import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import type { Loan } from "@/lib/types";

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.loans);
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    borrowerId: string;
    amountRequested: number;
    durationMonths: number;
    purpose: string;
  };
  const db = await readDB();
  const loan: Loan = {
    id: uid("loan"),
    borrowerId: body.borrowerId,
    amountRequested: body.amountRequested,
    durationMonths: body.durationMonths,
    purpose: body.purpose,
    status: "pending",
    fundedAmount: 0,
    allocations: [],
  };
  db.loans.push(loan);
  await writeDB(db);
  return NextResponse.json(loan);
}

