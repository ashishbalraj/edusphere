import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/common/PageLoader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

const StudentDashboard = lazy(() => import('@/pages/dashboard/StudentDashboard'));
const TeacherDashboard = lazy(() => import('@/pages/dashboard/TeacherDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'));

const CourseCatalog = lazy(() => import('@/pages/courses/CourseCatalog'));
const CourseDetail = lazy(() => import('@/pages/courses/CourseDetail'));
const CoursePlayer = lazy(() => import('@/pages/courses/CoursePlayer'));
const CourseManager = lazy(() => import('@/pages/courses/CourseManager'));

const AITutorPage = lazy(() => import('@/pages/ai/AITutorPage'));
const ChatPDFPage = lazy(() => import('@/pages/ai/ChatPDFPage'));
const NotesGeneratorPage = lazy(() => import('@/pages/ai/NotesGeneratorPage'));
const QuizGeneratorPage = lazy(() => import('@/pages/ai/QuizGeneratorPage'));
const FlashcardsPage = lazy(() => import('@/pages/ai/FlashcardsPage'));
const StudyPlannerPage = lazy(() => import('@/pages/ai/StudyPlannerPage'));
const AssignmentAssistantPage = lazy(() => import('@/pages/ai/AssignmentAssistantPage'));
const CodingMentorPage = lazy(() => import('@/pages/ai/CodingMentorPage'));
const ResumeBuilderPage = lazy(() => import('@/pages/ai/ResumeBuilderPage'));
const CareerCoachPage = lazy(() => import('@/pages/ai/CareerCoachPage'));
const MockInterviewPage = lazy(() => import('@/pages/ai/MockInterviewPage'));
const ProjectRecommendationPage = lazy(() => import('@/pages/ai/ProjectRecommendationPage'));
const ResearchAssistantPage = lazy(() => import('@/pages/ai/ResearchAssistantPage'));

const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
  },
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/register',
    element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
  },
  {
    path: '/forgot-password',
    element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
  },
  {
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Navigate to="/dashboard/student" replace />,
      },
      {
        path: '/dashboard/courses',
        element: <CourseCatalog />,
      },
      {
        path: '/dashboard/courses/:id',
        element: <CourseDetail />,
      },
      {
        path: '/dashboard/courses/:id/learn',
        element: <CoursePlayer />,
      },
      {
        path: '/dashboard/student',
        element: <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>,
      },
      {
        path: '/dashboard/teacher',
        element: <ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>,
      },
      {
        path: '/dashboard/teacher/courses/:id',
        element: <ProtectedRoute allowedRoles={['teacher', 'admin']}><CourseManager /></ProtectedRoute>,
      },
      {
        path: '/dashboard/admin',
        element: <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>,
      },
      { path: '/ai/tutor', element: <AITutorPage /> },
      { path: '/ai/chat-pdf', element: <ChatPDFPage /> },
      { path: '/ai/notes', element: <NotesGeneratorPage /> },
      { path: '/ai/quiz', element: <QuizGeneratorPage /> },
      { path: '/ai/flashcards', element: <FlashcardsPage /> },
      { path: '/ai/study-planner', element: <StudyPlannerPage /> },
      { path: '/ai/assignment-assistant', element: <AssignmentAssistantPage /> },
      { path: '/ai/coding-mentor', element: <CodingMentorPage /> },
      { path: '/ai/resume-builder', element: <ResumeBuilderPage /> },
      { path: '/ai/career-coach', element: <CareerCoachPage /> },
      { path: '/ai/mock-interview', element: <MockInterviewPage /> },
      { path: '/ai/project-recommendation', element: <ProjectRecommendationPage /> },
      { path: '/ai/research-assistant', element: <ResearchAssistantPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
]);
