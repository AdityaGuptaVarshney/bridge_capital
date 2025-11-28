import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await readDB();
  const loan = db.loans.find((l) => l.id === id);
  if (!loan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(loan.status === "active" || loan.status === "funded")) return NextResponse.json({ error: "Invalid state" }, { status: 400 });

  const totalDue = loan.totalDue ?? Math.round(loan.amountRequested * 1.1);
  // distribute to investors
  for (const a of loan.allocations) {
    const payout = Math.round(totalDue * (a.amount / loan.amountRequested));
    const inv = db.users.find((u) => u.id === a.investorId);
    if (inv) inv.walletBalance += payout;
  }
  loan.totalPaid = totalDue;
  loan.status = "completed";
  db.transactions.push({ id: `tx_${Date.now()}`, message: `Loan ${loan.id} fully repaid`, timestamp: Date.now() });
  await writeDB(db);
  return NextResponse.json(loan);
}
