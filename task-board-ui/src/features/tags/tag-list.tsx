import { useBoardStore } from "@/store/board-store";
import Tag from "./tag";
export default function TagList() {
  const tags = useBoardStore((s) => s.board.tags);
  const tagOrder = useBoardStore((s) => s.board.tagOrder);

  return (
    <div className="flex flex-col gap-2">
      <div>Chose from those tags : </div>
      <div className=" flex gap-2">
        {tagOrder.map((tagId) => {
          const tag = tags[tagId];
          if (!tag || tag.archivedAt) return null;
          return <Tag tag={tag} key={tagId} />; // I KNOW  ;-;
        })}
      </div>
    </div>
  );
}
