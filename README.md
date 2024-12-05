# KadenaNames SDK

## Introduction

Welcome to the **KadenaNames SDK**—your comprehensive solution for integrating human-readable addresses on the Kadena blockchain. Designed with developer convenience and user experience in mind, KadenaNames empowers you to create more intuitive and accessible decentralized applications (dApps).

### What is KadenaNames?

KadenaNames is a decentralized, on-chain service that provides human-readable names on the Kadena blockchain. Leveraging the robust capabilities of Pact smart contracts, KadenaNames ensures a secure, tamper-proof, and user-friendly experience. Our smart contracts serve as the definitive source of truth, meticulously verifying the authenticity and ownership of each name.

### Why KadenaNames?

- **Enhanced User Experience**: Simplify user interactions by replacing complex blockchain addresses with easy-to-remember names.
- **Increased Accessibility**: Make your dApps more approachable, attracting a broader user base.
- **Security and Trust**: Built on Kadena’s secure and scalable blockchain, ensuring reliability and integrity.
- **Comprehensive Error Handling**: Receive standardized responses with detailed error messages for seamless integration and debugging.
- **TypeScript Support**: Enjoy type safety and improved developer experience with full TypeScript support.

### How Does It Work?

KadenaNames offers multiple functionalities to interact with human-readable names:

1. **Name to Address**: Convert a user-friendly name (e.g., `alice.kda`) into its corresponding blockchain address.
2. **Address to Name**: Retrieve the human-readable name associated with a specific blockchain address.
3. **Fetch Sale State**: Check if a name is sellable and its current price.
4. **Fetch Name Info**: Get detailed information about a Kadena name, including price, availability, and sale status.
5. **Fetch Price By Period**: Retrieve the cost of registering a name for 1 or 2 years.
6. **Prepare Registration Transaction**: Create an unsigned transaction to register a Kadena name.
7. **Prepare Affiliate Transaction**: Create an unsigned transaction to add a new affiliate.

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
    if (response.success) {
      if (response.data) {
        console.log(`Address for ${name}: ${response.data}`)
      } else {
        console.log(`Address for ${name} not found.`)
      }
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
  const address = 'k:123456789abcdef'
  const networkId = 'testnet04'

  try {
    const response = await kadenaNames.addressToName(address, networkId)
    if (response.success) {
      if (response.data) {
        console.log(`Name for ${address}: ${response.data}`)
      } else {
        console.log(`Name for address ${address} not found.`)
      }
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
        `Sellable: ${response.data.sellable ? 'Yes' : 'No'}, Price: ${
          response.data.price
        }`
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
  const owner = 'owner-address' // Replace with actual owner address

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
  const owner = 'owner-address' // Replace with actual owner address

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

### Prepare Registration Transaction

```typescript
async function prepareRegistrationTransaction() {
  const owner = 'owner-address' // Replace with actual owner address
  const address = 'owner-address' // Replace with actual address
  const name = 'example.kda'
  const registrationPeriod = 1 // 1-year registration
  const networkId = 'testnet04'
  const account = 'signer-account' // Replace with actual signer account

  try {
    const transactionResponse = await kadenaNames.createRegisterNameTransaction(
      owner,
      address,
      name,
      registrationPeriod,
      networkId,
      account
    )

    if (transactionResponse.success && transactionResponse.data) {
      console.log(
        'Registration Transaction:',
        JSON.stringify(transactionResponse.data, null, 2)
      )
    } else {
      console.error(
        `Error preparing registration transaction: ${transactionResponse.error}`
      )
    }
  } catch (error) {
    console.error(`Error preparing registration transaction: ${error.message}`)
  }
}

prepareRegistrationTransaction()
```

---

### Prepare Affiliate Transaction

```typescript
function prepareAffiliateTransaction() {
  const affiliateName = 'affiliate-name' // Replace with actual affiliate name
  const feeAddress = 'fee-address' // Replace with actual fee address
  const fee = 5.0 // Example affiliate fee percentage
  const adminKey = 'admin-key' // Replace with actual admin key
  const networkId = 'testnet04'

  try {
    const transactionResponse = kadenaNames.createAddAffiliateTransaction(
      affiliateName,
      feeAddress,
      fee,
      adminKey,
      networkId
    )

    if (transactionResponse.success && transactionResponse.data) {
      console.log(
        'Affiliate Transaction:',
        JSON.stringify(transactionResponse.data, null, 2)
      )
    } else {
      console.error(
        `Error preparing affiliate transaction: ${transactionResponse.error}`
      )
    }
  } catch (error) {
    console.error(`Error preparing affiliate transaction: ${error.message}`)
  }
}

prepareAffiliateTransaction()
```

---

### Send Transaction

```typescript
async function sendSignedTransaction() {
  try {
    const transaction: ICommand = /* Your signed transaction */;
    const chainId = '1'; // Replace with actual chain ID
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
}

sendSignedTransaction();
```

---

## API Documentation

### `nameToAddress`

Converts a Kadena name to its corresponding blockchain address.

**Parameters:**

- `name`: `string`  
  The Kadena name (e.g., `alice.kda`).

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: string | null;
  error?: string;
}
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

---

### `addressToName`

Retrieves the Kadena name associated with a specific blockchain address.

**Parameters:**

- `address`: `string`  
  The Kadena blockchain address.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: string | null;
  error?: string;
}
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

---

### `fetchSaleState`

Fetches the sale state of a given Kadena name.

**Parameters:**

- `name`: `string`  
  The Kadena name.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: {
    sellable: boolean;
    price: number;
  };
  error?: string;
}
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

