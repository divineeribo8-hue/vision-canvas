import { Play, Expand } from "lucide-react";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PublishedPortfolioItem } from "@/lib/portfolio.functions";

export function PortfolioVisual({ item, placeholderLabel, placeholderType = "image", className }: { item: PublishedPortfolioItem | undefined; placeholderLabel: string; placeholderType?: "image" | "video"; className?: string }) {
  if (!item) return <VisualPlaceholder label={placeholderLabel} type={placeholderType} className={cn("portfolio-slot", className)} />;
  return <Dialog><figure className={cn("group overflow-hidden bg-muted", className)}>
    <DialogTrigger asChild><Button variant="ghost" aria-label={`View ${item.title}`} className="relative block h-auto w-full overflow-hidden rounded-none p-0">
      {item.mediaType === "video" ? <><video className="block w-full" src={item.mediaUrl} muted playsInline preload="metadata" /><Play className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-primary bg-background/85 p-2" /></> : <img className="block h-auto w-full transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.02]" src={item.mediaUrl} alt={item.title} loading="lazy" />}
      <Expand className="absolute right-3 top-3 size-8 bg-background/85 p-2 text-foreground" />
    </Button></DialogTrigger>
    <figcaption className="flex items-center justify-between gap-3 bg-background py-4"><span className="font-serif text-xl">{item.title}</span>{item.mediaType === "video" && <Play className="size-4" />}</figcaption>
  </figure><DialogContent className="max-h-[94dvh] w-[94vw] max-w-5xl overflow-auto p-4"><DialogTitle className="pr-8 font-serif text-2xl">{item.title}</DialogTitle><DialogDescription className="sr-only">Divine Aesthetics portfolio project</DialogDescription>
    {item.mediaType === "video" ? <video src={item.mediaUrl} controls autoPlay playsInline className="max-h-[78dvh] w-full object-contain" /> : <img src={item.mediaUrl} alt={item.title} className="max-h-[78dvh] w-full object-contain" />}
  </DialogContent></Dialog>;
}
