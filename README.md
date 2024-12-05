# KadenaNames SDK

## Introduction

Welcome to the **KadenaNames SDK**—a straightforward solution for integrating human-readable addresses on the Kadena blockchain. Designed for developer convenience and enhanced user experience, KadenaNames enables you to create more intuitive and accessible decentralized applications (dApps).

### What is KadenaNames?

KadenaNames is a decentralized, on-chain service that provides human-readable names on the Kadena blockchain. Leveraging the capabilities of Pact smart contracts, KadenaNames ensures a secure and user-friendly experience by verifying the authenticity and ownership of each name.

### Why KadenaNames?

- **Enhanced User Experience**: Replace complex blockchain addresses with easy-to-remember names.
- **Increased Accessibility**: Make your dApps more approachable, attracting a broader user base.
- **Security and Trust**: Built on Kadena’s secure and scalable blockchain, ensuring reliability and integrity.
- **Comprehensive Error Handling**: Receive standardized responses with detailed error messages for seamless integration.
- **TypeScript Support**: Enjoy type safety and improved developer experience with full TypeScript support.

### How Does It Work?

KadenaNames offers multiple functionalities to interact with human-readable names:

1. **Name to Address**: Convert a user-friendly name (e.g., `alice.kda`) into its corresponding blockchain address.
2. **Address to Name**: Retrieve the human-readable name associated with a specific blockchain address.
3. **Fetch Sale State**: Check if a name is sellable and its current price.
4. **Fetch Name Info**: Get detailed information about a Kadena name, including price, availability, and sale status.
5. **Fetch Price By Period**: Retrieve the cost of registering a name for 1 or 2 years.
6. **Prepare Registration Transaction**: Create an unsigned transaction to register a Kadena name.
7. **Send Transaction**: Submit a signed transaction to the Kadena blockchain.

These functionalities are encapsulated within the KadenaNames SDK, providing developers with straightforward methods to integrate name resolution and management into their applications.

---

## Features

- **TypeScript Support**: Fully typed for enhanced developer experience and type safety.
- **Standardized Responses**: Consistent response structure across all SDK methods for predictable error handling.
- **Simple Integration**: Easy-to-use methods for name resolution without the need for complex configurations.
- **Modular Design**: Organized structure promoting maintainability and scalability.
- **Comprehensive Error Handling**: Detailed error messages and standardized response formats to facilitate debugging.
- **Customization**: Optional customization of Chainweb host generators to support various networks.

---

## Installation

Install the KadenaNames SDK via your preferred package manager:

### Using `npm`:

```bash
npm install @kdlabs/kadenanames
```

### Using `yarn`:

```bash
yarn add @kdlabs/kadenanames
```

### Using `pnpm`:

```bash
pnpm add @kdlabs/kadenanames
```

---

## Usage

### Import the SDK

```typescript
import { kadenaNames } from '@kdlabs/kadenanames'
```

### `nameToAddress`

Converts a Kadena name to its corresponding blockchain address.

**Function Signature:**

```typescript
function nameToAddress(
  name: string,
  networkId: string
): Promise<{
  success: boolean
  data?: string | null
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.nameToAddress('alice.kda', 'testnet04')
if (response.success && response.data) {
  console.log(`Address: ${response.data}`)
} else {
  console.error(`Error: ${response.error}`)
}
```

### `addressToName`

Retrieves the Kadena name associated with a specific blockchain address.

**Function Signature:**

```typescript
function addressToName(
  address: string,
  networkId: string
): Promise<{
  success: boolean
  data?: string | null
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.addressToName(
  'k:123456789abcdef',
  'testnet04'
)
if (response.success && response.data) {
  console.log(`Name: ${response.data}`)
} else {
  console.error(`Error: ${response.error}`)
}
```

### `fetchSaleState`

Fetches the sale state of a given Kadena name.

**Function Signature:**

```typescript
function fetchSaleState(
  name: string,
  networkId: string
): Promise<{
  success: boolean
  data?: {
    sellable: boolean
    price: number
  }
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.fetchSaleState('example.kda', 'testnet04')
if (response.success && response.data) {
  console.log(
    `Sellable: ${response.data.sellable ? 'Yes' : 'No'}, Price: ${
      response.data.price
    }`
  )
} else {
  console.error(`Error: ${response.error}`)
}
```

### `fetchNameInfo`

