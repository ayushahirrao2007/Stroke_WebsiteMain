import { X } from 'lucide-react';
import { useState } from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sign in functionality would be connected to a backend service');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-600 hover:text-purple-800 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            StrokeAware
          </h2>
          <p className="text-purple-700">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900 bg-white"
              placeholder="your.email@university.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-900 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900 bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg font-semibold"
          >
            Sign In
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-2">
          <a href="#" className="block text-sm text-purple-600 hover:text-purple-800">
            Forgot password?
          </a>
          <p className="text-sm text-purple-700">
            New to StrokeAware?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 font-semibold">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
