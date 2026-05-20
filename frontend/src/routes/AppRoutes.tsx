import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'))
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'))
const UploadResumePage = lazy(() => import('@/pages/dashboard/UploadResumePage'))
const AnalyzePage = lazy(() => import('@/pages/dashboard/AnalyzePage'))
const RoadmapPage = lazy(() => import('@/pages/dashboard/RoadmapPage'))
const TrendingSkillsPage = lazy(() => import('@/pages/dashboard/TrendingSkillsPage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'))
const InterviewPage = lazy(() => import('@/pages/dashboard/InterviewPage'))

function PageFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-0">
      <Spinner label="Loading" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="resume" element={<UploadResumePage />} />
              <Route path="analyze" element={<AnalyzePage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="interview" element={<InterviewPage />}/>
              <Route path="trending" element={<TrendingSkillsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
