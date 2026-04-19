import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { courses } from '../../data/courses';

export function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-8">Types of Stroke</h2>

        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-[60] bg-purple-900/80 hover:bg-purple-900 text-white p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="sm:hidden" />
              <ChevronLeft size={24} className="hidden sm:block" />
            </button>
          )}

          {/*
            Scrollable Container:
            - overflow-x-auto for horizontal scrolling
            - overflow-y-visible so scaled cards are NOT clipped vertically
            - py-10 gives vertical breathing room for the scale transform
          */}
          <div
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth pb-4 py-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={`flex-shrink-0 transition-all duration-400 ease-out ${hoveredId !== null && hoveredId !== course.id
                  ? 'opacity-60 scale-95'
                  : 'opacity-100 scale-100'
                  }`}
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <VideoCard
                  id={course.id}
                  title={course.title}
                  image={course.image}
                  description={course.description}
                  isFirst={index === 0}
                  isLast={index === courses.length - 1}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-[60] bg-purple-900/80 hover:bg-purple-900 text-white p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="sm:hidden" />
              <ChevronRight size={24} className="hidden sm:block" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}