import {
  nameToAddress as serviceNameToAddress,
  addressToName as serviceAddressToName,
  getChainIdByNetwork
} from './services/service'

import { defaultChainwebHostGenerator } from './hosts/hosts'
import {
  ChainwebHostGenerator,
  ChainwebHostGeneratorOptions
} from './types/types'

/**
 * The main SDK class for interacting with KadenaNames.
 */
export class KadenaNamesSDK {
  private _chainwebHostGenerator: ChainwebHostGenerator

  /**
   * Creates an instance of KadenaNamesSDK.
   * @param options - Optional configuration options.
   * @param options.chainwebHostGenerator - Custom Chainweb host generator.
   */
  constructor(options?: { chainwebHostGenerator?: ChainwebHostGenerator }) {
    this._chainwebHostGenerator =
      options?.chainwebHostGenerator || defaultChainwebHostGenerator
  }

  /**
   * Generates the Chainweb URL based on network and chain IDs.
   * @param options - The options containing networkId and chainId.
   * @returns The generated Chainweb URL.
   * @throws Error if the Chainweb URL generation fails.
   */
  getChainwebUrl(options: ChainwebHostGeneratorOptions): string {
    const result = this._chainwebHostGenerator(options)
    if (!result) {
      throw new Error(
        'Failed to generate chainweb url using chainwebHostGenerator method'
      )
    }
    return result
  }

  /**
   * Converts a name to its corresponding address.
   * @param name - The Kadena name (e.g., 'example.kda').
   * @param networkId - The network identifier (e.g., 'testnet04', 'testnet05', 'mainnet01').
   * @returns The corresponding address or null if not found.
   */
  async nameToAddress(name: string, networkId: string): Promise<string | null> {
    try {
      const chainId = getChainIdByNetwork(networkId)
      const host = this.getChainwebUrl({
        networkId,
        chainId
      })
      const result = await serviceNameToAddress(name, networkId, host)

      if (result === undefined) {
        console.warn(`No address found for name: ${name}`)
        return null
      }
      return result
    } catch (error: any) {
      console.error(`Error resolving address: ${error.message}`)
      throw new Error(`Error resolving address: ${error.message}`)
    }
  }

  /**
   * Converts an address to its corresponding name.
   * @param address - The Kadena address.
   * @param networkId - The network identifier (e.g., 'testnet04', 'testnet05', 'mainnet01').
   * @returns The corresponding name or null if not found.
   */
  async addressToName(
    address: string,
    networkId: string
  ): Promise<string | null> {
    try {
      const chainId = getChainIdByNetwork(networkId)
      const host = this.getChainwebUrl({
        networkId,
        chainId
      })
      const result = await serviceAddressToName(address, networkId, host)

      if (result === undefined) {
        console.warn(`No name found for address: ${address}`)
        return null
      }
      return result
    } catch (error: any) {
      console.error(`Error resolving name: ${error.message}`)
      throw new Error(`Error resolving name: ${error.message}`)
    }
  }
}

/**
 * Singleton instance of KadenaNames SDK for easy import and use.
 */
export const kadenaNames = new KadenaNamesSDK()
