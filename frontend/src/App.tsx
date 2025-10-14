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
import { AuthProvider, useAuth } from './state/AuthContext.tsx'
import type { JSX } from 'react'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LoginRedirect = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppLayout>
            <Routes>
              <Route
                path="/login"
                element={
                  <LoginRedirect>
                    <LoginPage />
                  </LoginRedirect>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plot-availability"
                element={
                  <ProtectedRoute>
                    <PlotAvailabilityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops"
                element={
                  <ProtectedRoute>
                    <CropDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops/new"
                element={
                  <ProtectedRoute>
                    <AddCropPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops/:cropId/harvests"
                element={
                  <ProtectedRoute>
                    <HarvestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops/:cropId/harvests/new"
                element={
                  <ProtectedRoute>
                    <AddHarvestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops/:cropId/edit"
                element={
                  <ProtectedRoute>
                    <EditCropPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* catch all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppLayout>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
