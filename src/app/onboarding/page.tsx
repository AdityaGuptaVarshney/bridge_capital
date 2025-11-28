"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.replace("/auth");
  }, [user, router]);

  const isInvestor = user?.role === "investor";

  const [form, setForm] = useState<any>({});
  const onSave = async () => {
    if (!user) return;
    setLoading(true);
    // Update user in DB (simple: re-create by email not supported). For prototype, we'll just overwrite fields via users list endpoint not present; use signup to update isn't ideal.
    // Simplify: fetch all users, update client-side, and POST to a generic upsert endpoint would be better, but for brevity we skip API and store locally.
    const res = await fetch("/api/users");
    const users = await res.json();
    const me = users.find((u: any) => u.id === user.id);
    Object.assign(me, form);
    await fetch("/api/mock/update-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(me) }).catch(() => {});
    setUser(me);
    setLoading(false);
    router.push("/dashboard");
  };

  const fields = useMemo(() => {
    if (isInvestor) {
      return (
        <div className="grid gap-4">
          <div>
            <Label>PAN (optional)</Label>
            <Input onChange={(e) => setForm({ ...form, pan: e.target.value })} className="mt-1" placeholder="ABCDE1234F" />
          </div>
          <div>
            <Label>Investment Range</Label>
            <Input onChange={(e) => setForm({ ...form, investmentRange: e.target.value })} className="mt-1" placeholder="₹50k - ₹5L" />
          </div>
          <div>
            <Label>Risk Appetite</Label>
            <Select onValueChange={(v) => setForm({ ...form, riskAppetite: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    return (
      <div className="grid gap-4">
        <div>
          <Label>Business Name</Label>
          <Input onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="mt-1" placeholder="Acme Traders" />
        </div>
        <div>
          <Label>Category</Label>
          <Input onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1" placeholder="Retail / Services" />
        </div>
        <div>
          <Label>Purpose of Loan</Label>
          <Input onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })} className="mt-1" placeholder="Inventory expansion" />
        </div>
      </div>
    );
  }, [form, isInvestor]);

  if (!user) return null;
  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>Help tailor your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields}
          <Button onClick={onSave} disabled={loading} className="px-6">Continue</Button>
        </CardContent>
      </Card>
    </div>
  );
}
