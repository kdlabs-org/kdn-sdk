import { Pact, createClient } from '@kadena/client'
import type { ChainId, ICommandResult } from '@kadena/client'
import {
  KADENANAMES_NAMESPACE_MAINNET_MODULE,
  KADENANAMES_NAMESPACE_TESTNET_MODULE
} from '../constants/kdn'
import { parseChainResponse } from '../utils/responseParser'
import { getNamespaceModule } from '../constants/kdn'
import { isNameExpired, transformPactDate } from '../utils/date'
import { PRICE_MAP } from '../constants/kdn'
import { SaleState, NameInfo } from '../types/types'

/**
 * Determines the chain ID based on the network ID.
 * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
 * @returns The corresponding chain ID ('1' for testnet, '15' for mainnet).
 */
export const getChainIdByNetwork = (networkId: string): ChainId => {
  return networkId.includes('testnet') ? '1' : '15'
}

/**
 * Ensures that the provided name has the '.kda' extension.
 * @param name - The name to validate (e.g., 'example').
 * @returns The validated name with the '.kda' extension (e.g., 'example.kda').
 */
export function ensureKdaExtension(name: string): string {
  const lowerCaseName = name.toLowerCase()
  if (!lowerCaseName.endsWith('.kda')) {
    return `${lowerCaseName}.kda`
  }
  return lowerCaseName
}

/**
 * Resolves a name to an address or vice versa using the Kadena blockchain.
 * @param identifier - The name or address to resolve.
 * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
 * @param networkHost - The network host URL.
 * @param subject - The subject to resolve ('address' or 'name').
 * @returns The resolved address or name, or null if not found.
 */
async function kdnResolver(
  identifier: string,
  networkId: string,
  networkHost: string,
  subject: 'address' | 'name'
): Promise<string | null> {
  try {
    const module = networkId.includes('testnet')
      ? KADENANAMES_NAMESPACE_TESTNET_MODULE
      : KADENANAMES_NAMESPACE_MAINNET_MODULE
    const method = subject === 'address' ? 'get-address' : 'get-name'
    const param =
      subject === 'address'
        ? ensureKdaExtension(identifier.trim())
        : identifier.trim()

    const transaction = Pact.builder
      .execution((Pact as any).modules[module][method](param))
      .setMeta({ chainId: getChainIdByNetwork(networkId) })
      .setNetworkId(networkId)
      .createTransaction()

    const response: ICommandResult = await createClient(
      () => networkHost
    ).dirtyRead(transaction)

    return parseChainResponse<string>(response, subject) || null
  } catch (error) {
    console.error(`Error in kdnResolver (${subject}):`, error)
    return null
  }
}

/**
 * Converts a name to its corresponding address.
 * @param name - The Kadena name (e.g., 'example.kda').
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The corresponding address, or null if not found.
 */
export async function nameToAddress(
  name: string,
  networkId: string,
  networkHost: string
): Promise<string | null> {
  return kdnResolver(name, networkId, networkHost, 'address')
}

/**
 * Converts an address to its corresponding name.
 * @param address - The Kadena address.
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The corresponding name, or null if not found.
 */
export async function addressToName(
  address: string,
  networkId: string,
  networkHost: string
): Promise<string | null> {
  return kdnResolver(address, networkId, networkHost, 'name')
}

/**
 * Fetches the sale state of a Kadena name.
 * @param name - The Kadena name.
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The sale state of the name, including whether it's sellable and its price.
 */
