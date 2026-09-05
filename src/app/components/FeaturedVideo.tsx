import { Brain, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedVideoProps {
  id?: string;
}

export function FeaturedVideo({ id }: FeaturedVideoProps) {
  return (
    <section id={id} className="bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Educational Overview Container ─────────────────── */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8 lg:gap-12">

          {/* Video Container - Compact elegant vertical format */}
          <div className="w-full sm:w-auto shrink-0 flex flex-col items-center mx-auto lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-300/30 bg-black/70 w-[220px] sm:w-[240px] lg:w-[250px] aspect-[478/850] group ring-1 ring-white/20">
              <video
                src="/videos/stroke-intro.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-purple-200/90 font-medium">
              <PlayCircle size={14} className="text-purple-300" />
              <span>Video Introduction</span>
            </div>
          </div>

          {/* Educational Info */}
          <div className="flex-1 space-y-5 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-300/20 text-purple-200 text-xs font-semibold mb-2">
                <Brain className="text-purple-300" size={14} />
                <span>EDUCATIONAL OVERVIEW</span>
                <Sparkles size={12} className="text-purple-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                What is Brain Stroke?
              </h3>
            </div>

            <p className="text-purple-100/90 leading-relaxed text-sm sm:text-base">
              A <strong className="text-white font-semibold">brain stroke</strong> (or cerebrovascular accident) occurs
              when blood supply to a part of the brain is suddenly cut off — either by a blockage{' '}
              (<em>ischemic stroke</em>) or a burst blood vessel (<em>hemorrhagic stroke</em>). Without
              a constant supply of oxygen-rich blood, brain cells begin to die within minutes, making
              stroke a true medical emergency.
            </p>
            <p className="text-purple-100/90 leading-relaxed text-sm sm:text-base">
              Stroke is one of the leading causes of death and long-term disability worldwide. However,
              up to <strong className="text-white font-semibold">80% of strokes are preventable</strong> through
              lifestyle changes and management of risk factors such as high blood pressure, diabetes,
              smoking, and atrial fibrillation. Early recognition and rapid treatment dramatically
              reduce brain damage and improve recovery outcomes.
            </p>
            <p className="text-purple-100/90 leading-relaxed text-sm sm:text-base">
              The <strong className="text-white font-semibold">FAST acronym</strong> — Face drooping, Arm weakness,
              Speech difficulty, Time to call emergency services — is the most effective public tool
              for identifying a stroke in progress. Every minute counts.
            </p>

            {/* ── Read More Button ─────────────────────────────── */}
            <div className="pt-2">
              <Link
                to="/brain-stroke"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white
                           bg-gradient-to-r from-purple-500 to-blue-500
                           shadow-lg shadow-purple-500/30
                           hover:brightness-110 hover:shadow-purple-500/50 hover:shadow-xl
                           hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-300 group"
              >
                <span>Read More</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}