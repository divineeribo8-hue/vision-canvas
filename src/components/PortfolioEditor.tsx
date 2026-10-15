import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { checkPortfolioOwner, savePortfolioItem, removePortfolioItem, type PublishedPortfolioItem } from "@/lib/portfolio.functions";
import { serviceLabels, type ServiceKey } from "@/lib/divine-data";

export function PortfolioEditor({ items }: { items: PublishedPortfolioItem[] }) {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<PublishedPortfolioItem>();
  const [title, setTitle] = useState("");
  const [section, setSection] = useState<ServiceKey>("portraits");
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "square">("portrait");
  const [file, setFile] = useState<File>();
  const check = useServerFn(checkPortfolioOwner);
  const save = useServerFn(savePortfolioItem);
  const remove = useServerFn(removePortfolioItem);
  const queries = useQueryClient();
  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) { try { setOwner((await check()).owner); } catch { setOwner(false); } }
    });
  }, [open, check]);
  const login = async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/the-work`, extraParams: { login_hint: "divineeribo8@gmail.com" } });
    if (result.error) { setError("Sign-in could not be completed. Please try again."); return; }
    if (result.redirected) return;
    const access = await check(); setOwner(access.owner);
    if (!access.owner) setError("Portfolio editing is available only to the studio owner's Google account.");
  };
  const edit = (item?: PublishedPortfolioItem) => { setEditing(item); setTitle(item?.title ?? ""); setSection(item?.section === "videography" ? "videography" : "portraits"); setOrientation(item?.orientation ?? "portrait"); setFile(undefined); setError(""); setStatus(""); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setStatus("");
    let path: string | undefined;
    try {
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"].includes(file.type) || file.size > (file.type.startsWith("video/") ? 100 : 20) * 1024 * 1024) throw new Error("Use JPG, PNG or WebP up to 20MB, or MP4/WebM up to 100MB.");
        path = `portfolio/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const result = await supabase.storage.from("portfolio-media").upload(path, file);
        if (result.error) throw new Error("The file could not be uploaded. Please try again.");
      }
      await save({ data: { ...(editing ? { id: editing.id } : {}), title, section, orientation, mediaType: file ? (file.type.startsWith("video/") ? "video" : "image") : editing?.mediaType ?? "image", ...(path ? { mediaPath: path } : {}), sortOrder: editing ? items.findIndex((item) => item.id === editing.id) : items.length } });
      await queries.invalidateQueries({ queryKey: ["published-portfolio"] }); edit(); setStatus("Project saved.");
    } catch (caught) { if (path) await supabase.storage.from("portfolio-media").remove([path]); setError(caught instanceof Error ? caught.message : "The project could not be saved."); }
    finally { setBusy(false); }
  };
  const deleteItem = async (item: PublishedPortfolioItem) => {
    if (!window.confirm(`Remove “${item.title}” from the portfolio?`)) return;
    setBusy(true); setError("");
    try { await remove({ data: { id: item.id } }); await queries.invalidateQueries({ queryKey: ["published-portfolio"] }); edit(); setStatus("Project removed."); }
    catch { setError("The project could not be removed."); } finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="text" className="mt-8"><Pencil />Manage portfolio</Button></DialogTrigger><DialogContent className="max-h-[90dvh] w-[94vw] max-w-3xl overflow-auto"><DialogTitle className="font-serif text-3xl">Your portfolio</DialogTitle><DialogDescription>{owner ? "Photography & motion projects" : "Studio owner access"}</DialogDescription>
    {!owner ? <Button onClick={() => void login()}>Sign in with Google</Button> : <>
      <form onSubmit={(event) => void submit(event)} className="space-y-4 border-b border-border pb-6">
        <label><span className="field-label">Project title</span><input className="field" required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label><span className="field-label">Category</span><select className="field" value={section} onChange={(e) => setSection(e.target.value as ServiceKey)}>{Object.entries(serviceLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label><span className="field-label">Image format</span><select className="field" value={orientation} onChange={(e) => setOrientation(e.target.value as typeof orientation)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option><option value="square">Square</option></select></label>
        <label className="block"><span className="field-label">{editing ? "Replace photo or video (optional)" : "Photo or video"}</span><input key={editing?.id ?? "new"} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" required={!editing} onChange={(e) => setFile(e.target.files?.[0])} /></label>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP: up to 20MB · MP4, WebM: up to 100MB</p>
        <div className="flex gap-3"><Button disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Add project"}</Button>{editing && <Button variant="outline" type="button" onClick={() => edit()}><Plus />New project</Button>}</div>
      </form>
      <div className="divide-y divide-border">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0 break-words font-serif text-xl">{item.title}</span><div className="flex shrink-0 gap-2"><Button size="icon" variant="ghost" title={`Edit ${item.title}`} aria-label={`Edit ${item.title}`} onClick={() => edit(item)} disabled={busy}><Pencil /></Button><Button size="icon" variant="ghost" title={`Remove ${item.title}`} aria-label={`Remove ${item.title}`} onClick={() => void deleteItem(item)} disabled={busy}><Trash2 /></Button></div></div>)}</div>
    </>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{status && <p role="status" className="text-sm text-primary">{status}</p>}
  </DialogContent></Dialog>;
}
