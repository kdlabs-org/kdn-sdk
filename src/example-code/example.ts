import { kadenaNames } from '../index'

async function run(): Promise<void> {
  const name = 'examplename.kda'
  const networkId = 'testnet04'

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
