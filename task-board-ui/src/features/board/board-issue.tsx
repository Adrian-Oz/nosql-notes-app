import { Button } from "@/components/ui/button";
import { CircleDotIcon, Ellipsis } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardStore } from "@/store/board-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
export default function BoardIssue({
  issue,
}: {
  issue: {
    title: string;
    body: string | null;
    id: string;
    columnId: string | null;
    tagIDs: string[];
  };
}) {
  const openEditIssue = useBoardStore((s) => s.openEditIssue);
  const deleteIssue = useBoardStore((s) => s.deleteIssue);
  const boardTags = useBoardStore((s) => s.board.tags);
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.id,
    data: {
      type: "issue",
    },
  });
  return (
    <div
      className={cn(
        "bg-(--surface-3) h-36 w-full flex flex-col gap-1 rounded-md border p-2",
        "bg-yellow-500/20",
        isDragging && "opacity-0 pointer-events-none transition-none",
      )}
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <div className="w-full flex items-center gap-2 text-primary/60">
        <div className="flex gap-0.5 items-center cursor-grab " {...listeners}>
          <CircleDotIcon size={12} />
          <p className="text-sm">{issue.title ?? issue.id}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-(--surface-3)">
            <DropdownMenuGroup>
              <DropdownMenuLabel>This Issue</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  openEditIssue(issue.id);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteIssue(issue.id);
                  toast.success("Issue Deleted");
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 border rounded-md h-16  text-sm  truncate overflow-hidden">
        {issue.body ?? "No description"}
      </div>
      <div className="ml-auto flex gap-2">
        {issue.tagIDs.map((tagId) => {
          const tag = boardTags[tagId];
          if (!tag || tag.archivedAt) return null;
          return (
            // This button would later allow for filtering items on the board
            <Button
              variant={"outline"}
              key={tagId}
              className={
                "bg-(--surface-4) hover:bg-white/20 text-white text-[12px] rounded-full min-w-12 h-8 "
              }
            >
              {tag.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
