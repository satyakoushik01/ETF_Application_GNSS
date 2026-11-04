import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PortfolioProvider } from './context/PortfolioContext'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import ExploreETFs from './pages/ExploreETFs'
import ExploreBonds from './pages/ExploreBonds'
import ExploreMutualFunds from './pages/ExploreMutualFunds'
import Portfolio from './pages/Portfolio'
import Orders from './pages/Orders'

function ProtectedRoutes() {
  const { isAuthed } = useAuth()

  if (!isAuthed) {
    return <Navigate to="/welcome" replace />
  }

  return (
    <PortfolioProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/etfs" element={<ExploreETFs />} />
          <Route path="/bonds" element={<ExploreBonds />} />
          <Route path="/mutual-funds" element={<ExploreMutualFunds />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PortfolioProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<WelcomeGate />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function WelcomeGate() {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/" replace />
  return <Welcome />
}
