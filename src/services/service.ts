import { Pact, createClient } from '@kadena/client'
import type { ChainId, ICommandResult } from '@kadena/client'
import {
  KADENANAMES_NAMESPACE_MAINNET_MODULE,
  KADENANAMES_NAMESPACE_TESTNET_MODULE
} from '../constants/module'
import { parseChainResponse } from '../utils/responseParser'

/**
 * Determines the chain ID based on the network ID.
 * @param networkId - The network identifier.
 * @returns The corresponding chain ID.
 */
export const getChainIdByNetwork = (networkId: string): ChainId => {
  return networkId.includes('testnet') ? '1' : '15'
}

/**
 * Ensures that the provided name has the '.kda' extension.
 * @param name - The name to validate.
 * @returns The validated name with '.kda' extension.
 */
export function ensureKdaExtension(name: string): string {
  const lowerCaseName = name.toLowerCase()
  if (!lowerCaseName.endsWith('.kda')) {
    return `${lowerCaseName}.kda`
  }
  return lowerCaseName
}

/**
 * Creates a Kadena client.
 * @param networkHost - The network host URL.
 * @returns The Kadena client.
 */
const client = (networkHost: string) => createClient(networkHost)

/**
 * Resolves a name to an address or vice versa using the Kadena blockchain.
 * @param identifier - The name or address to resolve.
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @param subject - The subject to resolve ('address' or 'name').
 * @returns The resolved address or name, or undefined if not found.
 */
async function kdnResolver(
  identifier: string,
  networkId: string,
  networkHost: string,
  subject: 'address' | 'name'
): Promise<string | undefined> {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .execution((Pact as any).modules[module][method](param))
      .setMeta({ chainId: getChainIdByNetwork(networkId) })
      .setNetworkId(networkId)
      .createTransaction()

    const response: ICommandResult = await client(networkHost).dirtyRead(
      transaction
    )

    return parseChainResponse<string>(response, subject)
  } catch (error) {
    return undefined
  }
}

/**
 * Converts a name to its corresponding address.
 * @param name - The Kadena name (e.g., 'example.kda').
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The corresponding address, or undefined if not found.
 */
export async function nameToAddress(
  name: string,
  networkId: string,
  networkHost: string
): Promise<string | undefined> {
  return kdnResolver(name, networkId, networkHost, 'address')
}

/**
 * Converts an address to its corresponding name.
 * @param address - The Kadena address.
 * @param networkId - The network identifier.
 * @param networkHost - The network host URL.
 * @returns The corresponding name, or undefined if not found.
 */
export async function addressToName(
  address: string,
  networkId: string,
  networkHost: string
): Promise<string | undefined> {
  return kdnResolver(address, networkId, networkHost, 'name')
}
