# KadenaNames SDK

## Introduction

Welcome to the **KadenaNames SDK**—your gateway to seamless integration of human-readable addresses on the Kadena blockchain. Designed with convenience and ease-of-use in mind, KadenaNames empowers developers to enhance user experiences and elevate the accessibility of decentralized applications (dApps).

### What is KadenaNames?

KadenaNames is a decentralized, on-chain solution that provides human-readable addresses on the Kadena blockchain. By leveraging the robust capabilities of Pact smart contracts, KadenaNames ensures a secure, tamper-proof, and user-friendly experience. Our smart contracts act as the definitive source of truth, meticulously verifying the authenticity and ownership of each name.

### Why KadenaNames?

- **Enhanced User Experience**: Simplify interactions by replacing complex blockchain addresses with easy-to-remember names.
- **Increased Accessibility**: Make your dApps more approachable, attracting a broader user base.
- **Security and Trust**: Built on Kadena’s secure and scalable blockchain, ensuring reliability and integrity.

### How Does It Work?

KadenaNames offers multiple ways to interact with human-readable names:

1. **Name to Address**: Convert a user-friendly name (e.g., `alice.kda`) into its corresponding blockchain address.
2. **Address to Name**: Retrieve the human-readable name associated with a specific blockchain address.
3. **Fetch Sale State**: Check if a name is sellable and its current price.
4. **Fetch Name Info**: Get detailed information about a Kadena name, including price, availability, and sale status.
5. **Fetch Price By Period**: Retrieve the cost of registering a name for 1 or 2 years.

These functionalities are encapsulated within the KadenaNames SDK, providing developers with straightforward methods to integrate name resolution into their applications.

---

## Features

- **TypeScript Support**: Fully typed for enhanced developer experience and type safety.
- **Simple Integration**: Easy-to-use methods for name resolution without the need for complex configurations.
- **Modular Design**: Organized structure promoting maintainability and scalability.
- **Error Handling**: Comprehensive error logging.
- **Customization**: Optional customization of Chainweb host generators to support various networks.

---

## Installation

Install the KadenaNames SDK via your preferred package manager:

### Using `npm`:

```bash
npm install kdn-sdk
```

### Using `yarn`:

```bash
yarn add kdn-sdk
```

### Using `pnpm`:

```bash
pnpm add kdn-sdk
```

---

## Quick Start

Here’s a quick example to get started with the KadenaNames SDK.

### Import the SDK

```typescript
import { kadenaNames } from 'kdn-sdk'
```

---

### Convert Name to Address

```typescript
async function resolveName() {
  const name = 'alice.kda'
  const networkId = 'testnet04'

  try {
    const response = await kadenaNames.nameToAddress(name, networkId)
    if (response.success && response.data) {
      console.log(`Address for ${name}: ${response.data}`)
    } else if (response.success && !response.data) {
      console.log(`Address for ${name} not found.`)
    } else {
      console.error(`Error resolving address: ${response.error}`)
    }
  } catch (error) {
    console.error(error)
  }
}

resolveName()
```

---

### Convert Address to Name

```typescript
async function resolveAddress() {
  const address = 'k:123456789.....abcdef'
  const networkId = 'testnet04'

  try {
    const response = await kadenaNames.addressToName(address, networkId)
    if (response.success && response.data) {
      console.log(`Name for ${address}: ${response.data}`)
    } else if (response.success && !response.data) {
      console.log(`Name for ${address} not found.`)
    } else {
      console.error(`Error resolving name: ${response.error}`)
    }
  } catch (error) {
    console.error(error)
  }
}

resolveAddress()
```

---

### Fetch Sale State

```typescript
async function fetchSaleState() {
  const name = 'example.kda'
  const networkId = 'testnet04'

  try {
    const response = await kadenaNames.fetchSaleState(name, networkId)
    if (response.success && response.data) {
      console.log(
        `Sellable: ${response.data.sellable}, Price: ${response.data.price}`
      )
    } else {
      console.error(`Error fetching sale state: ${response.error}`)
    }
  } catch (error) {
    console.error(`Error fetching sale state: ${error.message}`)
  }
}

fetchSaleState()
```

---

### Fetch Name Info

```typescript
async function fetchNameInfo() {
  const name = 'example.kda'
  const networkId = 'testnet04'
  const owner = 'owner-address'

  try {
    const response = await kadenaNames.fetchNameInfo(name, networkId, owner)
    if (response.success && response.data) {
      console.log('Name Info:', response.data)
    } else {
      console.error(`Error fetching name info: ${response.error}`)
    }
  } catch (error) {
    console.error(`Error fetching name info: ${error.message}`)
  }
}

fetchNameInfo()
```

---

### Fetch Price By Period

```typescript
async function fetchPriceByPeriod() {
  const networkId = 'testnet04'
  const owner = 'owner-address'

  try {
    const responseOneYear = await kadenaNames.fetchPriceByPeriod(
      1,
      networkId,
      owner
    )
    if (responseOneYear.success && responseOneYear.data !== undefined) {
      console.log(`Price for 1 year: ${responseOneYear.data}`)
    } else {
      console.error(`Error fetching 1-year price: ${responseOneYear.error}`)
    }

    const responseTwoYears = await kadenaNames.fetchPriceByPeriod(
      2,
      networkId,
      owner
    )
    if (responseTwoYears.success && responseTwoYears.data !== undefined) {
      console.log(`Price for 2 years: ${responseTwoYears.data}`)
    } else {
      console.error(`Error fetching 2-year price: ${responseTwoYears.error}`)
    }
  } catch (error) {
    console.error(`Error fetching price: ${error.message}`)
  }
}

fetchPriceByPeriod()
```

---

## API Documentation

### **nameToAddress**

Converts a Kadena name to its corresponding blockchain address.

**Parameters:**

- `name`: The Kadena name (e.g., `alice.kda`).
- `networkId`: The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**
A promise that resolves to:

```typescript
{ success: boolean; data?: string; error?: string }
```

---

### **addressToName**

Retrieves the Kadena name associated with a specific blockchain address.

**Parameters:**

- `address`: The Kadena blockchain address.
- `networkId`: The network identifier.


```typescript
fetchSaleState(name: string, networkId: string): Promise<{ sellable: boolean; price: number }>
```

**Returns:**
A promise that resolves to:

```typescript
{ success: boolean; data?: string; error?: string }
```

---

### **fetchSaleState**


Fetches the sale state of a given Kadena name.

**Parameters:**

- `name`: The Kadena name.
- `networkId`: The network identifier.

**Returns:**
A promise that resolves to:

```typescript
{ success: boolean; data?: { sellable: boolean; price: number }; error?: string }
```

---

### **fetchNameInfo**

Fetches detailed information about a Kadena name.

**Parameters:**

- `name`: The Kadena name.
- `networkId`: The network identifier.
- `owner`: The owner's blockchain address.

**Returns:**
A promise that resolves to:

```typescript
{ success: boolean; data?: NameInfo; error?: string }
```

---

### **fetchPriceByPeriod**

Fetches the registration price for a specific period (1 or 2 years).

**Parameters:**

- `period`: 1 for one year, 2 for two years.
- `networkId`: The network identifier.
- `owner`: The owner’s address.

**Returns:**
A promise that resolves to:

```typescript
{ success: boolean; data?: number; error?: string }
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

---

## License

MIT

---

## Contact

For any inquiries or support, please reach out to **info@kdlaunch.com**.
