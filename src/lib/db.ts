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
      walletBalance: 100000,
      pan: "ABCDE1234F",
      investmentRange: "50k-1L",
      riskAppetite: "medium",
    },
    {
      id: "user_borrower1",
      role: "borrower",
      name: "Demo Borrower",
      email: "borrower@demo.com",
      walletBalance: 5000,
      businessName: "Demo Cafe",
      category: "Retail",
      loanPurpose: "Expansion",
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
      amountRequested: 50000,
      durationMonths: 12,
      purpose: "New equipment",
      status: "active",
      fundedAmount: 50000,
      allocations: [
        { investorId: "user_investor1", amount: 50000, share: 1 }
      ],
      totalDue: 55000,
      totalPaid: 10000,
    }
  ],
  pool: {
    total: 150000,
    contributions: [
      { investorId: "user_investor1", amount: 100000 }
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
