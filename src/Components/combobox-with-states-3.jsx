"use client";

import { Check, ChevronsUpDown, Inbox, Plus, Link2, Upload } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FileUploader from "@/components/Form/FileUploader";

export const title = "Empty State with Action";

const Example = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [showFileUploader, setShowFileUploader] = useState(false);

  const handleCreate = () => {
    setShowFileUploader(true);
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const newItems = files.map((file, index) => file.name);
      setItems([...items, ...newItems]);
      setShowFileUploader(false);
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button className="p-2 border border-border rounded-md bg-background">
          <Link2 className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Search files..." />
          <CommandList>
            {showFileUploader ? (
              <div className="p-4">
                <FileUploader
                  label="Upload Client Files"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setShowFileUploader(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <Inbox className="size-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">No files yet</p>
                  <p className="text-xs text-muted-foreground">
                    Upload your first client file
                  </p>
                </div>
                <Button className="w-full" onClick={handleCreate} size="sm">
                  <Upload className="mr-2 size-4" />
                  Upload File
                </Button>
              </div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      value={item}>
                      <Check
                        className={cn("mr-2 size-4", value === item ? "opacity-100" : "opacity-0")} />
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCreate}
                    size="sm"
                  >
                    <Upload className="mr-2 size-4" />
                    Add More Files
                  </Button>
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Example;
