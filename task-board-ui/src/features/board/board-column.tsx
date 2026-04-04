import { Button } from "@/components/ui/button";
import { Ellipsis, Squircle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardIssue from "./board-issue";
import clsx from "clsx";
import { useBoardStore } from "@/store/board-store";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "sonner";
import { useState } from "react";

export default function BoardColumn({
  column,
  issueIds,
}: {
  column: { id: string; name: string };
  issueIds: string[];
}) {
  //BOARD
  const boards = useBoardStore((s) => s.boards);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  if (!activeBoardId) return;
  const board = boards[activeBoardId];
  //Issue related
  const issues = board.issues;
  const openCreateIssue = useBoardStore((s) => s.openCreateIssue);
  //COLUMN related
  const deleteColumn = useBoardStore((s) => s.deleteColumn);
  const renameColumn = useBoardStore((s) => s.renameColumn);
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  function handleSave() {
    const trimmed = columnName.trim();

    if (trimmed === "") {
      setColumnName(column.name);
      setIsEditing(false);
      return;
    }

    renameColumn({ columnId: column.id, name: trimmed });
    setIsEditing(false);
  }
  //DND related
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

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });
  return (
    <div
      className={clsx(
        "h-full min-w-80 max-w-80 rounded-md p-2 border flex flex-col gap-2 bg-(--surface-2)",
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
        <div
          className="flex gap-1 items-center cursor-grab"
          {...(!isEditing ? listeners : {})}
        >
          <Squircle />
          {isEditing ? (
            <input
              autoFocus
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setColumnName(column.name);
                }
              }}
              className="text-xl bg-transparent border-b outline-none"
            />
          ) : (
            <p className="text-xl">{column.name}</p>
          )}
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
                  setIsEditing(true);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const result = deleteColumn(column.id);
                  if (!result.success) {
                    toast.error(result.error);
                  } else toast.success("Column Deleted ");
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
