import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
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
    Settings,
    Bell,
    Search,
    LogOut,
    MoreVertical,
    Activity,
    ShieldAlert,
    Menu,
    X,
    Loader2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────
interface UserRecord {
    id: string;
    email: string;
    role: string;
    status: string;
}

interface StatCard {
    icon: any;
    label: string;
    value: string;
}

export function Admin() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch users from Firestore ──────────────────────────
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                const fetched: UserRecord[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    email: doc.data().email ?? "—",
                    role: doc.data().role ?? "student",
                    status: doc.data().status ?? "Active",
                }));
                setUsers(fetched);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // ── Compute stats from live data ────────────────────────
    const stats: StatCard[] = [
        { icon: Users, label: "Total Users", value: users.length.toString() },
        {
            icon: Activity,
            label: "Active Users",
            value: users.filter((u) => u.status === "Active").length.toString(),
        },
        {
            icon: FileText,
            label: "Instructors",
            value: users
                .filter((u) => u.role.toLowerCase() === "instructor" || u.role.toLowerCase() === "admin")
                .length.toString(),
        },
    ];

    // Reusable Nav Item
    const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
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
                            Admin Panel
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={Users} label="Users Management" />
                    <NavItem icon={FileText} label="Content & Courses" />
                    <NavItem icon={ShieldAlert} label="Reports" />
                    <NavItem icon={Settings} label="Settings" />
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
                                    Admin
                                </span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} className="text-purple-300" />
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                            <NavItem icon={LayoutDashboard} label="Dashboard" active />
                            <NavItem icon={Users} label="Users Management" />
                            <NavItem icon={FileText} label="Content & Courses" />
                            <NavItem icon={ShieldAlert} label="Reports" />
                            <NavItem icon={Settings} label="Settings" />
                        </nav>
                    </aside>
                </div>
            )}

            {/* ── Main Content Area ─────────────────────────────── */}
            <main className="flex-1 flex flex-col relative z-10 w-full">

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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search users, courses..."
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
                                <p className="text-xs text-purple-300">admin@strokeaware</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 border-2 border-white/20 flex items-center justify-center font-bold shadow-lg">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 space-y-8 overflow-y-auto">

                    {/* Page Title */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
                        <p className="text-purple-300 mt-1">Monitor site activity and user engagement.</p>
                    </div>

                    {/* ── Stats Cards ───────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="md:col-span-3 flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-purple-300" size={28} />
                                <span className="ml-3 text-purple-300">Loading stats...</span>
                            </div>
                        ) : (
                            stats.map((stat, idx) => (
                                <Card key={idx} className="bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-white">
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

                    {/* ── Recent Users Table ────────────────────────── */}
                    <Card className="bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-white">
                        <CardHeader className="border-b border-white/10 pb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-white">Recent Users</CardTitle>
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
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Loader2 className="animate-spin text-purple-300" size={22} />
                                                    <span className="text-purple-300">Loading users...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-purple-300">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-white">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-full text-xs border border-white/10">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.status === 'Active' ? 'text-green-400' : 'text-gray-400'}`}>
                                                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-purple-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                </div>
            </main>
        </div>
    );
}
