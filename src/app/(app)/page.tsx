"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, PieChart, LineChart, Clock, CheckCircle2, Sparkles, ArrowRight, TrendingUp, Users, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
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
    <section id="home" className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden pt-20 lg:flex-row lg:justify-between lg:pt-0">
      {/* Background Elements */}
      <div className="absolute -left-20 top-20 h-72 w-72 animate-pulse-glow rounded-full bg-blue-500/20 blur-3xl filter" />
      <div className="absolute -right-20 bottom-20 h-96 w-96 animate-pulse-glow rounded-full bg-purple-500/20 blur-3xl filter" />

      <div className="z-10 flex flex-col items-center gap-8 text-center lg:w-1/2 lg:items-start lg:text-left">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 backdrop-blur-sm">
          <Sparkles className="mr-2 h-4 w-4 fill-blue-500 text-blue-500" />
          The Future of SME Investing
        </div>
        
        <h1 className="text-balance text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
          Invest Smarter. <br />
          <span className="text-gradient">Grow Together.</span>
        </h1>
        
        <p className="max-w-2xl text-lg leading-8 text-zinc-600">
          Connect with growing small businesses through our decentralized funding pool. 
          Experience <span className="font-semibold text-zinc-900">transparent tracking</span> and 
          <span className="font-semibold text-zinc-900"> automated diversification</span>.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => router.push("/auth")} size="lg" className="h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/dashboard")} className="h-12 rounded-full border-zinc-200 bg-white/50 px-8 text-base backdrop-blur-sm transition-all hover:bg-white/80">
            Explore Dashboard
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-200" />
            ))}
          </div>
          <p>Trusted by 3,000+ investors</p>
        </div>
      </div>

      <div className="relative mt-12 flex w-full justify-center lg:mt-0 lg:w-1/2">
        <div className="relative h-[400px] w-[400px] animate-float sm:h-[500px] sm:w-[500px]">
           {/* Placeholder for 3D Image - In a real app, use Spline or Three.js */}
           <Image 
            src="/hero-3d.png" 
            alt="3D Abstract Finance" 
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section id="stats" className="relative z-20 mx-auto max-w-5xl -mt-12">
      <div className="glass-card grid gap-8 rounded-2xl p-8 sm:grid-cols-3 sm:gap-4">
        <StatItem 
          icon={<Activity className="h-6 w-6 text-blue-600" />}
          value="₹5 Cr+" 
          label="Simulated Volume" 
          trend="+12% this week"
        />
        <div className="hidden w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent sm:block" />
        <StatItem 
          icon={<Users className="h-6 w-6 text-purple-600" />}
          value="3,000+" 
          label="Active Investors" 
          trend="+50 today"
        />
        <div className="hidden w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent sm:block" />
        <StatItem 
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
          value="95%" 
          label="Repayment Rate" 
          trend="Top tier"
        />
      </div>
    </section>
  );
}

function StatItem({ icon, value, label, trend }: { icon: React.ReactNode; value: string; label: string; trend: string }) {
  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="mb-3 rounded-xl bg-zinc-50 p-3 shadow-sm">{icon}</div>
      <div className="text-3xl font-bold text-zinc-900">{value}</div>
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="mt-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block">{trend}</div>
    </div>
  );
}

