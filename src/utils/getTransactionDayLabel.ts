export function getTransactionDayLabel(
  timestamp: number
) {
  const transactionDate =
    new Date(timestamp);

  const today =
    new Date();

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const transactionDay =
    transactionDate.toLocaleDateString();

  if (
    transactionDay ===
    today.toLocaleDateString()
  ) {
    return "TODAY";
  }

  if (
    transactionDay ===
    yesterday.toLocaleDateString()
  ) {
    return "YESTERDAY";
  }

  return transactionDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  );
}