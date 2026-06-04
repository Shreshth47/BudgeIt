export function getCategoryIcon(
  category: string
) {
  switch (category) {
    case "Food":
      return "🍔";

    case "Transport":
      return "🚕";

    case "Shopping":
      return "🛍️";

    case "Bills":
      return "📄";

    case "Entertainment":
      return "🎬";

    case "Health":
      return "💊";

    case "Education":
      return "📚";

    default:
      return "💸";
  }
}