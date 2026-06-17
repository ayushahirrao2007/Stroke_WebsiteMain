import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function Footer() {
  const { userRole } = useContext(AuthContext);
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
              NeuroNexos
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              Empowering medical students with comprehensive stroke education and awareness training.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Instructors</a></li>
              {userRole === 'admin' && (
                <li><Link to="/admin" className="hover:text-white transition-colors hover:translate-x-1 inline-block text-purple-300 font-bold">Admin Panel</Link></li>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Student Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Research Papers</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Case Studies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-purple-300">
          <p>&copy; 2026 NeuroNexos. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