---

### `fetchNameInfo`

Fetches detailed information about a Kadena name.

**Parameters:**

- `name`: `string`  
  The Kadena name.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `owner`: `string`  
  The owner's blockchain address.

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: {
    price: number;
    marketPrice: number;
    isAvailable: boolean;
    isForSale: boolean;
    expiryDate?: number; // Timestamp in milliseconds
  };
  error?: string;
}
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

---

### `fetchPriceByPeriod`

Fetches the registration price for a specific period (1 or 2 years).

**Parameters:**

- `period`: `1 | 2`  
  1 for one year, 2 for two years.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `owner`: `string`  
  The owner's blockchain address.

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: number;
  error?: string;
}
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

---

### `createRegisterNameTransaction`

Prepares an unsigned transaction for registering a Kadena name.

**Parameters:**

- `owner`: `string`  
  The account that owns the name being registered.

- `address`: `string`  
  The blockchain address to associate with the name.

- `name`: `string`  
  The Kadena name to register (e.g., `example.kda`).

- `registrationPeriod`: `1 | 2`  
  The registration period (1 for one year, 2 for two years).

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `account?`: `string`  
  The account performing the transaction (optional).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: IUnsignedCommand | null;
  error?: string;
}
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

---

### `createAddAffiliateTransaction`

Prepares an unsigned transaction to add a new affiliate.

**Parameters:**

- `affiliateName`: `string`  
  The name of the affiliate.

- `feeAddress`: `string`  
  The blockchain address where affiliate fees will be sent.

- `fee`: `number`  
  The fee percentage to be allocated to the affiliate.

- `adminKey`: `string`  
  The governance key to authorize the operation.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

```typescript
{
  success: boolean;
  data?: IUnsignedCommand;
  error?: string;
}
```

**Usage Example:**

```typescript
const response = kadenaNames.createAddAffiliateTransaction(
  'affiliate-name', // Replace with actual affiliate name
  'fee-address', // Replace with actual fee address
  5.0, // Example fee percentage
  'admin-key', // Replace with actual admin key
  'testnet04'
)

if (response.success && response.data) {
  console.log('Affiliate Transaction:', JSON.stringify(response.data, null, 2))
} else {
  console.error(`Error: ${response.error}`)
}
```

---

### `sendTransaction`

Submits a signed transaction to the Kadena blockchain.

**Parameters:**

