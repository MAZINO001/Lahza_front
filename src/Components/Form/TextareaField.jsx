// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import InputError from "../InputError";

// export default function TextareaField({
//   id,
//   label,
//   value,
//   onChange,
//   placeholder,
//   error,
// }) {
//   return (
//     <div>
//       <Label htmlFor={id} className="text-foreground">
//         {label}
//       </Label>
//       <Textarea
//         id={id}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`mt-1 block bg-background w-full  ${error ? "border-destructive" : "border-border"} text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring transition-colors min-h-[100px]`}
//       />
//       {error && (
//         <InputError message={error} className="mt-2 text-destructive" />
//       )}
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils"; // ← make sure this utility exists in your project
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "../InputError";

export default function TextareaField({
  id,
  label,
  value = "",
  onChange,
  placeholder,
  error,
  disabled = false,
  className,
  rows = 4, // more reasonable default than min-h-[100px]
}) {
  return (
    <div className={cn("space-y-2 ", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="flex-1 flex flex-col">
        <Textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            // "resize-y min-h-[100px]",
            "flex-1 resize-y min-h-[120px]",
            error && "border-destructive focus-visible:ring-destructive",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
            "bg-background text-foreground placeholder:text-muted-foreground",
          )}
        />

        {error && (
          <InputError message={error} className="text-sm text-destructive" />
        )}
      </div>
    </div>
  );
}
