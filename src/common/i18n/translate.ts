import { ar } from "./ar";
import { en } from "./en";
import { MessageKey } from "./messages";

export const translate = (key: string, language: "ar" | "en" = "ar"): string => {
  const dict = language === "en" ? en : ar;
  const message = dict[key as MessageKey];

  if (message) {
    return message;
  }

  // Fallback to English if not found in Arabic
  if (language === "ar" && en[key as MessageKey]) {
    return en[key as MessageKey];
  }

  return key;
};
