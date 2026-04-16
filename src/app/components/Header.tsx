import { Menu, X } from 'lucide-react';
import { useState, useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const ROUTE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Anatomy', to: '/anatomy' },
  { label: 'Therapeutics', to: '/therapeutics' },
  { label: 'Modern Medicines', to: '/modern-medicines' },
  { label: 'Homeopathic Medicines', to: '/homeopathic-medicines' },
  { label: 'Quiz', to: '/quiz' },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  /** Scrolls to the "About Stroke" section on the homepage */
  const handleAboutStroke = useCallback(() => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.pathname, navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-100/95 to-transparent backdrop-blur-sm">
      <div className="max-w-[90rem] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-8 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              StrokeAware
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {/* Home */}
            <Link to="/" className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium">Home</Link>
            {/* About Stroke — scrolls to section on homepage */}
            <button
              onClick={handleAboutStroke}
              className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
            >
              About Stroke
            </button>
            {/* Remaining route links */}
            {ROUTE_LINKS.filter(({ label }) => label !== 'Home').map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-purple-100 text-purple-700 px-6 py-2 rounded-md hover:bg-purple-200 transition-all shadow-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-100 text-purple-700 px-6 py-2 rounded-md hover:bg-purple-200 transition-all shadow-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-purple-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-4">
              {/* Home */}
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-purple-900 hover:text-purple-600 transition-colors font-medium">Home</Link>
              {/* About Stroke */}
              <button
                onClick={handleAboutStroke}
                className="text-left text-purple-900 hover:text-purple-600 transition-colors font-medium"
              >
                About Stroke
              </button>
              {/* Remaining route links */}
              {ROUTE_LINKS.filter(({ label }) => label !== 'Home').map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-purple-900 hover:text-purple-600 transition-colors font-medium"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
