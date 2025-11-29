"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR } from "@/lib/format";
import { MapPin, Wallet, BarChart3, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function BorrowerExplorePage() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [filteredInvestors, setFilteredInvestors] = useState<any[]>([]);

    // Filters
    const [range, setRange] = useState("all");
    const [risk, setRisk] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/users").then((r) => r.json()).then((us) => {
            const invs = us.filter((u: any) => u.role === "investor");
            setInvestors(invs);
            setFilteredInvestors(invs);
        });
    }, []);

    useEffect(() => {
        let res = investors;

        if (range !== "all") {
            res = res.filter(i => i.investmentRange === range);
        }

        if (risk !== "all") {
            res = res.filter(i => i.riskAppetite === risk);
        }

        if (search) {
            res = res.filter(i =>
                i.name?.toLowerCase().includes(search.toLowerCase()) ||
                i.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredInvestors(res);
    }, [range, risk, search, investors]);

    const ranges = Array.from(new Set(investors.map(i => i.investmentRange).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900">Find Investors</h1>
                <p className="text-zinc-600">Connect with investors looking for opportunities like yours.</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 md:flex-row md:items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search investors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 max-w-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Investment Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ranges</SelectItem>
                            {ranges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={risk} onValueChange={setRisk}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Risk Appetite" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Risk Levels</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredInvestors.map((inv) => (
                    <Card key={inv.id} className="transition-all hover:shadow-md">
                        <CardHeader className="flex-row items-center gap-4 pb-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                    {(inv.name || inv.email || "IN").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base">{inv.name || inv.email}</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs">
                                    <MapPin className="h-3 w-3" /> {inv.location || "India"}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 p-3 text-sm">
                                <div>
                                    <div className="text-zinc-500 text-xs">Range</div>
                                    <div className="font-semibold">{inv.investmentRange || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs">Risk Appetite</div>
                                    <div className="font-semibold capitalize">{inv.riskAppetite || "Medium"}</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs">Portfolio</div>
                                    <div className="font-semibold">{inv.portfolioCount ?? "5+"} Deals</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs">Total Invested</div>
                                    <div className="font-semibold text-blue-600">{inv.totalInvested ? formatINR(inv.totalInvested) : "—"}</div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full">View Profile</Button>
                        </CardContent>
                    </Card>
                ))}
                {filteredInvestors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500">
                        No investors found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
