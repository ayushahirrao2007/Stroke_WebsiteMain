import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    BookOpen,
    Brain,
    ChevronRight,
    AlertCircle,
    X,
    List,
} from 'lucide-react';
import hypertensionMd from '../data/Stroke Info/Hypertension-role.md?raw';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface StrokeSection {
    id: number;
    title: string;
    content: string;
}

/* ─────────────────────────────────────────────────────────────
   Parser  — splits the TXT file into logical sections
───────────────────────────────────────────────────────────── */
function parseIntoSections(raw: string): StrokeSection[] {
    const rawLines = raw.split(/\r?\n/);
    const sections: StrokeSection[] = [];
    let current: StrokeSection | null = null;
    let sectionCounter = 0;

    for (const rawLine of rawLines) {
        const line = rawLine;
        
        // Match ONLY # headings for main topics
        const isHeading = /^#\s/.test(line);

        // Skip anything before the first heading
        if (!current && !isHeading) {
            continue;
        }

        // Found a section heading
        if (isHeading) {
            if (current) {
                sections.push(current);
            }
            sectionCounter++;
            current = {
                id: sectionCounter,
                title: line.replace(/^#\s*/, '').trim(),
                content: '',
            };
            continue;
        }

        // Accumulate lines if we are inside a section
        if (current) {
            current.content += (current.content ? '\n' : '') + line;
        }
    }

    if (current) {
        sections.push(current);
    }

    return sections;
}

/* ─────────────────────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────────────────────── */
export default function CVSPage() {
    const navigate = useNavigate();
    const [sections, setSections] = useState<StrokeSection[]>([]);
    const [activeSection, setActiveSection] = useState<StrokeSection | null>(null);
    const [readIds, setReadIds] = useState<Set<number>>(new Set());

    // ── Mobile sidebar drawer state ─────────────────────────────────
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        try {
            const parsed = parseIntoSections(hypertensionMd);
            setSections(parsed);
            if (parsed.length > 0) setActiveSection(parsed[0]);
        } catch (err) {
            console.error("Failed to load CVS info:", err);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isSidebarOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isSidebarOpen]);

    const completedCount = readIds.size;
    const totalSections = sections.length;
    const progressPercent = totalSections
        ? Math.round((completedCount / totalSections) * 100)
        : 0;

    const isActiveRead = activeSection ? readIds.has(activeSection.id) : false;

    const markRead = () => {
        if (!activeSection) return;
        setReadIds(prev => new Set(prev).add(activeSection.id));
        const currentIdx = sections.findIndex(s => s.id === activeSection.id);
        const next = sections[currentIdx + 1];
        if (next) {
            setActiveSection(next);
            window.scrollTo(0, 0);
        }
    };

    // Select a section and close the mobile drawer
    const selectSection = (section: StrokeSection) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
        window.scrollTo(0, 0);
    };

    // ── Shared section list — desktop sidebar + mobile drawer ──
    const SectionList = () => (
        <nav className="p-2 space-y-1" aria-label="Guide sections">
            {sections.map((section, index) => {
                const isActive = activeSection?.id === section.id;
                const isDone = readIds.has(section.id);
                return (
                    <button
                        key={section.id}
                        onClick={() => selectSection(section)}
                        className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-white/15 border border-white/20'
                            : 'hover:bg-white/10 border border-transparent'
                            }`}
                    >
                        {/* Status icon */}
                        <div className="mt-0.5 shrink-0">
                            {isDone ? (
                                <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                                <Circle
                                    size={18}
                                    className={isActive ? 'text-purple-300' : 'text-white/30 group-hover:text-purple-400'}
                                />
                            )}
                        </div>

                        {/* Section info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isActive ? 'text-purple-300' : 'text-white/40'}`}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <p className={`text-sm font-medium leading-snug mt-0.5 ${isActive ? 'text-white' : 'text-purple-200 group-hover:text-white'}`}>
                                {section.title}
                            </p>
                        </div>

                        {isActive && (
                            <ChevronRight size={14} className="text-purple-400 shrink-0 mt-1" />
                        )}
                    </button>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* ── Top Bar ── */}
            <header className="relative z-10 flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors shrink-0 min-h-[44px]"
                    aria-label="Go back"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <div className="h-4 w-px bg-white/20 shrink-0" />
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Brain className="text-purple-400 shrink-0" size={18} />
                    <h1 className="text-white font-bold truncate text-sm sm:text-base">
                        CVS & Hypertension — Complete Guide
                    </h1>
                </div>
                {/* Progress pill */}
                <div className="ml-auto shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <span className="text-xs text-purple-300 font-medium">
                        {completedCount}/{totalSections}
                    </span>
                    <span className="text-xs font-bold text-white">{progressPercent}%</span>
                </div>
            </header>

            {/* ── Mobile: Sticky Sections Toggle Bar ─────────────────
                 Visible below lg. Provides quick access to the drawer
                 without having to scroll past all content. */}
            <div className="lg:hidden sticky top-0 z-30 bg-purple-900/90 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-purple-300 font-medium truncate max-w-[55%]">
                    {activeSection ? activeSection.title : 'Select a section'}
                </span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors shrink-0"
                    aria-label="Open sections list"
                >
                    <List size={14} />
                    Sections ({totalSections})
                </button>
            </div>

            {/* ── Mobile Drawer Overlay ───────────────────── */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Mobile Drawer Panel (slides up from bottom) ─ */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-900 to-indigo-900 border-t border-white/15 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '75vh', overflowY: 'auto' }}
                role="dialog"
                aria-modal="true"
                aria-label="Guide sections"
            >
                <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen size={14} />
                        Guide Sections
                    </h2>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-purple-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors"
                        aria-label="Close sections"
                    >
                        <X size={20} />
                    </button>
                </div>
                <SectionList />
            </div>

            {/* ── Main Split Layout ── */}
            <div className="relative z-10 flex flex-col lg:flex-row gap-0">

                {/* ── LEFT: Section Sidebar (desktop only) ── */}
                <aside className="hidden lg:block lg:w-80 xl:w-96 shrink-0 border-r border-white/10">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen size={14} />
                            Guide Sections
                        </h2>
                    </div>
                    <SectionList />
                </aside>

                {/* ── RIGHT: Section Content ── */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {activeSection ? (
                        <div className="max-w-3xl mx-auto space-y-6">

                            {/* Section Header Card */}
                            <Card className="bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl">
                                <CardHeader className="pb-3">
                                    {isActiveRead && (
                                        <div className="flex items-center gap-2 text-xs text-green-400 mb-2">
                                            <CheckCircle2 size={12} />
                                            <span>Read</span>
                                        </div>
                                    )}
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                        {activeSection.title}
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            {/* Section Body Card */}
                            <Card className="bg-white/8 backdrop-blur-sm border border-white/12">
                                <CardContent className="pt-6 pb-6 text-purple-100">
                                    <div className="prose prose-invert max-w-none prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:marker:text-purple-400">
                                        <ReactMarkdown>
                                            {activeSection.content}
                                        </ReactMarkdown>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions row */}
                            <div className="flex items-center gap-3 flex-wrap pb-6">
                                {isActiveRead ? (
                                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
                                        <CheckCircle2 size={18} />
                                        Section Read
                                    </div>
                                ) : (
                                    <Button
                                        onClick={markRead}
                                        className="h-11 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                    >
                                        <CheckCircle2 size={16} />
                                        Mark as Read
                                    </Button>
                                )}

                                {/* Next section button */}
                                {(() => {
                                    const currentIdx = sections.findIndex(s => s.id === activeSection.id);
                                    const next = sections[currentIdx + 1];
                                    return next ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setActiveSection(next);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
                                        >
                                            Next Section
                                            <ChevronRight size={16} />
                                        </Button>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    ) : (
                        sections.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-purple-300 py-12">
                                <AlertCircle size={32} className="opacity-50 mb-4 mx-auto" />
                                <p className="text-center font-medium">No guide content available.</p>
                            </div>
                        ) : null
                    )}
                </main>
            </div>
        </div>
    );
}
