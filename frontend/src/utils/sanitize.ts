// src/utils/sanitize.ts
import DOMPurify from "dompurify";

/**
 * 🧼 Sanitize user input to prevent XSS or HTML injection.
 * Use this for any text coming from forms or user content.
 *
 * @param value - The input string to sanitize
 * @returns A cleaned string safe for rendering or sending to backend
 */
export function sanitize(value: string): string {
  if (!value || typeof value !== "string") return "";
  return DOMPurify.sanitize(value.trim());
}
