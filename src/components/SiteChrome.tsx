import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/the-work", label: "THE WORK" },
  { to: "/sessions", label: "SESSIONS" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <Link to="/" className="min-w-0 font-serif text-xl leading-none text-foreground lg:text-2xl">
          <span className="block">Divine Aesthetics</span>
          <span className="block font-sans text-[0.58rem] uppercase tracking-[0.32em] text-muted-foreground">
            Media Agency
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild variant="editorial" size="sm" className="hidden lg:inline-flex">
          <Link to="/booking">BOOK A SESSION</Link>
        </Button>
      </div>
      <nav aria-label="Mobile navigation" className="flex gap-1 overflow-x-auto border-t border-border px-4 py-3 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 px-3 py-1 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/booking"
          className="shrink-0 px-3 py-1 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-primary"
        >
          BOOK
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl text-foreground">DIVINE AESTHETICS MEDIA AGENCY</p>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            Reflecting beauty in a divine way.
          </p>
          <p className="mt-8 font-serif text-4xl leading-tight text-foreground">
            YOUR VISION DESERVES TO BE SEEN.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="footer-label">Navigate</p>
            <div className="mt-4 grid gap-3">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className="footer-link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-label">Social</p>
            <div className="mt-4 grid gap-3">
              <a className="footer-link" href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a className="footer-link" href="mailto:divineeribo8@gmail.com">
                Email
              </a>
              <a className="footer-link" href="https://wa.me/2348162011902" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
