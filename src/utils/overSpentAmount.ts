export function getOverSpentAmount(
  spent: number,
  budget: number,
){
  return (
    Math.max(spent-budget,0)
  )
}