import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

export default function TagSelector({
  tags,
  tagOrder,
  selectedTagIDs,
  onTagClick,
}: {
  tags: Record<string, Tag>;
  tagOrder: string[];
  selectedTagIDs: string[];
  onTagClick: (tagId: string) => void;
}) {
  return (
    <div>
      {tagOrder.map((tagId) => {
        const tag = tags[tagId];
        return (
          <Button
            key={tagId}
            className={cn(
              "bg-(--surface-4) hover:bg-white/20 text-white",
              selectedTagIDs.includes(tagId) ? "opacity-100" : "opacity-30",
            )}
            onClick={() => {
              onTagClick(tagId);
            }}
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
}
