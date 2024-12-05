import * as service from './services/service'
import { defaultChainwebHostGenerator } from './hosts/hosts'
import {
  ChainwebHostGenerator,
  ChainwebHostGeneratorOptions,
  NameInfo,
  SaleState
} from './types/types'
import { PRICE_MAP } from './constants/kdn'
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/types'
import { ITransactionDescriptor } from '@kadena/client'

import type { SDKResponse } from './types/types'

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
        'Failed to generate Chainweb URL using chainwebHostGenerator method.'
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
  async nameToAddress(
    name: string,
    networkId: string
  ): Promise<SDKResponse<string | null>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.nameToAddress(name, networkId, host)
    return response
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
  ): Promise<SDKResponse<string | null>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.addressToName(address, networkId, host)
    return response
  }

  /**
   * Fetches the sale state of a Kadena name.
   * @param name - The Kadena name.
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @returns The sale state of the name, including its price and availability.
   */
  async fetchSaleState(
    name: string,
    networkId: string
  ): Promise<SDKResponse<SaleState>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.fetchSaleState(name, networkId, host)
    return response
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
  ): Promise<SDKResponse<NameInfo>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.fetchNameInfo(name, networkId, owner, host)
    return response
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
  ): Promise<SDKResponse<number>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.fetchPriceByPeriod(
      period,
      networkId,
      owner,
      host
    )
    return response
  }

  /**
   * Creates a transaction for adding a new affiliate.
   * @param affiliateName - The name of the affiliate.
   * @param feeAddress - The blockchain address where affiliate fees will be sent.
   * @param fee - The fee percentage to be allocated to the affiliate.
   * @param adminKey - The governance key to authorize the operation.
   * @param networkId - The network identifier (e.g., "testnet04", "mainnet01").
   * @returns A ServiceResponse containing either the unsigned transaction or an error message.
   */
  createAddAffiliateTransaction(
    affiliateName: string,
    feeAddress: string,
    fee: number,
    adminKey: string,
    networkId: string
  ): SDKResponse<IUnsignedCommand> {
    const response = service.prepareAddAffiliateTransaction(
      affiliateName,
      feeAddress,
      fee,
      adminKey,
      networkId
    )
    return response
  }

  /**
   * Creates a transaction for registering a Kadena name.
   * @param owner - The account that owns the name being registered.
   * @param address - The blockchain address to associate with the name.
   * @param name - The Kadena name to register (e.g., "example.kda").
   * @param registrationPeriod - The registration period (key from PRICE_MAP, e.g., 1 for 1 year).
   * @param networkId - The network identifier (e.g., "testnet04", "mainnet01").
   * @param account - The account performing the transaction.
   * @returns A ServiceResponse containing either the unsigned transaction or an error message.
   */
  async createRegisterNameTransaction(
    owner: string,
    address: string,
    name: string,
    registrationPeriod: keyof typeof PRICE_MAP,
    networkId: string,
    account?: string
  ): Promise<SDKResponse<IUnsignedCommand | null>> {
    const chainId = service.getChainIdByNetwork(networkId)
    const host = this.getChainwebUrl({ networkId, chainId })

    const response = await service.prepareRegisterNameTransaction(
      owner,
      address,
      name,
      registrationPeriod,
      networkId,
      host,
      account
    )
    return response
  }

  /**
   * Submits a signed transaction to the Kadena blockchain.
   * @param transaction - The signed transaction object.
   * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
   * @param chainId - The chain ID for the transaction (e.g., '1', '15').
   * @returns A standardized SDK response containing the transaction descriptor.
   */
  async sendTransaction(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId
  ): Promise<SDKResponse<ITransactionDescriptor>> {
    try {
      const host = this.getChainwebUrl({ networkId, chainId })
      const result = await service.sendTransaction(transaction, host)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error in sendTransaction:', error)
      return { success: false, error: (error as Error).message }
    }
  }
}

/**
 * Singleton instance of KadenaNames SDK for easy import and use.
 */
export const kadenaNames = new KadenaNamesSDK()
