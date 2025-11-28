import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(req: Request) {
  const { investorId, amount } = (await req.json()) as { investorId: string; amount: number };
  if (amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  const db = await readDB();
  const investor = db.users.find((u) => u.id === investorId && u.role === "investor");
  if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });
  if (investor.walletBalance < amount) return NextResponse.json({ error: "Insufficient wallet" }, { status: 400 });

  investor.walletBalance -= amount;
  db.pool.total += amount;
  const existing = db.pool.contributions.find((c) => c.investorId === investorId);
  if (existing) existing.amount += amount;
  else db.pool.contributions.push({ investorId, amount });

  db.transactions.push({ id: `tx_${Date.now()}`, message: `Investor ${investor.name} funded ${amount} to pool`, timestamp: Date.now() });
  await writeDB(db);
  return NextResponse.json({ pool: db.pool, investor });
}

