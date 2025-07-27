export const secureInput = (
  input: unknown,
  maxLength: number = 10,
): string | null => {
  // Ensure input is a string
  if (typeof input !== 'string') return null;

  // Trim whitespace
  const trimmed = input.trim();

  // Check length
  if (trimmed.length > maxLength) return null;

  // Optional: Add additional sanitization if needed
  // For example, remove potentially dangerous characters
  const sanitized = trimmed.replace(/[<>{}[\]$;]/g, '');

  return sanitized;
};
