"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-context";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Wallet, BarChart3, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { FundingChart } from "@/components/charts/funding-chart";
import { StatCard } from "@/components/stat-card";
import Link from "next/link";

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [amountRequested, setAmountRequested] = useState(10000);
  const [durationMonths, setDurationMonths] = useState(6);
  const [purpose, setPurpose] = useState("Working capital");
  const [investors, setInvestors] = useState<any[]>([]);

  const refresh = () => fetch("/api/loans").then((r) => r.json()).then((ls) => setLoans(ls.filter((l: any) => l.borrowerId === user?.id)));
  useEffect(() => {
    refresh();
    fetch("/api/users").then((r) => r.json()).then((u) => setInvestors(u.filter((x: any) => x.role === "investor")));
  }, [user]);

  const requestLoan = async () => {
    const res = await fetch("/api/loans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ borrowerId: user?.id, amountRequested, durationMonths, purpose }) });
    if (!res.ok) return toast.error("Request failed");
    refresh();
    toast.success("Loan request submitted");
  };

  const activeLoan = loans.find(l => l.status === "active" || l.status === "funding");
  const totalBorrowed = loans.reduce((acc, l) => acc + (l.fundedAmount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Welcome back, {user?.name?.split(" ")[0] || "Partner"}</h1>
          <p className="text-zinc-600">Manage your funding and track repayments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/explore/borrower">Find Investors</Link>
          </Button>
          <Button onClick={() => document.getElementById("request-card")?.scrollIntoView({ behavior: "smooth" })}>
            Request Loan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="Active Funding"
          value={formatINR(activeLoan?.fundedAmount ?? 0)}
          icon={<div className="rounded-full bg-blue-100 p-2 text-blue-600"><TrendingUp className="h-4 w-4" /></div>}
        />
        <StatCard
          label="Total Borrowed"
          value={formatINR(totalBorrowed)}
          icon={<div className="rounded-full bg-purple-100 p-2 text-purple-600"><Wallet className="h-4 w-4" /></div>}
        />
        <StatCard
          label="Next Repayment"
          value={activeLoan ? formatINR(activeLoan.amountRequested / activeLoan.durationMonths) : "₹0"}
          hint={activeLoan ? "Due in 15 days" : "No active loans"}
          icon={<div className="rounded-full bg-orange-100 p-2 text-orange-600"><Clock className="h-4 w-4" /></div>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <FundingChart />

        <Card id="request-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Request New Loan</CardTitle>
            <CardDescription>Get funded in as little as 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount Required</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500">₹</span>
                <Input type="number" value={amountRequested} onChange={(e) => setAmountRequested(parseInt(e.target.value || "0", 10))} className="pl-7" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duration (months)</Label>
              <Input type="number" value={durationMonths} onChange={(e) => setDurationMonths(parseInt(e.target.value || "0", 10))} />
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
            <Button onClick={requestLoan} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Submit Request
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Your Loan Applications</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((l) => {
            const pct = Math.min(100, Math.round((l.fundedAmount / l.amountRequested) * 100));
            return (
              <Card key={l.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{l.purpose || "Business Loan"}</CardTitle>
                      <CardDescription>Loan #{l.id.slice(-5)}</CardDescription>
                    </div>
                    <Badge variant={l.status === "pending" ? "secondary" : l.status === "active" ? "default" : l.status === "completed" ? "outline" : "secondary"}>{l.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Amount</span>
                    <span className="font-medium">{formatINR(l.amountRequested)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Funding Progress</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{l.durationMonths} months duration</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">Recommended Investors</h2>
          <Link href="/explore/borrower" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investors.slice(0, 3).map((inv) => (
            <Card key={inv.id} className="hover:shadow-md transition-all">
              <CardHeader className="flex-row items-center gap-3 pb-3">
                <Avatar>
                  <AvatarFallback>{(inv.name || inv.email || "IN").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{inv.name || inv.email}</CardTitle>
                  <CardDescription className="text-xs">
                    Risk: {inv.riskAppetite || "Medium"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <span>Range: {inv.investmentRange || "₹50k - ₹1L"}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                  <span>Active Investments: {inv.portfolioCount ?? "5+"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
