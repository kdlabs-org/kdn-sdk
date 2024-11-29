/**
 * Transforms a Pact date object into a JavaScript Date instance.
 * @param val - The Pact date object, which may contain a `timep` or `time` property with a numeric timestamp.
 * @returns A JavaScript Date object if the input contains a valid timestamp, or `null` if the input is invalid or missing.
 * @example
 * // Example Pact date objects:
 * // { timep: 1672531200000 } -> new Date(1672531200000)
 * // { time: 1672531200000 } -> new Date(1672531200000)
 * // { invalid: "data" } -> null
 */
export const transformPactDate = (val: any): Date | null => {
  if (!val) return null

  const hasOwnProperty = Object.prototype.hasOwnProperty

  if (hasOwnProperty.call(val, 'timep') && typeof val.timep === 'number') {
    return new Date(val.timep)
  }

  if (hasOwnProperty.call(val, 'time') && typeof val.time === 'number') {
    return new Date(val.time)
  }

  return null
}

/**
 * Determines if a Kadena name has expired, accounting for a 31-day grace period.
 * @param expiryDateMs - The expiration date of the name in milliseconds since the Unix epoch.
 * @returns `true` if the name is expired (current time is beyond the expiration date + grace period), otherwise `false`.
 * @example
 * // Assume the current date is March 1, 2023 (timestamp: 1677628800000):
 * isNameExpired(1672531200000) // true (expired on January 31, 2023 + grace period)
 * isNameExpired(1677628800000) // false (within the grace period)
 */
export const isNameExpired = (expiryDateMs: number): boolean => {
  const gracePeriod = 31 * 24 * 60 * 60 * 1000 // 31 days in milliseconds
  return Date.now() > expiryDateMs + gracePeriod
}
