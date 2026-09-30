import { Request, Response, NextFunction } from "express";

export const languageMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers["accept-language"];

  if (header && typeof header === "string") {
    const primary = header.split(",")[0]?.trim().toLowerCase() || "";
    if (primary.startsWith("en")) {
      req.language = "en";
      return next();
    }
  }

  // Default to Arabic
  req.language = "ar";
  next();
};
