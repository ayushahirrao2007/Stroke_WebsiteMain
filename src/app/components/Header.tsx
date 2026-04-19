import { Menu, X } from 'lucide-react';
import { useState, useContext, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const ROUTE_LINKS_BEFORE_ABOUT = [
  { label: 'Home', to: '/' },
  { label: 'NeuroAnatomy', to: '/anatomy' },
  { label: 'CVS', to: '/cvs' },
] as const;

const ROUTE_LINKS_AFTER_ABOUT = [
  { label: 'Homeopathic Therapeutics', to: '/homeopathic-medicines' },
  { label: 'Modern Medicines', to: '/modern-medicines' },
  { label: 'Quiz', to: '/quiz' },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-100/95 to-transparent backdrop-blur-sm"
      style={{ width: '100%', overflowX: 'hidden' }}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-4" style={{ width: '100%' }}>
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              StrokeAware
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {ROUTE_LINKS_BEFORE_ABOUT.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}

            {/* About Stroke — scrolls to section on homepage */}
            <button
              onClick={handleAboutStroke}
              className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
            >
              About Stroke
            </button>

            {ROUTE_LINKS_AFTER_ABOUT.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-5">
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
          </div>

          {/* Mobile Menu Toggle — always visible on mobile */}
          <button
            className="lg:hidden text-purple-900 p-2 -mr-2 shrink-0 z-[60]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Overlay ──────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-0 z-[55] bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* ── Mobile Menu Panel ────────────────────────────────── */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-[56] h-full w-[85vw] max-w-[320px] bg-gradient-to-b from-purple-50 to-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ overflowY: 'auto' }}
      >
        {/* Close button inside panel */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={closeMenu}
            className="text-purple-900 p-1"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-5 py-4 gap-1">
          {ROUTE_LINKS_BEFORE_ABOUT.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-900 hover:bg-purple-100 active:bg-purple-200 transition-colors font-medium text-base"
            >
              {label}
            </Link>
          ))}

          {/* About Stroke */}
          <button
            onClick={handleAboutStroke}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-purple-900 hover:bg-purple-100 active:bg-purple-200 transition-colors font-medium text-base"
          >
            About Stroke
          </button>

          {ROUTE_LINKS_AFTER_ABOUT.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-900 hover:bg-purple-100 active:bg-purple-200 transition-colors font-medium text-base"
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-purple-200" />

          {/* Auth Links in Mobile Menu */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200 transition-colors font-semibold text-base"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-base mt-1 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-base shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200 transition-colors font-semibold text-base mt-1"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
