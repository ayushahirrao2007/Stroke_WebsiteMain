import { useState, useEffect, useRef, useContext } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../app/components/ui/card";
import { Button } from "../../app/components/ui/button";
import {
    Brain,
    Users,
    FileText,
    LayoutDashboard,
    Bell,
    Search,
    LogOut,
    MoreVertical,
    Activity,
    Menu,
    X,
    Loader2,
    Trash2,
    AlertTriangle,
    BookOpen,
    Award,
    TrendingUp,
} from "lucide-react";
import { courses } from "../../data/courses";
import { markdownFiles } from "../../data/markdowns";
import { parseMarkdownLessons } from "../../utils/parseMarkdown";
import { AuthContext } from "../../context/AuthContext";

// ── Pre-compute total lesson count per course (module-level, runs once) ─────
const COURSE_LESSON_COUNTS: Record<number, number> = {};
const COURSE_TITLES: Record<number, string> = {};

for (const course of courses) {
    COURSE_TITLES[course.id] = course.title;
    if (course.markdownFile && markdownFiles[course.markdownFile]) {
        COURSE_LESSON_COUNTS[course.id] = parseMarkdownLessons(
            markdownFiles[course.markdownFile]
        ).length;
    } else {
        COURSE_LESSON_COUNTS[course.id] = course.lessons?.length ?? 0;
    }
}

const TOTAL_LESSONS = Object.values(COURSE_LESSON_COUNTS).reduce(
    (sum, n) => sum + n,
    0
);

// ── Types ────────────────────────────────────────────────────
interface UserRecord {
    id: string;
    email: string;
    role: string;
    status: string;
    completedLessons: string[];
    quizScores: Record<string, number>;
}

interface StatCard {
    icon: any;
    label: string;
    value: string;
}

// ── Helper: overall progress percentage ─────────────────────
function overallProgress(completedLessons: string[]): number {
    if (TOTAL_LESSONS === 0) return 0;
    return Math.round((completedLessons.length / TOTAL_LESSONS) * 100);
}

// ── Helper: per-course progress ──────────────────────────────
function courseProgress(
    courseId: number,
    completedLessons: string[]
): { completed: number; total: number; pct: number } {
    const total = COURSE_LESSON_COUNTS[courseId] ?? 0;
    const completed = completedLessons.filter((k) =>
        k.startsWith(`${courseId}_`)
    ).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct };
}

