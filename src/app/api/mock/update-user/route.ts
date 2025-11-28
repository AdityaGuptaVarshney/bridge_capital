import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as User;
  const db = await readDB();
  const idx = db.users.findIndex((u) => u.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });
  db.users[idx] = { ...db.users[idx], ...body } as User;
  await writeDB(db);
  return NextResponse.json(db.users[idx]);
}

