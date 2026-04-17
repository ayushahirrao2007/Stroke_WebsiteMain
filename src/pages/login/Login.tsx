import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../app/components/ui/button";
import { Input } from "../../app/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../app/components/ui/card";
import { Loader2, Brain, Mail, Lock } from "lucide-react";

const FIREBASE_ERROR_MAP: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/network-request-failed":
        "Network error. Please check your connection.",
};

function getFirebaseErrorMessage(code: string): string {
    return FIREBASE_ERROR_MAP[code] ?? "An unexpected error occurred. Please try again.";
}

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err: any) {
            const code: string = err?.code ?? "";
            setError(getFirebaseErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4 py-12">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-2 shadow-lg">
                            <Brain className="text-white" size={28} />
                        </div>
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                            StrokeAware
                        </span>
                    </div>
                    <p className="text-purple-300 text-sm">
                        Brain Stroke Education Platform
                    </p>
                </div>

                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-purple-200">
                            Sign in to continue your learning journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-lg px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-purple-200 flex items-center gap-1.5">
                                    <Mail size={14} />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/60 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-purple-200 flex items-center gap-1.5">
                                    <Lock size={14} />
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/60 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-purple-300 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-purple-200 font-semibold hover:text-white underline underline-offset-2 transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
