import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PortfolioProvider } from './context/PortfolioContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExploreETFs from './pages/ExploreETFs'
import ExploreBonds from './pages/ExploreBonds'
import Portfolio from './pages/Portfolio'
import Orders from './pages/Orders'

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/etfs" element={<ExploreETFs />} />
            <Route path="/bonds" element={<ExploreBonds />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  )
}
