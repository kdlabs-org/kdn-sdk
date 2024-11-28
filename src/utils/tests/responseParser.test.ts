import { describe, it, expect } from 'vitest'
import { parseChainResponse } from '../responseParser'
import type { ICommandResult } from '@kadena/client'

import { IPactResultError, IPactResultSuccess } from '../../types/types'

describe('parseChainResponse', () => {
  it('should return the data when the response status is success', () => {
    const mockResponse: ICommandResult = {
      reqKey: 'mockReqKey',
      txId: 1,
      result: {
        status: 'success',
        data: 'mockData'
      } as IPactResultSuccess,
      gas: 100,
      logs: null,
      continuation: null,
      metaData: null
    }

    const result = parseChainResponse<string>(mockResponse, 'mockSubject')
    expect(result).toBe('mockData')
  })

  it('should throw an error when the response status is failure', () => {
    const mockResponse: ICommandResult = {
      reqKey: 'mockReqKey',
      txId: 1,
      result: {
        status: 'failure',
        error: { message: 'mock error message' }
      } as IPactResultError,
      gas: 100,
      logs: null,
      continuation: null,
      metaData: null
    }

    expect(() =>
      parseChainResponse<string>(mockResponse, 'mockSubject')
    ).toThrowError(
      'Failed to retrieve mockSubject: {"message":"mock error message"}'
    )
  })

  it('should throw an error if result is missing', () => {
    const invalidResponse: ICommandResult = {
      reqKey: 'mockReqKey',
      txId: 1,
      result: undefined as unknown as IPactResultSuccess,
      gas: 100,
      logs: null,
      continuation: null,
      metaData: null
    }

    expect(() =>
      parseChainResponse<string>(invalidResponse, 'mockSubject')
    ).toThrowError('Failed to retrieve mockSubject: Unknown error')
  })
})
