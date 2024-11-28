import { ChainwebHostGeneratorOptions } from '../types/types'

/**
 * Generates Chainweb URLs based on network and chain IDs.
 * @param options - The options containing networkId and chainId.
 * @returns The generated Chainweb URL.
 * @throws Error if the networkId is unsupported.
 */
export const defaultChainwebHostGenerator = (
  options: ChainwebHostGeneratorOptions
): string => {
  const chainwebHostMap: Record<string, string> = {
    mainnet01: 'https://api.chainweb.com',
    testnet04: 'https://api.testnet.chainweb.com',
    testnet05: 'https://api.testnet.chainweb.com'
  }

  const baseUrl = chainwebHostMap[options.networkId]
  if (!baseUrl) {
    throw new Error(`Unsupported networkId: ${options.networkId}`)
  }

  return `${baseUrl}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`
}
