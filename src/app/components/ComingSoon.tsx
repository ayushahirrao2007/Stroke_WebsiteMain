import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-10 shadow-2xl">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Construction className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">
            Coming Soon
          </h1>
          <p className="text-purple-200 text-base leading-relaxed mb-8">
            This feature is under development
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-[1.02]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
