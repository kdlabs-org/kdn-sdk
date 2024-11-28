import { ChainId } from '@kadena/client'

/**
 * Interface for Chainweb Host Generator options.
 */
export interface ChainwebHostGeneratorOptions {
  networkId: string
  chainId: ChainId
}

/** Type definition for the Chainweb Host Generator function */
export type ChainwebHostGenerator = (
  options: ChainwebHostGeneratorOptions
) => string
