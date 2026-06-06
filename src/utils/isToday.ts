export function isToday(
  timestamp: number
) {
  const today =
    new Date()
      .toLocaleDateString();

  const transactionDate =
    new Date(timestamp)
      .toLocaleDateString();

  return (
    today === transactionDate
  );
}