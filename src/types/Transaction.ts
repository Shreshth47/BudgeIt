export interface Transaction {
  id: string;

  merchant: string;

  amount: number;

  timestamp: number;

  category: string;

  debtCreated: number;
}