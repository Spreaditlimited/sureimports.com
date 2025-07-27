/**
 * Validates a phone number
 * @param phoneNumber The phone number to validate (as string or number)
 * @returns {boolean} True if valid, false otherwise
 */
export default function isValidPhoneNumber(
  phoneNumber: string | number,
): boolean {
  // Convert to string if it's a number
  const phoneStr =
    typeof phoneNumber === 'number' ? phoneNumber.toString() : phoneNumber;

  // Check if it contains only digits
  if (!/^\d+$/.test(phoneStr)) {
    return false;
  }

  // Check length between 6 and 12 digits
  return phoneStr.length >= 6 && phoneStr.length <= 12;
}
