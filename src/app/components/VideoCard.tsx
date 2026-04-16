import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface VideoCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function VideoCard({ id, title, image, description, isFirst = false, isLast = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKnowMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/course/${id}`);
  };

  const handleMouseEnter = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      }
    }, 120);
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    /* Outer wrapper: handles scale + z-index, does NOT clip overflow */
    <div
      className={`
        relative flex-shrink-0 w-64 sm:w-80 cursor-pointer
        group/card
        ${isHovered
          ? 'z-50 drop-shadow-[0_20px_60px_rgba(168,85,247,0.6)]'
          : 'z-0 opacity-100'
        }
      `}
      style={{
        transformOrigin: isFirst ? 'left center' : isLast ? 'right center' : 'center center',
        transform: isHovered ? 'translateY(-14px) scale(1.12)' : 'translateY(0) scale(1)',
        transition: 'transform 350ms ease-out, opacity 350ms ease-out, box-shadow 350ms ease-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayClick}
    >
      {/* Inner card: overflow-hidden for rounded corners on image only */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-2xl">
        {/* Thumbnail Image */}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'
            }`}
        />

        {/* Video Element (plays on hover) */}
        {isPlaying && (
          <video
            ref={videoRef}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
        )}

        {/* Animated Border Glow */}
        <div className={`absolute inset-0 rounded-lg transition-all duration-350 ${isHovered ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-purple-900' : ''
          }`} />

        {/* Base Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-350 ${isHovered ? 'from-black/95 via-black/60 to-transparent' : 'from-black/90 via-black/40 to-transparent'
          }`} />

        {/* Hover Readability Gradient (bottom 70%) */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none rounded-b-lg"
          style={{
            height: '70%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 350ms ease-out',
          }}
        />

        {/* Number Badge (visible when not hovered) */}
        <div className={`absolute bottom-4 left-4 z-20 transition-all duration-500 ease-out ${isHovered ? 'opacity-0 translate-y-8 scale-75' : 'opacity-100 translate-y-0 scale-100'
          }`}>
          <span className="text-8xl font-bold text-white/20 leading-none" style={{ WebkitTextStroke: '3px white' }}>
            {id}
          </span>
        </div>

        {/* Title Badge */}
        <div className={`absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md transition-all duration-500 ${isHovered ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
          <span className="text-white text-sm font-semibold">{title}</span>
        </div>


        {/* Hover Content — fades in from below, above gradient */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-4 z-10 ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 350ms ease-out, transform 350ms ease-out',
          }}
        >
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg drop-shadow-lg">{title}</h3>
            <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">{description}</p>

            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="px-2 py-0.5 border border-white/50 rounded text-xs">HD</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleKnowMoreClick}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold transition-all transform hover:scale-105"
              >
                <Play size={16} />
                Know more
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all transform hover:scale-110 hover:rotate-90 shadow-lg">
                <Plus size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all ml-auto transform hover:scale-110 shadow-lg"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all transform hover:scale-110 hover:rotate-180 shadow-lg">
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}