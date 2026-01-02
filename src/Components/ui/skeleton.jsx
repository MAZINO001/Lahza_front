import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      // className={cn("bg-accent animate-pulse rounded-md", className)}
      className={cn("bg-primary/20 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
