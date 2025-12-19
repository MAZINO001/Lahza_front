// import React, { useState, useRef, useEffect } from "react";
// import { Label } from "../ui/label";
// import InputError from "../InputError";
// import { ChevronDown, X } from "lucide-react";

// export default function SearchableSelectField({
//   id,
//   label,
//   value = [],
//   onChange,
//   options = [],
//   placeholder,
//   error,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const containerRef = useRef(null);
//   const inputRef = useRef(null);
//   const dropdownRef = useRef(null);

//   // Ensure value is always an array
//   const selectedValues = Array.isArray(value) ? value : [];

//   // Filter options based on search term
//   const filteredOptions = options.filter(
//     (opt) =>
//       opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       opt.value.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Get selected option objects
//   const selectedOptions = selectedValues
//     .map((val) => options.find((opt) => opt.value === val))
//     .filter(Boolean);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Scroll highlighted item into view
//   useEffect(() => {
//     if (highlightedIndex >= 0 && dropdownRef.current) {
//       const highlightedElement = dropdownRef.current.children[highlightedIndex];
//       if (highlightedElement) {
//         highlightedElement.scrollIntoView({ block: "nearest" });
//       }
//     }
//   }, [highlightedIndex]);

//   const handleInputChange = (e) => {
//     const newValue = e.target.value;
//     setSearchTerm(newValue);
//     setIsOpen(true);
//     setHighlightedIndex(-1);
//   };

//   const handleSelectOption = (opt) => {
//     if (selectedValues.includes(opt.value)) {
//       // Deselect if already selected
//       onChange(selectedValues.filter((v) => v !== opt.value));
//     } else {
//       // Add to selection
//       onChange([...selectedValues, opt.value]);
//     }
//     setSearchTerm("");
//     setHighlightedIndex(-1);
//     inputRef.current?.focus();
//   };

//   const handleRemoveOption = (valueToRemove) => {
//     onChange(selectedValues.filter((v) => v !== valueToRemove));
//   };

//   const handleKeyDown = (e) => {
//     if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
//       setIsOpen(true);
//       e.preventDefault();
//       return;
//     }

//     if (isOpen) {
//       switch (e.key) {
//         case "ArrowDown":
//           e.preventDefault();
//           setHighlightedIndex((prev) =>
//             prev < filteredOptions.length - 1 ? prev + 1 : prev
//           );
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
//           break;
//         case "Enter":
//           e.preventDefault();
//           if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
//             handleSelectOption(filteredOptions[highlightedIndex]);
//           }
//           break;
//         case "Escape":
//           setIsOpen(false);
//           setHighlightedIndex(-1);
//           break;
//         case "Backspace":
//           if (searchTerm === "" && selectedValues.length > 0) {
//             // Remove last selected item on backspace when input is empty
//             onChange(selectedValues.slice(0, -1));
//           }
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   return (
//     <div ref={containerRef} className="relative">
//       <Label htmlFor={id} className="text-foreground">
//         {label}
//       </Label>
//       <div className="relative">
//         <div
//           className={`mt-1 min-h-10 w-full px-2 py-1.5 rounded-md border ${
//             error ? "border-destructive" : "border-border"
//           } bg-background text-foreground focus-within:ring-2 focus-within:ring-ring focus-within:border-primary flex flex-wrap gap-1.5 items-center`}
//           onClick={() => inputRef.current?.focus()}
//         >
//           {selectedOptions.map((opt) => (
//             <div
//               key={opt.value}
//               className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent text-accent-foreground text-sm"
//             >
//               <span>{opt.label}</span>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleRemoveOption(opt.value);
//                 }}
//                 className="hover:bg-accent-foreground/20 rounded-sm p-0.5 transition-colors"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//           <input
//             ref={inputRef}
//             id={id}
//             type="text"
//             value={searchTerm}
//             onChange={handleInputChange}
//             onFocus={() => setIsOpen(true)}
//             onKeyDown={handleKeyDown}
//             placeholder={
//               selectedValues.length === 0
//                 ? placeholder || "-- Sélectionnez une option --"
//                 : ""
//             }
//             className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
//           />
//           <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//         </div>
//       </div>

//       {isOpen && filteredOptions.length > 0 && (
//         <div
//           ref={dropdownRef}
//           className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-md border border-border bg-popover text-popover-foreground"
//         >
//           {filteredOptions.map((opt, idx) => {
//             const isSelected = selectedValues.includes(opt.value);
//             return (
//               <div
//                 key={opt.value}
//                 onClick={() => handleSelectOption(opt)}
//                 className={`cursor-pointer py-2 px-3 transition-colors ${
//                   idx === highlightedIndex
//                     ? "bg-accent text-accent-foreground"
//                     : "hover:bg-accent hover:text-accent-foreground"
//                 } ${isSelected ? "bg-accent/50" : ""}`}
//               >
//                 <div className="flex items-center justify-between gap-2">
//                   <span
//                     className={`font-medium ${isSelected ? "font-bold" : ""}`}
//                   >
//                     {opt.label}
//                   </span>
//                   <span className="text-sm text-muted-foreground">
//                     #{opt.value}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {error && (
//         <InputError message={error} className="mt-2 text-destructive" />
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Label } from "../ui/label";
import InputError from "../InputError";
import { ChevronDown, X } from "lucide-react";

