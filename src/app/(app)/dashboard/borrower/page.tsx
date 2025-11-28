"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/auth-context";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Wallet, BarChart3 } from "lucide-react";

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
    if (!res.ok) return alert("Request failed");
    refresh();
    toast.success("Loan request submitted");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Borrower Dashboard</h1>
        <p className="text-sm text-zinc-600">Request funding and track your loan status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request New Loan</CardTitle>
          <CardDescription>Enter details for your business loan</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Amount</Label>
            <Input type="number" value={amountRequested} onChange={(e) => setAmountRequested(parseInt(e.target.value || "0", 10))} />
          </div>
          <div>
            <Label>Duration (months)</Label>
            <Input type="number" value={durationMonths} onChange={(e) => setDurationMonths(parseInt(e.target.value || "0", 10))} />
          </div>
          <div className="sm:col-span-3">
            <Label>Purpose</Label>
            <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div className="sm:col-span-3">
            <Button onClick={requestLoan}>Submit Request</Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your Loan Applications</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((l) => {
            const pct = Math.min(100, Math.round((l.fundedAmount / l.amountRequested) * 100));
            return (
              <Card key={l.id}>
                <CardHeader>
                  <CardTitle className="text-base">{l.purpose || "Business Loan"}</CardTitle>
                  <CardDescription>Loan #{l.id.slice(-5)} • {l.durationMonths} months</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-zinc-700">Track your application’s funding and status.</div>
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
                    <Badge variant={l.status === "pending" ? "secondary" : l.status === "active" ? "default" : l.status === "completed" ? "outline" : "secondary"}>{l.status}</Badge>
                    <div className="text-xs text-zinc-600">{pct}% funded</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Explore Investors</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investors.map((inv) => (
            <Card key={inv.id}>
              <CardHeader className="flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback>{(inv.name || inv.email || "IN").split(" ").map((s: string) => s[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{inv.name || inv.email}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>Risk: {inv.riskAppetite || "—"}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-zinc-500"><MapPin className="h-3.5 w-3.5" /> {inv.location || "—"}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-zinc-600">
                <div className="inline-flex items-center gap-1"><Wallet className="h-4 w-4" /> Range: {inv.investmentRange || "—"}</div>
                <div className="inline-flex items-center gap-1"><BarChart3 className="h-4 w-4" /> Portfolio: {inv.portfolioCount ?? "—"} • Invested: {inv.totalInvested ? formatINR(inv.totalInvested) : "—"}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
