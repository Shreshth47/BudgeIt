export function calculateBudget({
  income, fixedExpenses, savingsTarget,}:{income:number; fixedExpenses:number; savingsTarget:number;}){
    const disposable = income - fixedExpenses - savingsTarget;
    return Math.max(0,Math.floor(disposable/30));
}