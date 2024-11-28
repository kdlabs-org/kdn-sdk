import { describe, it, expect } from 'vitest'
import { defaultChainwebHostGenerator } from '../hosts'
import { ChainwebHostGeneratorOptions } from '../../types/types'

describe('defaultChainwebHostGenerator', () => {
  it('should generate correct Chainweb URL for mainnet01', () => {
    const options = {
      networkId: 'mainnet01',
      chainId: '15'
    } as ChainwebHostGeneratorOptions
    const expected =
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/15/pact'
    const url = defaultChainwebHostGenerator(options)
    expect(url).toBe(expected)
  })

  it('should generate correct Chainweb URL for testnet04', () => {
    const options = {
      networkId: 'testnet04',
      chainId: '1'
    } as ChainwebHostGeneratorOptions
    const expected =
      'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact'
    const url = defaultChainwebHostGenerator(options)
    expect(url).toBe(expected)
  })

  it('should throw an error for unsupported networkId', () => {
    const options = {
      networkId: 'unknownnet',
      chainId: '1'
    } as ChainwebHostGeneratorOptions
    expect(() => defaultChainwebHostGenerator(options)).toThrow(
      'Unsupported networkId: unknownnet'
    )
  })
})
