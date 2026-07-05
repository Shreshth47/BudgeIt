export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface UserDocument {
  uid: string;

  email: string;

  fullName: string;

  dateOfBirth: string;

  currency: string;

  upiId: string;

  currentBalance: number;

  monthlyIncome: number;

  secondaryIncome: number;

  fixedExpenses: FixedExpense[];

  savingsTarget: number;

  emergencyFundGoal: number;

  overrideDailyLimit: number | null;

  hasCompletedOnboarding: boolean;

  createdAt: number;

  updatedAt: number;
}