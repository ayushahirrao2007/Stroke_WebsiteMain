import { Brain, Clock, GraduationCap, Heart } from 'lucide-react';
interface ReasonsSectionProps {
  id?: string;
}

const reasons = [
  {
    icon: Brain,
    title: 'Expert Knowledge',
    description: 'Learn from leading neurologists and stroke specialists worldwide',
  },
  {
    icon: Clock,
    title: 'Time is Brain',
    description: 'Master rapid assessment and intervention techniques that save lives',
  },
  {
    icon: GraduationCap,
    title: 'Medical Student Focused',
    description: 'Curriculum designed specifically for medical education and board exams',
  },
  {
    icon: Heart,
    title: 'Evidence-Based',
    description: 'Access the latest clinical guidelines and research-backed protocols',
  },
];

export function ReasonsSection({ id }: ReasonsSectionProps) {
  return (
    <section id={id} className="bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-12">More Reasons to Learn</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-600/50 to-blue-600/50 backdrop-blur-sm rounded-lg p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all hover:transform hover:scale-105"
            >
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <reason.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-purple-100">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