function Features() {
  const items = [
    { 
      icon: <PieChart className="h-6 w-6 text-white" />, 
      color: "bg-blue-500",
      title: "Smart Diversification", 
      desc: "Automatically spread your capital across vetted businesses to minimize risk and maximize potential returns." 
    },
    { 
      icon: <ShieldCheck className="h-6 w-6 text-white" />, 
      color: "bg-purple-500",
      title: "Transparent Ledger", 
      desc: "Every transaction is recorded on our immutable ledger. Track funding flows and repayments in real-time." 
    },
    { 
      icon: <LineChart className="h-6 w-6 text-white" />, 
      color: "bg-pink-500",
      title: "Real-time Analytics", 
      desc: "Visualize your portfolio performance with advanced charting tools and predictive earnings models." 
    },
    { 
      icon: <Clock className="h-6 w-6 text-white" />, 
      color: "bg-orange-500",
      title: "Instant Liquidity", 
      desc: "Our unique pool structure allows for faster funding approvals and quicker deployment of capital." 
    },
  ];

  return (
    <section id="features" className="py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Why Choose Bridge Capital?</h2>
        <p className="mt-4 text-lg text-zinc-600">Built for the modern investor who demands speed, transparency, and control.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((f, i) => (
          <div key={i} className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6">
            <div className={`mb-4 inline-flex rounded-xl p-3 shadow-lg ${f.color}`}>
              {f.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900">{f.title}</h3>
            <p className="text-zinc-600">{f.desc}</p>
            
            {/* Decorative gradient blob */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-150 ${f.color}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Connect", d: "Link your wallet or bank account to start." },
    { n: "02", t: "Allocate", d: "Deposit funds into the diversified lending pool." },
    { n: "03", t: "Earn", d: "Watch your investment grow as loans are repaid." },
    { n: "04", t: "Withdraw", d: "Access your principal and interest anytime." },
  ];
  
  return (
    <section id="how-it-works" className="relative overflow-hidden rounded-3xl bg-zinc-900 py-20 text-white">
      {/* Background Gradients */}
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/40 via-zinc-900 to-zinc-900" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">A simple, streamlined process designed to get your money working for you immediately.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-2xl font-bold text-white shadow-inner ring-1 ring-white/10">
                {s.n}
              </div>
              <h3 className="mb-2 text-xl font-bold">{s.t}</h3>
              <p className="text-sm text-zinc-400">{s.d}</p>
              
              {i !== steps.length - 1 && (
                <div className="absolute left-8 top-16 hidden h-full w-px bg-gradient-to-b from-zinc-700 to-transparent md:block lg:h-px lg:w-full lg:bg-gradient-to-r" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-12">
      <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900">Trusted by the Community</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <div className="flex gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
            </div>
            <CardTitle className="text-lg">“Effortless diversification”</CardTitle>
            <CardDescription className="text-zinc-700">“I allocate once and the system spreads it across many businesses. Tracking returns is simple and the UI is beautiful.”</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100" />
            <div>
              <div className="font-bold text-zinc-900">Sarah J.</div>
              <div className="text-xs text-zinc-500">Angel Investor</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <div className="flex gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
            </div>
            <CardTitle className="text-lg">“Faster working capital”</CardTitle>
            <CardDescription className="text-zinc-700">“Once approved, my request was funded immediately from the pool. Clear visibility throughout the entire repayment process.”</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100" />
            <div>
              <div className="font-bold text-zinc-900">Michael R.</div>
              <div className="text-xs text-zinc-500">Small Business Owner</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl py-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-zinc-900">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {[
          { q: "Is this a real investment platform?", a: "This is a prototype for demonstration only. No real money moves—wallets, pool, and payouts are simulated." },
          { q: "How are loans funded?", a: "Approved requests draw from the shared pool proportionally based on investor contributions at the time of funding." },
          { q: "What returns are shown?", a: "Repayments in the demo include a flat 10% interest to illustrate distribution logic." },
          { q: "How do I get started?", a: "Click “Get Started,” choose your role (Investor or Borrower), and complete a quick profile." }
        ].map((item, i) => (
          <AccordionItem key={i} value={`q${i}`} className="glass-card rounded-xl border-none px-4">
            <AccordionTrigger className="text-lg font-medium text-zinc-900 hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="text-zinc-600">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function FinalCTA() {
  const router = useRouter();
  return (
    <section id="get-started" className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-24 text-center text-white shadow-2xl">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="absolute -left-20 top-20 h-72 w-72 animate-pulse-glow rounded-full bg-blue-500/30 blur-3xl filter" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 animate-pulse-glow rounded-full bg-purple-500/30 blur-3xl filter" />
      
      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Ready to start growing?</h2>
        <p className="mb-10 text-lg text-zinc-300">Join thousands of investors and businesses building the future of finance together.</p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={() => router.push("/auth")} size="lg" className="h-14 min-w-[200px] rounded-full bg-white text-lg font-bold text-zinc-900 hover:bg-zinc-100">
            Create Account
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/dashboard")} className="h-14 min-w-[200px] rounded-full border-zinc-700 bg-transparent text-lg text-white hover:bg-zinc-800 hover:text-white">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
