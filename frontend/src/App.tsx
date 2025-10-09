import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AppLayout } from './components/layout/AppLayout.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { CropDetailsPage } from './pages/CropDetailsPage.tsx'
import { AddCropPage } from './pages/AddCropPage.tsx'
import { HarvestsPage } from './pages/HarvestsPage.tsx'
import { AddHarvestPage } from './pages/AddHarvestPage.tsx'
import { EditCropPage } from './pages/EditCropPage.tsx'
import { PlotAvailabilityPage } from './pages/PlotAvailabilityPage.tsx'
import { AppProvider } from './state/AppContext.tsx'
import ReportsPage from './pages/ReportsPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plot-availability" element={<PlotAvailabilityPage />} />
            <Route path="/crops" element={<CropDetailsPage />} />
            <Route path="/crops/new" element={<AddCropPage />} />
            <Route path="/crops/:cropId/harvests" element={<HarvestsPage />} />
            <Route path="/crops/:cropId/harvests/new" element={<AddHarvestPage />} />
            <Route path="/crops/:cropId/edit" element={<EditCropPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/reports" element={<ReportsPage/>} />
          </Routes>
        </AppLayout>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
