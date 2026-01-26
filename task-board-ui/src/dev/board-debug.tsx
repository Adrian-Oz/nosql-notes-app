import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/store/board-store";

export function BoardDebug() {
  const board = useBoardStore((s) => s.board);

  const addColumn = useBoardStore((s) => s.addColumn);
  const addIssue = useBoardStore((s) => s.addIssue);
  const moveColumn = useBoardStore((s) => s.moveColumn);
  const moveIssue = useBoardStore((s) => s.moveIssue);

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          addIssue({ title: "Thats an issue for sure" });
        }}
      >
        Add Issue
      </Button>
      <Button
        onClick={() => {
          addColumn({ name: "Thats an issue for sure" });
        }}
      >
        Add column
      </Button>
    </div>
  );
}
