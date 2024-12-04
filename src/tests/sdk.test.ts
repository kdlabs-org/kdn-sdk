import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import { kadenaNames } from '../sdk'
import { ChainId } from '@kadena/types'

// Mock the defaultChainwebHostGenerator to return a fixed host URL
import * as hosts from '../hosts/hosts'
vi.spyOn(hosts, 'defaultChainwebHostGenerator').mockImplementation(
  () => 'https://api.testnet.chainweb.com'
)

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function getResponseData({
  gas,
  status,
  data,
  error,
  reqKey,
  logs,
  metaData,
  continuation = null,
  txId = null
}: {
  gas: number
  status: 'success' | 'failure'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
  reqKey?: string
  logs?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metaData?: any
  continuation?: boolean | null
  txId?: string | null
}) {
  return {
    gas,
    result: {
      status,
      ...(status === 'success' ? { data } : { error })
    },
    reqKey,
    logs,
    metaData,
    continuation,
    txId
  }
}

function setupServerResponse(
  url: string,
  responseType: 'json' | 'networkError' | 'text',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData?: any
) {
  server.use(
    http.post(url, (req) => {
      if (responseType === 'json') {
        return HttpResponse.json(responseData, { status: 200 })
      } else if (responseType === 'text') {
        const body =
          typeof responseData === 'string' ? responseData : 'Invalid response'
        return HttpResponse.text(body, { status: 200 })
      } else if (responseType === 'networkError') {
        return HttpResponse.error()
      }
      return undefined
    })
  )
}

/**
 * Helper function to construct the local URL for the Pact API.
 */
function getLocalUrl(networkId: string, chainId: ChainId): string {
  const host = kadenaNames.getChainwebUrl({ networkId, chainId })

  return `${host}/api/v1/local`
}

describe('KadenaNames SDK', () => {
  describe('nameToAddress', () => {
    it('should return address for registered name on mainnet', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 45,
        status: 'success',
        data: 'k:af5b9003f37c64ac178f324b1ce8e45e6080b4fa40710bf7f3cd3661a4dd1eb6',
        reqKey: '3zOoUiP96_snGPPhUkMT9fFv8CR3QTpgWqY7iGcGMqQ',
        logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        metaData: {
          publicMeta: {
            creationTime: 1730816358,
            ttl: 28800,
            gasLimit: 600,
            chainId: chainId,
            gasPrice: 0.000001,
            sender:
              'k:91254395a83597938cfae0e9d601768f5b56984ea1a6c7c3a2367fdffbebb966'
          },
          blockTime: 1730816360288982,
          prevBlockHash: '0DNmlM1FWhZOZpNJgvtWZSkqWzg7Rx1ngkVBTyIbqUI',
          blockHeight: 5278342
        }
      })

      setupServerResponse(url, 'json', responseData)

      const result = await kadenaNames.nameToAddress('turkiye.kda', networkId)

      expect(result.success).toBe(true)
      expect(result.data).toBe(
        'k:af5b9003f37c64ac178f324b1ce8e45e6080b4fa40710bf7f3cd3661a4dd1eb6'
      )
      expect(result.error).toBeUndefined()
    })

    it('should return error for unregistered name on mainnet', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 600,
        status: 'failure',
        error: {
          callStack: [],
          type: 'TxFailure',
          message: 'with-read: row not found: test',
          info: ''
        },
        reqKey: 'BrQipOFNcyLq2c6fSDra1hlNrnWJtIHNaHhyiwKWvio',
        logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        metaData: null
      })

      setupServerResponse(url, 'json', responseData)

      const result = await kadenaNames.nameToAddress(
        'unregistered.kda',
        networkId
      )

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBe(
        'Failed to resolve address for identifier "unregistered.kda"'
      )
    })

    it('should return error when result status is failure with different error', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 600,
        status: 'failure',
        error: {
          callStack: [],
          type: 'TxFailure',
          message: 'Some other error occurred',
          info: ''
        },
        reqKey: 'SomeReqKey',
        logs: 'SomeLogs',
        metaData: null
      })

      setupServerResponse(url, 'json', responseData)

      const result = await kadenaNames.nameToAddress('some.kda', networkId)

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBe(
        'Failed to resolve address for identifier "some.kda"'
      )
    })
  })

  describe('addressToName', () => {
    it('should return name for registered address on mainnet', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 46,
        status: 'success',
        data: 'turkiye.kda',
        reqKey: 'ZK03-W2pyyOdjrjk-h7Gyfrc1_vdt5i6EvZzaixM1Ls',
        logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        metaData: {
          publicMeta: {
            creationTime: 1730816445,
            ttl: 28800,
            gasLimit: 600,
            chainId: chainId,
            gasPrice: 0.000001,
            sender:
              'k:91254395a83597938cfae0e9d601768f5b56984ea1a6c7c3a2367fdffbebb966'
          },
          blockTime: 1730816419833911,
          prevBlockHash: 'Jb7rCBboaUPmHM0siFCG2kQo7iqNeMaooOjD2wTD4xQ',
          blockHeight: 5278343
        }
      })

      server.use(
        http.post(url, (req) => {
          return HttpResponse.json(responseData, { status: 200 })
        })
      )

      const result = await kadenaNames.addressToName(
        'k:af5b9003f37c64ac178f324b1ce8e45e6080b4fa40710bf7f3cd3661a4dd1eb6',
        networkId
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe('turkiye.kda')
      expect(result.error).toBeUndefined()
    })

    it('should return error for unregistered address on mainnet', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 600,
        status: 'failure',
        error: {
          callStack: [],
          type: 'TxFailure',
          message: 'with-read: row not found: k:x1',
          info: ''
        },
        reqKey: '5fKlVZyTGY17vtfMgYBBVNb8WHeFg-iyMQ3IPPWNY4c',
        logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        metaData: null
      })

      setupServerResponse(url, 'json', responseData)

      const result = await kadenaNames.addressToName(
        'k:unknownaddress',
        networkId
      )

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBe(
        'Failed to resolve name for identifier "k:unknownaddress"'
      )
    })

    it('should return error when result status is failure with different error', async () => {
      const networkId = 'mainnet01'
      const chainId = '15'
      const url = getLocalUrl(networkId, chainId)

      const responseData = getResponseData({
        gas: 600,
        status: 'failure',
        error: {
          callStack: [],
          type: 'TxFailure',
          message: 'Some other error occurred',
          info: ''
        },
        reqKey: 'AnotherReqKey',
        logs: 'AnotherLogs',
        metaData: null
      })

      setupServerResponse(url, 'json', responseData)

      const result = await kadenaNames.addressToName('k:someaddress', networkId)

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBe(
        'Failed to resolve name for identifier "k:someaddress"'
      )
    })
  })
})