export default function SearchableSelectField({
  id,
  label,
  value = [],
  onChange,
  options = [],
  placeholder,
  error,
  customValue = [],
  onCustomChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Ensure values are always arrays
  const selectedValues = Array.isArray(value) ? value : [];
  const customValues = Array.isArray(customValue) ? customValue : [];

  // Filter options based on search term
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(opt.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option objects
  const selectedOptions = selectedValues
    .map((val) => options.find((opt) => opt.value === val))
    .filter(Boolean);

  // Combine selected options and custom entries for display
  const allTags = [
    ...selectedOptions.map((opt) => ({
      type: "selected",
      label: opt.label,
      value: opt.value,
    })),
    ...customValues.map((text) => ({
      type: "custom",
      label: text,
      value: text,
    })),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (opt) => {
    if (selectedValues.includes(opt.value)) {
      // Deselect if already selected
      onChange(selectedValues.filter((v) => v !== opt.value));
    } else {
      // Add to selection
      onChange([...selectedValues, opt.value]);
    }
    setSearchTerm("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tag) => {
    if (tag.type === "selected") {
      // Remove from selected projects
      onChange(selectedValues.filter((v) => v !== tag.value));
    } else if (tag.type === "custom") {
      // Remove from custom entries
      if (onCustomChange) {
        onCustomChange(customValues.filter((v) => v !== tag.value));
      }
    }
  };

  const handleAddCustomEntry = () => {
    const trimmed = searchTerm.trim();
    if (trimmed && !customValues.includes(trimmed)) {
      if (onCustomChange) {
        onCustomChange([...customValues, trimmed]);
      }
      setSearchTerm("");
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      e.preventDefault();
      return;
    }

    if (isOpen) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            // Select from dropdown
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else if (filteredOptions.length === 0 && searchTerm.trim()) {
            // No results - add as custom entry
            handleAddCustomEntry();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "Backspace":
          if (searchTerm === "" && allTags.length > 0) {
            // Remove last tag on backspace when input is empty
            const lastTag = allTags[allTags.length - 1];
            handleRemoveTag(lastTag);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      <div className="relative">
        <div
          className={`mt-1 min-h-10 w-full px-2 py-1.5 rounded-md border ${
            error ? "border-destructive" : "border-border"
          } bg-background text-foreground focus-within:ring-2 focus-within:ring-ring focus-within:border-primary flex flex-wrap gap-1.5 items-center`}
          onClick={() => inputRef.current?.focus()}
        >
          {allTags.map((tag, idx) => (
            <div
              key={`${tag.type}-${tag.value}-${idx}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent text-accent-foreground text-sm"
            >
              <span>{tag.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
                className="hover:bg-accent-foreground/20 rounded-sm p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              allTags.length === 0
                ? placeholder || "-- Sélectionnez une option --"
                : ""
            }
            className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
          />
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-md border border-border bg-popover text-popover-foreground"
        >
          {filteredOptions.map((opt, idx) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => handleSelectOption(opt)}
                className={`cursor-pointer py-2 px-3 transition-colors ${
                  idx === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                } ${isSelected ? "bg-accent/50" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-medium ${isSelected ? "font-bold" : ""}`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    #{opt.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
