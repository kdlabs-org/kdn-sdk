// const { kadenaNames } = require('kdn-sdk');

// async function run() {
//   const name = 'examplename.kda';
//   const networkId = 'testnet04';
//   const owner = 'owner-address'; // Replace with the actual owner address

//   try {
//     // Convert name to address
//     const addressResponse = await kadenaNames.nameToAddress(name, networkId);

//     if (addressResponse.success && addressResponse.data) {
//       const address = addressResponse.data;
//       console.log(`Address for ${name}: ${address}`);

//       // Convert address back to name
//       const resolvedNameResponse = await kadenaNames.addressToName(
//         address,
//         networkId
//       );

//       if (resolvedNameResponse.success && resolvedNameResponse.data) {
//         const resolvedName = resolvedNameResponse.data;
//         console.log(`Name for ${address}: ${resolvedName}`);
//       } else if (resolvedNameResponse.success && !resolvedNameResponse.data) {
//         console.log(`Name for address ${address} not found.`);
//       } else {
//         console.error(`Error resolving name: ${resolvedNameResponse.error}`);
//       }
//     } else if (addressResponse.success && !addressResponse.data) {
//       console.log(`Address for ${name} not found.`);
//     } else {
//       console.error(`Error resolving address: ${addressResponse.error}`);
//     }

//     // Fetch sale state
//     const saleStateResponse = await kadenaNames.fetchSaleState(name, networkId);
//     if (saleStateResponse.success && saleStateResponse.data) {
//       const saleState = saleStateResponse.data;
//       console.log(`Sale state for ${name}:`);
//       console.log(`  Sellable: ${saleState.sellable ? 'Yes' : 'No'}`);
//       console.log(`  Price: ${saleState.price}`);
//     } else {
//       console.error(`Error fetching sale state: ${saleStateResponse.error}`);
//     }

//     // Fetch name info
//     const nameInfoResponse = await kadenaNames.fetchNameInfo(
//       name,
//       networkId,
//       owner
//     );
//     if (nameInfoResponse.success && nameInfoResponse.data) {
//       const nameInfo = nameInfoResponse.data;
//       console.log(`Info for ${name}:`);
//       console.log(`  Price: ${nameInfo.price}`);
//       console.log(`  Market Price: ${nameInfo.marketPrice}`);
//       console.log(`  Available: ${nameInfo.isAvailable ? 'Yes' : 'No'}`);
//       console.log(`  For Sale: ${nameInfo.isForSale ? 'Yes' : 'No'}`);
//       if (nameInfo.expiryDate) {
//         console.log(
//           `  Expiry Date: ${new Date(nameInfo.expiryDate).toLocaleDateString()}`
//         );
//       }
//     } else {
//       console.error(`Error fetching name info: ${nameInfoResponse.error}`);
//     }

//     // Fetch price by registration period
//     const priceForOneYearResponse = await kadenaNames.fetchPriceByPeriod(
//       1,
//       networkId,
//       owner
//     );
//     if (
//       priceForOneYearResponse.success &&
//       priceForOneYearResponse.data !== undefined
//     ) {
//       const priceForOneYear = priceForOneYearResponse.data;
//       console.log(`Price to register ${name} for 1 year: ${priceForOneYear}`);
//     } else {
//       console.error(
//         `Error fetching 1-year price: ${priceForOneYearResponse.error}`
//       );
//     }

//     const priceForTwoYearsResponse = await kadenaNames.fetchPriceByPeriod(
//       2,
//       networkId,
//       owner
//     );
//     if (
//       priceForTwoYearsResponse.success &&
//       priceForTwoYearsResponse.data !== undefined
//     ) {
//       const priceForTwoYears = priceForTwoYearsResponse.data;
//       console.log(`Price to register ${name} for 2 years: ${priceForTwoYears}`);
//     } else {
//       console.error(
//         `Error fetching 2-year price: ${priceForTwoYearsResponse.error}`
//       );
//     }
//   } catch (error) {
//     console.error('An unexpected error occurred:', error);
//   }
// }

// run();