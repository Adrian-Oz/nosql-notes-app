import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/store/board-store";

export function BoardDebug() {
  const addColumn = useBoardStore((s) => s.addColumn);
  const addIssue = useBoardStore((s) => s.addIssue);

  let number = 1;

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          addIssue({ title: "KURWA" });
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
