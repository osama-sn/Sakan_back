import { ERROR_CODES } from "../constants/error-codes";

export type MessageKey = keyof typeof ERROR_CODES;

export type TranslationDictionary = Record<MessageKey, string>;
