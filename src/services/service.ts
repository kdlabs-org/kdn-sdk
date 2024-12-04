import { Pact, createClient } from '@kadena/client'
import type {
  ChainId,
  ICommand,
  ICommandResult,
  ITransactionDescriptor,
  IUnsignedCommand
} from '@kadena/client'
import {
  KADENANAMES_NAMESPACE_MAINNET_MODULE,
  KADENANAMES_NAMESPACE_TESTNET_MODULE
} from '../constants/kdn'
import { parseChainResponse } from '../utils/responseParser'
import { getNamespaceModule } from '../constants/kdn'
import { isNameExpired, transformPactDate } from '../utils/date'
import { PRICE_MAP, VAULT } from '../constants/kdn'
import { SaleState, NameInfo } from '../types/types'
import { addExtentionToName } from '../utils/transform'

/**
 * Standardized response type for service functions.
 */
export type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

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
): Promise<ServiceResponse<string | null>> {
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

    const result = parseChainResponse<string>(response, subject)
    return { success: true, data: result || null }
  } catch (error) {
    console.error(`Error in kdnResolver (${subject}):`, error)
    return {
      success: false,
      error: `Failed to resolve ${subject} for identifier "${identifier}"`
    }
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
): Promise<ServiceResponse<string | null>> {
  return await kdnResolver(name, networkId, networkHost, 'address')
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
): Promise<ServiceResponse<string | null>> {
  return await kdnResolver(address, networkId, networkHost, 'name')
}

/**
 * Fetches the sale state of a Kadena name.
 * @param name - The Kadena name.
 * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
 * @param networkHost - The network host URL.
 * @returns The sale state of the name, including whether it's sellable and its price.
 */
export const fetchSaleState = async (
  name: string,
  networkId: string,
  networkHost: string
): Promise<ServiceResponse<SaleState>> => {
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

    const saleState = parseChainResponse<SaleState>(response, 'sale state')
    if (!saleState) {
      throw new Error('Sale state parsing failed')
    }

    return { success: true, data: saleState }
  } catch (error) {
    console.error('Error in fetchSaleState:', error)
    return { success: false, error: 'Failed to fetch sale state' }
  }
}

/**
 * Fetches detailed information about a Kadena name.
 * @param name - The Kadena name.
 * @param networkId - The network identifier.
 * @param owner - The owner of the name.
 * @param networkHost - The network host URL.
 * @returns Detailed information about the name, including its price, availability, and expiry date.
 */
export const fetchNameInfo = async (
  name: string,
  networkId: string,
  owner: string,
  networkHost: string
): Promise<ServiceResponse<NameInfo>> => {
  try {
    const formattedName = ensureKdaExtension(name)
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

    let result = parseChainResponse<NameInfo | null>(response, 'name info')
    if (!result) {
      result = {
        price: 0,
        marketPrice: 0,
        isAvailable: false,
        isForSale: false
      }
    }

    const expiryDate = transformPactDate(result.expiryDate)
    if (expiryDate && isNameExpired(expiryDate.getTime())) {
      result = {
        ...result,
        price: 0,
        marketPrice: 0,
        isAvailable: false,
        isForSale: false,
        expiryDate
      }
    }

    const saleStateResponse = await fetchSaleState(
      formattedName,
      networkId,
      networkHost
    )
    if (!saleStateResponse.success) {
      return { success: false, error: saleStateResponse.error }
    }

    const saleState = saleStateResponse.data

    return {
      success: true,
      data: {
        ...result,
        isAvailable: saleState.sellable,
        isForSale: saleState.sellable,
        price: saleState.price,
        marketPrice: saleState.price ?? result.lastPrice ?? 0,
        expiryDate
      }
    }
  } catch (error) {
    console.error('Error in fetchNameInfo:', error)
    return {
      success: false,
      error: 'Failed to fetch name information'
    }
  }
}

/**
 * Fetches the price for registering a Kadena name based on the registration period.
 * @param period - The registration period (key from PRICE_MAP).
 * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
 * @param owner - The owner's account.
 * @param networkHost - The network host URL.
 * @returns The price for the specified registration period.
 */
export const fetchPriceByPeriod = async (
  period: keyof typeof PRICE_MAP,
  networkId: string,
  owner: string,
  networkHost: string
): Promise<ServiceResponse<number>> => {
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

    const price = parseChainResponse<number>(response, 'price')
    if (price === undefined || price === null) {
      throw new Error('Price parsing failed')
    }

    return { success: true, data: price }
  } catch (error) {
    console.error('Error in fetchPriceByPeriod:', error)
    return { success: false, error: 'Failed to fetch price by period' }
  }
}

/**
 * Creates a transaction for adding a new affiliate to the Kadena Names system.
 * @param affiliateName - The name of the affiliate.
 * @param feeAddress - The blockchain address where affiliate fees will be sent.
 * @param fee - The fee percentage to be allocated to the affiliate.
 * @param adminKey - The governance key to authorize the operation.
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The unsigned transaction JSON.
 */
