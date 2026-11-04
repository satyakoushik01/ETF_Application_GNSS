import { createContext, useContext, useMemo, useState } from 'react'
import {
  INITIAL_CASH,
  bonds,
  etfs,
  mutualFunds,
  getAssetById,
  getAssetType,
  initialHoldings,
  initialOrders,
} from '../data/mockData'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [cash, setCash] = useState(INITIAL_CASH)
  const [holdings, setHoldings] = useState(initialHoldings)
  const [orders, setOrders] = useState(initialOrders)

  const enrichedHoldings = useMemo(() => {
    return holdings
      .map((h) => {
        const asset = getAssetById(h.assetId)
        if (!asset) return null
        const invested = h.qty * h.avgPrice
        const current = h.qty * asset.ltp
        const pnl = current - invested
        const pnlPct = invested ? (pnl / invested) * 100 : 0
        const dayPnl = h.qty * asset.change
        return { ...h, asset, invested, current, pnl, pnlPct, dayPnl }
      })
      .filter(Boolean)
  }, [holdings])

  const netValue = useMemo(
    () => enrichedHoldings.reduce((sum, h) => sum + h.current, 0),
    [enrichedHoldings],
  )

  const invested = useMemo(
    () => enrichedHoldings.reduce((sum, h) => sum + h.invested, 0),
    [enrichedHoldings],
  )

  const todayPnl = useMemo(
    () => enrichedHoldings.reduce((sum, h) => sum + h.dayPnl, 0),
    [enrichedHoldings],
  )

  const totalPnl = netValue - invested

  function placeOrder({ asset, side, qty }) {
    const quantity = Number(qty)
    if (!asset || !quantity || quantity <= 0) {
      return { ok: false, message: 'Enter a valid quantity.' }
    }

    const value = quantity * asset.ltp
    const type = getAssetType(asset)

    if (side === 'BUY') {
      if (value > cash) {
        return { ok: false, message: 'Insufficient virtual balance.' }
      }
      setCash((c) => c - value)
      setHoldings((prev) => {
        const existing = prev.find((h) => h.assetId === asset.id)
        if (!existing) {
          return [...prev, { assetId: asset.id, qty: quantity, avgPrice: asset.ltp }]
        }
        const newQty = existing.qty + quantity
        const avgPrice = (existing.avgPrice * existing.qty + asset.ltp * quantity) / newQty
        return prev.map((h) =>
          h.assetId === asset.id ? { ...h, qty: newQty, avgPrice } : h,
        )
      })
    } else {
      const existing = holdings.find((h) => h.assetId === asset.id)
      if (!existing || existing.qty < quantity) {
        return { ok: false, message: 'Not enough quantity to sell.' }
      }
      setCash((c) => c + value)
      setHoldings((prev) =>
        prev
          .map((h) => (h.assetId === asset.id ? { ...h, qty: h.qty - quantity } : h))
          .filter((h) => h.qty > 0),
      )
    }

    const id = `ORD-${Math.floor(11000 + Math.random() * 8000)}`
    const now = new Date()
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    setOrders((prev) => [
      {
        id,
        symbol: asset.symbol,
        type,
        side,
        qty: quantity,
        price: asset.ltp,
        status: 'Executed',
        time: stamp,
      },
      ...prev,
    ])

    return { ok: true, message: `${side} ${quantity} ${asset.symbol} at ₹${asset.ltp}` }
  }

  return (
    <PortfolioContext.Provider
      value={{
        cash,
        holdings: enrichedHoldings,
        orders,
        netValue,
        invested,
        todayPnl,
        totalPnl,
        etfs,
        bonds,
        mutualFunds,
        placeOrder,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
