import { CATEGORY_RULES }
  from "@/constants/categoryRules";

export function detectCategory(
  merchant: string
): string {

  const lowerMerchant =
    merchant.toLowerCase();

  for (const [
    category,
    keywords,
  ] of Object.entries(
    CATEGORY_RULES
  )) {

    const matched =
      keywords.some(
        keyword =>
          lowerMerchant.includes(
            keyword
          )
      );

    if (matched) {
      return category;
    }
  }

  return "Other";
}