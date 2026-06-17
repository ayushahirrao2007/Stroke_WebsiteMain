import { useState } from 'react';
import { Brain, Stethoscope, Activity, Heart, Microscope, BookOpen } from 'lucide-react';

const categories = [
  {
    icon: Brain,
    title: 'Neuroanatomy',
    count: '24 courses',
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-100',
    image: 'https://images.unsplash.com/photo-1725689587796-af783f04c0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMG1lZGljYWwlMjBzdHVkZW50fGVufDF8fHx8MTc2NzgwODI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Skills',
    count: '18 courses',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-100',
    image: 'https://images.unsplash.com/photo-1674702727317-d29b2788dc4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzY3NzkxNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Activity,
    title: 'Emergency Care',
    count: '15 courses',
    color: 'from-indigo-500 to-indigo-700',
    bgColor: 'bg-indigo-100',
    image: 'https://images.unsplash.com/photo-1679001976061-43be2417a90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJva2UlMjBhd2FyZW5lc3MlMjBoZWFsdGh8ZW58MXx8fHwxNzY3ODA4MDgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Heart,
    title: 'Patient Care',
    count: '20 courses',
    color: 'from-pink-500 to-pink-700',
    bgColor: 'bg-pink-100',
    image: 'https://images.unsplash.com/photo-1576670160060-c4e874631c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY3ODA4MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Microscope,
    title: 'Research Methods',
    count: '12 courses',
    color: 'from-violet-500 to-violet-700',
    bgColor: 'bg-violet-100',
    image: 'https://images.unsplash.com/photo-1767378262839-9d615a266ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwbmV1cm9sb2d5fGVufDF8fHx8MTc2NzgwODI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: BookOpen,
    title: 'Case Studies',
    count: '30 courses',
    color: 'from-cyan-500 to-cyan-700',
    bgColor: 'bg-cyan-100',
    image: 'https://images.unsplash.com/photo-1725689587796-af783f04c0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMG1lZGljYWwlMjBzdHVkZW50fGVufDF8fHx8MTc2NzgwODI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function CategoriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-2">Browse by Category</h2>
          <p className="text-purple-700">Explore our comprehensive stroke education library</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hoveredIndex === index ? 'scale-110 blur-sm' : 'scale-100'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-opacity duration-500 ${
                  hoveredIndex === index ? 'opacity-95' : 'opacity-85'
                }`} />
              </div>

              {/* Content */}
              <div className="relative p-4 sm:p-8 h-40 sm:h-48 flex flex-col justify-between">
                {/* Icon */}
                <div className={`${category.bgColor} rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform transition-all duration-500 ${
                  hoveredIndex === index ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                }`}>
                  <category.icon className="text-purple-700" size={24} />
                </div>

                {/* Text */}
                <div className={`transform transition-all duration-500 ${
                  hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                }`}>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm">{category.count}</p>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-6 right-6 transform transition-all duration-500 ${
                  hoveredIndex === index ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Ripple Effect */}
              <div className={`absolute inset-0 bg-white rounded-full transition-all duration-1000 ${
                hoveredIndex === index ? 'scale-150 opacity-0' : 'scale-0 opacity-30'
              }`} style={{ transformOrigin: 'center' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
