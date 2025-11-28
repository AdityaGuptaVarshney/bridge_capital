import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await readDB();
  const loan = db.loans.find((l) => l.id === id);
  if (!loan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (loan.status !== "pending") return NextResponse.json({ error: "Invalid state" }, { status: 400 });

  loan.status = "approved";
  await writeDB(db);
  return NextResponse.json(loan);
}
