import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUserProgress } from '../hooks/useUserProgress';
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
    List,
    Stethoscope,
    X,
    FolderKanban,
} from 'lucide-react';

interface CaseSection {
    id: number;
    title: string;
    content: string;
}

interface CaseItem {
    id: string;
    title: string;
    subtitle: string;
    rawMarkdown: string;
}

// Preset metadata for established clinical case studies
const CASE_METADATA_PRESETS: Record<string, { title: string; subtitle: string }> = {
    case_01: {
        title: 'CASE 001 — The Breakfast Incident',
        subtitle: 'Acute Left MCA Cardioembolic Ischemic Stroke Encounter',
    },
    case_02: {
        title: 'CASE 002 — The Forgotten Left Side',
        subtitle: 'Acute Right MCA Ischemic Stroke with Hemispatial Neglect',
    },
    case_03: {
        title: 'CASE 003 — The Silent Left Leg',
        subtitle: 'Acute Left ACA Territory Ischemic Stroke with Abulia',
    },
    case_04: {
        title: 'CASE 004 — The World Went Dark',
        subtitle: 'Acute Left PCA Ischemic Stroke with Alexia without Agraphia',
    },
    case_05: {
        title: 'CASE 005 — Acute Bilateral Watershed Infarction',
        subtitle: 'ACA–MCA Border Zone Infarction with Man-in-the-Barrel Syndrome',
    },
    case_06: {
        title: 'CASE 006 — Acute Hypertensive Intracerebral Haemorrhage',
        subtitle: 'Acute Left Basal Ganglia Putaminal Hypertensive Bleed',
    },
    case_07: {
        title: 'CASE 007 — Acute Lobar Intracerebral Haemorrhage',
        subtitle: 'Right Parietal Lobar Bleed Secondary to Cerebral Amyloid Angiopathy',
    },
    case_08: {
        title: 'CASE 008 — Primary Intraventricular Haemorrhage',
        subtitle: 'Primary Intraventricular Bleed with Acute Obstructive Hydrocephalus',
    },
    case_09: {
        title: 'CASE 009 — Lateral Medullary (Wallenberg) Syndrome',
        subtitle: 'Acute Left PICA Territory Infarction with Crossed Sensory Deficits',
    },
    case_10: {
        title: 'CASE 010 — Superior Cerebellar Artery (SCA) Stroke',
        subtitle: 'Acute Right SCA Territory Ischemic Stroke with Severe Truncal Ataxia',
    },
    case_11: {
        title: 'CASE 011 — The Morning Collapse',
        subtitle: 'Acute Haemorrhagic Stroke Encounter',
    },
    case_12: {
        title: 'CASE 012 — The Man Who Could Not Stand',
        subtitle: 'Transient Ischaemic Attack / Brainstem Ischemia',
    },
    case_13: {
        title: 'CASE 013 — The Silent Deep Infarct',
        subtitle: 'Acute Lacunar Stroke Encounter',
    },
    case_14: {
        title: 'CASE 014 — The Warning Before the Stroke',
        subtitle: 'Transient Ischaemic Attack (TIA)',
    },
    case_15: {
        title: 'CASE 015 — The Hypertensive Brain Bleed',
        subtitle: 'Acute Haemorrhagic Stroke Encounter',
    },
    case_16: {
        title: 'CASE 016 — The Clumsy Hand Syndrome',
        subtitle: 'Acute Lacunar Stroke (Dysarthria-Clumsy Hand Syndrome)',
    },
    case_17: {
        title: 'CASE 017 — Cerebellar Stroke Encounter',
        subtitle: 'Acute Cerebellar Infarction / Vertebrobasilar Ischemia',
    },
    case_18: {
        title: 'CASE 018 — The Eye That Went Dark',
        subtitle: 'Transient Ischaemic Attack (Amaurosis Fugax)',
    },
    case_19: {
        title: 'CASE 019 — The Numb Side',
        subtitle: 'Acute Pure Sensory Lacunar Stroke',
    },
    case_20: {
        title: "CASE 020 — The Words That Wouldn't Come Out",
        subtitle: 'Transient Ischaemic Attack with Transient Expressive Aphasia',
    },
    case_21: {
        title: 'CASE 021 — Acute Cerebral Watershed Infarction',
        subtitle: 'Border-Zone / Internal Watershed Stroke Encounter',
    },
    case_22: {
        title: 'CASE 022 — Acute Bilateral Posterior Watershed Stroke',
        subtitle: 'Bilateral Posterior Watershed Infarction',
    },
    case_23: {
        title: 'CASE 023 — Acute Bilateral ACA–MCA Watershed Stroke',
        subtitle: 'Anterior Border-Zone Watershed Infarction',
    },
    case_24: {
        title: 'CASE 024 — The Weakness After Standing',
        subtitle: 'Acute Watershed Ischemic Stroke Encounter',
    },
    case_25: {
        title: 'CASE 025 — The Sudden Loss of Strength After Vomiting',
        subtitle: 'Acute Watershed Ischemic Stroke Encounter',
    },
    case_26: {
        title: 'CASE 026 — Acute Bilateral Watershed Infarction',
        subtitle: 'ACA–MCA Border Zone Infarction',
    },
    case_27: {
        title: 'CASE 027 — The Sudden Loss of Balance',
        subtitle: 'Acute Left Pontine / Brainstem Infarction',
    },
    case_28: {
        title: 'CASE 028 — The Sudden Weakness and Double Vision',
        subtitle: 'Acute Left Pontine Infarction',
    },
    case_29: {
        title: 'CASE 029 — The Sudden Drooping Eyelid',
        subtitle: 'Acute Midbrain / Brainstem Stroke',
    },
    case_30: {
        title: 'CASE 030 — Sudden Slurred Speech and Dizziness',
        subtitle: 'Acute Left Pontine Infarction',
    },
};

