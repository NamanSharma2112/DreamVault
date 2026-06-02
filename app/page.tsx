import Link from "next/link";
import {
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { HeroAnimation, HeroItem } from "@/components/landing/HeroAnimation";

const features = [
  {
    icon: Globe,
    title: "Smart URL Scraping",
    tagline:
      "Paste any product link — Amazon, Flipkart, Airbnb — and we auto-fill the title, price, and image for you.",
    bg: "bg-canvas-parchment",
    text: "text-ink",
    linkClass: "text-primary",
  },
  {
    icon: Target,
    title: "Goal-Based Savings",
    tagline:
      "Group items into goals like 'Trip to Europe' or 'New Setup'. Track progress and monthly savings needed.",
    bg: "bg-surface-tile-1",
    text: "text-on-dark",
    linkClass: "text-primary-on-dark",
  },
  {
    icon: TrendingUp,
    title: "Financial Planning",
    tagline:
      "Input your income and see exactly how to allocate savings across goals.",
    bg: "bg-canvas",
    text: "text-ink",
    linkClass: "text-primary",
  },
  {
    icon: Heart,
    title: "Wishlist & Buy List",
    tagline:
      "Separate aspirational wishes from committed purchases.",
    bg: "bg-surface-tile-2",
    text: "text-on-dark",
    linkClass: "text-primary-on-dark",
  },
  {
    icon: Shield,
    title: "Progress Tracking",
    tagline:
      "Visual progress bars, deadline countdowns, and priority badges keep you motivated.",
    bg: "bg-canvas-parchment",
    text: "text-ink",
    linkClass: "text-primary",
  },
  {
    icon: Zap,
    title: "Smart Dashboard",
    tagline:
      "See total values, category breakdowns, upcoming deadlines, and savings projections.",
    bg: "bg-surface-tile-3",
    text: "text-on-dark",
    linkClass: "text-primary-on-dark",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Global Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-11 items-center justify-between bg-surface-black px-6">
        <Link href="/" className="flex items-center gap-2 text-on-dark">
          <Sparkles className="h-4 w-4 text-primary-on-dark" />
          <span className="text-nav-link text-on-dark">DreamVault</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-nav-link text-on-dark/80 transition-colors hover:text-on-dark"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-[9999px] bg-primary px-4 py-1.5 text-nav-link text-on-primary transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 pt-11 text-center">
        {/* Subtle radial ambient tint */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(0,102,204,0.04)_0%,_transparent_70%)]" />

        <HeroAnimation>
          {/* Badge */}
          <HeroItem className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-[9999px] bg-primary/5 px-4 py-1.5 text-caption text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Your financial dreams, organized
            </span>
          </HeroItem>

          {/* Headline */}
          <HeroItem>
            <h1 className="text-hero text-ink">
              Every dream has a price.
              <br />
              <span className="text-primary">We help you save for it.</span>
            </h1>
          </HeroItem>

          {/* Subtitle */}
          <HeroItem>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted-80">
              From a ₹20 pen to a dream vacation — save anything you want to
              buy, set savings goals, track progress, and make your dreams a
              reality.
            </p>
          </HeroItem>

          {/* CTAs */}
          <HeroItem>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[9999px] bg-primary px-7 py-3.5 text-button-large text-on-primary transition-transform active:scale-95"
              >
                Start Saving Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-[9999px] border border-primary px-7 py-3.5 text-body text-primary transition-transform active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </HeroItem>
        </HeroAnimation>
      </section>

      {/* ── Feature Tiles (alternating full-bleed) ── */}
      {features.map((feature) => {
        const isDark = feature.bg.includes("tile");
        const Icon = feature.icon;

        return (
          <section key={feature.title} className={`${feature.bg} px-6 py-[80px]`}>
            <div className="mx-auto max-w-3xl text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[11px] ${
                    isDark ? "bg-primary-on-dark/10" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isDark ? "text-primary-on-dark" : "text-primary"}`}
                  />
                </div>
              </div>

              {/* Headline */}
              <h2 className={`text-display-lg ${feature.text}`}>
                {feature.title}
              </h2>

              {/* Tagline */}
              <p
                className={`mx-auto mt-4 max-w-2xl text-lead ${
                  isDark ? "text-body-muted" : "text-ink-muted-80"
                }`}
              >
                {feature.tagline}
              </p>

              {/* CTA link */}
              <div className="mt-6">
                <Link
                  href="/register"
                  className={`${feature.linkClass} text-body inline-flex items-center gap-1 transition-opacity hover:opacity-80`}
                >
                  Learn more
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Dark CTA Section ── */}
      <section className="bg-surface-tile-1 px-6 py-[80px] text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-lg text-on-dark">
            Stop dreaming. Start planning.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body text-body-muted">
            Join thousands of savers who have organized their financial dreams
            and are actively working toward making them real.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-[9999px] bg-primary px-7 py-3.5 text-button-large text-on-primary transition-transform active:scale-95"
          >
            Create Your Vault
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-canvas-parchment px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {/* Product */}
            <div>
              <h3 className="text-caption-strong text-ink">Product</h3>
              <ul className="mt-2">
                {["Dashboard", "Wishlist", "Buy List", "Goals", "Expenses"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/register"
                        className="text-dense-link text-ink-muted-80 transition-colors hover:text-ink"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-caption-strong text-ink">Features</h3>
              <ul className="mt-2">
                {[
                  "URL Scraping",
                  "Smart Savings",
                  "Progress Tracking",
                  "Financial Planning",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="/register"
                      className="text-dense-link text-ink-muted-80 transition-colors hover:text-ink"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-caption-strong text-ink">About</h3>
              <ul className="mt-2">
                {["Privacy", "Terms", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/register"
                      className="text-dense-link text-ink-muted-80 transition-colors hover:text-ink"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hairline divider */}
          <div className="mt-10 border-t border-hairline" />

          {/* Legal row */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-fine-print text-ink-muted-48">
                DreamVault
              </span>
            </div>
            <p className="text-fine-print text-ink-muted-48">
              © {new Date().getFullYear()} DreamVault. Save for what matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
