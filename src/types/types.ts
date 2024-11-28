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

export declare interface IPactInt {
  int: string
}
export declare interface IPactDecimal {
  decimal: string
}

export declare type PactValue =
  | PactLiteral
  | Array<PactValue>
  | Record<string, any>

export declare type PactLiteral =
  | string
  | number
  | IPactInt
  | IPactDecimal
  | boolean
  | Date

export declare interface IPactResultSuccess {
  status: 'success'
  data: PactValue
}

export declare interface IPactResultError {
  status: 'failure'
  error: object
}
