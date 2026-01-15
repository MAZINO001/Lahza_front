import { useId, useState, useEffect } from "react";
import { TagInput } from "emblor";
import { Label } from "@/components/ui/label";

export default function TagsField({
  id = "tags",
  label,
  value = [],
  onChange,
}) {
  const uid = useId();
  const [tags, setTags] = useState(
    (value || []).map((t) => (typeof t === "string" ? { text: t } : t))
  );
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  // sync when external value (from react-hook-form) changes
  useEffect(() => {
    const newTags = (value || []).map((t) =>
      typeof t === "string" ? { text: t } : t
    );
    const currentTagsText = tags.map((t) => t.text).join(",");
    const newTagsText = newTags.map((t) => t.text).join(",");

    if (currentTagsText !== newTagsText) {
      setTags(newTags);
    }
  }, [value, tags]);

  // when local tags change -> propagate upward
  const handleTagsChange = (newTags) => {
    setTags(newTags);
    if (onChange) {
      // send only the text values
      onChange(newTags.map((t) => t.text));
    }
  };

  return (
    <div className="*:not-first:mt-2">
      {label && <Label htmlFor={uid}>{label}</Label>}
      <TagInput
        id={uid}
        tags={tags}
        setTags={handleTagsChange}
        placeholder="Add a tag"
        styleClasses={{
          inlineTagsContainer:
            "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
          input: "w-full min-w-[80px] shadow-none px-2 h-7",
          tag: {
            body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
    </div>
  );
}
