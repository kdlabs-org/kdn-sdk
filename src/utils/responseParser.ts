import { ICommandResult } from '@kadena/client'

/**
 * Parses the response from the Chainweb API.
 * @template T
 * @param response - The response from the API.
 * @param subject - The subject being retrieved (e.g., 'address', 'name').
 * @returns The parsed data.
 * @throws Will throw an error if the response indicates failure.
 */
export function parseChainResponse<T>(
  response: ICommandResult,
  subject: string
): T {
  if (response.result?.status === 'success') {
    return response.result.data as T
  } else if (response.result?.status === 'failure') {
    const errorMessage = `Failed to retrieve ${subject}: ${JSON.stringify(
      response.result.error
    )}`
    throw new Error(errorMessage)
  }
  throw new Error(`Failed to retrieve ${subject}: Unknown error`)
}
