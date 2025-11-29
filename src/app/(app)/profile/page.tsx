"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth-context";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, MapPin, Shield, User } from "lucide-react";

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
      toast.success("Profile updated successfully");
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-zinc-600">Please sign in to manage your profile.</p>
        <Button className="mt-4" onClick={() => window.location.href = "/auth"}>Sign In</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-24 flex flex-col items-start gap-6 sm:flex-row sm:items-end">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-zinc-100 text-4xl font-bold text-zinc-900">
                {(user.name || user.email || "U").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md hover:bg-zinc-50">
              <Camera className="h-4 w-4 text-zinc-600" />
            </button>
          </div>
          <div className="flex-1 space-y-1 pb-2">
            <h1 className="text-3xl font-bold text-zinc-900">{user.name || "User"}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role} Account</span>
              </div>
              {(user as any).location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {(user as any).location}
                </div>
              )}
            </div>
          </div>
          <div className="pb-2">
            <Button onClick={onSave} disabled={saving} className="min-w-[120px]">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Sidebar Info */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm text-zinc-500">Member Since</span>
                  <span className="text-sm font-medium">Nov 2023</span>
                </div>
                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm text-zinc-500">Verification</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Wallet ID</span>
                  <span className="text-sm font-mono text-zinc-600">{user.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and location.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input className="pl-9" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input className="pl-9" value={form.email ?? ""} disabled />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input className="pl-9" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isInvestor && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                  <CardDescription>Customize your investment preferences.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input value={form.pan ?? ""} onChange={(e) => setForm({ ...form, pan: e.target.value })} placeholder="ABCDE1234F" />
                  </div>
                  <div className="space-y-2">
                    <Label>Investment Range</Label>
                    <Input value={form.investmentRange ?? ""} onChange={(e) => setForm({ ...form, investmentRange: e.target.value })} placeholder="e.g. 50k - 1L" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Risk Appetite</Label>
                    <Select value={form.riskAppetite ?? ""} onValueChange={(v) => setForm({ ...form, riskAppetite: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Conservative)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Aggressive)</SelectItem>
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
                  <CardDescription>Tell us about your business.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Business Name</Label>
                    <Input value={form.businessName ?? ""} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Retail" />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Purpose</Label>
                    <Input value={form.loanPurpose ?? ""} onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })} placeholder="e.g. Expansion" />
                  </div>
                  <div className="space-y-2">
                    <Label>Years in Business</Label>
                    <Input type="number" value={form.yearsInBusiness ?? ""} onChange={(e) => setForm({ ...form, yearsInBusiness: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Revenue</Label>
                    <Input value={form.revenueRange ?? ""} onChange={(e) => setForm({ ...form, revenueRange: e.target.value })} placeholder="e.g. 10L - 50L" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

