export type Role = "investor" | "borrower" | "admin";

export interface UserBase {
  id: string;
  role: Role;
  name: string;
  email: string;
  walletBalance: number;
}

export interface InvestorProfile extends UserBase {
  role: "investor";
  pan?: string;
  investmentRange?: string;
  riskAppetite?: "low" | "medium" | "high";
}

export interface BorrowerProfile extends UserBase {
  role: "borrower";
  businessName?: string;
  category?: string;
  loanPurpose?: string;
}

export type User = InvestorProfile | BorrowerProfile | (UserBase & { role: "admin" });

export interface PoolContribution {
  investorId: string;
  amount: number;
}

export interface LoanAllocation {
  investorId: string;
  amount: number;
  share: number; // percentage 0..1
}

export type LoanStatus = "pending" | "approved" | "funding" | "funded" | "active" | "completed" | "rejected";

export interface Loan {
  id: string;
  borrowerId: string;
  amountRequested: number;
  durationMonths: number;
  purpose: string;
  status: LoanStatus;
  fundedAmount: number;
  allocations: LoanAllocation[];
  totalDue?: number; // principal + interest
  totalPaid?: number;
}

export interface DBShape {
  users: User[];
  loans: Loan[];
  pool: { total: number; contributions: PoolContribution[] };
  transactions: { id: string; message: string; timestamp: number }[];
}

