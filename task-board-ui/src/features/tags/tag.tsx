import type { Tag } from "@/types/tag";
type TagItemProps = {
  tag: Tag;
};
export default function Tag({ tag }: TagItemProps) {
  return (
    <div className="px-3 py-1 rounded-md text-sm bg-(--surface-4) inline-flex ">
      {tag.name}
    </div>
  );
}
