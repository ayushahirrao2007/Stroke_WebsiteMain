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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white to-white md:from-purple-100/95 md:to-transparent md:backdrop-blur-sm shadow-sm md:shadow-none"
      style={{ width: '100%', overflow: 'visible' }}
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
          <nav className="hidden md:flex items-center gap-4 lg:gap-7">
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
          <div className="hidden md:flex items-center gap-2 lg:gap-5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-purple-100 text-purple-700 px-4 py-2 lg:px-6 rounded-md hover:bg-purple-200 transition-all shadow-md text-sm font-medium whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 lg:px-6 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 lg:px-6 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-sm font-medium whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-100 text-purple-700 px-4 py-2 lg:px-6 rounded-md hover:bg-purple-200 transition-all shadow-md text-sm font-medium whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle — always visible on mobile */}
          <button
            className="md:hidden text-purple-900 p-2 -mr-2 shrink-0 z-[60]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ──────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white text-black shadow-lg z-50 flex flex-col space-y-3 p-4 overflow-y-auto"
             style={{ maxHeight: 'calc(100vh - 76px)' }}>
          {ROUTE_LINKS_BEFORE_ABOUT.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="block w-full text-left py-2 px-4 hover:bg-purple-50 rounded-md font-medium"
            >
              {label}
            </Link>
          ))}

          <button
            onClick={handleAboutStroke}
            className="block w-full text-left py-2 px-4 hover:bg-purple-50 rounded-md font-medium"
          >
            About Stroke
          </button>

          {ROUTE_LINKS_AFTER_ABOUT.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="block w-full text-left py-2 px-4 hover:bg-purple-50 rounded-md font-medium"
            >
              {label}
            </Link>
          ))}

          <div className="my-2 border-t border-gray-200" />

          {/* Auth Links in Mobile Menu */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="block w-full text-left py-2 px-4 hover:bg-purple-50 rounded-md font-medium text-purple-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="block w-full text-left py-2 px-4 hover:bg-purple-50 rounded-md font-medium text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center py-3 px-4 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full text-center py-3 px-4 mt-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
