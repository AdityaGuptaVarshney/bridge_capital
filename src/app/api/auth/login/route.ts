import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email: string };
  const db = await readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

