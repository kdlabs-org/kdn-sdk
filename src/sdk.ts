import * as service from './services/service'
import { defaultChainwebHostGenerator } from './hosts/hosts'
import {
  ChainwebHostGenerator,
  ChainwebHostGeneratorOptions,
  NameInfo,
  SaleState
} from './types/types'
import { PRICE_MAP } from './constants/kdn'

/**
 * The main SDK class for interacting with KadenaNames.
 */
export class KadenaNamesSDK {
  private _chainwebHostGenerator: ChainwebHostGenerator

  public readonly PRICE_MAP = PRICE_MAP

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
   * Generates the Chainweb URL for a given network and chain ID.
   * @param options - Object containing the networkId and chainId.
   * @returns The generated Chainweb URL.
   * @throws Error if the Chainweb URL cannot be generated.
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
   * Converts a Kadena name to its corresponding address.
   * @param name - The Kadena name (e.g., 'example.kda').
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @returns The address corresponding to the name, or null if not found.
   */
  async nameToAddress(name: string, networkId: string): Promise<string | null> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })
    return await service.nameToAddress(name, networkId, host)
  }

  /**
   * Converts a Kadena address to its corresponding name.
   * @param address - The Kadena address.
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @returns The name corresponding to the address, or null if not found.
   */
  async addressToName(
    address: string,
    networkId: string
  ): Promise<string | null> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })
    return await service.addressToName(address, networkId, host)
  }

  /**
   * Fetches the sale state of a Kadena name.
   * @param name - The Kadena name.
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @returns The sale state of the name, including its price and availability.
   */
  async fetchSaleState(name: string, networkId: string): Promise<SaleState> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })
    return await service.fetchSaleState(name, networkId, host)
  }

  /**
   * Fetches detailed information about a Kadena name.
   * @param name - The Kadena name.
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @param owner - The owner's account.
   * @returns Detailed information about the name, including its price, availability, and expiry date.
   */
  async fetchNameInfo(
    name: string,
    networkId: string,
    owner: string
  ): Promise<NameInfo> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })
    return await service.fetchNameInfo(name, networkId, owner, host)
  }

  /**
   * Fetches the price for registering a Kadena name based on the registration period.
   * @param period - The registration period (key from PRICE_MAP).
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @param owner - The owner's account.
   * @returns The price for the specified registration period.
   */
  async fetchPriceByPeriod(
    period: keyof typeof PRICE_MAP,
    networkId: string,
    owner: string
  ): Promise<number> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })
    return await service.fetchPriceByPeriod(period, networkId, owner, host)
  }
}

/**
 * Singleton instance of KadenaNames SDK for easy import and use.
 */
export const kadenaNames = new KadenaNamesSDK()
