import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const db = await readDB();
  return NextResponse.json({ pool: db.pool, transactions: db.transactions, loans: db.loans, users: db.users });
}

