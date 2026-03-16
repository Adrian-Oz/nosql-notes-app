import { Button } from "@/components/ui/button";
import { CircleDotIcon, Ellipsis } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
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
export default function BoardIssue({
  issue,
}: {
  issue: {
    title: string;
    body: string | null;
    id: string;
    columnId: string | null;
  };
}) {
  const openEditIssue = useBoardStore((s) => s.openEditIssue);
  const deleteIssue = useBoardStore((s) => s.deleteIssue);
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
      className={clsx(
        "bg-(--surface-3) h-36 w-full flex flex-col rounded-md border p-4",
        isDragging && "invisible",
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

      <div className="p-2 border rounded-md h-16  text-sm  overflow-auto  ">
        {issue.body ?? "No description"}
      </div>
    </div>
  );
}
