import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useUserProgress } from "../../hooks/useUserProgress";
import { useCourses } from "../../hooks/useCourses";
import { parseMarkdownLessons } from "../../utils/parseMarkdown";
import { markdownFiles } from "../../data/markdowns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../app/components/ui/card";
import { Button } from "../../app/components/ui/button";
import {
    Brain,
    BookOpen,
    TrendingUp,
    LogOut,
    Award,
} from "lucide-react";
import { logout } from "../../services/authService";


export function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { progress } = useUserProgress();
    const { courses } = useCourses();

    const completedLessons = progress.completedLessons;
    const uniqueCourseIds = new Set(completedLessons.map(lesson => parseInt(lesson.split('_')[0])));
    const coursesEnrolled = uniqueCourseIds.size;
    const passedQuizzes = Object.values(progress.quizScores).filter(score => score >= 60).length;

    const enrolledCourses = courses.filter(course => uniqueCourseIds.has(course.id));

    /** Derive a friendly display name from the Firebase user object */
    const displayName: string =
        user?.displayName ??
        user?.email?.split("@")[0] ??
        "Student";

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* ── Top Nav ───────────────────────────────────────── */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-1.5 shadow-lg">
                        <Brain className="text-white" size={22} />
                    </div>
                    <span className="text-xl font-extrabold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        NeuroNexus
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors"
                >
                    <LogOut size={16} />
                    Sign out
                </button>
            </header>

            {/* ── Main Content ──────────────────────────────────── */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* Welcome Banner */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Welcome back,{" "}
                        <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                            {displayName}
                        </span>{" "}
                        👋
                    </h1>
                    <p className="text-purple-300 mt-2 text-sm sm:text-base">
                        Continue where you left off and keep building your stroke awareness expertise.
                    </p>
                </div>

                {/* ── Stats Row ─────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: BookOpen, label: "Courses Started", value: coursesEnrolled.toString() },
                        { icon: Award, label: "Quizzes Passed", value: passedQuizzes.toString() },
                    ].map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col gap-2 hover:bg-white/15 transition-colors"
                        >
                            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg w-10 h-10 flex items-center justify-center shadow">
                                <Icon className="text-white" size={20} />
                            </div>
                            <div className="text-2xl font-bold text-white">{value}</div>
                            <div className="text-xs text-purple-300">{label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Enrolled Courses ───────────────────────────────── */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-2">Your Courses</h2>
                    {enrolledCourses.length > 0 ? (
                        enrolledCourses.map(course => {
                            let totalLessons = 0;
                            if (course.markdownFile && markdownFiles[course.markdownFile]) {
                                totalLessons = parseMarkdownLessons(markdownFiles[course.markdownFile]).length;
                            } else if (course.lessons) {
                                totalLessons = course.lessons.length;
                            }

                            const courseCompletedCount = completedLessons.filter(key => key.startsWith(`${course.id}_`)).length;
                            const progressPercent = totalLessons > 0 ? Math.round((courseCompletedCount / totalLessons) * 100) : 0;

                            return (
                                <Card key={course.id} className="bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl text-white overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold text-white">
                                            {course.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {/* Progress Bar */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-purple-300">Course Progress</span>
                                                <span className="text-white">{progressPercent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                            <Button
                                                variant="outline"
                                                onClick={() => navigate(`/course/${course.id}`)}
                                                className="flex-1 h-11 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold transition-all duration-200"
                                            >
                                                <TrendingUp size={16} />
                                                Continue Learning
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-purple-300 mb-4">You haven't started any courses yet.</p>
                            <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700 text-white">
                                Browse Courses
                            </Button>
                        </div>
                    )}
                </div>


            </main>
        </div>
    );
}
