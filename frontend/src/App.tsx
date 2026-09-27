import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components & Layout
import { AppLayout } from './components/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RetinalAnalysisPage } from './pages/RetinalAnalysisPage';
import { RetinalScanDetailPage } from './pages/RetinalScanDetailPage';
import { ReportsPage } from './pages/ReportsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { EmergencyNumbersPage } from './pages/EmergencyNumbersPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-semibold text-slate-500">
        Authenticating Netra AI...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Patient Application Layout & Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="retinal-analysis" element={<RetinalAnalysisPage />} />
              <Route path="retinal-analysis/:id" element={<RetinalScanDetailPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/:id" element={<RetinalScanDetailPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="government-schemes" element={<GovernmentSchemesPage />} />
              <Route path="emergency-numbers" element={<EmergencyNumbersPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