export function prepareAddAffiliateTransaction(
  affiliateName: string,
  feeAddress: string,
  fee: number,
  adminKey: string,
  networkId: string
): IUnsignedCommand {
  const module = getNamespaceModule(networkId)
  const chainId = getChainIdByNetwork(networkId)

  const transaction = Pact.builder
    .execution(
      (Pact as any).modules[module]['add-affiliate'](
        affiliateName,
        feeAddress,
        fee
      )
    )
    .setMeta({
      chainId,
      senderAccount: adminKey,
      gasLimit: 100000,
      gasPrice: 0.001,
      ttl: 600,
      creationTime: Math.floor(Date.now() / 1000)
    })
    .setNetworkId(networkId)
    .createTransaction()

  return transaction
}

/**
 * Prepares a transaction for registering a Kadena name.
 *
 * This service function handles the logic for fetching all required details,
 * including the registration price and details about the name, to construct
 * an unsigned transaction.
 *
 * @param owner - The account that owns the name being registered.
 * @param address - The blockchain address to associate with the name.
 * @param name - The Kadena name to register (e.g., "example.kda").
 * @param registrationPeriod - The registration period (key from PRICE_MAP, e.g., 1 for 1 year).
 * @param networkId - The network identifier (e.g., "testnet04", "mainnet01").
 * @param account - The account performing the transaction.
 * @param networkHost - The Chainweb network host URL.
 * @returns An unsigned transaction ready to be signed and submitted.
 * @throws Will throw an error if fetching name info or price fails.
 */
export const prepareRegisterNameTransaction = async (
  owner: string,
  address: string,
  name: string,
  registrationPeriod: keyof typeof PRICE_MAP,
  networkId: string,
  account: string,
  networkHost: string
): Promise<IUnsignedCommand | null> => {
  const days = PRICE_MAP[registrationPeriod]

  // Fetch current price for the name
  const nameInfoResponse = await fetchNameInfo(
    name,
    networkId,
    owner,
    networkHost
  )
  if (!nameInfoResponse.success) {
    throw new Error(
      `Failed to fetch name info for "${name}": ${nameInfoResponse.error}`
    )
  }
  const newPrice = nameInfoResponse.data.price

  // Fetch stored price for the given period
  const priceResponse = await fetchPriceByPeriod(
    registrationPeriod,
    networkId,
    owner,
    networkHost
  )
  if (!priceResponse.success) {
    throw new Error(
      `Failed to fetch price for period ${registrationPeriod}: ${priceResponse.error}`
    )
  }
  const storedPrice = priceResponse.data

  // Determine the price to use for the transaction
  const price =
    newPrice > 0 && newPrice !== storedPrice ? newPrice : storedPrice

  // Construct the transaction
  const transaction = createRegisterNameTransaction(
    owner,
    address,
    name,
    days,
    price,
    networkId,
    account
  )

  return transaction
}

/**
 * Creates a transaction to register a Kadena name.
 * @param owner - The owner's blockchain account.
 * @param address - The blockchain address to associate with the name.
 * @param name - The Kadena name to register.
 * @param days - The registration duration in days (e.g., 365, 730).
 * @param price - The price to register the name.
 * @param networkId - The network identifier (e.g., 'testnet04', 'mainnet01').
 * @param account - The account signing the transaction.
 * @param networkHost - The Chainweb host URL.
 * @returns An unsigned transaction object to be signed by the wallet.
 */
export function createRegisterNameTransaction(
  owner: string,
  address: string,
  name: string,
  days: number,
  price: number,
  networkId: string,
  account: string
): IUnsignedCommand {
  const module = getNamespaceModule(networkId)
  const chainId = getChainIdByNetwork(networkId)
  const formattedName = addExtentionToName(name)

  const transaction = Pact.builder
    .execution(
      (Pact as any).modules[module].register(
        owner,
        address,
        formattedName,
        { int: days },
        ''
      )
    )
    .addSigner(account, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', owner, VAULT, price),
      withCapability(`${module}.ACCOUNT_GUARD`, owner)
    ])
    .setMeta({
      chainId,
      senderAccount: owner
    })
    .setNetworkId(networkId)
    .createTransaction()

  return transaction
}

/**
 * Sends a signed transaction to the Kadena blockchain.
 * @param transaction - The signed transaction object.
 * @param networkId - The network identifier (e.g., 'testnet04', 'testnet05', 'mainnet01').
 * @param host - The Chainweb host URL for the specified network.
 * @returns A promise that resolves to the transaction descriptor, containing details of the submitted transaction.
 */
export async function sendTransaction(
  transaction: ICommand,
  networkHost: string
): Promise<ITransactionDescriptor> {
  try {
    const result = await createClient(() => networkHost).submitOne(transaction)
    return result
  } catch (error) {
    console.error('Error in sendTransaction:', error)
    throw error
  }
}
