import { Play } from "lucide-react";

import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { cn } from "@/lib/utils";
import type { PublishedPortfolioItem } from "@/lib/portfolio.functions";

export function PortfolioVisual({ item, placeholderLabel, placeholderType = "image", className }: { item?: PublishedPortfolioItem; placeholderLabel: string; placeholderType?: "image" | "video"; className?: string }) {
  if (!item) return <VisualPlaceholder label={placeholderLabel} type={placeholderType} className={className} />;
  return <figure className={cn("group relative min-h-72 overflow-hidden bg-muted", className)}>
    {item.mediaType === "video" ? <video className="absolute inset-0 size-full object-cover" src={item.mediaUrl} controls preload="metadata" /> : <img className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" src={item.mediaUrl} alt={item.title} loading="lazy" />}
    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/85 p-4 backdrop-blur-sm"><span className="font-serif text-xl">{item.title}</span>{item.mediaType === "video" && <Play className="size-4" />}</figcaption>
  </figure>;
}
