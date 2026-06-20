import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import homoeopathyStrokeMd from '../data/Therapeutics/Role-of-Homoeopathy-in-Stroke-Management.md?raw';
import arnicaMontanaMd from '../data/Therapeutics/Arnica-Montana-1M.md?raw';
import lachesisMutaMd from '../data/Therapeutics/Lachesis-Muta-30C.md?raw';

interface TherapeuticsLesson {
    id: number;
    title: string;
    markdown: string;
    calloutHeading: string;
    pdfFilename: string;
}

const LESSONS: TherapeuticsLesson[] = [
    {
        id: 1,
        title: 'Role of Homoeopathy in Stroke Management',
        markdown: homoeopathyStrokeMd,
        calloutHeading: 'Note',
        pdfFilename: 'Role of Homoeopathy in Stroke Management.pdf',
    },
    {
        id: 2,
        title: 'Clinical Evaluation of Arnica Montana 1M in Post-Stroke Recovery',
        markdown: arnicaMontanaMd,
        calloutHeading: 'Disclaimer',
        pdfFilename: 'Clinical Evaluation of Arnica Montana 1M in Post-Stroke Recovery.pdf',
    },
    {
        id: 3,
        title: 'Effectiveness of Lachesis Muta 30C in Essential Hypertension',
        markdown: lachesisMutaMd,
        calloutHeading: 'Disclaimer',
        pdfFilename: 'Effectiveness of Lachesis Muta 30C in Essential Hypertension.pdf',
    },
];

function splitCalloutContent(
    raw: string,
    calloutHeading: string,
): { main: string; callout: string } {
    const marker = `# ${calloutHeading}`;
    const calloutIndex = raw.indexOf(marker);
    if (calloutIndex < 0) {
        return { main: raw.trim(), callout: '' };
    }

    const main = raw.slice(0, calloutIndex).trim();
    const callout = raw.slice(calloutIndex + marker.length).trim();

    return { main, callout };
}

function getLessonPdfUrl(pdfFilename: string): string {
    return `/PDF/${encodeURIComponent(pdfFilename)}`;
}

export default function TherapeuticsPage() {
    const navigate = useNavigate();
    const [activeLesson, setActiveLesson] = useState<TherapeuticsLesson>(LESSONS[0]);
    const [readIds, setReadIds] = useState<Set<number>>(new Set());

    const { main, callout } = useMemo(
        () => splitCalloutContent(activeLesson.markdown, activeLesson.calloutHeading),
        [activeLesson],
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeLesson.id]);

    const completedCount = readIds.size;
    const totalLessons = LESSONS.length;
    const progressPercent = totalLessons
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

    const isActiveRead = readIds.has(activeLesson.id);

    const markComplete = () => {
        setReadIds(prev => new Set(prev).add(activeLesson.id));
        const currentIdx = LESSONS.findIndex(l => l.id === activeLesson.id);
        const next = LESSONS[currentIdx + 1];
        if (next) {
            setActiveLesson(next);
            window.scrollTo(0, 0);
        }
    };

    const selectLesson = (lesson: TherapeuticsLesson) => {
        setActiveLesson(lesson);
        window.scrollTo(0, 0);
    };

    const markdownProseClass =
        'prose prose-invert max-w-none ' +
        'prose-headings:text-white prose-headings:font-bold ' +
        'prose-p:text-purple-100 prose-p:leading-relaxed ' +
        'prose-strong:text-white ' +
        'prose-ul:text-purple-100 prose-ul:list-disc prose-ul:ml-6 ' +
        'prose-ol:text-purple-100 prose-ol:list-decimal prose-ol:ml-6 ' +
        'prose-li:text-purple-100 prose-li:marker:text-purple-400';

    const renderMarkdown = (content: string) => (
        <div className={markdownProseClass}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

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
                        Homeopathic Therapeutics
                    </h1>
                </div>
                <div className="ml-auto shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <span className="text-xs text-purple-300 font-medium">
                        {completedCount}/{totalLessons}
                    </span>
                    <span className="text-xs font-bold text-white">{progressPercent}%</span>
                </div>
            </header>

            <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-0">

                <aside className="lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-r border-white/10">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen size={14} />
                            Course Lessons
                        </h2>
                    </div>

                    <nav className="p-2 space-y-1" aria-label="Course lessons">
                        {LESSONS.map((lesson, index) => {
                            const isActive = activeLesson.id === lesson.id;
                            const isDone = readIds.has(lesson.id);
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => selectLesson(lesson)}
                                    className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-white/15 border border-white/20'
                                        : 'hover:bg-white/10 border border-transparent'
                                        }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
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

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${isActive ? 'text-purple-300' : 'text-white/40'}`}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium leading-snug mt-0.5 ${isActive ? 'text-white' : 'text-purple-200 group-hover:text-white'}`}>
                                            {lesson.title}
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

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto space-y-6">

                        <Card className="bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl">
                            <CardHeader className="pb-3">
                                {isActiveRead && (
                                    <div className="flex items-center gap-2 text-xs text-green-400 mb-2">
                                        <CheckCircle2 size={12} />
                                        <span>Completed</span>
                                    </div>
                                )}
                                <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                    {activeLesson.title}
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/8 backdrop-blur-sm border border-white/12">
                            <CardContent className="pt-6 pb-6 text-purple-100 space-y-8">
                                {renderMarkdown(main)}

                                {callout && (
                                    <div>
                                        <h1 className="text-white font-bold text-2xl mb-4">
                                            {activeLesson.calloutHeading}
                                        </h1>
                                        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-5">
                                            <div className="flex items-start gap-3 mb-3">
                                                <AlertCircle size={20} className="text-amber-300 shrink-0 mt-0.5" />
                                                <p className="text-sm font-semibold text-amber-200 uppercase tracking-wide">
                                                    Important Information
                                                </p>
                                            </div>
                                            {renderMarkdown(callout)}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-8">
                                    <h2 className="text-white font-bold text-xl mb-4">
                                        More Information
                                    </h2>
                                    <a
                                        href={getLessonPdfUrl(activeLesson.pdfFilename)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                                    >
                                        <span aria-hidden="true">📄</span>
                                        More Info
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3 flex-wrap pb-6">
                            {isActiveRead ? (
                                <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
                                    <CheckCircle2 size={18} />
                                    Lesson Completed
                                </div>
                            ) : (
                                <Button
                                    onClick={markComplete}
                                    className="h-11 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                >
                                    <CheckCircle2 size={16} />
                                    Mark as Completed
                                </Button>
                            )}

                            {(() => {
                                const currentIdx = LESSONS.findIndex(l => l.id === activeLesson.id);
                                const next = LESSONS[currentIdx + 1];
                                return next ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => selectLesson(next)}
                                        className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
                                    >
                                        Next Lesson
                                        <ChevronRight size={16} />
                                    </Button>
                                ) : null;
                            })()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
