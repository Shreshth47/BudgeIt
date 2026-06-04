export function getRemainingBudget(
  dailyBudget: number,
  todaysSpend: number,
  rollover: number
){
  return (
    Math.max(dailyBudget-todaysSpend+rollover,0)
  )
}