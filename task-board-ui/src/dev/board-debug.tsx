import { Button } from "@/components/ui/button";

import { useBoardStore } from "@/store/board-store";

export function BoardDebug() {
  const addColumn = useBoardStore((s) => s.addColumn);
  const addIssue = useBoardStore((s) => s.addIssue);
  const openTagDialog = useBoardStore((s) => s.openCreateTag);
  return (
    <div className="flex flex-col gap-2">
      <p>This is used for debugging right now :C</p>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            addColumn({ name: "Name Me" });
          }}
        >
          Add column
        </Button>
        <Button
          onClick={() => {
            addIssue({ title: "Name Me", tagIDs: [] });
          }}
        >
          Add issue
        </Button>
        <Button
          onClick={() => {
            openTagDialog();
          }}
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
}
