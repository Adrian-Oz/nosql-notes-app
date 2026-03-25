import { Button } from "@/components/ui/button";
import { Ellipsis, Ghost, Squircle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardIssue from "./board-issue";
import clsx from "clsx";
import { useBoardStore } from "@/store/board-store";
import { useDroppable } from "@dnd-kit/core";

export default function BoardColumn({
  column,
  issueIds,
}: {
  column: { id: string; name: string };
  issueIds: string[];
}) {
  const issues = useBoardStore((s) => s.board.issues);
  const openCreateIssue = useBoardStore((s) => s.openCreateIssue);
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });
  return (
    <div
      className={clsx(
        "h-full min-w-80 max-w-80 rounded-md p-2 border border-red-900 flex flex-col gap-2 bg-(--surface-2)",
        isDragging && "opacity-50",
      )}
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <div className="w-full flex items-center p-2 justify-between border-b">
        <div className="flex gap-1 items-center cursor-grab" {...listeners}>
          <Squircle />
          <p className="text-xl">{column.name}</p>
        </div>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </div>

      <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setDroppableRef}
          className={clsx(
            "min-h-80 flex-1 flex gap-2 p-2 flex-col overflow-y-auto border-2",
          )}
        >
          {issueIds.map((issueId) => {
            const issue = issues[issueId];
            if (!issue) return null;

            return <BoardIssue key={issueId} issue={issue} />;
          })}
        </div>
      </SortableContext>
      <Button variant={"ghost"} onClick={() => openCreateIssue(column.id)}>
        Add Issue
      </Button>
    </div>
  );
}
