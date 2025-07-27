export function convertToTitleCase(input: string): string {
  // Split the string by underscore
  const words = input.toLowerCase().split('_');

  // Capitalize the first letter of each word
  const titleCaseWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  // Join the words back together with spaces
  return titleCaseWords.join(' ');
}
