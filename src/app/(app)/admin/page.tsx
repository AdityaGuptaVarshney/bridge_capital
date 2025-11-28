"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminPage() {
  const [data, setData] = useState<any>({ pool: { total: 0 }, loans: [], users: [], transactions: [] });

  const refresh = () => fetch("/api/admin").then((r) => r.json()).then(setData);
  useEffect(() => { refresh(); }, []);

  const approve = async (id: string) => {
    await fetch(`/api/loans/${id}/approve`, { method: "POST" });
    await fetch(`/api/loans/${id}/fund`, { method: "POST" });
    refresh();
    toast.success(`Approved and funded ${id}`);
  };
  const repay = async (id: string) => {
    await fetch(`/api/loans/${id}/repay`, { method: "POST" });
    refresh();
    toast.success(`Marked repaid ${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Console</h1>
        <p className="text-sm text-zinc-600">Approve borrower requests, manage funding and repayments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Pool</CardTitle>
          <CardDescription>Total available: {formatINR(data.pool.total)}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Borrower Requests</CardTitle>
          <CardDescription>Approve to trigger pool funding</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.loans.map((l: any) => (
                <TableRow key={l.id}>
                  <TableCell>{l.id}</TableCell>
                  <TableCell>{formatINR(l.amountRequested)} ({formatINR(l.fundedAmount)} funded)</TableCell>
                  <TableCell>{l.borrowerId}</TableCell>
                  <TableCell>
                    <Badge variant={l.status === "pending" ? "secondary" : l.status === "active" ? "default" : l.status === "completed" ? "outline" : "secondary"}>{l.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {l.status === "pending" && <Button size="sm" onClick={() => approve(l.id)}>Approve</Button>}
                    {l.status === "active" && <Button size="sm" variant="outline" onClick={() => repay(l.id)}>Mark Repaid</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-700 space-y-1">
          {data.transactions.slice().reverse().map((t: any) => (
            <div key={t.id}>{new Date(t.timestamp).toLocaleString()}: {t.message}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
