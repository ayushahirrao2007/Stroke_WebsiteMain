import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
interface FeaturedVideoProps {
  id?: string;
}

export function FeaturedVideo({ id }: FeaturedVideoProps) {
  return (
    <section id={id} className="bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Educational Overview Container ─────────────────── */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-8">

          {/* Video Container */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 w-full">
              <video
                src="/videos/stroke-intro.mp4"
                controls
                playsInline
                className="w-full h-auto aspect-video object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Educational Info */}
          <div className="w-full md:w-1/2 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="text-purple-300 shrink-0" size={20} />
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                  Educational Overview
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mt-1">
                What is Brain Stroke?
              </h3>
            </div>

            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              A <strong className="text-white">brain stroke</strong> (or cerebrovascular accident) occurs
              when blood supply to a part of the brain is suddenly cut off — either by a blockage{' '}
              (<em>ischemic stroke</em>) or a burst blood vessel (<em>hemorrhagic stroke</em>). Without
              a constant supply of oxygen-rich blood, brain cells begin to die within minutes, making
              stroke a true medical emergency.
            </p>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              Stroke is one of the leading causes of death and long-term disability worldwide. However,
              up to <strong className="text-white">80% of strokes are preventable</strong> through
              lifestyle changes and management of risk factors such as high blood pressure, diabetes,
              smoking, and atrial fibrillation. Early recognition and rapid treatment dramatically
              reduce brain damage and improve recovery outcomes.
            </p>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              The <strong className="text-white">FAST acronym</strong> — Face drooping, Arm weakness,
              Speech difficulty, Time to call emergency services — is the most effective public tool
              for identifying a stroke in progress. Every minute counts.
            </p>

            {/* ── Read More Button ─────────────────────────────── */}
            <div className="mt-5">
              <Link
                to="/brain-stroke"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white
                           bg-gradient-to-r from-purple-500 to-blue-500
                           shadow-lg shadow-purple-500/30
                           hover:brightness-110 hover:shadow-purple-500/50 hover:shadow-xl
                           transition-all duration-300"
              >
                Read More
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}