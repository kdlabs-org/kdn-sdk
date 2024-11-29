/**
 * Adds the '.kda' extension to a name if it does not already include an extension.
 * @param name - The name to validate (e.g., 'example' or 'example.kda').
 * @returns The name with the '.kda' extension added if no extension exists (e.g., 'example' becomes 'example.kda').
 */
export const addExtentionToName = (name: string): string => {
  const lowerCaseName = name.toLowerCase()
  return lowerCaseName.includes('.') ? name : `${name}.kda`
}

/**
 * Shortens a string by keeping the first and last five characters, separated by '...'.
 * @param inputString - The string to shorten.
 * @returns The shortened string if its length exceeds 10 characters (e.g., 'abcdefghij12345' becomes 'abcde...2345'), or the original string if its length is 10 or less.
 */
export const shortenString = (inputString: string): string => {
  if (inputString.length <= 10) {
    return inputString
  }
  const firstFive = inputString.slice(0, 5)
  const lastFive = inputString.slice(-5)
  return `${firstFive}...${lastFive}`
}
