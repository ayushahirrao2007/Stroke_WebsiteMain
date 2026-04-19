import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function Footer() {
  const { userRole } = useContext(AuthContext);
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
              StrokeAware
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              Empowering medical students with comprehensive stroke education and awareness training.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all transform hover:scale-110">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Instructors</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Certifications</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog</a></li>
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
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-purple-200">
              <li className="flex items-start gap-2 hover:text-white transition-colors">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span>support@strokeaware.edu</span>
              </li>
              <li className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 hover:text-white transition-colors">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Medical Education Center<br />123 Health Street, Suite 456</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-purple-300">
          <p>&copy; 2026 StrokeAware. All rights reserved.</p>
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
