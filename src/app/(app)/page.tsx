"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, PieChart, LineChart, Clock, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-14">
      <LandingHero />
      <StatsStrip />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

function LandingHero() {
  const router = useRouter();
  return (
    <section id="home" className="flex w-full flex-col items-center gap-8 text-center sm:items-start sm:text-left">
      {/* <div className="flex items-center gap-3">
        <Image src="/next.svg" alt="Logo" width={80} height={16} />
        <span className="text-xl font-semibold">Bridge Capital</span>
      </div> */}
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900">Invest Smarter. Grow Together.</h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600">
        Connect with growing small businesses. Diversify with pooled funding. See every rupee working for you with transparent tracking.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => router.push("/auth")} className="px-6">Get Started</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Explore Dashboard</Button>
      </div>
      <div className="w-full rounded-xl border bg-white p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <HeroPoint icon={<PieChart className="h-5 w-5" />} title="Pooled diversification" desc="Invest alongside others to spread risk and fund more businesses." />
          <HeroPoint icon={<LineChart className="h-5 w-5" />} title="Live performance" desc="Track funding, allocations, and repayments in real time." />
          <HeroPoint icon={<ShieldCheck className="h-5 w-5" />} title="Transparent by design" desc="Clear logs and statuses across every step. No surprises." />
        </div>
      </div>
    </section>
  );
}

function HeroPoint({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-zinc-100 p-2 text-zinc-800">{icon}</div>
      <div>
        <div className="font-medium text-zinc-900">{title}</div>
        <div className="text-sm text-zinc-600">{desc}</div>
      </div>
    </div>
  );
}

function StatsStrip() {
  return (
    <section id="stats" className="rounded-xl border bg-white p-4">
      <div className="grid gap-4 text-center sm:grid-cols-3">
        <div>
          <div className="text-xl font-semibold text-zinc-900">₹5 Cr+</div>
          <div className="text-sm text-zinc-600">Simulated funding volume</div>
        </div>
        <Separator className="hidden sm:block" />
        <div>
          <div className="text-xl font-semibold text-zinc-900">3,000+</div>
          <div className="text-sm text-zinc-600">Simulated investors</div>
        </div>
        <Separator className="hidden sm:block" />
        <div>
          <div className="text-xl font-semibold text-zinc-900">95%</div>
          <div className="text-sm text-zinc-600">On-time repayments (demo)</div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: <PieChart className="h-5 w-5" />, title: "Diversified Pool", desc: "Allocate across many businesses proportionally, not one-by-one." },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Clear Transparency", desc: "Every funding and repayment is logged for clarity." },
    { icon: <LineChart className="h-5 w-5" />, title: "Portfolio View", desc: "See invested total, expected returns, and active loans." },
    { icon: <Clock className="h-5 w-5" />, title: "Faster Access", desc: "Approved requests can fund instantly from the shared pool." },
  ];
  return (
    <section id="features" className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">Why Bridge Capital</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((f) => (
          <Card key={f.title}>
            <CardHeader className="flex-row items-start gap-3">
              <div className="rounded-lg bg-zinc-100 p-2 text-zinc-800">{f.icon}</div>
              <div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, t: "Add to Pool", d: "Investors contribute to a shared pool.", icon: <PieChart className="h-5 w-5" /> },
    { n: 2, t: "Approve Requests", d: "Admin reviews and approves borrower requests.", icon: <ShieldCheck className="h-5 w-5" /> },
    { n: 3, t: "Auto Funding", d: "Loans are funded proportionally from the pool.", icon: <LineChart className="h-5 w-5" /> },
    { n: 4, t: "Repay & Distribute", d: "Borrowers repay with interest; payouts auto‑distribute.", icon: <CheckCircle2 className="h-5 w-5" /> },
  ];
  return (
    <section id="how-it-works" className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">How it works</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <Card key={s.n}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-zinc-100 p-2 text-zinc-800">{s.icon}</div>
                <CardTitle className="text-base">{s.n}. {s.t}</CardTitle>
              </div>
              <CardDescription>{s.d}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">What users say</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">“Effortless diversification”</CardTitle>
            <CardDescription>“I allocate once and the system spreads it across many businesses. Tracking returns is simple.”</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">— Simulated Investor</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">“Faster working capital”</CardTitle>
            <CardDescription>“Once approved, my request was funded immediately from the pool. Clear visibility throughout.”</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600">— Simulated Borrower</CardContent>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">FAQs</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="q1">
          <AccordionTrigger>Is this a real investment platform?</AccordionTrigger>
          <AccordionContent>
            This is a prototype for demonstration only. No real money moves—wallets, pool, and payouts are simulated.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>How are loans funded?</AccordionTrigger>
          <AccordionContent>
            Approved requests draw from the shared pool proportionally based on investor contributions at the time of funding.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>What returns are shown?</AccordionTrigger>
          <AccordionContent>
            Repayments in the demo include a flat 10% interest to illustrate distribution logic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger>How do I get started?</AccordionTrigger>
          <AccordionContent>
            Click “Get Started,” choose your role (Investor or Borrower), and complete a quick profile.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function FinalCTA() {
  const router = useRouter();
  return (
    <section id="get-started" className="overflow-hidden rounded-xl border bg-gradient-to-br from-white to-zinc-50">
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-zinc-900">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Join Bridge Capital today</h3>
          </div>
          <p className="text-sm text-zinc-600">Invest in small businesses or request funding in minutes.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/auth")} className="px-6">Get Started</Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>View Demo</Button>
        </div>
      </div>
    </section>
  );
}
