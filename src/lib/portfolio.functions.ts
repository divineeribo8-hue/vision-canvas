import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import portraitRedDress from "@/assets/portrait-red-dress.jpg.asset.json";
import portraitChocolateDress from "@/assets/portrait-chocolate-dress.jpg.asset.json";
import portraitWhiteBlooms from "@/assets/portrait-white-blooms.webp.asset.json";
import portraitGardenRed from "@/assets/portrait-garden-red.webp.asset.json";

const featuredWork: PublishedPortfolioItem[] = [
  { id: "featured-portrait-red-dress", section: "portraits", title: "Portrait in Natural Light", mediaType: "image", orientation: "portrait", mediaUrl: portraitRedDress.url },
  { id: "featured-portrait-chocolate-dress", section: "portraits", title: "Studio Elegance", mediaType: "image", orientation: "portrait", mediaUrl: portraitChocolateDress.url },
  { id: "featured-portrait-white-blooms", section: "portraits", title: "Between the Blooms", mediaType: "image", orientation: "portrait", mediaUrl: portraitWhiteBlooms.url },
  { id: "featured-portrait-garden-red", section: "portraits", title: "Red in the Garden", mediaType: "image", orientation: "portrait", mediaUrl: portraitGardenRed.url },
];


export type PublishedPortfolioItem = {
  id: string;
  section: string;
  title: string;
  mediaType: "image" | "video";
  orientation: "portrait" | "landscape" | "square";
  mediaUrl: string;
};

export const getPublishedPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return featuredWork;

  const publicClient = createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await publicClient.from("portfolio_items").select("id, section, title, media_type, orientation, media_path").eq("published", true).order("sort_order");
  if (error || !data?.length) return featuredWork;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const signed = await Promise.all(data.map(async (item) => {
    const { data: signedData } = await supabaseAdmin.storage.from("portfolio-media").createSignedUrl(item.media_path, 3600);
    if (!signedData?.signedUrl) return null;
    return { id: item.id, section: item.section, title: item.title, mediaType: item.media_type as "image" | "video", orientation: item.orientation as "portrait" | "landscape" | "square", mediaUrl: signedData.signedUrl } satisfies PublishedPortfolioItem;
  }));
  return [...featuredWork, ...signed.filter((item): item is PublishedPortfolioItem => item !== null)];
});
