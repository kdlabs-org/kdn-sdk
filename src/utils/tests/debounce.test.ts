import { describe, it, expect, vi } from 'vitest'
import { debounce } from '../debounce'

describe('debounce', () => {
  it('should call the provided function after the specified delay', async () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')

    expect(mockFn).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Ensure the function was called once
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should reset the delay if called consecutively', async () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first')
    await new Promise((resolve) => setTimeout(resolve, 100))
    debouncedFn('second')

    expect(mockFn).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Ensure the function was called once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('second')
  })

  it('should not call the function if the delay is not reached', async () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')

    expect(mockFn).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Ensure the function is still not called
    expect(mockFn).not.toHaveBeenCalled()
  })
})
