import {create} from "zustand";

interface BudgetStore {
  dailyBudget: number,
  setDailyBudget: (value:number) => void
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  dailyBudget: 0,
  setDailyBudget: (value) => set({dailyBudget: value})
}));