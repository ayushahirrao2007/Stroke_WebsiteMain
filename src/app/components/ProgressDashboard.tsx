import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CourseProgress {
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export function ProgressDashboard() {
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([0, 0, 0]);

  const courses: CourseProgress[] = [
    {
      title: 'Ischemic Stroke',
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
    },
    {
      title: 'Hemorrhagic Stroke',
      progress: 30,
      totalLessons: 10,
      completedLessons: 3,
    },
    {
      title: 'Cortical Ischemia Stroke',
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
    },
  ];

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses Enrolled',
      value: '6',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Award,
      label: 'Certificates Earned',
      value: '1',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      label: 'Hours Watched',
      value: '12.5',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: TrendingUp,
      label: 'Learning Streak',
      value: '5 days',
      color: 'from-violet-500 to-violet-600',
    },
  ];

  useEffect(() => {
    // Animate progress bars
    const intervals: ReturnType<typeof setInterval>[] = [];

    courses.forEach((course, index) => {
      setTimeout(() => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2;
          setAnimatedProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = Math.min(progress, course.progress);
            return newProgress;
          });
          if (progress >= course.progress) {
            clearInterval(interval);
          }
        }, 20);
        intervals.push(interval);
      }, index * 200);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-purple-900 mb-2">Your Learning Progress</h2>
          <p className="text-purple-700">Track your journey to becoming a stroke care expert</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${stat.color} rounded-lg w-12 h-12 flex items-center justify-center mb-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">{stat.value}</div>
              <div className="text-sm text-purple-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-purple-900 mb-6">Continue Learning</h3>

          <div className="space-y-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="group hover:bg-purple-50 p-4 rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 group-hover:text-purple-700 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-sm text-purple-600 mt-1">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {course.progress}%
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="relative h-3 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${animatedProgress[index] || 0}%` }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Continue Button on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-all mt-3">
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2">
                    Continue Learning →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}