- `transaction`: `ICommand`  
  The signed transaction object.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `chainId`: `string`  
  The chain ID for the transaction (e.g., `'1'`, `'15'`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: ITransactionDescriptor;
  error?: string;
}
```

**Usage Example:**

```typescript
try {
  const transaction: ICommand = /* Your signed transaction */;
  const chainId = '1'; // Replace with actual chain ID
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
if (response.success) {
  if (response.data) {
    console.log(`Address: ${response.data}`)
  } else {
    console.log('Address not found.')
  }
} else {
  console.error(`Error: ${response.error}`)
}
```

This standardized approach ensures that you can handle both successes and failures uniformly across your application.

---

## API Documentation

### `nameToAddress`

Converts a Kadena name to its corresponding blockchain address.

**Parameters:**

- `name`: `string`  
  The Kadena name (e.g., `alice.kda`).

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: string | null;
  error?: string;
}
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

---

### `addressToName`

Retrieves the Kadena name associated with a specific blockchain address.

**Parameters:**

- `address`: `string`  
  The Kadena blockchain address.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: string | null;
  error?: string;
}
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

---

### `fetchSaleState`

Fetches the sale state of a given Kadena name.

**Parameters:**

- `name`: `string`  
  The Kadena name.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: {
    sellable: boolean;
    price: number;
  };
  error?: string;
}
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

---

### `fetchNameInfo`

Fetches detailed information about a Kadena name.

**Parameters:**

- `name`: `string`  
  The Kadena name.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `owner`: `string`  
  The owner's blockchain address.

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: {
    price: number;
    marketPrice: number;
    isAvailable: boolean;
    isForSale: boolean;
    expiryDate?: number; // Timestamp in milliseconds
  };
  error?: string;
}
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

---

### `fetchPriceByPeriod`

Fetches the registration price for a specific period (1 or 2 years).

**Parameters:**

- `period`: `1 | 2`  
  1 for one year, 2 for two years.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `owner`: `string`  
  The owner's blockchain address.

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: number;
  error?: string;
}
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

---

### `createRegisterNameTransaction`

Prepares an unsigned transaction for registering a Kadena name.

**Parameters:**

- `owner`: `string`  
  The account that owns the name being registered.

- `address`: `string`  
  The blockchain address to associate with the name.

- `name`: `string`  
  The Kadena name to register (e.g., `example.kda`).

- `registrationPeriod`: `1 | 2`  
  The registration period (1 for one year, 2 for two years).

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `account?`: `string`  
  The account performing the transaction (optional).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: IUnsignedCommand | null;
  error?: string;
}
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

---

### `createAddAffiliateTransaction`

Prepares an unsigned transaction to add a new affiliate.

**Parameters:**

- `affiliateName`: `string`  
  The name of the affiliate.

- `feeAddress`: `string`  
  The blockchain address where affiliate fees will be sent.

- `fee`: `number`  
  The fee percentage to be allocated to the affiliate.

- `adminKey`: `string`  
  The governance key to authorize the operation.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

**Returns:**

```typescript
{
  success: boolean;
  data?: IUnsignedCommand;
  error?: string;
}
```

**Usage Example:**

```typescript
const response = kadenaNames.createAddAffiliateTransaction(
  'affiliate-name', // Replace with actual affiliate name
  'fee-address', // Replace with actual fee address
  5.0, // Example fee percentage
  'admin-key', // Replace with actual admin key
  'testnet04'
)

if (response.success && response.data) {
  console.log('Affiliate Transaction:', JSON.stringify(response.data, null, 2))
} else {
  console.error(`Error: ${response.error}`)
}
```

---

### `sendTransaction`

Submits a signed transaction to the Kadena blockchain.

**Parameters:**

- `transaction`: `ICommand`  
  The signed transaction object.

- `networkId`: `string`  
  The network identifier (e.g., `testnet04`, `mainnet01`).

- `chainId`: `string`  
  The chain ID for the transaction (e.g., `'1'`, `'15'`).

**Returns:**

A promise that resolves to:

```typescript
{
  success: boolean;
  data?: ITransactionDescriptor;
  error?: string;
}
```

**Usage Example:**

```typescript
try {
  const transaction: ICommand = /* Your signed transaction */;
  const chainId = '1'; // Replace with actual chain ID
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

- **Documentation**: Comprehensive guides and API references are available in this README.
- **Support**: Join our [Discord](https://discord.gg/kadena) or follow us on [Twitter](https://twitter.com/kadena_io) for the latest updates and support.
- **Changelog**: Refer to the [CHANGELOG](./CHANGELOG.md) for a detailed history of updates and changes.

---

By integrating the KadenaNames SDK into your projects, you enhance the usability and accessibility of your dApps, making blockchain interactions smoother and more intuitive for your users. Happy developing!
