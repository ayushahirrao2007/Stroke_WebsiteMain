import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
interface TestimonialsSectionProps {
  id?: string;
}

const testimonials = [
  {
    id: 1,
    name: 'Dr. Emily Chen',
    role: 'Medical Student, Year 3',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 5,
    text: 'StrokeAware transformed my understanding of neurological emergencies. The video content and interactive features make learning engaging and memorable.',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Resident Physician',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 5,
    text: 'The progress tracking and structured curriculum helped me ace my neurology rotation. Highly recommended for all medical students!',
  },
  {
    id: 3,
    name: 'Dr. Sarah Williams',
    role: 'Medical Student, Year 4',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Exceptional content from world-class neurologists. The case studies and real-world scenarios are invaluable for board exam preparation.',
  },
  {
    id: 4,
    name: 'Michael Park',
    role: 'Medical Student, Year 2',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 5,
    text: 'The interactive video previews and smooth interface make learning enjoyable. I can track my progress and stay motivated throughout my studies.',
  },
];

export function TestimonialsSection({ id }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id={id} className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-2">What Our Students Say</h2>
          <p className="text-purple-700">Join thousands of medical students advancing their stroke education</p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden group hover:shadow-purple-500/20 transition-all duration-500">
            {/* Decorative Quote Icon */}
            <div className="absolute top-6 right-6 text-purple-200 opacity-50">
              <Quote size={80} fill="currentColor" />
            </div>

            {/* Content */}
            <div className="relative z-10 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                {/* Avatar */}
                <div className="relative group/avatar">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-200 group-hover/avatar:ring-purple-400 transition-all transform group-hover/avatar:scale-110">
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2 shadow-lg">
                    <Star size={20} fill="white" className="text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-purple-900">{currentTestimonial.name}</h3>
                  <p className="text-purple-600 mb-2">{currentTestimonial.role}</p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 justify-center md:justify-start">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="currentColor"
                        className="text-yellow-500"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-lg text-purple-800 leading-relaxed italic">
                "{currentTestimonial.text}"
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'w-3 bg-purple-300 hover:bg-purple-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Stats Below */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-purple-600 mb-1">5,000+</div>
              <div className="text-sm text-purple-700">Students Enrolled</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-purple-600 mb-1">4.9/5</div>
              <div className="text-sm text-purple-700">Average Rating</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
              <div className="text-sm text-purple-700">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