/**
 * Dynamically loads all markdown files in `src/data/Case Studies/*.md` using Vite's glob import.
 */
const rawCaseModules = import.meta.glob<string>('../data/Case Studies/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

/**
 * Extracts case number from file path, e.g. "case_01.md" -> 1, "case_12.md" -> 12.
 */
function getCaseNumberFromPath(path: string): number {
    const match = path.match(/case_(\d+)\.md$/i);
    return match ? parseInt(match[1], 10) : 9999;
}

/**
 * Derives case metadata from markdown content if not explicitly preset.
 */
function deriveCaseMetadata(rawMd: string, caseId: string, caseNum: number): { title: string; subtitle: string } {
    if (CASE_METADATA_PRESETS[caseId]) {
        return CASE_METADATA_PRESETS[caseId];
    }

    const lines = rawMd.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const firstH1 = lines.find((l) => l.startsWith('# '))?.replace(/^#\s*/, '').trim() || '';
    const firstH2 = lines.find((l) => l.startsWith('## ') && !l.startsWith('## STROKE') && !l.startsWith('## 1.'))?.replace(/^##\s*/, '').replace(/["“”]/g, '').trim() || '';

    const formattedNum = `CASE ${String(caseNum).padStart(3, '0')}`;
    const cleanTitle = firstH1 ? firstH1.replace(/^(Case Title:\s*|Case ID:\s*\S+\s*)/i, '').trim() : `${formattedNum}`;
    const cleanSubtitle = firstH2 || 'Clinical Encounter & Stroke Unit Assessment';

    return {
        title: `${formattedNum} — ${cleanTitle}`,
        subtitle: cleanSubtitle,
    };
}

/**
 * Build sorted list of all available clinical cases from globbed files.
 */
function buildCasesList(): CaseItem[] {
    const sortedPaths = Object.keys(rawCaseModules).sort(
        (a, b) => getCaseNumberFromPath(a) - getCaseNumberFromPath(b)
    );

    return sortedPaths.map((path) => {
        const rawMarkdown = rawCaseModules[path] || '';
        const caseNum = getCaseNumberFromPath(path);
        const caseId = `case_${String(caseNum).padStart(2, '0')}`;
        const normalizedKey = `case_${caseNum < 10 ? String(caseNum).padStart(2, '0') : String(caseNum)}`;

        const { title, subtitle } = deriveCaseMetadata(rawMarkdown, normalizedKey, caseNum);

        return {
            id: caseId,
            title,
            subtitle,
            rawMarkdown,
        };
    });
}

const CASES: CaseItem[] = buildCasesList();

/**
 * Parses markdown into logical sections by top-level `# ` or `## ` headings,
 * preserving subsections (`### `, `#### `), tables, and dialogues within their parent topic.
 */
function parseIntoCaseSections(raw: string): CaseSection[] {
    const rawLines = raw.split(/\r?\n/);
    const sections: CaseSection[] = [];
    let current: CaseSection | null = null;
    let sectionCounter = 0;

    for (const rawLine of rawLines) {
        const headingMatch = rawLine.match(/^(#{1,2})\s+(.+)$/);

        if (headingMatch) {
            if (current && current.content.trim().length > 0) {
                sections.push(current);
            }

            sectionCounter++;
            current = {
                id: sectionCounter,
                title: headingMatch[2].trim().replace(/\*\*/g, ''),
                content: '',
            };
            continue;
        }

        if (current) {
            current.content += (current.content ? '\n' : '') + rawLine;
        }
    }

    if (current && current.content.trim().length > 0) {
        sections.push(current);
    }

    return sections;
}

/**
 * Generates deterministic page-level completion ID: e.g. "case_01_page_01", "case_03_page_04"
 */
function getCasePageId(caseId: string, pageNumber: number): string {
    return `${caseId}_page_${String(pageNumber).padStart(2, '0')}`;
}

export default function CaseStudiesPage() {
    const navigate = useNavigate();
    const { progress, markCaseStudyComplete } = useUserProgress();
    const [selectedCase, setSelectedCase] = useState<CaseItem>(CASES[0] || {
        id: 'case_01',
        title: 'CASE 001',
        subtitle: 'Clinical Case Study',
        rawMarkdown: '',
    });
    const [sections, setSections] = useState<CaseSection[]>([]);
    const [activeSection, setActiveSection] = useState<CaseSection | null>(null);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        try {
            const parsed = parseIntoCaseSections(selectedCase.rawMarkdown);
            setSections(parsed);
            if (parsed.length > 0) {
                setActiveSection(parsed[0]);
            } else {
                setActiveSection(null);
            }
        } catch (err) {
            console.error("Failed to parse case study markdown:", err);
        }
    }, [selectedCase]);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isSidebarOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const activeSectionIndex = activeSection
        ? sections.findIndex((s) => s.id === activeSection.id)
        : 0;

    const isPageComplete = (secId: number) => {
        const pageId = getCasePageId(selectedCase.id, secId);
        return (progress.caseStudies || []).includes(pageId) || completedIds.has(pageId);
    };

    const completedCount = useMemo(() => {
        return sections.filter((sec) => isPageComplete(sec.id)).length;
    }, [sections, progress.caseStudies, completedIds, selectedCase.id]);

    const progressPercent = sections.length > 0
        ? Math.round((completedCount / sections.length) * 100)
        : 0;

    const isActiveComplete = activeSection
        ? isPageComplete(activeSection.id)
        : false;

    const markComplete = () => {
        if (!activeSection) return;
        const pageId = getCasePageId(selectedCase.id, activeSection.id);
        markCaseStudyComplete(pageId);
        setCompletedIds((prev) => new Set(prev).add(pageId));
        const currentIndex = sections.findIndex((s) => s.id === activeSection.id);
        const nextSec = sections[currentIndex + 1];
        if (nextSec) {
            setActiveSection(nextSec);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSelectSection = (sec: CaseSection) => {
        setActiveSection(sec);
        setIsSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextSection = () => {
        if (activeSectionIndex < sections.length - 1) {
            handleSelectSection(sections[activeSectionIndex + 1]);
        }
    };

    const handlePrevSection = () => {
        if (activeSectionIndex > 0) {
            handleSelectSection(sections[activeSectionIndex - 1]);
        }
    };

    // Shared Section Navigation component (Desktop sidebar + Mobile Drawer)
    const SectionNavigationList = () => (
        <nav className="p-2 space-y-1" aria-label="Case topics">
            {sections.map((sec, index) => {
                const isActive = activeSection?.id === sec.id;
                const isDone = isPageComplete(sec.id);

                return (
                    <button
                        key={sec.id}
                        onClick={() => handleSelectSection(sec)}
                        className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                            isActive
                                ? 'bg-white/15 border border-white/20 shadow-sm'
                                : 'hover:bg-white/10 border border-transparent'
                        }`}
                    >
                        <div className="mt-0.5 shrink-0">
                            {isDone ? (
                                <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                                <Circle
                                    size={18}
                                    className={
                                        isActive
                                            ? 'text-purple-300'
                                            : 'text-white/30 group-hover:text-purple-400'
                                    }
                                />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs font-bold ${
                                        isActive ? 'text-purple-300' : 'text-white/40'
                                    }`}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <p
                                className={`text-sm font-medium leading-snug mt-0.5 ${
                                    isActive
                                        ? 'text-white font-semibold'
                                        : 'text-purple-200 group-hover:text-white'
                                    }`}
                            >
                                {sec.title}
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative text-white font-sans overflow-x-hidden">
            {/* Background glowing blurred decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* ── Top Navigation Bar ───────────────────────────────────────── */}
            <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/10 backdrop-blur-md bg-purple-950/40 sticky top-0">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors shrink-0 min-h-[44px]"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="h-4 w-px bg-white/20 shrink-0 hidden sm:block" />
                    <div className="flex items-center gap-2 min-w-0">
                        <Brain className="text-purple-400 shrink-0" size={18} />
                        <h1 className="text-white font-bold truncate text-sm sm:text-base">
                            Clinical Case Studies
                        </h1>
                    </div>
                </div>

                {/* Case Switcher & Progress */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-2.5 py-1">
                        <FolderKanban size={14} className="text-purple-300 shrink-0" />
                        <select
                            value={selectedCase.id}
                            onChange={(e) => {
                                const found = CASES.find((c) => c.id === e.target.value);
                                if (found) setSelectedCase(found);
                            }}
                            aria-label="Select Clinical Case"
                            className="bg-transparent text-white text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-1 [&>option]:bg-slate-900 [&>option]:text-white max-w-[200px] xs:max-w-[280px] sm:max-w-none"
                        >
                            {CASES.map((c, i) => (
                                <option key={c.id} value={c.id}>
                                    Case {String(i + 1).padStart(2, '0')}: {c.title.replace(/^CASE\s*\d+\s*[—–-]\s*/i, '')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Progress pill */}
                    <div className="shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                        <span className="text-xs text-purple-300 font-medium hidden xs:inline">
                            {completedCount}/{sections.length} topics
                        </span>
                        <span className="text-xs font-bold text-white">{progressPercent}%</span>
                    </div>
                </div>
            </header>

            {/* ── Mobile: Sticky Section Header Bar ──────────────────────── */}
            <div className="lg:hidden sticky top-[57px] z-15 bg-purple-900/90 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-purple-300 font-medium truncate max-w-[60%]">
                    {activeSection ? activeSection.title : 'Select a topic'}
                </span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-1.5 text-purple-300 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors shrink-0"
                    aria-label="Open topic list"
                >
                    <List size={14} />
                    Topics ({sections.length})
                </button>
            </div>

            {/* ── Mobile Drawer Overlay ────────────────────────────────────── */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Mobile Drawer Panel ──────────────────────────────────────── */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-900 to-indigo-900 border-t border-white/15 shadow-2xl transition-transform duration-300 ease-in-out max-h-[80vh] flex flex-col rounded-t-2xl ${
                    isSidebarOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                aria-label="Topics drawer"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-300" />
                        <h2 className="text-sm font-semibold text-white">Case Topics</h2>
                        <span className="text-xs text-purple-300 font-normal">
                            ({completedCount}/{sections.length} read)
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 text-white/60 hover:text-white rounded-lg transition-colors min-touch"
                        aria-label="Close topics drawer"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                    <SectionNavigationList />
                </div>
            </div>

            {/* ── Main Split Layout ────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-0">
                {/* ── LEFT: Topics Sidebar (Desktop) ───────────────────────── */}
                <aside className="lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-r border-white/10">
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                                <BookOpen size={14} />
                                Case Topics
                            </h2>
                            <span className="text-xs font-bold text-white">{progressPercent}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/10">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
                        <SectionNavigationList />
                    </div>
                </aside>

                {/* ── RIGHT: Topic Content ─────────────────────────────────── */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {activeSection ? (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Header Card */}
                            <Card className="bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <span className="text-xs font-bold tracking-widest text-purple-300 uppercase bg-purple-500/20 border border-purple-400/30 px-2.5 py-1 rounded-full">
                                            Topic {String(activeSectionIndex + 1).padStart(2, '0')} of {sections.length}
                                        </span>
                                        {isActiveComplete && (
                                             <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-400/30 px-2.5 py-0.5 rounded-full">
                                                <CheckCircle2 size={13} />
                                                <span>Completed</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
                                        {selectedCase.subtitle}
                                    </p>
                                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mt-1">
                                        {activeSection.title}
                                    </CardTitle>

                                    {/* Clinical Case Illustration for Cases 1 to 20 */}
                                    {activeSectionIndex === 0 && (() => {
                                        const caseNumMatch = selectedCase.id.match(/case_(\d+)/i);
                                        const caseNum = caseNumMatch ? parseInt(caseNumMatch[1], 10) : 0;
                                        if (caseNum >= 1 && caseNum <= 20) {
                                            const paddedNum = String(caseNum).padStart(2, '0');
                                            return (
                                                <div className="mt-4 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black/40 relative group">
                                                    <img
                                                        src={`/images/case_studies/case_${paddedNum}_img.png`}
                                                        alt={`${selectedCase.title} Scenario Illustration`}
                                                        loading="lazy"
                                                        className="w-full max-h-[460px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                    <div className="bg-purple-950/80 px-4 py-2 text-xs text-purple-200 border-t border-white/10 flex items-center justify-between">
                                                        <span className="font-semibold text-white flex items-center gap-1.5">
                                                            <Brain size={14} className="text-purple-400" />
                                                            Clinical Scenario Encounter Illustration
                                                        </span>
                                                        <span className="text-purple-300 font-mono">Case {paddedNum}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </CardHeader>
                            </Card>

                            {/* Body Card */}
                            <Card className="bg-white/8 backdrop-blur-sm border border-white/12 shadow-xl">
                                <CardContent className="pt-6 pb-6">
                                    <div className="prose prose-invert max-w-none
                                        prose-headings:text-white prose-headings:font-bold
                                        prose-p:text-purple-100 prose-p:leading-relaxed
                                        prose-strong:text-white
                                        prose-ul:text-purple-100 prose-ul:list-disc prose-ul:ml-6
                                        prose-ol:text-purple-100 prose-ol:list-decimal prose-ol:ml-6
                                        prose-li:text-purple-100 prose-li:marker:text-purple-400
                                        prose-table:border-white/15 prose-table:rounded-xl prose-table:overflow-hidden
                                        prose-th:bg-white/10 prose-th:text-purple-200 prose-th:p-3 prose-th:border-b prose-th:border-white/15
                                        prose-td:p-3 prose-td:border-t prose-td:border-white/10 prose-td:text-purple-100
                                        prose-hr:border-white/10">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                blockquote({ children }) {
                                                    return (
                                                        <div className="my-4 bg-purple-950/60 border-l-4 border-purple-400 p-4 rounded-r-xl text-purple-100 shadow-inner backdrop-blur-sm">
                                                            <div className="flex items-center gap-2 font-bold text-xs uppercase text-purple-300 mb-1.5">
                                                                <Brain size={15} className="text-purple-400" /> Clinical Dialogue & Encounter
                                                            </div>
                                                            <div className="italic text-sm leading-relaxed">
                                                                {children}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                                code({ inline, className, children, ...props }: any) {
                                                    return !inline ? (
                                                        <pre className="my-4 p-4 rounded-xl bg-purple-950/80 border border-white/15 font-mono text-xs text-purple-200 overflow-x-auto shadow-inner leading-relaxed">
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    ) : (
                                                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-200 font-mono text-xs border border-white/10" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                                h3({ children }) {
                                                    const text = String(children);
                                                    const isThoughtProcess = text.includes("Doctor's Thought Process") || text.includes("Thought Process");
                                                    return (
                                                        <h3
                                                            className={`mt-6 mb-3 font-bold text-lg flex items-center gap-2 ${
                                                                isThoughtProcess
                                                                    ? 'text-amber-200 bg-amber-950/40 p-3 rounded-xl border border-amber-500/30'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {isThoughtProcess && (
                                                                <Stethoscope size={18} className="text-amber-400 shrink-0" />
                                                            )}
                                                            <span>{children}</span>
                                                        </h3>
                                                    );
                                                },
                                                img(props) {
                                                    return (
                                                        <img
                                                            src={props.src}
                                                            alt={props.alt || 'Clinical case diagram'}
                                                            loading="lazy"
                                                            className="w-full max-w-xl mx-auto my-4 rounded-xl border border-white/15 shadow-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    );
                                                },
                                            }}
                                        >
                                            {activeSection.content}
                                        </ReactMarkdown>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action & Navigation Buttons */}
                            <div className="flex items-center gap-3 flex-wrap pt-2">
                                {isActiveComplete ? (
                                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
                                        <CheckCircle2 size={18} />
                                        Topic Completed
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

                                {/* Prev Topic Button */}
                                {activeSectionIndex > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={handlePrevSection}
                                        className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
                                    >
                                        <ArrowLeft size={16} />
                                        Previous
                                    </Button>
                                )}

                                {/* Next Topic Button */}
                                {activeSectionIndex < sections.length - 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleNextSection}
                                        className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold ml-auto"
                                    >
                                        Next Topic
                                        <ChevronRight size={16} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-purple-300">
                            Loading case study content...
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
