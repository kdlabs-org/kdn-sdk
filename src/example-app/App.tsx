import React, { useState } from 'react'
import './index.css'
import { kadenaNames } from '../sdk'

function App() {
  const [nameInput, setNameInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)
  const [resolvedName, setResolvedName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [networkId, setNetworkId] = useState('testnet04')

  const handleNameToAddress = async () => {
    setError(null)
    setResolvedAddress(null)
    setResolvedName(null)

    try {
      const address = await kadenaNames.nameToAddress(nameInput, networkId)
      if (address) {
        setResolvedAddress(address)
      } else {
        setError(`Address for ${nameInput} not found.`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddressToName = async () => {
    setError(null)
    setResolvedName(null)

    try {
      const name = await kadenaNames.addressToName(addressInput, networkId)
      if (name) {
        setResolvedName(name)
      } else {
        setError(`Name for address ${addressInput} not found.`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

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
            <option value="development">Development</option>
          </select>
        </div>

        <div className="converter-card">
          <h2>Name to Address</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="e.g., alice.kda"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <button onClick={handleNameToAddress}>Resolve</button>
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
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button onClick={handleAddressToName}>Resolve</button>
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
