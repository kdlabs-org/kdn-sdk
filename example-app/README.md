## KadenaNames React Example App

This React app demonstrates how to integrate the KadenaNames SDK to resolve Kadena blockchain names to addresses and vice versa. The app focuses on providing a smooth user experience by utilizing debouncing to optimize network requests and reduce unnecessary API calls.

---

## Features

- **Resolve Names to Addresses**: Convert human-readable Kadena names (e.g., `alice.kda`) into blockchain addresses.
- **Resolve Addresses to Names**: Convert Kadena blockchain addresses into their corresponding names.
- **Fetch Sale State**: Retrieve information about whether a name is sellable and its current price.
- **Fetch Name Info**: Get detailed information about a Kadena name, including price, market price, availability, and sale status.
- **Fetch Price By Period**: Retrieve the price for registering a name for a specific period (e.g., 1 year or 2 years).
- **Debouncing for Performance**: Prevents excessive API calls by waiting for user input to settle before triggering requests.

---

## Debouncing in Action

### Benefits of Debouncing

Debouncing is implemented in this app to:

1. **Optimize Performance**: Ensures that API calls are made only after a brief pause in user input (500ms by default).
2. **Enhance User Experience**: Prevents overloading the network with rapid requests, especially during fast typing or frequent button clicks.
3. **Reduce API Load**: Minimizes redundant API calls, improving overall app efficiency and scalability.

---

## Debouncing Implementation

### Custom Debounce Utility

The app uses a custom debounce utility, defined in `src/utils/debounce.ts`:

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

### How It’s Used

Debouncing is applied to the API calls for resolving names and addresses in `App.tsx`:

```typescript
const debouncedHandleNameToAddress = useMemo(
  () =>
    debounce(async (name: string, network: string) => {
      setError(null)
      setResolvedAddress(null)

      try {
        const response = await kadenaNames.nameToAddress(name, network)
        if (response.success && response.data) {
          setResolvedAddress(response.data)
        } else if (response.success && !response.data) {
          setError(`Address for ${name} not found.`)
        } else {
          setError(response.error)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }, 500),
  []
)

const debouncedHandleAddressToName = useMemo(
  () =>
    debounce(async (address: string, network: string) => {
      setError(null)
      setResolvedName(null)

      try {
        const response = await kadenaNames.addressToName(address, network)
        if (response.success && response.data) {
          setResolvedName(response.data)
        } else if (response.success && !response.data) {
          setError(`Name for address ${address} not found.`)
        } else {
          setError(response.error)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }, 500),
  []
)
```

---

## Example Functionalities

### Fetch Sale State

Get details about the sale state of a name, including whether it’s sellable and its price:

```typescript
const handleFetchSaleState = async () => {
  if (!nameInput.trim()) {
    setError('Please enter a name.')
    return
  }

  try {
    const response = await kadenaNames.fetchSaleState(nameInput, networkId)
    if (response.success && response.data) {
      setSaleState(response.data)
    } else {
      setError(response.error || 'Failed to fetch sale state.')
    }
  } catch (err: any) {
    setError(`Error fetching sale state: ${err.message}`)
  }
}
```

---

### Fetch Name Info

Retrieve comprehensive information about a Kadena name:

```typescript
const handleFetchNameInfo = async () => {
  if (!nameInput.trim()) {
    setError('Please enter a name.')
    return
  }

  try {
    const response = await kadenaNames.fetchNameInfo(
      nameInput,
      networkId,
      'owner-address'
    )
    if (response.success && response.data) {
      setNameInfo(response.data)
    } else {
      setError(response.error || 'Failed to fetch name info.')
    }
  } catch (err: any) {
    setError(`Error fetching name info: ${err.message}`)
  }
}
```

---

### Fetch Price By Period

Fetch the registration price for a specific period (e.g., 1 year, 2 years):

```typescript
const handleFetchPriceByPeriod = async (period: 1 | 2) => {
  try {
    const response = await kadenaNames.fetchPriceByPeriod(
      period,
      networkId,
      'owner-address'
    )
    if (response.success && response.data !== undefined) {
      setPriceByPeriod(response.data)
    } else {
      setError(response.error || 'Failed to fetch price.')
    }
  } catch (err: any) {
    setError(`Error fetching price: ${err.message}`)
  }
}
```
