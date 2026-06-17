import { Menu, X } from 'lucide-react';
import { useState, useContext, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../services/authService';

type NavItem =
  | { type: 'link'; label: string; to: string }
  | { type: 'button'; label: string; action: 'about' };

const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Home', to: '/' },
  { type: 'link', label: 'NeuroAnatomy', to: '/anatomy' },
  { type: 'link', label: 'CVS', to: '/cvs' },
  { type: 'button', label: 'About Stroke', action: 'about' },
  { type: 'link', label: 'Homeopathic Therapeutics', to: '/therapeutics' },
  { type: 'link', label: 'Modern Medicines', to: '/modern-medicines' },
  { type: 'link', label: 'Quiz', to: '/quiz' },
];

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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-100/95 to-transparent backdrop-blur-sm"
        style={{ width: '100%', overflowX: 'hidden' }}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4" style={{ width: '100%' }}>
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeuroNexus
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_ITEMS.map((item) => {
                if (item.type === 'button' && item.action === 'about') {
                  return (
                    <button
                      key={item.label}
                      onClick={handleAboutStroke}
                      className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  );
                }
                if (item.type === 'link') {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="text-sm text-purple-900 hover:text-purple-600 transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return null;
              })}
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

            {/* Mobile Menu Toggle — always visible on mobile; min 44×44px touch target */}
            <button
              className="lg:hidden text-purple-900 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 shrink-0 z-[60] rounded-xl hover:bg-purple-100 active:bg-purple-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-panel"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ──────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-0 z-[55] bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Menu Panel ────────────────────────────────── */}
      <div
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`lg:hidden fixed top-0 right-0 z-[56] h-full w-[85vw] max-w-[320px] bg-gradient-to-b from-purple-50 to-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ overflowY: 'auto' }}
      >
        {/* Close button inside panel — min 44×44px touch target */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-purple-100">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={closeMenu}
            className="text-purple-900 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-purple-100 active:bg-purple-200 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-5 py-4 gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.type === 'button' && item.action === 'about') {
              return (
                <button
                  key={item.label}
                  onClick={handleAboutStroke}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-purple-900 hover:bg-purple-100 active:bg-purple-200 transition-colors font-medium text-base"
                >
                  {item.label}
                </button>
              );
            }
            if (item.type === 'link') {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-900 hover:bg-purple-100 active:bg-purple-200 transition-colors font-medium text-base"
                >
                  {item.label}
                </Link>
              );
            }
            return null;
          })}

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
    </>
  );
}
