import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
                        StrokeAware
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
                        { icon: BookOpen, label: "Courses Enrolled", value: "1" },
                        { icon: Award, label: "Certificates", value: "0" },
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

                {/* ── Course Card ───────────────────────────────── */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl text-white overflow-hidden">
                    {/* Course thumbnail strip */}
                    <div className="h-3 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />

                    <CardHeader className="pb-2">
                        <div>
                            <CardTitle className="text-xl font-bold text-white">
                                Brain Stroke Awareness
                            </CardTitle>
                            <CardDescription className="text-purple-200 mt-1">
                                Understanding stroke symptoms, prevention & emergency response
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/progress")}
                                className="flex-1 h-11 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold transition-all duration-200"
                            >
                                <TrendingUp size={16} />
                                View Progress
                            </Button>
                        </div>
                    </CardContent>
                </Card>


            </main>
        </div>
    );
}
