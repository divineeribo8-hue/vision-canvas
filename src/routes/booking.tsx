import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Check, CloudUpload, FileImage, Info } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getInspirationLink } from "@/lib/booking.functions";
import { readBookingDraft, updateBookingDraft, type BookingDraft, type StoredInspirationFile } from "@/lib/booking-storage";
import { findPackage, packages, serviceLabels } from "@/lib/divine-data";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [
    { title: "Book a Session — Divine Aesthetics" },
    { name: "description", content: "Choose a session, request a date and share the vision behind your visuals." },
    { property: "og:title", content: "Book a Session — Divine Aesthetics" },
    { property: "og:description", content: "An intentional path from your idea to a personally confirmed session." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BookingPage,
});

function BookingPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<BookingDraft>({ inspirationFiles: [] });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const signLink = useServerFn(getInspirationLink);
  useEffect(() => setDraft(readBookingDraft()), []);

  const patch = (partial: BookingDraft) => {
    const next = { ...draft, ...partial };
    setDraft(next);
    updateBookingDraft(partial);
  };
  const selected = findPackage(draft.packageId);

  const selectPackage = (id: string) => {
    const pkg = findPackage(id);
    if (!pkg) return;
    patch({ service: pkg.service, packageId: pkg.id, packageName: pkg.name, price: pkg.price, duration: pkg.duration, deliverables: pkg.deliverables });
  };

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []).slice(0, 8);
    if (!chosen.length) return;
    setUploading(true);
    const initial: StoredInspirationFile[] = chosen.map((file) => ({ name: file.name, size: file.size, type: file.type, status: "local" }));
    patch({ inspirationFiles: initial });
    const completed: StoredInspirationFile[] = [];
    for (const file of chosen) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `requests/${crypto.randomUUID()}/${safeName}`;
      const { error: uploadError } = await supabase.storage.from("booking-inspiration").upload(path, file, { upsert: false });
      if (uploadError) { completed.push({ name: file.name, size: file.size, type: file.type, status: "failed", error: uploadError.message }); continue; }
      let shareUrl: string | undefined;
      try { shareUrl = (await signLink({ data: { path } })).url; } catch { shareUrl = undefined; }
      completed.push({ name: file.name, size: file.size, type: file.type, status: "stored", storagePath: path, ...(shareUrl ? { shareUrl } : {}) });
    }
    patch({ inspirationFiles: completed });
    setUploading(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!draft.packageId || !draft.date || !draft.time || !draft.fullName || !draft.email || !draft.phone || !draft.locationChoice || !draft.vision || draft.vision.trim().length < 10) {
      setError("Please complete the package, date, time, contact, location and vision fields.");
      return;
    }
    updateBookingDraft(draft);
    navigate({ to: "/booking-review" });
  };

  return <PageShell><main>
    <header className="page-intro pb-8">
      <p className="eyebrow">BOOK A SESSION</p>
      <h1 className="page-title">LET’S UNDERSTAND YOUR VISION.</h1>
      <p className="mt-8 max-w-2xl body-large">This is a booking request. Your session is only confirmed after Divine Aesthetics personally reviews the details and responds.</p>
    </header>
    <form onSubmit={submit} className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          {[
            ["01", "SESSION"], ["02", "DATE & TIME"], ["03", "CLIENT DETAILS"], ["04", "LOCATION"], ["05", "INSPIRATION"], ["06", "YOUR VISION"],
          ].map(([number, label]) => <div key={number} className="flex gap-4 border-b border-border py-3"><span className="text-xs text-muted-foreground">{number}</span><span className="eyebrow">{label}</span></div>)}
        </aside>
        <div className="space-y-16">
          <section>
            <p className="eyebrow">01 / SESSION</p><h2 className="mt-3 font-serif text-4xl">Choose your service and package.</h2>
            <div className="mt-7 grid gap-3 md:grid-cols-2">{packages.map((pkg) => <button type="button" key={pkg.id} onClick={() => selectPackage(pkg.id)} className={`border p-5 text-left transition-colors ${draft.packageId === pkg.id ? "border-primary bg-secondary" : "border-border hover:border-primary"}`}>
              <span className="eyebrow">{serviceLabels[pkg.service]}</span><span className="mt-2 block font-serif text-2xl">{pkg.name}</span><span className="mt-3 block text-sm text-muted-foreground">{pkg.price} · {pkg.duration} · {pkg.deliverables}</span>
            </button>)}</div>
            {selected && <p className="mt-4 flex items-center gap-2 text-sm text-primary"><Check className="size-4" /> {selected.name} selected</p>}
          </section>

          <section>
            <p className="eyebrow">02 / DATE & TIME</p><h2 className="mt-3 font-serif text-4xl">Request a preferred date and time.</h2>
            <div className="mt-5 flex gap-3 border border-border bg-secondary p-5 text-sm leading-7 text-muted-foreground"><CalendarDays className="mt-1 size-5 shrink-0 text-primary" /><p><strong className="text-foreground">Calendar connection ready.</strong> Google Calendar is not connected yet, so these are preferences—not live availability. No date is presented as confirmed until it is checked personally.</p></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2"><label><span className="field-label">Preferred date</span><input className="field" type="date" value={draft.date ?? ""} onChange={(e) => patch({ date: e.target.value })} /></label><label><span className="field-label">Preferred time</span><input className="field" type="time" value={draft.time ?? ""} onChange={(e) => patch({ time: e.target.value })} /></label></div>
          </section>

          <section>
            <p className="eyebrow">03 / CLIENT DETAILS</p><h2 className="mt-3 font-serif text-4xl">How can we reach you?</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2"><label><span className="field-label">Full name</span><input className="field" value={draft.fullName ?? ""} onChange={(e) => patch({ fullName: e.target.value })} /></label><label><span className="field-label">Email</span><input className="field" type="email" value={draft.email ?? ""} onChange={(e) => patch({ email: e.target.value })} /></label><label><span className="field-label">Phone / WhatsApp</span><input className="field" type="tel" value={draft.phone ?? ""} onChange={(e) => patch({ phone: e.target.value })} /></label></div>
          </section>

          <section>
            <p className="eyebrow">04 / LOCATION</p><h2 className="mt-3 font-serif text-4xl">WHERE WOULD YOU LIKE YOUR SESSION?</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">{[["own", "I HAVE A LOCATION IN MIND"], ["recommend", "I’D LIKE DIVINE AESTHETICS TO RECOMMEND A LOCATION"]].map(([value, label]) => <button type="button" key={value} onClick={() => patch({ locationChoice: value as "own" | "recommend" })} className={`border p-5 text-left text-sm ${draft.locationChoice === value ? "border-primary bg-secondary" : "border-border"}`}>{label}</button>)}</div>
            {draft.locationChoice === "own" && <label className="mt-5 block"><span className="field-label">Location details</span><textarea className="field min-h-28" value={draft.locationDetails ?? ""} onChange={(e) => patch({ locationDetails: e.target.value })} /></label>}
          </section>

          <section>
            <p className="eyebrow">05 / INSPIRATION</p><h2 className="mt-3 font-serif text-4xl">Share your visual references.</h2><p className="mt-4 body-large">Have references, screenshots or moodboards? Share them so we can understand the visual direction you’re drawn to.</p>
            <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-primary p-7 text-center"><CloudUpload className="size-7 text-primary" /><span className="mt-3 text-sm font-medium">Select images or files</span><span className="mt-1 text-xs text-muted-foreground">Up to 8 files, 20MB each</span><input className="sr-only" type="file" accept="image/*,.pdf" multiple onChange={uploadFiles} /></label>
            {uploading && <p className="mt-4 text-sm">Storing selected files…</p>}
            {!!draft.inspirationFiles?.length && <div className="mt-4 space-y-2">{draft.inspirationFiles.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 border border-border p-3 text-sm"><span className="flex min-w-0 items-center gap-2"><FileImage className="size-4 shrink-0" /><span className="truncate">{file.name}</span></span><span className={file.status === "stored" ? "text-primary" : file.status === "failed" ? "text-destructive" : "text-muted-foreground"}>{file.status === "stored" ? "Stored" : file.status === "failed" ? "Not stored" : "Selected locally"}</span></div>)}</div>}
            <label className="mt-5 block"><span className="field-label">Inspiration notes</span><textarea className="field min-h-28" value={draft.inspirationNotes ?? ""} onChange={(e) => patch({ inspirationNotes: e.target.value })} /></label>
          </section>

          <section>
            <p className="eyebrow">06 / YOUR VISION</p><h2 className="mt-3 font-serif text-4xl">WHAT WOULD YOU LIKE YOUR VISUALS TO COMMUNICATE?</h2><p className="mt-4 body-large">Tell us about your idea, story, aesthetic, mood or anything you want us to understand before your session.</p>
            <textarea className="field mt-6 min-h-56 text-lg leading-8" value={draft.vision ?? ""} onChange={(e) => patch({ vision: e.target.value })} />
            <label className="mt-5 block"><span className="field-label">Relevant notes</span><textarea className="field min-h-28" value={draft.relevantNotes ?? ""} onChange={(e) => patch({ relevantNotes: e.target.value })} /></label>
          </section>

          {error && <p role="alert" className="flex gap-2 border border-destructive p-4 text-sm text-destructive"><Info className="size-4 shrink-0" />{error}</p>}
          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8"><Button type="submit" variant="editorial" size="lg">REVIEW YOUR SESSION</Button><Button asChild type="button" variant="text"><Link to="/sessions">BACK TO PRICING</Link></Button></div>
        </div>
      </div>
    </form>
  </main></PageShell>;
}
