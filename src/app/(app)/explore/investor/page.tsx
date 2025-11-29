"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR } from "@/lib/format";
import { Building2, MapPin, Star, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function InvestorExplorePage() {
    const [loans, setLoans] = useState<any[]>([]);
    const [borrowers, setBorrowers] = useState<any[]>([]);
    const [filteredLoans, setFilteredLoans] = useState<any[]>([]);

    // Filters
    const [category, setCategory] = useState("all");
    const [risk, setRisk] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        Promise.all([
            fetch("/api/loans").then((r) => r.json()),
            fetch("/api/users").then((r) => r.json())
        ]).then(([ls, us]) => {
            setLoans(ls);
            setBorrowers(us.filter((u: any) => u.role === "borrower"));
            setFilteredLoans(ls);
        });
    }, []);

    useEffect(() => {
        let res = loans;

        if (category !== "all") {
            res = res.filter(l => {
                const b = borrowers.find(u => u.id === l.borrowerId);
                return b?.category === category;
            });
        }

        if (search) {
            res = res.filter(l => {
                const b = borrowers.find(u => u.id === l.borrowerId);
                return l.purpose.toLowerCase().includes(search.toLowerCase()) ||
                    b?.businessName?.toLowerCase().includes(search.toLowerCase());
            });
        }

        // Dummy risk filter logic since we don't have real risk scores in DB yet
        if (risk !== "all") {
            // Randomly filter for demo purposes or based on amount
            if (risk === "low") res = res.filter(l => l.amountRequested < 50000);
            if (risk === "high") res = res.filter(l => l.amountRequested >= 50000);
        }

        setFilteredLoans(res);
    }, [category, risk, search, loans, borrowers]);

    const categories = Array.from(new Set(borrowers.map(b => b.category).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900">Explore Opportunities</h1>
                <p className="text-zinc-600">Find and fund businesses that match your investment criteria.</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Search by business or purpose..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={risk} onValueChange={setRisk}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Risk Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Risk Levels</SelectItem>
                            <SelectItem value="low">Low Risk (&lt;50k)</SelectItem>
                            <SelectItem value="high">High Yield (&gt;50k)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredLoans.map((l) => {
                    const b = borrowers.find((x) => x.id === l.borrowerId);
                    const pct = Math.min(100, Math.round((l.fundedAmount / l.amountRequested) * 100));
                    return (
                        <Card key={l.id} className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">{b?.businessName || "Business Loan"}</CardTitle>
                                        <CardDescription className="text-xs">{b?.category} • {b?.location || "India"}</CardDescription>
                                    </div>
                                    <Badge variant={l.status === "approved" ? "secondary" : "outline"}>{l.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm text-zinc-700 font-medium">{l.purpose}</div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <Building2 className="h-3.5 w-3.5" />
                                        <span>{b?.yearsInBusiness || "2"} years in business</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 p-3 text-sm">
                                    <div>
                                        <div className="text-zinc-500 text-xs">Amount</div>
                                        <div className="font-semibold">{formatINR(l.amountRequested)}</div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 text-xs">Returns</div>
                                        <div className="font-semibold text-green-600">~12% p.a.</div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 text-xs">Duration</div>
                                        <div className="font-semibold">{l.durationMonths} Mo</div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 text-xs">Rating</div>
                                        <div className="flex items-center gap-1 font-semibold">
                                            {b?.rating || 4.5} <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Funding Progress</span>
                                        <span className="font-medium">{pct}%</span>
                                    </div>
                                    <Progress value={pct} className="h-2" />
                                </div>

                                <Button className="w-full">View Details</Button>
                            </CardContent>
                        </Card>
                    );
                })}
                {filteredLoans.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500">
                        No loans found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
