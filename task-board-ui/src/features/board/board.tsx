import { useBoardStore } from "@/store/board-store";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";

import { pointerWithin, rectIntersection } from "@dnd-kit/core";

import BoardColumn from "./board-column";
import BoardIssue from "./board-issue";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";

export default function Board() {
  const boards = useBoardStore((s) => s.boards);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  if (!activeBoardId) return;
  const board = boards[activeBoardId];

  const [activeDrag, setActiveDrag] = useState<{
    id: string;
    type: "issue" | "column";
  } | null>(null);
  //DnD Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveDrag({
      id: active.id as string,
      type: active.data.current?.type,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (over.id === active.id) return;
    // console.log(over.data.current);
    const { boards, activeBoardId, moveIssue, moveColumn } =
      useBoardStore.getState();
    if (!activeBoardId) return;
    const board = boards[activeBoardId];
    // handle issues sorting
    //When in the same container :

    if (
      active.data.current?.type === "column" &&
      over.data.current?.type === "column"
    ) {
      const oldIndex = board.columnOrder.indexOf(active.id as string);
      const newIndex = board.columnOrder.indexOf(over.id as string);

      if (oldIndex === -1 || newIndex === -1) return;
      if (oldIndex === newIndex) return;

      moveColumn({ oldIndex, newIndex });
      return;
    }
    if (active.data.current?.type !== "issue") return;

    const activeIssueId = active.id as string;
    const activeIssue = board.issues[activeIssueId];
    const sourceColumnId = activeIssue.columnId as string;

    if (over.data.current?.type === "issue") {
      const overIssueId = over.id as string;
      const overIssue = board.issues[overIssueId];
      const targetColumnId = overIssue.columnId as string;

      if (sourceColumnId === targetColumnId) {
        // SAME COLUMN REORDER

        const issueOrder = board.issueOrderByColumn[sourceColumnId];
        const oldIndex = issueOrder.indexOf(activeIssueId);
        const newIndex = issueOrder.indexOf(overIssueId);

        if (oldIndex === -1 || newIndex === -1) return;
        if (oldIndex === newIndex) return;
        const currentIndex =
          board.issueOrderByColumn[sourceColumnId].indexOf(activeIssueId);

        if (currentIndex === newIndex) return;
        moveIssue({
          issueId: activeIssueId,
          fromColumnId: sourceColumnId,
          toColumnId: sourceColumnId,
          toIndex: newIndex,
        });
      } else {
        // DIFFERENT COLUMN
        const targetOrder = board.issueOrderByColumn[targetColumnId];
        const newIndex = targetOrder.indexOf(overIssueId);
        if (
          activeIssue.columnId === targetColumnId &&
          board.issueOrderByColumn[targetColumnId].indexOf(activeIssueId) ===
            newIndex
        ) {
          return;
        }

        moveIssue({
          issueId: activeIssueId,
          fromColumnId: sourceColumnId,
          toColumnId: targetColumnId,
          toIndex: newIndex,
        });
      }

      return;
    }

    if (over.data.current?.type === "column") {
      const targetColumnId = over.id as string;

      if (sourceColumnId === targetColumnId) {
        return;
      }

      const targetOrder = board.issueOrderByColumn[targetColumnId];
      const toIndex = targetOrder.length;
      // console.log(targetOrder);
      // console.log("in OVER COLUMN");
      // console.log(toIndex);

      moveIssue({
        issueId: activeIssueId,
        fromColumnId: sourceColumnId,
        toColumnId: targetColumnId,
        toIndex,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        const pointerCollisions = pointerWithin(args);

        if (pointerCollisions.length > 0) {
          return pointerCollisions;
        }

        return rectIntersection(args);
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveDrag(null);
      }}
    >
      <section className="flex gap-4 h-full p-4 overflow-x-auto overflow-y-hidden">
        <DragOverlay dropAnimation={null}>
          {activeDrag?.type === "issue" && activeDrag.id ? (
            <BoardIssue issue={board.issues[activeDrag.id]} />
          ) : null}
        </DragOverlay>
        <SortableContext
          items={board.columnOrder}
          strategy={horizontalListSortingStrategy}
        >
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const issueIds = board.issueOrderByColumn[columnId] ?? [];

            return (
              <BoardColumn key={columnId} column={column} issueIds={issueIds} />
            );
          })}
        </SortableContext>
      </section>
    </DndContext>
  );
}
