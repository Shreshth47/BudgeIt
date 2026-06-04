export default function getTotalFixedExpenses(expenses: {
  amount: number;
}[]
) {
  return expenses.reduce((sum,expense)=>sum+expense.amount,0);
}