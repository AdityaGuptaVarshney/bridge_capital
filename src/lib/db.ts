import type { DBShape, User, Loan, PoolContribution } from "./types";

// In-memory store for Vercel/Serverless environment
// This data resets on every cold start, which is fine for a demo.

const globalForDb = global as unknown as { db: DBShape };

const SEED_DB: DBShape = {
  users: [
    {
      id: "user_investor1",
      role: "investor",
      name: "Demo Investor",
      email: "investor@demo.com",
      walletBalance: 10000000, // Increased balance
      pan: "ABCDE1234F",
      investmentRange: "50k-1L",
      riskAppetite: "medium",
      location: "Mumbai",
      portfolioCount: 12,
      totalInvested: 450000,
    },
    {
      id: "user_investor2",
      role: "investor",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      walletBalance: 5000000,
      investmentRange: "1L-5L",
      riskAppetite: "high",
      location: "Bangalore",
      portfolioCount: 8,
      totalInvested: 1200000,
    },
    {
      id: "user_investor3",
      role: "investor",
      name: "Sarah Williams",
      email: "sarah@example.com",
      walletBalance: 2500000,
      investmentRange: "10k-50k",
      riskAppetite: "low",
      location: "Delhi",
      portfolioCount: 25,
      totalInvested: 800000,
    },
    {
      id: "user_investor4",
      role: "investor",
      name: "Venture Capital Ltd",
      email: "vc@example.com",
      walletBalance: 50000000,
      investmentRange: "5L+",
      riskAppetite: "high",
      location: "Mumbai",
      portfolioCount: 45,
      totalInvested: 15000000,
    },
    {
      id: "user_borrower1",
      role: "borrower",
      name: "Demo Borrower",
      email: "borrower@demo.com",
      walletBalance: 5000,
      businessName: "GreenLeaf Cafe",
      category: "Retail",
      loanPurpose: "Expansion",
      location: "Pune",
      revenueRange: "10L-50L",
      yearsInBusiness: 3,
      rating: 4.5,
    },
    {
      id: "user_borrower2",
      role: "borrower",
      name: "Amit Patel",
      email: "amit@techsol.com",
      walletBalance: 12000,
      businessName: "TechSol Solutions",
      category: "Technology",
      loanPurpose: "Server Infrastructure",
      location: "Hyderabad",
      revenueRange: "50L-1Cr",
      yearsInBusiness: 5,
      rating: 4.8,
    },
    {
      id: "user_borrower3",
      role: "borrower",
      name: "Priya Singh",
      email: "priya@handicrafts.com",
      walletBalance: 2000,
      businessName: "Desi Handicrafts",
      category: "Retail",
      loanPurpose: "Inventory",
      location: "Jaipur",
      revenueRange: "5L-10L",
      yearsInBusiness: 2,
      rating: 4.2,
    },
    {
      id: "user_borrower4",
      role: "borrower",
      name: "Rahul Verma",
      email: "rahul@logistics.com",
      walletBalance: 8000,
      businessName: "FastTrack Logistics",
      category: "Logistics",
      loanPurpose: "Vehicle Purchase",
      location: "Chennai",
      revenueRange: "1Cr+",
      yearsInBusiness: 7,
      rating: 4.6,
    },
    {
      id: "user_admin1",
      role: "admin",
      name: "Admin User",
      email: "admin@demo.com",
      walletBalance: 0,
    }
  ],
  loans: [
    {
      id: "loan_1",
      borrowerId: "user_borrower1",
      amountRequested: 500000,
      durationMonths: 12,
      purpose: "New equipment for kitchen expansion",
      status: "active",
      fundedAmount: 500000,
      allocations: [
        { investorId: "user_investor1", amount: 500000, share: 1 }
      ],
      totalDue: 550000,
      totalPaid: 100000,
    },
    {
      id: "loan_2",
      borrowerId: "user_borrower2",
      amountRequested: 2000000,
      durationMonths: 24,
      purpose: "Upgrading server infrastructure",
      status: "funding",
      fundedAmount: 1200000,
      allocations: [
        { investorId: "user_investor2", amount: 1000000, share: 0.5 },
        { investorId: "user_investor3", amount: 200000, share: 0.1 }
      ],
      totalDue: 2400000,
      totalPaid: 0,
    },
    {
      id: "loan_3",
      borrowerId: "user_borrower3",
      amountRequested: 100000,
      durationMonths: 6,
      purpose: "Seasonal inventory purchase",
      status: "approved",
      fundedAmount: 0,
      allocations: [],
      totalDue: 110000,
      totalPaid: 0,
    },
    {
      id: "loan_4",
      borrowerId: "user_borrower4",
      amountRequested: 1500000,
      durationMonths: 36,
      purpose: "Adding 2 new delivery trucks",
      status: "pending",
      fundedAmount: 0,
      allocations: [],
      totalDue: 1800000,
      totalPaid: 0,
    },
    {
      id: "loan_5",
      borrowerId: "user_borrower1",
      amountRequested: 200000,
      durationMonths: 12,
      purpose: "Marketing campaign",
      status: "completed",
      fundedAmount: 200000,
      allocations: [
        { investorId: "user_investor1", amount: 200000, share: 1 }
      ],
      totalDue: 220000,
      totalPaid: 220000,
    }
  ],
  pool: {
    total: 15000000,
    contributions: [
      { investorId: "user_investor1", amount: 10000000 },
      { investorId: "user_investor4", amount: 5000000 }
    ]
  },
  transactions: []
};

if (!globalForDb.db) {
  globalForDb.db = SEED_DB;
}

export async function readDB(): Promise<DBShape> {
  // Simulate async delay
  return Promise.resolve(globalForDb.db);
}

export async function writeDB(db: DBShape): Promise<void> {
  globalForDb.db = db;
  return Promise.resolve();
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
