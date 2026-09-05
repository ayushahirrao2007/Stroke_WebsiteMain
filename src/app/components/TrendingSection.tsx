import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { courses as staticCourses } from '../../data/courses';

export function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const strokeCourses = staticCourses.filter(
    (course) =>
      !course.title.toLowerCase().includes('case study') &&
      !course.markdownFile?.toLowerCase().startsWith('case_')
  );

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
    <section id="types-of-strokes" className="bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Types of Strokes
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
            {strokeCourses.length} Modules
          </span>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-[70] bg-purple-950/90 hover:bg-purple-900 text-white p-3 rounded-full border border-white/20 shadow-2xl transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
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
            className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth pb-4 py-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {strokeCourses.map((course, index, filteredArray) => (
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
                  index={index}
                  title={course.title}
                  image={course.image}
                  description={course.description}
                  isFirst={index === 0}
                  isLast={index === filteredArray.length - 1}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-[70] bg-purple-950/90 hover:bg-purple-900 text-white p-3 rounded-full border border-white/20 shadow-2xl transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}