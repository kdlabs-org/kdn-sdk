import { useState, useMemo } from 'react'
import './index.css'
import { kadenaNames } from '../src/index'
import { debounce } from './utils'

function App() {
  const [nameInput, setNameInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)
  const [resolvedName, setResolvedName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [networkId, setNetworkId] = useState('testnet04')

  const debouncedHandleNameToAddress = useMemo(
    () =>
      debounce(async (name: string, network: string) => {
        setError(null)
        setResolvedAddress(null)
        setResolvedName(null)

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

  const debouncedHandleAddressToName = useMemo(
    () =>
      debounce(async (address: string, network: string) => {
        setError(null)
        setResolvedName(null)

        try {
          const name = await kadenaNames.addressToName(address, network)
          if (name) {
            setResolvedName(name)
          } else {
            setError(`Name for address ${address} not found.`)
          }
        } catch (err: any) {
          setError(err.message)
        }
      }, 500),
    []
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>KadenaNames SDK</h1>
        <p>Convert between Names and Addresses effortlessly</p>
      </header>

      <main className="main-content">
        <div className="network-selector">
          <label htmlFor="network">Network:</label>
          <select
            id="network"
            value={networkId}
            onChange={(e) => setNetworkId(e.target.value)}
          >
            <option value="testnet04">Testnet04</option>
            <option value="testnet05">Testnet05</option>
            <option value="mainnet01">Mainnet01</option>
          </select>
        </div>

        <div className="converter-card">
          <h2>Name to Address</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="e.g., alice.kda"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value)
                debouncedHandleNameToAddress(e.target.value, networkId)
              }}
            />
          </div>
          {resolvedAddress && (
            <p className="result">
              <strong>{nameInput}:</strong> {resolvedAddress}
            </p>
          )}
        </div>

        <div className="converter-card">
          <h2>Address to Name</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="e.g., 0x1234..."
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value)
                debouncedHandleAddressToName(e.target.value, networkId)
              }}
            />
          </div>
          {resolvedName && (
            <p className="result">
              <strong>{addressInput}:</strong> {resolvedName}
            </p>
          )}
        </div>

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} KadenaNames SDK</p>
      </footer>
    </div>
  )
}

export default App
