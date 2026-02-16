import { Button } from "@/components/ui/button";
import { CircleDotIcon, Ellipsis } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { CSS } from "@dnd-kit/utilities";
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
      {...listeners}
    >
      <div className="w-full flex items-center gap-2 text-primary/60">
        <div className="flex gap-0.5 items-center">
          <CircleDotIcon size={12} />
          <p className="text-sm">{issue.id}</p>
        </div>
        <Button size="sm" variant="ghost">
          <Ellipsis />
        </Button>
      </div>

      <div className="p-2 border rounded-md h-full items-center flex justify-center">
        {issue.body ?? "No description"}
      </div>
    </div>
  );
}