// ── Small progress bar component ─────────────────────────────
function MiniBar({ pct, color = "from-purple-400 to-blue-400" }: { pct: number; color?: string }) {
    return (
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────
export function Admin() {
    const { user } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Actions menu
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Confirmation dialog
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // User detail panel
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    // ── Close menu on outside click ──────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Fetch users from Firestore ───────────────────────────
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                const fetched: UserRecord[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        email: data.email ?? "—",
                        role: data.role ?? "student",
                        status: data.status ?? "Active",
                        completedLessons: data.progress?.completedLessons ?? [],
                        quizScores: data.progress?.quizScores ?? {},
                    };
                });
                setUsers(fetched);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // ── Delete user ──────────────────────────────────────────
    const handleRemoveUser = async () => {
        if (!confirmDeleteId) return;
        setDeleting(true);
        try {
            // Delete Firestore user document
            await deleteDoc(doc(db, "users", confirmDeleteId));
            // Note: Firebase Auth account deletion requires Admin SDK / Cloud Function
            // and cannot be done safely from the client for accounts other than the
            // currently signed-in user. Structure is ready for backend integration.
            setUsers((prev) => prev.filter((u) => u.id !== confirmDeleteId));
            if (selectedUser?.id === confirmDeleteId) setSelectedUser(null);
        } catch (error) {
            console.error("Failed to remove user:", error);
        } finally {
            setDeleting(false);
            setConfirmDeleteId(null);
        }
    };

    // ── Filtered users ───────────────────────────────────────
    const filteredUsers = users.filter(
        (u) =>
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Stats ────────────────────────────────────────────────
    const stats: StatCard[] = [
        { icon: Users, label: "Total Users", value: users.length.toString() },
        {
            icon: Activity,
            label: "Active Users",
            value: users.filter((u) => u.status === "Active").length.toString(),
        },
        {
            icon: FileText,
            label: "Instructors / Admins",
            value: users
                .filter(
                    (u) =>
                        u.role.toLowerCase() === "instructor" ||
                        u.role.toLowerCase() === "admin"
                )
                .length.toString(),
        },
    ];

    // ── Nav Item ─────────────────────────────────────────────
    const NavItem = ({
        icon: Icon,
        label,
        active = false,
    }: {
        icon: any;
        label: string;
        active?: boolean;
    }) => (
        <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                    ? "bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white font-medium border border-white/10"
                    : "text-purple-300 hover:bg-white/10 hover:text-white"
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    // ── Confirmation Dialog ──────────────────────────────────
    const confirmUser = users.find((u) => u.id === confirmDeleteId);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
            {/* Background decorative blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* ── Sidebar (Desktop) ─────────────────────────────── */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl relative z-10">
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-2 shadow-lg">
                            <Brain className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                            NeuroNexus
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Mobile Sidebar Overlay ────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="relative w-64 max-w-sm flex-col border-r border-white/10 bg-[#120a2e] flex z-50 animate-in slide-in-from-left">
                        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-1.5 shadow-lg">
                                    <Brain className="text-white" size={20} />
                                </div>
                                <span className="text-xl font-extrabold text-white">
                                    NeuroNexus
                                </span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} className="text-purple-300" />
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                            <NavItem icon={LayoutDashboard} label="Dashboard" active />
                        </nav>
                    </aside>
                </div>
            )}

            {/* ── Main Content Area ─────────────────────────────── */}
            <main className="flex-1 flex flex-col relative z-10 w-full min-w-0">

                {/* ── Top Header ────────────────────────────────── */}
                <header className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-purple-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="relative hidden md:block w-72">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search users, courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="relative text-purple-300 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                        </button>

                        <div className="flex items-center gap-3 pl-5 border-l border-white/10">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-white">System Admin</p>
                                <p className="text-xs text-purple-300">{user?.email || ""}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 border-2 border-white/20 flex items-center justify-center font-bold shadow-lg">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 space-y-8 overflow-y-auto">

                    {/* Page Title & Actions */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
                            <p className="text-purple-300 mt-1">Monitor site activity and user engagement.</p>
                        </div>
                        <Button
                            onClick={async () => {
                                const { seedDatabase } = await import("../../utils/seedDatabase");
                                await seedDatabase();
                                alert("Database seeded! Check console for details.");
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                        >
                            Seed Database
                        </Button>
                    </div>

                    {/* ── Stats Cards ─────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="md:col-span-3 flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-purple-300" size={28} />
                                <span className="ml-3 text-purple-300">Loading stats...</span>
                            </div>
                        ) : (
                            stats.map((stat, idx) => (
                                <Card
                                    key={idx}
                                    className="bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-white"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between pb-4">
                                            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg w-12 h-12 flex items-center justify-center shadow-lg">
                                                <stat.icon className="text-white" size={24} />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                                        <p className="text-purple-300 text-sm mt-1">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* ── Users Table + Detail Panel layout ───────── */}
                    <div className={`flex gap-6 ${selectedUser ? "flex-col xl:flex-row" : ""}`}>

                        {/* ── Users Table ─────────────────────────── */}
                        <div className={selectedUser ? "xl:flex-1 min-w-0" : "w-full"}>
                            <Card className="bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-white">
                                <CardHeader className="border-b border-white/10 pb-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-white">
                                                Recent Users
                                            </CardTitle>
                                            <CardDescription className="text-purple-300 mt-1">
                                                Latest registered accounts on the platform
                                            </CardDescription>
                                        </div>
                                        <Button
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                            size="sm"
                                        >
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-purple-300 font-medium border-b border-white/10">
                                            <tr>
                                                <th className="px-6 py-4">User</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Progress</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Loader2
                                                                className="animate-spin text-purple-300"
                                                                size={22}
                                                            />
                                                            <span className="text-purple-300">
                                                                Loading users...
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-12 text-center text-purple-300"
                                                    >
                                                        {searchQuery
                                                            ? "No users match your search."
                                                            : "No users found."}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredUsers.map((user) => {
                                                    const pct = overallProgress(user.completedLessons);
                                                    const isSelected = selectedUser?.id === user.id;
                                                    return (
                                                        <tr
                                                            key={user.id}
                                                            className={`border-b border-white/5 transition-colors cursor-pointer ${isSelected
                                                                    ? "bg-purple-600/20"
                                                                    : "hover:bg-white/5"
                                                                }`}
                                                            onClick={() =>
                                                                setSelectedUser(
                                                                    isSelected ? null : user
                                                                )
                                                            }
                                                        >
                                                            {/* Email */}
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                                        {user.email[0]?.toUpperCase() ?? "?"}
                                                                    </div>
                                                                    <span className="font-semibold text-white truncate max-w-[160px]">
                                                                        {user.email}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Role */}
                                                            <td className="px-6 py-4">
                                                                <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-full text-xs border border-white/10">
                                                                    {user.role}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3 min-w-[120px]">
                                                                    <div className="flex-1">
                                                                        <MiniBar pct={pct} />
                                                                    </div>
                                                                    <span
                                                                        className={`text-xs font-bold shrink-0 ${pct === 100
                                                                                ? "text-green-400"
                                                                                : pct >= 50
                                                                                    ? "text-blue-300"
                                                                                    : "text-purple-300"
                                                                            }`}
                                                                    >
                                                                        {pct}%
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Status */}
                                                            <td className="px-6 py-4">
                                                                <span
                                                                    className={`flex items-center gap-1.5 text-xs font-semibold ${user.status === "Active"
                                                                            ? "text-green-400"
                                                                            : "text-gray-400"
                                                                        }`}
                                                                >
                                                                    <span
                                                                        className={`w-2 h-2 rounded-full ${user.status === "Active"
                                                                                ? "bg-green-400"
                                                                                : "bg-gray-400"
                                                                            }`}
                                                                    />
                                                                    {user.status}
                                                                </span>
                                                            </td>

                                                            {/* Actions */}
                                                            <td
                                                                className="px-6 py-4 text-right"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="relative inline-block" ref={openMenuId === user.id ? menuRef : undefined}>
                                                                    <button
                                                                        id={`actions-btn-${user.id}`}
                                                                        className="p-2 text-purple-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                                                        onClick={() =>
                                                                            setOpenMenuId(
                                                                                openMenuId === user.id
                                                                                    ? null
                                                                                    : user.id
                                                                            )
                                                                        }
                                                                        aria-label="User actions"
                                                                        aria-expanded={openMenuId === user.id}
                                                                    >
                                                                        <MoreVertical size={16} />
                                                                    </button>

                                                                    {/* Dropdown */}
                                                                    {openMenuId === user.id && (
                                                                        <div className="absolute right-0 mt-1 w-44 bg-[#1e1040] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                                            <button
                                                                                id={`view-details-${user.id}`}
                                                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-purple-200 hover:bg-white/10 hover:text-white transition-colors text-left"
                                                                                onClick={() => {
                                                                                    setSelectedUser(user);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                            >
                                                                                <BookOpen size={14} />
                                                                                View Details
                                                                            </button>
                                                                            <div className="h-px bg-white/10 mx-3" />
                                                                            <button
                                                                                id={`remove-user-${user.id}`}
                                                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors text-left"
                                                                                onClick={() => {
                                                                                    setConfirmDeleteId(user.id);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                            >
                                                                                <Trash2 size={14} />
                                                                                Remove User
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        {/* ── User Detail Panel ────────────────────── */}
                        {selectedUser && (
                            <div className="xl:w-96 shrink-0">
                                <Card className="bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl text-white sticky top-28">
                                    {/* Header */}
                                    <CardHeader className="border-b border-white/10 pb-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
                                                    {selectedUser.email[0]?.toUpperCase() ?? "?"}
                                                </div>
                                                <div className="min-w-0">
                                                    <CardTitle className="text-sm font-bold text-white truncate">
                                                        {selectedUser.email}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="bg-white/10 text-purple-200 px-2 py-0.5 rounded-full text-xs border border-white/10">
                                                            {selectedUser.role}
                                                        </span>
                                                        <span
                                                            className={`flex items-center gap-1 text-xs font-semibold ${selectedUser.status === "Active"
                                                                    ? "text-green-400"
                                                                    : "text-gray-400"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === "Active"
                                                                        ? "bg-green-400"
                                                                        : "bg-gray-400"
                                                                    }`}
                                                            />
                                                            {selectedUser.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedUser(null)}
                                                className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                                                aria-label="Close detail panel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 space-y-5 max-h-[calc(100vh-18rem)] overflow-y-auto">

                                        {/* Overall Progress */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <TrendingUp size={14} className="text-purple-400" />
                                                <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                                    Overall Progress
                                                </h3>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-purple-300">
                                                        {selectedUser.completedLessons.length} / {TOTAL_LESSONS} lessons
                                                    </span>
                                                    <span
                                                        className={`text-lg font-extrabold ${overallProgress(selectedUser.completedLessons) === 100
                                                                ? "text-green-400"
                                                                : overallProgress(selectedUser.completedLessons) >= 50
                                                                    ? "text-blue-300"
                                                                    : "text-purple-300"
                                                            }`}
                                                    >
                                                        {overallProgress(selectedUser.completedLessons)}%
                                                    </span>
                                                </div>
                                                <MiniBar
                                                    pct={overallProgress(selectedUser.completedLessons)}
                                                    color={
                                                        overallProgress(selectedUser.completedLessons) === 100
                                                            ? "from-green-400 to-emerald-400"
                                                            : "from-purple-400 to-blue-400"
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Course-wise Progress */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen size={14} className="text-purple-400" />
                                                <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                                    Course Progress
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {courses.map((course) => {
                                                    const { completed, total, pct } = courseProgress(
                                                        course.id,
                                                        selectedUser.completedLessons
                                                    );
                                                    return (
                                                        <div
                                                            key={course.id}
                                                            className="bg-white/5 rounded-xl p-3 border border-white/10"
                                                        >
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <span className="text-xs font-medium text-white truncate max-w-[70%]">
                                                                    {course.title}
                                                                </span>
                                                                <span
                                                                    className={`text-xs font-bold shrink-0 ml-2 ${pct === 100
                                                                            ? "text-green-400"
                                                                            : pct > 0
                                                                                ? "text-blue-300"
                                                                                : "text-white/30"
                                                                        }`}
                                                                >
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                            <MiniBar
                                                                pct={pct}
                                                                color={
                                                                    pct === 100
                                                                        ? "from-green-400 to-emerald-400"
                                                                        : pct > 0
                                                                            ? "from-purple-400 to-blue-400"
                                                                            : "from-white/10 to-white/10"
                                                                }
                                                            />
                                                            <div className="text-xs text-purple-400 mt-1">
                                                                {completed} / {total} lessons
                                                                {pct === 100 && (
                                                                    <span className="ml-2 text-green-400 font-semibold">
                                                                        ✓ Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Quiz Scores */}
                                        {Object.keys(selectedUser.quizScores).length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Award size={14} className="text-purple-400" />
                                                    <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                                        Quiz Scores
                                                    </h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {Object.entries(selectedUser.quizScores).map(
                                                        ([courseId, score]) => {
                                                            const title =
                                                                COURSE_TITLES[Number(courseId)] ??
                                                                `Course ${courseId}`;
                                                            const passed = score >= 60;
                                                            return (
                                                                <div
                                                                    key={courseId}
                                                                    className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between"
                                                                >
                                                                    <span className="text-xs font-medium text-white truncate max-w-[65%]">
                                                                        {title}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <span
                                                                            className={`text-xs font-bold ${passed
                                                                                    ? "text-green-400"
                                                                                    : "text-red-400"
                                                                                }`}
                                                                        >
                                                                            {score}%
                                                                        </span>
                                                                        <span
                                                                            className={`text-xs px-2 py-0.5 rounded-full border ${passed
                                                                                    ? "bg-green-500/20 border-green-500/30 text-green-300"
                                                                                    : "bg-red-500/20 border-red-500/30 text-red-300"
                                                                                }`}
                                                                        >
                                                                            {passed ? "Passed" : "Failed"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Remove User button in detail panel */}
                                        <div className="pt-2 border-t border-white/10">
                                            <button
                                                id={`detail-remove-${selectedUser.id}`}
                                                onClick={() => setConfirmDeleteId(selectedUser.id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-xl border border-red-500/20 transition-all"
                                            >
                                                <Trash2 size={14} />
                                                Remove User
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {/* ── Confirmation Dialog ──────────────────────────── */}
            {confirmDeleteId && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={() => !deleting && setConfirmDeleteId(null)}
                >
                    <div
                        className="bg-[#1a0e3d] border border-white/15 rounded-2xl shadow-2xl w-full max-w-md p-7 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-5">
                            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                <AlertTriangle size={28} className="text-red-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white text-center mb-2">
                            Remove User?
                        </h2>

                        {/* Body */}
                        <p className="text-purple-300 text-sm text-center mb-2">
                            Are you sure you want to remove:
                        </p>
                        <p className="text-white font-semibold text-sm text-center bg-white/10 rounded-lg px-4 py-2 mb-5 truncate">
                            {confirmUser?.email ?? confirmDeleteId}
                        </p>
                        <p className="text-red-400/80 text-xs text-center mb-7">
                            This action cannot be undone. The user's Firestore record will be permanently deleted.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                id="confirm-cancel-btn"
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-remove-btn"
                                onClick={handleRemoveUser}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Remove
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
