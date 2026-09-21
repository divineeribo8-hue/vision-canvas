import { Film, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function VisualPlaceholder({
  label,
  type = "image",
  className,
}: {
  label: string;
  type?: "image" | "video";
  className?: string;
}) {
  const Icon = type === "video" ? Film : ImageIcon;

  return (
    <div
      className={cn(
        "group relative flex min-h-72 overflow-hidden border border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <div className="absolute inset-0 placeholder-texture" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-border bg-background/80 p-4 backdrop-blur-sm">
        <div>
          <p className="font-sans text-[0.66rem] uppercase tracking-[0.26em] text-accent-foreground">
            Replaceable {type} placeholder
          </p>
          <p className="mt-1 font-serif text-2xl text-foreground">{label}</p>
        </div>
        <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
      </div>
    </div>
  );
}
