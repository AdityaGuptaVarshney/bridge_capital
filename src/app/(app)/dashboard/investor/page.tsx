"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-context";
import { formatINR } from "@/lib/format";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Building2, Star, TrendingUp, ArrowRight } from "lucide-react";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import Link from "next/link";

export default function InvestorDashboard() {
  const { user, setUser } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [pool, setPool] = useState<{ total: number }>({ total: 0 });
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [amount, setAmount] = useState(10000);

  useEffect(() => {
    fetch("/api/loans").then((r) => r.json()).then(setLoans);
    fetch("/api/admin").then((r) => r.json()).then((d) => setPool(d.pool));
    fetch("/api/users").then((r) => r.json()).then((u) => setBorrowers(u.filter((x: any) => x.role === "borrower")));
  }, []);

  const portfolio = useMemo(() => {
    if (!user) return { totalInvested: 0, expectedReturns: 0, activeLoans: 0 };
    const myAllocs = loans.filter((l) => l.allocations?.some((a: any) => a.investorId === user.id));
    const totalInvested = myAllocs.reduce((s, l) => s + l.allocations.find((a: any) => a.investorId === user.id)!.amount, 0);
    const expectedReturns = myAllocs.reduce((s, l) => s + Math.round(l.amountRequested * 0.1 * (l.allocations.find((a: any) => a.investorId === user.id)!.amount / l.amountRequested)), 0);
    const activeLoans = myAllocs.filter((l) => l.status === "active").length;
    return { totalInvested, expectedReturns, activeLoans };
  }, [loans, user]);

  const investNow = async () => {
    if (!user) return;
    const res = await fetch("/api/pool/invest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ investorId: user.id, amount }) });
    if (!res.ok) return toast.error("Investment failed");
    const data = await res.json();
    setPool(data.pool);
    setUser(data.investor);
    toast.success(`Added ${formatINR(amount)} to pool`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Welcome back, {user?.name?.split(" ")[0] || "Investor"}</h1>
          <p className="text-zinc-600">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/explore/investor">Browse Loans</Link>
          </Button>
          <Button onClick={() => document.getElementById("invest-card")?.scrollIntoView({ behavior: "smooth" })}>
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="Wallet Balance"
          value={formatINR(user?.walletBalance ?? 0)}
          icon={<div className="rounded-full bg-blue-100 p-2 text-blue-600"><TrendingUp className="h-4 w-4" /></div>}
        />
        <StatCard
          label="Total Invested"
          value={formatINR(portfolio.totalInvested)}
          icon={<div className="rounded-full bg-purple-100 p-2 text-purple-600"><Building2 className="h-4 w-4" /></div>}
        />
        <StatCard
          label="Expected Returns"
          value={formatINR(portfolio.expectedReturns)}
          icon={<div className="rounded-full bg-green-100 p-2 text-green-600"><Star className="h-4 w-4" /></div>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PortfolioChart />

        <Card id="invest-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Invest</CardTitle>
            <CardDescription>Current Pool: <span className="font-medium text-zinc-900">{formatINR(pool.total)}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500">₹</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))}
                  className="pl-7"
                />
              </div>
            </div>
            <Button onClick={investNow} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Add to Pool
            </Button>
            <p className="text-xs text-zinc-500 text-center">
              Funds are automatically diversified across approved loans.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">Recommended Opportunities</h2>
          <Link href="/explore/investor" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.filter((l) => ["approved", "funding"].includes(l.status)).slice(0, 3).map((l) => {
            const b = borrowers.find((x) => x.id === l.borrowerId);
            const pct = Math.min(100, Math.round((l.fundedAmount / l.amountRequested) * 100));
            return (
              <Card key={l.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{b?.businessName || "Business Loan"}</CardTitle>
                      <CardDescription className="text-xs">{b?.category} • {b?.location}</CardDescription>
                    </div>
                    <Badge variant={l.status === "approved" ? "secondary" : "outline"}>{l.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Target</span>
                      <span className="font-medium">{formatINR(l.amountRequested)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Funded</span>
                      <span className="font-medium text-blue-600">{formatINR(l.fundedAmount)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={pct} className="h-2" />
                    <div className="text-right text-xs text-zinc-500">{pct}% funded</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