export const fetchSaleState = async (
  name: string,
  networkId: string,
  networkHost: string
): Promise<SaleState> => {
  try {
    const formattedName = ensureKdaExtension(name)
    const module = getNamespaceModule(networkId)
    const chainId = getChainIdByNetwork(networkId)

    const transaction = Pact.builder
      .execution((Pact as any).modules[module]['get-sale-state'](formattedName))
      .setMeta({
        chainId,
        senderAccount: 'account',
        gasLimit: 100000,
        gasPrice: 0.001,
        ttl: 600,
        creationTime: Math.floor(Date.now() / 1000)
      })
      .setNetworkId(networkId)
      .createTransaction()

    const response = await createClient(() => networkHost).dirtyRead(
      transaction
    )

    return (
      parseChainResponse<SaleState>(response, 'sale state') || {
        sellable: false,
        price: 0
      }
    )
  } catch (error) {
    console.error('Error in fetchSaleState:', error)
    return { sellable: false, price: 0 }
  }
}

/**
 * Fetches detailed information about a Kadena name.
 * @param name - The Kadena name.
 * @param networkId - The network identifier.
 * @param owner - The owner of the name.
 * @param networkHost - The network host URL.
 * @returns Detailed information about the name, including its price, market price, availability, and sale status.
 */
export const fetchNameInfo = async (
  name: string,
  networkId: string,
  owner: string,
  networkHost: string
): Promise<NameInfo> => {
  const formattedName = ensureKdaExtension(name)
  try {
    const module = getNamespaceModule(networkId)
    const chainId = getChainIdByNetwork(networkId)

    const transaction = Pact.builder
      .execution((Pact as any).modules[module]['get-name-info'](formattedName))
      .setMeta({
        chainId,
        senderAccount: owner,
        gasLimit: 100000,
        gasPrice: 0.001,
        ttl: 600,
        creationTime: Math.floor(Date.now() / 1000)
      })
      .setNetworkId(networkId)
      .createTransaction()

    const response = await createClient(() => networkHost).dirtyRead(
      transaction
    )

    const result = parseChainResponse<NameInfo | null>(
      response,
      'name info'
    ) || {
      price: 0,
      marketPrice: 0,
      isAvailable: false,
      isForSale: false
    }

    const expiryDate = transformPactDate(result.expiryDate)
    if (expiryDate && isNameExpired(expiryDate.getTime())) {
      return {
        ...result,
        price: 0,
        marketPrice: 0,
        isAvailable: false,
        isForSale: false,
        expiryDate
      }
    }

    const saleState = await fetchSaleState(
      formattedName,
      networkId,
      networkHost
    )
    return {
      ...result,
      isAvailable: saleState.sellable,
      isForSale: saleState.sellable,
      price: saleState.price,
      marketPrice: saleState.price ?? result.lastPrice ?? 0,
      expiryDate
    }
  } catch (error) {
    console.error('Error in fetchNameInfo:', error)
    return {
      price: 0,
      marketPrice: 0,
      isAvailable: false,
      isForSale: false
    }
  }
}

/**
 * Fetches the price for registering a Kadena name based on the registration period.
 * @param period - The registration period (key from PRICE_MAP).
 * @param networkId - The network identifier.
 * @param owner - The owner's account.
 * @param networkHost - The network host URL.
 * @returns The price for the specified registration period.
 */
export const fetchPriceByPeriod = async (
  period: keyof typeof PRICE_MAP,
  networkId: string,
  owner: string,
  networkHost: string
): Promise<number> => {
  try {
    const days = PRICE_MAP[period]
    const module = getNamespaceModule(networkId)
    const chainId = getChainIdByNetwork(networkId)

    const transaction = Pact.builder
      .execution((Pact as any).modules[module]['get-price']({ int: days }))
      .setMeta({
        chainId,
        senderAccount: owner,
        gasLimit: 600,
        gasPrice: 1.0e-6,
        ttl: 28800,
        creationTime: Math.floor(Date.now() / 1000)
      })
      .setNetworkId(networkId)
      .createTransaction()

    const response = await createClient(() => networkHost).dirtyRead(
      transaction
    )

    return parseChainResponse<number>(response, 'price') || 0
  } catch (error) {
    console.error('Error in fetchPriceByPeriod:', error)
    return 0
  }
}
