"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export default function DashboardRoot() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) router.replace("/auth");
    else if (user.role === "investor") router.replace("/dashboard/investor");
    else if (user.role === "borrower") router.replace("/dashboard/borrower");
    else if (user.role === "admin") router.replace("/admin");
  }, [user, router]);
  return null;
}

