import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useUserProgress } from '../../hooks/useUserProgress';
import { markdownFiles } from '../../data/markdowns';
import { parseMarkdownLessons } from '../../utils/parseMarkdown';
import {
    Brain,
    Lock,
    Unlock,
    BookOpen,
    ChevronRight,
    Loader2,
    X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  QuizListPage
//  Renders from the Navbar "/quiz" route.
//  Shows every course with its per-course quiz lock/unlock state.
//  Uses the SAME per-course validation as CourseDetails:
//    completedLessons.filter(k => k.startsWith(`${courseId}_`))
// ─────────────────────────────────────────────────────────────

export function QuizListPage() {
    const navigate = useNavigate();
    const { courses, loading: coursesLoading } = useCourses();
    const { progress } = useUserProgress();
    const [lockedCourseTitle, setLockedCourseTitle] = useState<string | null>(null);
    const [lockedCourseProgress, setLockedCourseProgress] = useState({ completed: 0, total: 0 });

    // Derive per-course lesson counts and quiz access states
    const courseQuizStates = useMemo(() => {
        return courses.map((course) => {
            // Get total lessons for THIS course
            let totalLessons = 0;
            if (course.markdownFile && markdownFiles[course.markdownFile]) {
                totalLessons = parseMarkdownLessons(markdownFiles[course.markdownFile]).length;
            } else if (course.lessons) {
                totalLessons = course.lessons.length;
            }

            // Filter completedLessons by THIS course's prefix ONLY
            const coursePrefix = `${course.id}_`;
            const completedCount = progress.completedLessons.filter(
                (key) => key.startsWith(coursePrefix)
            ).length;

            const isUnlocked = totalLessons > 0 && completedCount >= totalLessons;
            const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return {
                course,
                totalLessons,
                completedCount,
                isUnlocked,
                percent,
            };
        });
    }, [courses, progress.completedLessons]);

    // ── Loading state ───────────────────────────────────────────
    if (coursesLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4">
                <Loader2 className="animate-spin text-purple-400 mb-4" size={48} />
                <p className="text-purple-300">Loading quizzes...</p>
            </div>
        );
    }

    const handleQuizClick = (state: typeof courseQuizStates[number]) => {
        if (state.isUnlocked) {
            navigate(`/course/${state.course.id}/quiz`);
        } else {
            setLockedCourseTitle(state.course.title);
            setLockedCourseProgress({ completed: state.completedCount, total: state.totalLessons });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-sm">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors"
                >
                    ← Home
                </button>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                    <Brain className="text-purple-400 shrink-0" size={18} />
                    <h1 className="text-white font-bold text-sm sm:text-base">Course Quizzes</h1>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Test Your Knowledge
                    </h2>
                    <p className="text-purple-300 mt-1 text-sm">
                        Complete all lessons in a course to unlock its quiz.
                    </p>
                </div>

                {courseQuizStates.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                        <p className="text-purple-300">No courses available.</p>
                    </div>
                ) : (
                    courseQuizStates.map((state) => (
                        <div
                            key={state.course.id}
                            onClick={() => handleQuizClick(state)}
                            className={`group bg-white/10 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-200 cursor-pointer
                                ${state.isUnlocked
                                    ? 'border-white/15 hover:bg-white/15 hover:border-purple-400/40'
                                    : 'border-white/10 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Status icon */}
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                    state.isUnlocked
                                        ? 'bg-gradient-to-br from-purple-500/40 to-blue-500/40 border border-purple-400/30'
                                        : 'bg-white/10 border border-white/10'
                                }`}>
                                    {state.isUnlocked ? (
                                        <Unlock size={22} className="text-purple-300" />
                                    ) : (
                                        <Lock size={22} className="text-white/40" />
                                    )}
                                </div>

                                {/* Course info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-sm sm:text-base truncate">
                                        {state.course.title}
                                    </h3>
                                    <p className="text-xs text-purple-300 mt-0.5">
                                        {state.isUnlocked
                                            ? 'All lessons completed — Quiz available!'
                                            : `${state.completedCount}/${state.totalLessons} lessons completed`
                                        }
                                    </p>

                                    {/* Progress bar */}
                                    {!state.isUnlocked && state.totalLessons > 0 && (
                                        <div className="mt-2 h-1.5 w-full max-w-[200px] bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500"
                                                style={{ width: `${state.percent}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Action indicator */}
                                <div className="shrink-0">
                                    {state.isUnlocked ? (
                                        <div className="flex items-center gap-1.5 text-purple-300 group-hover:text-white transition-colors">
                                            <span className="text-xs font-semibold hidden sm:inline">Start Quiz</span>
                                            <ChevronRight size={18} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-white/30">
                                            <span className="text-xs font-semibold hidden sm:inline">Locked</span>
                                            <Lock size={14} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* ── Locked Quiz Modal ────────────────────────────────── */}
            {lockedCourseTitle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setLockedCourseTitle(null)}
                    />
                    <div className="relative z-10 bg-gradient-to-br from-[#1a0a3e] to-[#0f1b4d] border border-white/15 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setLockedCourseTitle(null)}
                            className="absolute top-3 right-3 text-purple-300 hover:text-white transition-colors p-1"
                        >
                            <X size={18} />
                        </button>

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-400/30">
                            <Lock className="text-red-300" size={28} />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{lockedCourseTitle}</h3>
                        <p className="text-purple-200 text-sm leading-relaxed mb-5">
                            Complete all lessons of this course to unlock the quiz.
                        </p>

                        {/* Per-course progress */}
                        <div className="bg-white/10 rounded-xl p-3 mb-5 border border-white/10">
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className="text-purple-300 flex items-center gap-1">
                                    <BookOpen size={12} /> Progress
                                </span>
                                <span className="text-white">
                                    {lockedCourseProgress.completed}/{lockedCourseProgress.total} lessons
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500"
                                    style={{ width: `${lockedCourseProgress.total > 0 ? Math.round((lockedCourseProgress.completed / lockedCourseProgress.total) * 100) : 0}%` }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setLockedCourseTitle(null)}
                            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white
                                hover:from-purple-700 hover:to-blue-700 active:scale-95 transition-all duration-200 shadow-lg"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
