import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

// Allocate from pool proportionally to contributions until loan fully funded
export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await readDB();
  const loan = db.loans.find((l) => l.id === id);
  if (!loan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(loan.status === "approved" || loan.status === "funding")) return NextResponse.json({ error: "Invalid state" }, { status: 400 });

  const remaining = loan.amountRequested - loan.fundedAmount;
  if (remaining <= 0) return NextResponse.json(loan);

  const poolTotal = db.pool.total;
  if (poolTotal <= 0) {
    loan.status = "funding"; // waiting for pool
    await writeDB(db);
    return NextResponse.json(loan);
  }

  const allocAmount = Math.min(remaining, poolTotal);

  const totalContrib = db.pool.contributions.reduce((s, c) => s + c.amount, 0);
  if (totalContrib <= 0) return NextResponse.json(loan);

  // Proportional allocation
  for (const contrib of db.pool.contributions) {
    if (allocAmount <= 0) break;
    const share = contrib.amount / totalContrib;
    const amount = Math.floor(allocAmount * share);
    if (amount <= 0) continue;

    loan.fundedAmount += amount;
    const inv = db.users.find((u) => u.id === contrib.investorId);
    if (inv) {
      const existing = loan.allocations.find((a) => a.investorId === inv.id);
      if (existing) {
        existing.amount += amount;
        existing.share = existing.amount / loan.fundedAmount;
      } else {
        loan.allocations.push({ investorId: inv.id, amount, share });
      }
    }
    contrib.amount -= amount;
    db.pool.total -= amount;
  }

  // Clean empty contributions
  db.pool.contributions = db.pool.contributions.filter((c) => c.amount > 0);

  if (loan.fundedAmount >= loan.amountRequested) {
    loan.status = "funded";
    // For demo move to active and set totalDue (10% interest)
    loan.status = "active";
    loan.totalDue = Math.round(loan.amountRequested * 1.1);
    loan.totalPaid = 0;
    db.transactions.push({ id: `tx_${Date.now()}`, message: `Loan ${loan.id} funded from pool`, timestamp: Date.now() });
  } else {
    loan.status = "funding";
  }

  await writeDB(db);
  return NextResponse.json(loan);
}
