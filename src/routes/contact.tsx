import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Divine Aesthetics Media Agency" },
    { name: "description", content: "Start a conversation with Divine Aesthetics about your next visual story." },
    { property: "og:title", content: "Have a Vision in Mind? — Divine Aesthetics" },
    { property: "og:description", content: "Tell us what you’re imagining. Let’s create something that feels true to you." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});

const methods = [
  { icon: MessageCircle, title: "WHATSAPP", text: "For session enquiries and direct conversation.", href: "https://wa.me/2348162011902" },
  { icon: Mail, title: "EMAIL", text: "For detailed briefs, collaborations and commissions.", href: "mailto:divineeribo8@gmail.com" },
  { icon: Instagram, title: "INSTAGRAM", text: "Follow the evolving visual archive.", href: "https://instagram.com/divineaesthetics.media" },
];

function ContactPage() {
  return <PageShell><main>
    <header className="page-intro"><p className="eyebrow">CONTACT</p><h1 className="page-title">HAVE A VISION IN MIND?</h1><p className="mt-8 max-w-2xl body-large">Tell us what you’re imagining. Let’s create something that feels true to you.</p><Button asChild variant="editorial" size="lg" className="mt-8"><Link to="/booking">START A CONVERSATION</Link></Button></header>
    <section className="border-y border-border bg-secondary"><div className="section-shell grid gap-px bg-border md:grid-cols-3">{methods.map(({ icon: Icon, title, text, href }) => <a key={title} href={href} target="_blank" rel="noreferrer" className="group min-h-72 bg-secondary p-8 transition-colors hover:bg-accent"><div className="flex items-center justify-between"><Icon className="size-7 text-primary" /><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h2 className="mt-16 font-serif text-4xl">{title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p></a>)}</div></section>
    <section className="section-shell"><div className="border-l-2 border-primary pl-6"><p className="eyebrow">CONTACT DETAILS</p><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">WhatsApp: +234 816 201 1902 · Gmail: divineeribo8@gmail.com</p></div></section>
  </main></PageShell>;
}
