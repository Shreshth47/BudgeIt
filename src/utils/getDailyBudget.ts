import { calculateBudget } from "./calculateBudget";
import getTotalFixedExpenses from "./getTotalFixedExpenses";

export function getDailyBudget(
  income:number,
  fixedExpenses:{amount:number}[],
  savingsTarget: number
) {
  return calculateBudget({
    income, fixedExpenses: getTotalFixedExpenses(fixedExpenses), savingsTarget,
  });
}