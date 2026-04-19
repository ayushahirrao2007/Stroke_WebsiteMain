import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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
} from 'lucide-react';

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

        // Skip anything before the first heading
        if (!current && !line.startsWith('# ')) {
            continue;
        }

        // Found a section heading
        if (line.startsWith('# ')) {
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
export default function BrainStrokePage() {
    const navigate = useNavigate();
    const [sections, setSections] = useState<StrokeSection[]>([]);
    const [activeSection, setActiveSection] = useState<StrokeSection | null>(null);
    const [readIds, setReadIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Statically import the Markdown file to ensure it bundles securely on Vercel
        import('../data/Stroke Info/Stroke-info.md?raw')
            .then((module) => {
                const parsed = parseIntoSections(module.default);
                setSections(parsed);
                // FAILSAFE: Automatically bind to first segment
                if (parsed.length > 0) setActiveSection(parsed[0]);
            })
            .catch((err) => {
                console.error("Failed to load stroke info:", err);
            });
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* ── Top Bar ── */}
            <header className="relative z-10 flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2 min-w-0">
                    <Brain className="text-purple-400 shrink-0" size={18} />
                    <h1 className="text-white font-bold truncate text-sm sm:text-base">
                        Brain Stroke — Complete Guide
                    </h1>
                </div>
                {/* Progress pill */}
                <div className="ml-auto shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <span className="text-xs text-purple-300 font-medium">
                        {completedCount}/{totalSections} sections
                    </span>
                    <span className="text-xs font-bold text-white">{progressPercent}%</span>
                </div>
            </header>

            {/* ── Main Split Layout ── */}
            <div className="relative z-10 flex flex-col lg:flex-row gap-0">

                {/* ── LEFT: Section Sidebar ── */}
                <aside className="lg:w-80 xl:w-96 shrink-0 border-r border-white/10 order-last lg:order-first mt-8 lg:mt-0">
                    <div className="p-4 border-t lg:border-t-0 border-b border-white/10">
                        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen size={14} />
                            Guide Sections
                        </h2>
                    </div>
                    <nav className="p-2 space-y-1">
                        {sections.map((section, index) => {
                            const isActive = activeSection?.id === section.id;
                            const isDone = readIds.has(section.id);
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSection(section);
                                        if (window.innerWidth < 1024) window.scrollTo(0, 0);
                                    }}
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
                </aside>

                {/* ── RIGHT: Section Content ── */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 order-first lg:order-last">
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
                                        {(() => {
                                          console.log(activeSection.content);
                                          const cleanContent = activeSection.content
                                            .replace(/&lt;/g, "<")
                                            .replace(/&gt;/g, ">");
                                          const moveImagesPlugin = () => (tree: any) => {
                                            let lastInsertionIndex = 0;
                                            for (let i = 0; i < tree.children.length; i++) {
                                              const node = tree.children[i];
                                              if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
                                                lastInsertionIndex = i;
                                              } else if (node.type === 'element' && node.tagName === 'p') {
                                                const images: any[] = [];
                                                const others: any[] = [];
                                                (node.children || []).forEach((child: any) => {
                                                  if (child.type === 'element' && child.tagName === 'img') {
                                                    images.push(child);
                                                  } else {
                                                    others.push(child);
                                                  }
                                                });
                                                if (images.length > 0) {
                                                  node.children = others;
                                                  tree.children.splice(lastInsertionIndex + 1, 0, ...images);
                                                  i += images.length;
                                                  lastInsertionIndex += images.length;
                                                }
                                              } else if (node.type === 'element' && node.tagName === 'img') {
                                                if (i > lastInsertionIndex + 1) {
                                                  tree.children.splice(i, 1);
                                                  tree.children.splice(lastInsertionIndex + 1, 0, node);
                                                  lastInsertionIndex++;
                                                } else {
                                                  lastInsertionIndex = i;
                                                }
                                              }
                                            }
                                          };
                                            
                                          return (
                                            <ReactMarkdown 
                                                rehypePlugins={[rehypeRaw, moveImagesPlugin]}
                                                components={{
                                                    h1: ({node, ...props}) => (
                                                      <h1 className="text-2xl font-bold mt-6 mb-2" {...props} />
                                                    ),
                                                    h2: ({node, ...props}) => (
                                                      <h2 className="text-xl font-semibold mt-5 mb-2" {...props} />
                                                    ),
                                                    h3: ({node, ...props}) => (
                                                      <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                                                    ),
                                                    h4: ({node, ...props}) => (
                                                      <h4 className="text-base font-semibold mt-3 mb-2" {...props} />
                                                    ),
                                                    p: ({node, ...props}) => (
                                                      <p className="mb-4" {...props} />
                                                    ),
                                                    img: ({node, ...props}) => (
                                                      <div className="my-6 flex justify-center w-full clear-both">
                                                        <img
                                                          {...props}
                                                          loading="lazy"
                                                          className="w-full max-w-xl rounded-lg block"
                                                        />
                                                      </div>
                                                    )
                                                }}
                                            >
                                                {cleanContent}
                                            </ReactMarkdown>
                                          );
                                        })()}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions row */}
                            <div className="flex items-center gap-3 flex-wrap">
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
