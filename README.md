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

KadenaNames offers two primary ways to interact with human-readable names:

1. **Name to Address**: Convert a user-friendly name (e.g., `alice.kda`) into its corresponding blockchain address.
2. **Address to Name**: Retrieve the human-readable name associated with a specific blockchain address.

These functionalities are encapsulated within the KadenaNames SDK, providing developers with straightforward methods to integrate name resolution into their applications.

## Features

- **TypeScript Support**: Fully typed for enhanced developer experience and type safety.
- **Simple Integration**: Easy-to-use methods for name resolution without the need for complex configurations.
- **Modular Design**: Organized structure promoting maintainability and scalability.
- **Error Handling**: Comprehensive error logging using native `console` methods.
- **Customization**: Optional customization of Chainweb host generators to support various networks.

## Installation

Install the KadenaNames SDK via npm:

```typescript
pnpm add kdn-sdk
```

Or using yarn:

```typescript
yarn add kdn-sdk
```

or using npm

```typescript
npm install kdn-sdk
```

## Quick Start

Here's a simple example to get you started with the KadenaNames SDK.

## Import the SDK

```typescript
import { kadenaNames } from 'kdn-sdk'
```

## Convert Name to Address

```typescript
async function resolveName() {
  const name = 'alice.kda'
  const networkId = 'testnet04'

  try {
    const address = await kadenaNames.nameToAddress(name, networkId)
    console.log(`Address for ${name}: ${address}`)
  } catch (error) {
    console.error(error)
  }
}

resolveName()
```

## Convert Address to Name

```typescript
async function resolveAddress() {
  const address = '0x123456789abcdef'
  const networkId = 'testnet04'

  try {
    const name = await kadenaNames.addressToName(address, networkId)
    console.log(`Name for ${address}: ${name}`)
  } catch (error) {
    console.error(error)
  }
}
resolveAddress()
```

## API Documentation

### KadenaNames SDK

The main class providing methods to interact with KadenaNames.

**Methods**

```typescript
nameToAddress(name: string, networkId: string): Promise<string | null>
```

Converts a Kadena name to its corresponding blockchain address.

**Parameters:**

name: The Kadena name (e.g., alice.kda).
networkId: The network identifier (e.g., testnet04, mainnet01).
Returns: A promise that resolves to the corresponding address or null if not found.

Example:

```typescript

const address = await kadenaNamesSDK.nameToAddress('alice.kda', 'testnet04');
console.log(address); // Outputs: k:123456789....abcdef
addressToName(address: string, networkId: string): Promise<string | null>
```

Retrieves the Kadena name associated with a specific blockchain address.

**Parameters:**

address: The Kadena blockchain address.
networkId: The network identifier (e.g., testnet04, mainnet01).
Returns: A promise that resolves to the corresponding name or null if not found.

Example:

```typescript
const name = await kadenaNamesSDK.addressToName('0x123456789abcdef','testnet04')
console.log(name) // Outputs: alice.kda
nameToAddress(name: string, networkId: string): Promise<string | null>
```

Retrieves the Kadena address associated with a specific Kadena name.

**Configuration**

Custom Chainweb Host Generator
By default, the SDK uses a predefined Chainweb host generator. However, you can provide a custom generator to support additional networks or specific configurations.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

1. Fork the repository.
2. Create your feature branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature/YourFeature
5. Open a pull request.

## License

MIT

## Contact

For any inquiries or support, please reach out to info@kdlaunch.com.
