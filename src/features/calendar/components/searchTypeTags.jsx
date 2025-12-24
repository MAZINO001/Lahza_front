/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useId, useState, useEffect } from "react";
import { TagInput } from "emblor";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultAllTags = [
  "Meeting",
  "Reminder",
  "Agency",
  "Holiday",
  "Other",
  "Weekend",
];

export default function SearchTypeTags({
  id = "tags",
  label,
  value = [],
  onChange,
  allTags = defaultAllTags,
  placeholder = "Type to add or search tags...",
}) {
  const uid = useId();

  const normalizeTag = (t) =>
    typeof t === "string"
      ? { id: t, text: t }
      : { id: t.id ?? t.text, text: t.text ?? t };

  const [tags, setTags] = useState((value || []).map(normalizeTag));
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  // Sync external value changes
  useEffect(() => {
    const newTags = (value || []).map(normalizeTag);
    const currentTexts = tags
      .map((t) => t.text)
      .sort()
      .join(",");
    const newTexts = newTags
      .map((t) => t.text)
      .sort()
      .join(",");
    if (currentTexts !== newTexts) {
      setTags(newTags);
    }
  }, [value]);

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    if (onChange) {
      onChange(newTags.map((t) => t.text));
    }
  };

  // Normalize all available tags
  const normalizedAllTags = allTags.map(normalizeTag);

  // Available suggestions (exclude already selected)
  const availableSuggestions = normalizedAllTags.filter(
    (tag) => !tags.some((selected) => selected.id === tag.id)
  );

  // Custom autocomplete component
  const Autocomplete = ({ inputValue = "" }) => {
    const filtered = availableSuggestions.filter((tag) =>
      tag.text.toLowerCase().includes(inputValue.toLowerCase().trim())
    );

    if (inputValue.trim() === "" || filtered.length === 0) return null;

    return (
      <Command className="rounded-md border shadow-md bg-popover text-popover-foreground mt-1">
        <CommandList>
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup>
            {filtered.map((tag) => (
              <CommandItem
                key={tag.id}
                onSelect={() => {
                  handleTagsChange([...tags, tag]);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    tags.some((t) => t.id === tag.id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {tag.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <div className="*:not-first:mt-2">
      {label && <Label htmlFor={uid}>{label}</Label>}

      <div className="relative">
        <TagInput
          id={uid}
          tags={tags}
          setTags={handleTagsChange}
          placeholder={placeholder}
          activeTagIndex={activeTagIndex}
          setActiveTagIndex={setActiveTagIndex}
          enableAutocomplete={true}
          autocompleteOptions={availableSuggestions}
          styleClasses={{
            inlineTagsContainer:
              "relative border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 flex flex-wrap items-center",
            input:
              "flex-1 min-w-[120px] shadow-none px-2 h-8 bg-transparent outline-none",
            tag: {
              body: "h-7 relative bg-secondary border border-input rounded-md font-medium text-xs px-2 pe-7 flex items-center",
              closeButton:
                "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-destructive/10",
            },
            autoComplete: {
              command: "w-full",
              commandList: "max-h-60 overflow-auto",
              commandItem: "px-3 py-2",
            },
          }}
          customAutocompleteComponent={Autocomplete}
        />
      </div>
    </div>
  );
}
