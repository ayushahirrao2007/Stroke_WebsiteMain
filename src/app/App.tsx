import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CurveSeparator } from './components/CurveSeparator';
import { TrendingSection } from './components/TrendingSection';
import { ReasonsSection } from './components/ReasonsSection';
import { FeaturedVideo } from './components/FeaturedVideo';

import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ComingSoon } from './components/ComingSoon';
import { Routes, Route } from 'react-router-dom';
import { CourseDetails } from './pages/CourseDetails';
import { Login } from '../pages/login/Login';
import { Register } from '../pages/register/Register';
import { Admin } from '../pages/admin/Admin';

import { RequireAuth } from '../components/RequireAuth';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { QuizPage } from '../pages/quiz/QuizPage';
import BrainStrokePage from '../pages/BrainStrokePage';
import AnatomyPage from '../pages/AnatomyPage';
export default function App() {

  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────── */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
            <Header />
            <HeroSection id="home" />
            <CurveSeparator />
            <FeaturedVideo id="courses" />
            <TrendingSection />

            <TestimonialsSection id="about" />
            <ReasonsSection id="resources" />
            <Footer />
          </div>
        }
      />

      <Route path="/brain-stroke" element={<BrainStrokePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Coming Soon pages ─────────────────────────────────── */}
      <Route path="/anatomy" element={<AnatomyPage />} />
      <Route path="/cvs" element={<ComingSoon />} />
      <Route path="/modern-medicines" element={<ComingSoon />} />
      <Route path="/homeopathic-medicines" element={<ComingSoon />} />
      <Route path="/quiz" element={<ComingSoon />} />

      {/* ── Protected Admin route ─────────── */}
      <Route element={<RequireAuth requireAdmin={true} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      {/* ── Protected routes (require authentication) ─────────── */}
      <Route element={<RequireAuth />}>
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course/:id/quiz" element={<QuizPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/progress" element={<CourseDetails />} />
      </Route>

    </Routes>
  );
}