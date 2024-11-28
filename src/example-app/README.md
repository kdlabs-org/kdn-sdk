## KadenaNames React Example App

This React app demonstrates how to integrate the KadenaNames SDK to resolve Kadena blockchain names to addresses and vice versa. The app focuses on providing a smooth user experience by utilizing debouncing to optimize network requests and reduce unnecessary API calls.

## Features

    •	Resolve Names to Addresses: Convert human-readable Kadena names (e.g., alice.kda) into blockchain addresses.
    •	Resolve Addresses to Names: Convert Kadena blockchain addresses into their corresponding names.
    •	Debouncing for Performance: Prevents excessive API calls by waiting for user input to settle before triggering requests.
    •	Network Selector: Choose from supported Kadena networks (testnet04, testnet05, mainnet01, development).
    •	Responsive Design: User-friendly interface optimized for desktops and mobile devices.

## Debouncing in Action

Debouncing is implemented in this app to: 1. Optimize Performance: Ensures that API calls are made only after a brief pause in user input (500ms by default). 2. Enhance User Experience: Prevents overloading the network with rapid requests, especially during fast typing or frequent button clicks. 3. Reduce API Load: Minimizes redundant API calls, improving overall app efficiency and scalability.

The custom debounce utility used in this app is reusable and avoids reliance on third-party libraries like Lodash.

## Debouncing Implementation

** Custom Debounce Utility **

The app uses a custom debounce utility, defined in src/utils/debounce.ts:

```typescript
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
```

## How It’s Used

Debouncing is applied to the API calls for resolving names and addresses in App.tsx:

```typescript
const debouncedHandleNameToAddress = useMemo(
  () =>
    debounce(async (name: string, network: string) => {
      setError(null)
      setResolvedAddress(null)

      try {
        const address = await kadenaNames.nameToAddress(name, network)
        if (address) {
          setResolvedAddress(address)
        } else {
          setError(`Address for ${name} not found.`)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }, 500),
  []
)
```
