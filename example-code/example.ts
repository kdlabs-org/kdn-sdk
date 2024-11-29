// // Import the KadenaNames SDK
// import { kadenaNames } from 'kdn-sdk';

// async function run(): Promise<void> {
//   const name = 'examplename.kda';
//   const networkId = 'testnet04';
//   const owner = 'owner-address'; // Replace with the actual owner address

//   try {
//     // Convert name to address
//     const address = await kadenaNames.nameToAddress(name, networkId);

//     if (!address) {
//       console.log(`Address for ${name} not found.`);
//       return;
//     }
//     console.log(`Address for ${name}: ${address}`);

//     // Convert address back to name
//     const resolvedName = await kadenaNames.addressToName(address, networkId);

//     if (!resolvedName) {
//       console.log(`Name for address ${address} not found.`);
//       return;
//     }
//     console.log(`Name for ${address}: ${resolvedName}`);

//     // Fetch sale state
//     const saleState = await kadenaNames.fetchSaleState(name, networkId);
//     console.log(`Sale state for ${name}:`);
//     console.log(`  Sellable: ${saleState.sellable ? 'Yes' : 'No'}`);
//     console.log(`  Price: ${saleState.price}`);

//     // Fetch name info
//     const nameInfo = await kadenaNames.fetchNameInfo(name, networkId, owner);
//     console.log(`Info for ${name}:`);
//     console.log(`  Price: ${nameInfo.price}`);
//     console.log(`  Market Price: ${nameInfo.marketPrice}`);
//     console.log(`  Available: ${nameInfo.isAvailable ? 'Yes' : 'No'}`);
//     console.log(`  For Sale: ${nameInfo.isForSale ? 'Yes' : 'No'}`);

//     // Fetch price by registration period
//     const priceForOneYear = await kadenaNames.fetchPriceByPeriod(1, networkId, owner);
//     console.log(`Price to register ${name} for 1 year: ${priceForOneYear}`);

//     const priceForTwoYears = await kadenaNames.fetchPriceByPeriod(2, networkId, owner);
//     console.log(`Price to register ${name} for 2 years: ${priceForTwoYears}`);
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

// // Run the example
// run();
