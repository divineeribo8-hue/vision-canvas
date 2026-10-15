import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { z } from "zod";

export type PublishedPortfolioItem = {
  id: string; section: string; title: string; mediaType: "image" | "video";
  orientation: "portrait" | "landscape" | "square"; mediaUrl: string;
};

export const getPublishedPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Portfolio is temporarily unavailable");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from("portfolio_items").select("id, section, title, media_type, orientation, media_path").eq("published", true).in("section", ["portraits", "videography"]).order("sort_order");
  if (error) throw new Error("Portfolio could not be loaded");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const signed = await Promise.all((data ?? []).map(async (item) => {
    let mediaUrl = item.media_path;
    if (!mediaUrl.startsWith("/__l5e/assets-v1/")) {
      const { data: signedData } = await supabaseAdmin.storage.from("portfolio-media").createSignedUrl(item.media_path, 3600);
      if (!signedData?.signedUrl) return null;
      mediaUrl = signedData.signedUrl;
    }
    return { id: item.id, section: item.section, title: item.title, mediaType: item.media_type as "image" | "video", orientation: item.orientation as "portrait" | "landscape" | "square", mediaUrl } satisfies PublishedPortfolioItem;
  }));
  return signed.filter((item): item is PublishedPortfolioItem => item !== null);
});

export const checkPortfolioOwner = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "owner").maybeSingle();
  return { owner: !!data };
});

export const savePortfolioItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(1).max(120), section: z.enum(["portraits", "videography"]), mediaType: z.enum(["image", "video"]), orientation: z.enum(["portrait", "landscape", "square"]), mediaPath: z.string().regex(/^portfolio\/[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/).optional(), sortOrder: z.number().int().min(0).max(10000) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "owner").maybeSingle();
    if (!role) throw new Error("Only the studio owner can edit the portfolio");
    const fields = { title: data.title, section: data.section, media_type: data.mediaType, orientation: data.orientation, sort_order: data.sortOrder, updated_at: new Date().toISOString() };
    if (data.id) {
      const { data: previous } = await context.supabase.from("portfolio_items").select("media_path").eq("id", data.id).single();
      const { error } = await context.supabase.from("portfolio_items").update({ ...fields, ...(data.mediaPath ? { media_path: data.mediaPath } : {}) }).eq("id", data.id);
      if (error) throw new Error("The project could not be saved");
      if (data.mediaPath && previous?.media_path.startsWith("portfolio/")) await context.supabase.storage.from("portfolio-media").remove([previous.media_path]);
    } else {
      if (!data.mediaPath) throw new Error("Select a photo or video first");
      const { error } = await context.supabase.from("portfolio_items").insert({ ...fields, media_path: data.mediaPath, published: true });
      if (error) throw new Error("The project could not be saved");
    }
    return { ok: true };
  });

export const removePortfolioItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "owner").maybeSingle();
    if (!role) throw new Error("Only the studio owner can edit the portfolio");
    const { data: item } = await context.supabase.from("portfolio_items").select("media_path").eq("id", data.id).single();
    const { error } = await context.supabase.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw new Error("The project could not be removed");
    if (item?.media_path.startsWith("portfolio/")) await context.supabase.storage.from("portfolio-media").remove([item.media_path]);
    return { ok: true };
  });
