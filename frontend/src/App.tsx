import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Toaster } from './components/ui/toast'
import { usePageViewTracker } from './hooks/use-page-view-tracker'
import { BannerProvider } from './contexts/BannerContext'
import ErrorBoundary from './components/ErrorBoundary'
import TopBanner from './components/TopBanner'
import './App.css'

// Eagerly load the home page for fast initial render
import HomePage from './pages/HomePage'

// Lazy load all other pages for code splitting
const AboutPage = lazy(() => import('./pages/AboutPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'))
const MediuConservarePage = lazy(() => import('./pages/MediuConservarePage'))
const EduatieDezvoltarePage = lazy(() => import('./pages/EduatieDezvoltarePage'))
const VoluntariatComunitatePage = lazy(() => import('./pages/VoluntariatComunitatePage'))
const DezvoltareDurabilaTurismRegenerativPage = lazy(() => import('./pages/DezvoltareDurabilaTurismRegenerativPage'))
const SummerCampPage = lazy(() => import('./pages/SummerCampPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const GetInvolvedPage = lazy(() => import('./pages/GetInvolvedPage'))
const ActivityReportPage = lazy(() => import('./pages/ActivityReportPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const GalleryAdminPage = lazy(() => import('./pages/GalleryAdminPage'))
const DataViewerAdminPage = lazy(() => import('./pages/DataViewerAdminPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminDocsPage = lazy(() => import('./pages/AdminDocsPage'))
const FileManagerPage = lazy(() => import('./pages/FileManagerPage'))
const ImageUploadAdminPage = lazy(() => import('./pages/ImageUploadAdminPage'))
const StatisticsAdminPage = lazy(() => import('./pages/admin/StatisticsAdminPage'))
const TestimonialsAdminPage = lazy(() => import('./pages/admin/TestimonialsAdminPage'))
const TeamAdminPage = lazy(() => import('./pages/admin/TeamAdminPage'))
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'))
const PageViewAnalyticsPage = lazy(() => import('./pages/PageViewAnalyticsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  )
}

function AppContent() {
  return (
    <>
      <TopBanner />
      <ScrollToTop />
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/despre" element={<AboutPage />} />
          <Route path="/echipa" element={<TeamPage />} />
          <Route path="/proiecte" element={<ProjectsPage />} />
          <Route path="/experiente" element={<ExperiencesPage />} />
          <Route path="/initiative/mediu-si-conservare" element={<MediuConservarePage />} />
          <Route path="/initiative/educatie-si-dezvoltare" element={<EduatieDezvoltarePage />} />
          <Route path="/initiative/voluntariat-si-comunitate" element={<VoluntariatComunitatePage />} />
          <Route path="/initiative/dezvoltare-durabila-turism-regenerativ" element={<DezvoltareDurabilaTurismRegenerativPage />} />
          <Route path="/summer-camp" element={<SummerCampPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/galerie/admin" 
            element={
              <ProtectedRoute>
                <GalleryAdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/data" 
            element={
              <ProtectedRoute>
                <DataViewerAdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/docs" 
            element={
              <ProtectedRoute>
                <AdminDocsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/files" 
            element={
              <ProtectedRoute>
                <FileManagerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/media" 
            element={
              <ProtectedRoute>
                <ImageUploadAdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/statistics" 
            element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/annual-statistics" 
            element={
              <ProtectedRoute>
                <StatisticsAdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/testimonials" 
            element={
              <ProtectedRoute>
                <TestimonialsAdminPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute>
                <TeamAdminPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/analytics/page-views" 
            element={
              <ProtectedRoute>
                <PageViewAnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/implica-te" element={<GetInvolvedPage />} />
          <Route path="/raport-activitate" element={<ActivityReportPage />} />
          <Route path="/termeni-si-conditii" element={<TermsPage />} />
          <Route path="/politica-de-cookie-uri" element={<CookiePolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

function App() {
  // Track page views
  usePageViewTracker();

  return (
    <ErrorBoundary>
      <BannerProvider>
        <AppContent />
      </BannerProvider>
    </ErrorBoundary>
  )
}

export default App
