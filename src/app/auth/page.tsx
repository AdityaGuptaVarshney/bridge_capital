"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-context";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<"investor" | "borrower">("investor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const onSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });
    if (!res.ok) return alert("Signup failed");
    const u = await res.json();
    localStorage.setItem("bb_user_id", u.id);
    localStorage.setItem("bb_user_email", u.email);
    setUser(u);
    router.push("/onboarding");
  };

  const onLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return alert("Login failed");
    const u = await res.json();
    localStorage.setItem("bb_user_id", u.id);
    localStorage.setItem("bb_user_email", u.email);
    setUser(u);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>{mode === "signup" ? "Create your account" : "Log in"}</CardTitle>
          <CardDescription>Unified portal for investors and borrowers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="borrower">Borrower</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {mode === "signup" && (
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="Your name" />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" placeholder="you@example.com" />
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {mode === "signup" ? (
              <Button onClick={onSignup} className="px-6">Sign up</Button>
            ) : (
              <Button onClick={onLogin} className="px-6">Log in</Button>
            )}
            <Button variant="ghost" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Have an account? Log in" : "New here? Sign up"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
