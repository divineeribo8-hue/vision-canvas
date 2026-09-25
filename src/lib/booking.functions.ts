import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

const fileSchema = z.object({
  name: z.string().trim().min(1).max(180),
  size: z.number().nonnegative().max(20 * 1024 * 1024),
  type: z.string().trim().max(120),
  status: z.enum(["local", "stored", "failed"]),
  storagePath: z.string().trim().max(500).optional(),
  error: z.string().trim().max(300).optional(),
  shareUrl: z.string().url().max(2000).optional(),
});

const bookingSchema = z.object({
  service: z.string().trim().min(1).max(120),
  packageName: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(80),
  duration: z.string().trim().min(1).max(120),
  deliverables: z.string().trim().min(1).max(180),
  preferredDate: z.string().trim().min(1).max(80),
  preferredTime: z.string().trim().min(1).max(80),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(40),
  locationChoice: z.enum(["own", "recommend"]),
  locationDetails: z.string().trim().max(500).optional(),
  inspirationNotes: z.string().trim().max(1000).optional(),
  inspirationFiles: z.array(fileSchema).max(8),
  vision: z.string().trim().min(10).max(2500),
  relevantNotes: z.string().trim().max(1000).optional(),
  contactMethod: z.enum(["whatsapp", "email"]).optional(),
});

function createPublicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Cloud database is not configured");

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { error } = await supabase.from("booking_requests").insert({
      service: data.service,
      package_name: data.packageName,
      price: data.price,
      duration: data.duration,
      deliverables: data.deliverables,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      location_choice: data.locationChoice,
      location_details: data.locationDetails || null,
      inspiration_notes: data.inspirationNotes || null,
      inspiration_files: data.inspirationFiles,
      vision: data.vision,
      relevant_notes: data.relevantNotes || null,
      contact_method: data.contactMethod || null,
      status: "booking_request_sent",
    });

    if (error) {
      throw new Error(`Booking request could not be saved: ${error.message}`);
    }

    return { ok: true };
  });

export const getInspirationLink = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ path: z.string().regex(/^requests\/[0-9a-f-]{36}\/[a-zA-Z0-9._-]{1,200}$/) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage.from("booking-inspiration").createSignedUrl(data.path, 60 * 60 * 24 * 30);
    if (error || !signed?.signedUrl) throw new Error("Secure link could not be created");
    return { url: signed.signedUrl };
  });
