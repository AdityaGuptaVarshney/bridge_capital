import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import type { Role, User } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<User> & { role: Role };
  const db = await readDB();

  const exists = db.users.find((u) => u.email === body.email);
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const id = uid("user");
  const walletBalance = body.role === "investor" ? 100_000 : 0; // seed wallet for demo
  const user: User = {
    id,
    role: body.role,
    name: body.name || "",
    email: body.email || "",
    walletBalance,
    ...(body.role === "investor"
      ? { pan: body["pan" as keyof User] as string | undefined, investmentRange: body["investmentRange" as keyof User] as string | undefined, riskAppetite: body["riskAppetite" as keyof User] as any }
      : body.role === "borrower"
      ? { businessName: body["businessName" as keyof User] as string | undefined, category: body["category" as keyof User] as string | undefined, loanPurpose: body["loanPurpose" as keyof User] as string | undefined }
      : {}),
  } as User;

  db.users.push(user);
  await writeDB(db);
  return NextResponse.json(user);
}

