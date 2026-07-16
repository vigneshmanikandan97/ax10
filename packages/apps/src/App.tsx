import { Routes, Route, Navigate } from 'react-router-dom'
import { Hub } from './pages/Hub'
import { DashboardPage } from './pages/DashboardPage'
import { SupportDemo } from './pages/SupportDemo'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ComingSoon } from './pages/ComingSoon'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/support" element={<Navigate to="/support/dashboard" replace />} />
      <Route path="/support/dashboard" element={<DashboardPage />} />
      <Route path="/support/triage" element={<SupportDemo />} />
      <Route path="/support/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  )
}

export default App
