import { useState, useMemo } from 'react'
import './index.css'
import { kadenaNames } from '../dist/esm'
import { debounce } from './utils'

function App() {
  const [nameInput, setNameInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)
  const [resolvedName, setResolvedName] = useState<string | null>(null)
  const [saleState, setSaleState] = useState<{
    sellable: boolean
    price: number
  } | null>(null)
  const [nameInfo, setNameInfo] = useState<any>(null)
  const [priceByPeriod, setPriceByPeriod] = useState<number | null>(null)
  const [transactionOutput, setTransactionOutput] = useState<string | null>(
    null
  )
  const [affiliateTransactionOutput, setAffiliateTransactionOutput] = useState<
    string | null
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [networkId, setNetworkId] = useState('testnet04')

  const debouncedHandleNameToAddress = useMemo(
    () =>
      debounce(async (name: string, network: string) => {
        setError(null)
        setResolvedAddress(null)

        if (!name.trim()) {
          setError('Please enter a valid name.')
          return
        }

        const response = await kadenaNames.nameToAddress(name, network)
        if (response.success) {
          if (response.data) {
            setResolvedAddress(response.data)
          } else {
            setError(`Address for ${name} not found.`)
          }
        } else {
          setError(response.error || 'An unexpected error occurred.')
        }
      }, 500),
    []
  )

  const debouncedHandleAddressToName = useMemo(
    () =>
      debounce(async (address: string, network: string) => {
        setError(null)
        setResolvedName(null)

        if (!address.trim()) {
          setError('Please enter a valid address.')
          return
        }

        const response = await kadenaNames.addressToName(address, network)
        if (response.success) {
          if (response.data) {
            setResolvedName(response.data)
          } else {
            setError(`Name for address ${address} not found.`)
          }
        } else {
          setError(response.error || 'An unexpected error occurred.')
        }
      }, 500),
    []
  )

  const handleFetchSaleState = async () => {
    if (!nameInput.trim()) {
      setError('Please enter a name.')
      return
    }

    setError(null)
    setSaleState(null)

    const response = await kadenaNames.fetchSaleState(nameInput, networkId)
    if (response.success && response.data) {
      setSaleState(response.data)
    } else {
      setError(response.error || 'Failed to fetch sale state.')
    }
  }

  const handleFetchNameInfo = async () => {
    if (!nameInput.trim()) {
      setError('Please enter a name.')
      return
    }

    setError(null)
    setNameInfo(null)

    const owner = 'owner-address' // Replace with actual owner address

    const response = await kadenaNames.fetchNameInfo(
      nameInput,
      networkId,
      owner
    )
    if (response.success && response.data) {
      setNameInfo(response.data)
    } else {
      setError(response.error || 'Failed to fetch name info.')
    }
  }

  const handleFetchPriceByPeriod = async (period: 1 | 2) => {
    setError(null)
    setPriceByPeriod(null)

    const owner = 'owner-address' // Replace with actual owner address

    const response = await kadenaNames.fetchPriceByPeriod(
      period,
      networkId,
      owner
    )
    if (response.success && response.data !== undefined) {
      setPriceByPeriod(response.data)
    } else {
      setError(response.error || 'Failed to fetch price.')
    }
  }

  const handlePrepareTransaction = async () => {
    if (!nameInput.trim() || !addressInput.trim()) {
      setError('Please provide both name and address.')
      return
    }

    setError(null)
    setTransactionOutput(null)

    try {
      const owner = 'owner-address' // Replace with actual owner address
      const registrationPeriod = 1 // Defaulting to 1-year registration
      const account = 'account-id' // Replace with actual account ID

      const transaction = await kadenaNames.createRegisterNameTransaction(
        owner,
        addressInput,
        nameInput,
        registrationPeriod,
        networkId,
        account
      )

      if (transaction) {
        setTransactionOutput(JSON.stringify(transaction, null, 2))
      } else {
        setError('Failed to prepare the transaction.')
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.')
    }
  }

  const handlePrepareAffiliateTransaction = () => {
    if (!nameInput.trim() || !addressInput.trim()) {
      setError('Please provide both affiliate name and fee address.')
      return
    }

    setError(null)
    setAffiliateTransactionOutput(null)

    try {
      const fee = 5.0 // Example affiliate fee
      const adminKey = 'admin-key' // Replace with actual admin key

      const transaction = kadenaNames.createAddAffiliateTransaction(
        nameInput,
        addressInput,
        fee,
        adminKey,
        networkId
      )

      if (transaction) {
        setAffiliateTransactionOutput(JSON.stringify(transaction, null, 2))
      } else {
        setError('Failed to prepare the affiliate transaction.')
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>KadenaNames SDK</h1>
        <p>Convert between Names and Addresses effortlessly</p>
      </header>

      <main className="main-content">
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
              placeholder="e.g., k:1234abcd..."
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

        <div className="converter-card">
          <h2>Prepare Registration Transaction</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name to register"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Blockchain address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          </div>
          <button className="action-button" onClick={handlePrepareTransaction}>
            Prepare Transaction
          </button>
          {transactionOutput && (
            <textarea
              className="transaction-output"
              value={transactionOutput}
              readOnly
            />
          )}
        </div>

        <div className="converter-card">
          <h2>Prepare Affiliate Transaction</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Affiliate name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Fee address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          </div>
          <button
            className="action-button"
            onClick={handlePrepareAffiliateTransaction}
          >
            Prepare Affiliate Transaction
          </button>
          {affiliateTransactionOutput && (
            <textarea
              className="transaction-output"
              value={affiliateTransactionOutput}
              readOnly
            />
          )}
        </div>

        <div className="converter-card">
          <h2>Fetch Sale State</h2>
          <button className="action-button" onClick={handleFetchSaleState}>
            Fetch Sale State
          </button>
          {saleState && (
            <p className="result">
              <strong>Sellable:</strong> {saleState.sellable ? 'Yes' : 'No'}{' '}
              <strong>Price:</strong> {saleState.price}
            </p>
          )}
        </div>

        <div className="converter-card">
          <h2>Fetch Name Info</h2>
          <button className="action-button" onClick={handleFetchNameInfo}>
            Fetch Name Info
          </button>
          {nameInfo && (
            <div className="result">
              <strong>Price:</strong> {nameInfo.price} <br />
              <strong>Market Price:</strong> {nameInfo.marketPrice} <br />
              <strong>Available:</strong> {nameInfo.isAvailable ? 'Yes' : 'No'}{' '}
              <br />
              <strong>For Sale:</strong> {nameInfo.isForSale ? 'Yes' : 'No'}
              <br />
              {nameInfo.expiryDate && (
                <>
                  <strong>Expiry Date:</strong>{' '}
                  {new Date(nameInfo.expiryDate).toLocaleDateString()} <br />
                </>
              )}
            </div>
          )}
        </div>

        <div className="converter-card">
          <h2>Fetch Price By Period</h2>
          <button
            className="action-button"
            onClick={() => handleFetchPriceByPeriod(1)}
          >
            Fetch 1-Year Price
          </button>
          <button
            className="action-button"
            onClick={() => handleFetchPriceByPeriod(2)}
          >
            Fetch 2-Year Price
          </button>
          {priceByPeriod !== null && (
            <p className="result">
              <strong>Price:</strong> {priceByPeriod}
            </p>
          )}
        </div>

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
