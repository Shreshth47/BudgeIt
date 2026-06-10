export function getNotificationGroup(
  timestamp: number
) {
  const notificationDate =
    new Date(timestamp);

  const today =
    new Date();

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const isSameDay = (
    d1: Date,
    d2: Date
  ) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() ===
      d2.getFullYear();

  if (
    isSameDay(
      notificationDate,
      today
    )
  ) {
    return "Today";
  }

  if (
    isSameDay(
      notificationDate,
      yesterday
    )
  ) {
    return "Yesterday";
  }

  return "Older";
}