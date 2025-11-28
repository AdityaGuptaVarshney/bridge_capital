"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-context";
import Image from "next/image";

function HashNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>(typeof window !== "undefined" ? window.location.hash : "");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const linkHash = href.includes("#") ? `#${href.split("#")[1]}` : "";
  const isActive = (pathname === "/" && linkHash && hash === linkHash) || (href === "/" && pathname === "/" && !hash);
  return (
    <Link href={href} className={`text-sm px-3 py-2 rounded-md transition-colors ${isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"}`}>
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image src="/bridge-logo.png" alt="Bridge Capital" width={120} height={120} priority /> */}
            <span className="font-bold">Bridge Capital</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <HashNavLink href="/" label="Home" />
            <HashNavLink href="/#features" label="Features" />
            <HashNavLink href="/#how-it-works" label="How it works" />
            <HashNavLink href="/#testimonials" label="Testimonials" />
            <HashNavLink href="/#faq" label="FAQ" />
            {user?.role === "admin" && <Link href="/admin" className="text-sm px-3 py-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50">Admin</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!user && (
            <Button size="sm" onClick={() => router.push("/auth")}>
              Get Started
            </Button>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-zinc-600 sm:inline">{user.name || user.email} · {user.role}</span>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>Profile</Button>
              <Button size="sm" onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
