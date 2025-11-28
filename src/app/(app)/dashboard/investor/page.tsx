"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/auth-context";
import { formatINR } from "@/lib/format";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Building2, Star } from "lucide-react";

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
    if (!res.ok) return alert("Investment failed");
    const data = await res.json();
    setPool(data.pool);
    setUser(data.investor);
    toast.success(`Added ${formatINR(amount)} to pool`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Investor Dashboard</h1>
        <p className="text-sm text-zinc-600">Track your portfolio and add funds to the shared pool.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Wallet Balance" value={formatINR(user?.walletBalance ?? 0)} />
        <StatCard label="Portfolio Invested" value={formatINR(portfolio.totalInvested)} />
        <StatCard label="Expected Returns" value={formatINR(portfolio.expectedReturns)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invest Now</CardTitle>
          <CardDescription>Add funds to aggregator pool (current pool: {formatINR(pool.total)})</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))} className="w-40" />
          <Button onClick={investNow}>Add to Pool</Button>
        </CardContent>
      </Card>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Available Business Loans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.filter((l) => ["approved", "funding"].includes(l.status)).map((l) => {
            const b = borrowers.find((x) => x.id === l.borrowerId);
            const pct = Math.min(100, Math.round((l.fundedAmount / l.amountRequested) * 100));
            return (
              <Card key={l.id}>
                <CardHeader>
                  <CardTitle className="text-base">{b?.businessName || "Business Loan"}</CardTitle>
                  <CardDescription>Loan #{l.id.slice(-5)} • {l.durationMonths} months</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {b && (
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{b.category}</span>
                      <span>•</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{b.location}</span>
                    </div>
                  )}
                  <div className="text-sm text-zinc-700">Purpose: {l.purpose}</div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-zinc-600">Amount</div>
                    <div className="font-medium">{formatINR(l.amountRequested)}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-zinc-600">Funded</div>
                    <div className="font-medium">{formatINR(l.fundedAmount)}</div>
                  </div>
                  <Progress value={pct} />
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={l.status === "approved" ? "secondary" : "outline"}>{l.status}</Badge>
                    <div className="text-xs text-zinc-600">{pct}% funded</div>
                  </div>
                  {b && (
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <div>Revenue: {b.revenueRange}</div>
                      <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-zinc-800 text-zinc-800" /> {b.rating}/5</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Browse Borrowers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {borrowers.map((b) => (
            <Card key={b.id}>
              <CardHeader className="flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback>{(b.businessName || b.name || "BB").split(" ").map((s: string) => s[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{b.businessName || b.name || "Borrower"}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{b.category || "Small Business"}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-zinc-500"><MapPin className="h-3.5 w-3.5" /> {b.location || "—"}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-zinc-600">
                <div>Purpose: {b.loanPurpose || "Working capital"}</div>
                <div>Years in business: {b.yearsInBusiness ?? "—"}</div>
                <div>Revenue: {b.revenueRange ?? "—"}</div>
                <div className="flex items-center gap-1">Rating: <Star className="h-3.5 w-3.5 fill-zinc-800 text-zinc-800" /> {b.rating ?? "—"}/5</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
