import { Button } from "@/components/ui/button";
import { CircleDotIcon, Ellipsis, Squircle } from "lucide-react";
import { useBoardStore } from "@/store/board-store";

export default function Board() {
  const board = useBoardStore((s) => s.board);
  console.log(board);
  return (
    <section className="flex gap-4 h-full p-4 overflow-x-auto overflow-y-hidden">
      {board.columnOrder.map((columnId) => {
        const column = board.columns[columnId];
        const issueIds = board.issueOrderByColumn[columnId] ?? [];

        return (
          <BoardColumn key={columnId} column={column} issueIds={issueIds} />
        );
      })}
    </section>
  );
}

function BoardColumn({
  column,
  issueIds,
}: {
  column: { id: string; name: string };
  issueIds: string[];
}) {
  const issues = useBoardStore((s) => s.board.issues);

  return (
    <div className="h-full min-w-80 max-w-80 rounded-md p-2 border flex flex-col gap-2">
      <div className="w-full flex items-center p-2 justify-between">
        <div className="flex gap-1 items-center">
          <Squircle />
          <p className="text-xl">{column.name}</p>
        </div>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </div>

      <div className="min-h-0 flex-1 flex gap-2 p-2 flex-col overflow-y-auto">
        {issueIds.map((issueId) => {
          const issue = issues[issueId];
          if (!issue) return null;

          return <BoardIssue key={issueId} issue={issue} />;
        })}
      </div>
    </div>
  );
}

function BoardIssue({
  issue,
}: {
  issue: { title: string; body: string | null };
}) {
  return (
    <div className="bg-black/15 h-36 w-full flex flex-col rounded-md border p-4">
      <div className="w-full flex items-center gap-2 text-primary/60">
        <div className="flex gap-0.5 items-center">
          <CircleDotIcon size={12} />
          <p className="text-sm">{issue.title}</p>
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


