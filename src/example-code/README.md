## KadenaNames SDK Example Script

This script demonstrates how to use the KadenaNames SDK to resolve Kadena blockchain names to addresses and vice versa. It provides a simple example of interacting with the Kadena blockchain to convert human-readable names into blockchain addresses and back.

## How It Works

    1.	Name to Address Conversion:
    •	Converts a Kadena name (e.g., examplename.kda) into its corresponding blockchain address.
    2.	Address to Name Conversion:
    •	Converts a blockchain address back to its associated Kadena name.
    3.	Error Handling:
    •	Handles cases where the name or address cannot be resolved, providing appropriate feedback in the console.

## Prerequisites

### Install Dependencies

Ensure the KadenaNames SDK is installed in your project:

```typescript
npm install kdn-sdk
```

## Script Usage

Save the script as example.ts and run it using Node.js.

## Code Overview

```typescript
import { kadenaNames } from '../index' // Import KadenaNames SDK ('kdn-sdk')

async function run(): Promise<void> {
  const name = 'examplename.kda' // Name to resolve
  const networkId = 'testnet04' // Specify the network

  try {
    // Convert name to address
    const address = await kadenaNames.nameToAddress(name, networkId)

    if (!address) {
      console.log(`Address for ${name} not found.`)
      return
    }
    console.log(`Address for ${name}: ${address}`)

    // Convert address back to name
    const resolvedName = await kadenaNames.addressToName(address, networkId)

    if (!resolvedName) {
      console.log(`Name for address ${address} not found.`)
      return
    }
    console.log(`Name for ${address}: ${resolvedName}`)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

run()
```

Output

The script performs the following steps: 1. Resolve Name to Address:
• Logs the resolved blockchain address for the given name.
• Example: Address for examplename.kda: k:123456789abcdef 2. Resolve Address to Name:
• Logs the resolved name for the blockchain address.
• Example: Name for k:123456789abcdef: examplename.kda 3. Error Handling:
• If the name or address cannot be resolved, an error message is logged:
• Example: Address for examplename.kda not found.

## How to Customize

Change the Name

Modify the name variable to resolve a different Kadena name:

```typescript
const name = 'yourname.kda'
```

## Change the Network

Update the networkId variable to target a different Kadena network:
• testnet04
• testnet05
• mainnet01

```typescript
const networkId = 'mainnet01'
```

## Features Highlight

    •	Ease of Use: Simplifies interaction with Kadena Names.
    •	Bidirectional Conversion: Handles both name-to-address and address-to-name conversions.
    •	Error Handling: Detects and logs cases where names or addresses cannot be resolved.
