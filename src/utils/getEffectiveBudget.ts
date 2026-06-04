export function getEffectiveBudget(
  dailyBudget: number,
  rollover: number,
  debtCarryForward: number
) {
  return Math.max(
    dailyBudget +
      rollover -
      debtCarryForward,
    0
  );
}