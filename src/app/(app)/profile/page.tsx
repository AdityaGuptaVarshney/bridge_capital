"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth-context";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const isInvestor = user?.role === "investor";
  const isBorrower = user?.role === "borrower";

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/mock/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...form }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setUser(updated);
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-sm text-zinc-600">Please sign in to manage your profile.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-sm text-zinc-600">Update your account and {isInvestor ? "investor" : isBorrower ? "business" : "user"} details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Basic information for your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input className="mt-1" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Location</Label>
            <Input className="mt-1" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City" />
          </div>
        </CardContent>
      </Card>

      {isInvestor && (
        <Card>
          <CardHeader>
            <CardTitle>Investor Details</CardTitle>
            <CardDescription>Tell us your preferences</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>PAN (optional)</Label>
              <Input className="mt-1" value={form.pan ?? ""} onChange={(e) => setForm({ ...form, pan: e.target.value })} placeholder="ABCDE1234F" />
            </div>
            <div>
              <Label>Investment Range</Label>
              <Input className="mt-1" value={form.investmentRange ?? ""} onChange={(e) => setForm({ ...form, investmentRange: e.target.value })} placeholder="INR 25k - 1L" />
            </div>
            <div className="sm:col-span-2">
              <Label>Risk Appetite</Label>
              <Select value={form.riskAppetite ?? ""} onValueChange={(v) => setForm({ ...form, riskAppetite: v })}>
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
          </CardContent>
        </Card>
      )}

      {isBorrower && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>Information about your business</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Business Name</Label>
              <Input className="mt-1" value={form.businessName ?? ""} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Input className="mt-1" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Retail / Services / F&B" />
            </div>
            <div>
              <Label>Primary Purpose</Label>
              <Input className="mt-1" value={form.loanPurpose ?? ""} onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })} placeholder="Working capital" />
            </div>
            <div>
              <Label>Years in Business</Label>
              <Input type="number" className="mt-1" value={form.yearsInBusiness ?? ""} onChange={(e) => setForm({ ...form, yearsInBusiness: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Revenue Range</Label>
              <Input className="mt-1" value={form.revenueRange ?? ""} onChange={(e) => setForm({ ...form, revenueRange: e.target.value })} placeholder="INR 10L - 25L" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="px-6">{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
}