Fetches detailed information about a Kadena name.

**Function Signature:**

```typescript
function fetchNameInfo(
  name: string,
  networkId: string,
  owner: string
): Promise<{
  success: boolean
  data?: {
    price: number
    marketPrice: number
    isAvailable: boolean
    isForSale: boolean
    expiryDate?: number // Timestamp in milliseconds
  }
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.fetchNameInfo(
  'example.kda',
  'testnet04',
  'owner-address'
)
if (response.success && response.data) {
  console.log('Name Info:', response.data)
} else {
  console.error(`Error: ${response.error}`)
}
```

### `fetchPriceByPeriod`

Fetches the registration price for a specific period (1 or 2 years).

**Function Signature:**

```typescript
function fetchPriceByPeriod(
  period: 1 | 2,
  networkId: string,
  owner: string
): Promise<{
  success: boolean
  data?: number
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.fetchPriceByPeriod(
  1,
  'testnet04',
  'owner-address'
)
if (response.success && response.data !== undefined) {
  console.log(`Price for 1 year: ${response.data}`)
} else {
  console.error(`Error: ${response.error}`)
}
```

### `createRegisterNameTransaction`

Prepares an unsigned transaction for registering a Kadena name.

**Function Signature:**

```typescript
function createRegisterNameTransaction(
  owner: string,
  address: string,
  name: string,
  registrationPeriod: 1 | 2,
  networkId: string,
  account?: string
): Promise<{
  success: boolean
  data?: IUnsignedCommand | null
  error?: string
}>
```

**Usage Example:**

```typescript
const response = await kadenaNames.createRegisterNameTransaction(
  'owner-address', // Replace with actual owner address
  'owner-address', // Replace with actual address
  'example.kda',
  1, // 1-year registration
  'testnet04',
  'signer-account' // Replace with actual signer account
)

if (response.success && response.data) {
  console.log(
    'Registration Transaction:',
    JSON.stringify(response.data, null, 2)
  )
} else {
  console.error(`Error: ${response.error}`)
}
```

### `sendTransaction`

Submits a signed transaction to the Kadena blockchain.

**Function Signature:**

```typescript
function sendTransaction(
  transaction: ICommand,
  networkId: string,
  chainId: string
): Promise<{
  success: boolean
  data?: ITransactionDescriptor
  error?: string
}>
```

**Usage Example:**

```typescript
try {
  const transaction: ICommand = /* Your signed transaction */;
  const chainId = '15';
  const networkId = 'testnet04';

  const response = await kadenaNames.sendTransaction(transaction, networkId, chainId);
  if (response.success && response.data) {
    console.log('Transaction Descriptor:', response.data);
  } else {
    console.error(`Error: ${response.error}`);
  }
} catch (error) {
  console.error(`Error sending transaction: ${(error as Error).message}`);
}
```

---

## Error Handling

The KadenaNames SDK provides standardized responses for all its methods to facilitate predictable and consistent error handling. Each method returns an object containing:

- `success`: `boolean`  
  Indicates whether the operation was successful.

- `data`: `T | undefined`  
  Contains the requested data if the operation was successful.

- `error`: `string | undefined`  
  Contains an error message if the operation failed.

**Example:**

```typescript
const response = await kadenaNames.nameToAddress('alice.kda', 'testnet04')
if (response.success && response.data) {
  console.log(`Address: ${response.data}`)
} else {
  console.error(`Error: ${response.error}`)
}
```

This standardized approach ensures that you can handle both successes and failures uniformly across your application.

---

## Contributing

Contributions are welcome! Please follow these steps to contribute to the KadenaNames SDK:

1. **Fork the repository.**
2. **Create your feature branch:**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes:**

   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a pull request.**

Please ensure that your code adheres to the project's coding standards and includes appropriate tests and documentation.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any inquiries or support, please reach out to **info@kdlaunch.com**.

---

## Additional Resources

- **Support**: Join our [Discord](https://discord.gg/kdlabs) or follow us on [Twitter](https://twitter.com/kd_labs) for the latest updates and support.
- **Changelog**: Refer to the [CHANGELOG](./CHANGELOG.md) for a detailed history of updates and changes.

---

By integrating the KadenaNames SDK into your projects, you enhance the usability and accessibility of your dApps, making blockchain interactions smoother and more intuitive for your users. Happy developing!
