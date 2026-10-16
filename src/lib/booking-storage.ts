import { findPackage, serviceLabels, type PackageOption, type ServiceKey } from "./divine-data";

export type StoredInspirationFile = {
  name: string;
  size: number;
  type: string;
  status: "local" | "stored" | "failed";
  storagePath?: string;
  error?: string;
  shareUrl?: string;
};

export type BookingDraft = {
  service?: ServiceKey;
  packageId?: string;
  packageName?: string;
  price?: string;
  duration?: string;
  deliverables?: string;
  date?: string;
  time?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  locationChoice?: "own" | "recommend";
  locationDetails?: string;
  inspirationNotes?: string;
  inspirationFiles?: StoredInspirationFile[];
  vision?: string;
  relevantNotes?: string;
  contactMethod?: "whatsapp" | "email";
  requestSent?: boolean;
};

const storageKey = "divine-aesthetics-booking";

export function readBookingDraft(): BookingDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as BookingDraft;
    if (!parsed || typeof parsed !== "object") return {};
    const selected = findPackage(parsed.packageId);
    if (!selected) {
      const { service, packageId, packageName, price, duration, deliverables, ...details } = parsed;
      return details;
    }
    return { ...parsed, service: selected.service, packageName: selected.name, price: selected.price, duration: selected.duration, deliverables: selected.deliverables };
  } catch {
    return {};
  }
}

export function writeBookingDraft(next: BookingDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export function updateBookingDraft(partial: BookingDraft) {
  const current = readBookingDraft();
  const next = { ...current, ...partial };
  writeBookingDraft(next);
  return next;
}

export function startBookingFromPackage(pkg: PackageOption) {
  return updateBookingDraft({
    service: pkg.service,
    packageId: pkg.id,
    packageName: pkg.name,
    price: pkg.price,
    duration: pkg.duration,
    deliverables: pkg.deliverables,
    requestSent: false,
  });
}

export function resetBookingDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
}

export function buildBookingMessage(draft: BookingDraft) {
  const files = draft.inspirationFiles?.length
    ? draft.inspirationFiles
        .map((file) => {
          if (file.status === "stored" && file.shareUrl) return `- ${file.name}: ${file.shareUrl}`;
          const status = file.status === "stored" ? "stored" : file.status === "failed" ? "not uploaded" : "selected locally only, not uploaded";
          return `- ${file.name} (${status})`;
        })
        .join("\n")
    : "No files attached.";

  return [
    "Hello Divine Aesthetics,",
    "",
    "I'd like to book a session.",
    "",
    `Name: ${draft.fullName || "Not provided"}`,
    `Service: ${draft.service ? serviceLabels[draft.service] : "Not selected"}`,
    `Package: ${draft.packageName || "Not selected"}`,
    `Price: ${draft.price || "Not provided"}`,
    `Duration: ${draft.duration || "Not provided"}`,
    `Deliverables: ${draft.deliverables || "Not provided"}`,
    `Preferred date: ${draft.service === "videography" ? "Not applicable (editing project)" : draft.date || "Not selected"}`,
    `Preferred time: ${draft.service === "videography" ? "Not applicable (editing project)" : draft.time || "Not selected"}`,
    `Location: ${draft.service === "videography" ? "Not applicable (editing project)" : draft.locationChoice === "recommend" ? "I'd like Divine Aesthetics to recommend a location." : draft.locationDetails || "Not provided"}`,
    "",
    "Vision:",
    draft.vision || "Not provided",
    "",
    "Additional notes:",
    draft.relevantNotes || "None",
    "",
    "Inspiration (secure links, valid 30 days):",
    draft.inspirationNotes || "No notes provided.",
    files,
    "",
    `Phone: ${draft.phone || "Not provided"}`,
    `Email: ${draft.email || "Not provided"}`,
    "",
    "I understand a 50% deposit is required to secure this session, and it is not confirmed until the deposit is received and Divine Aesthetics confirms it.",
    "",
    "I look forward to creating with Divine Aesthetics.",
  ].join("\n");
}

export function isInquiryComplete(draft: BookingDraft) {
  return !!(findPackage(draft.packageId) && draft.fullName?.trim() && draft.email?.trim() && draft.phone?.trim() && draft.vision?.trim() &&
    (draft.service === "videography" || (draft.date && draft.time && draft.locationChoice && (draft.locationChoice !== "own" || draft.locationDetails?.trim()))));
}
