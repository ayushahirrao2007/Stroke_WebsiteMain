import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { courses } from '../../data/courses';
import { markdownFiles } from '../../data/markdowns';
import { parseMarkdownLessons, type ParsedLesson } from '../../utils/parseMarkdown';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Brain,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import type { Lesson } from '../../data/courses';

// Union type: a lesson can come from static data or markdown parsing
type AnyLesson = Lesson | ParsedLesson;

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === Number(id));

  // ── Parse markdown lessons (static import, no fetch needed) ──
  const mdLessons = useMemo<ParsedLesson[]>(() => {
    if (!course?.markdownFile) return [];
    const raw = markdownFiles[course.markdownFile];
    if (!raw) return [];
    return parseMarkdownLessons(raw);
  }, [course?.markdownFile]);

  const hasMarkdownError =
    !!course?.markdownFile && !(course.markdownFile in markdownFiles);

  // ── Determine active lesson list ───────────────────────────────
  const isMarkdownCourse = !!course?.markdownFile;
  const lessons: AnyLesson[] = isMarkdownCourse ? mdLessons : (course?.lessons ?? []);

  // ── Track completed lessons ────────────────────────────────────
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());

  const [activeLesson, setActiveLesson] = useState<AnyLesson | null>(lessons[0] ?? null);

  // Auto-select first lesson when available
  useEffect(() => {
    if (lessons.length > 0 && activeLesson === null) {
      setActiveLesson(lessons[0]);
    }
  }, [lessons, activeLesson]);

  // Reset active lesson and completed state when course changes
  useEffect(() => {
    setActiveLesson(lessons[0] ?? null);
    setCompletedIds(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);

  // ── Guard: no course found ─────────────────────────────────────
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Brain className="text-purple-400 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold text-white mb-2">Course not found</h1>
          <p className="text-purple-300 mb-6">This course doesn't exist or has no lessons yet.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = completedIds.size;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const markComplete = () => {
    if (activeLesson) {
      setCompletedIds((prev) => new Set(prev).add(activeLesson.id));
      const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson) setActiveLesson(nextLesson);
    }
  };

  const isActiveLessonComplete = activeLesson ? completedIds.has(activeLesson.id) : false;

  // ── Render lesson content ─────────────────────────────────────
  const renderContent = (lesson: AnyLesson) => {
    if (isMarkdownCourse) {
      return (
        <div className="prose prose-invert max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-purple-100 prose-p:leading-relaxed
          prose-strong:text-white
          prose-ul:text-purple-100 prose-ul:list-disc prose-ul:ml-6
          prose-ol:text-purple-100 prose-ol:list-decimal prose-ol:ml-6
          prose-li:text-purple-100 prose-li:marker:text-purple-400
          prose-code:text-purple-200 prose-code:bg-white/10 prose-code:rounded prose-code:px-1">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      );
    }

    // Legacy plain-text renderer for non-markdown courses
    return (
      <div className="prose prose-sm max-w-none">
        {lesson.content.split('\n\n').map((paragraph, pIdx) => {
          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={pIdx} className="text-purple-100 leading-relaxed text-sm sm:text-base mb-4 last:mb-0">
              {parts.map((part, i) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={i} className="text-white font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* ── Top Bar ───────────────────────────────────────── */}
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
            {course.title}
          </h1>
        </div>
        {/* Progress pill */}
        <div className="ml-auto shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
          <span className="text-xs text-purple-300 font-medium">
            {completedCount}/{totalLessons} lessons
          </span>
          <span className="text-xs font-bold text-white">{progressPercent}%</span>
        </div>
      </header>

      {/* ── Main Split Layout ──────────────────────────────── */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-0 h-[calc(100vh-65px)]">

        {/* ── LEFT: Lesson Sidebar ──────────────────────── */}
        <aside className="lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} />
              Course Lessons
            </h2>
          </div>

          {/* Error state */}
          {hasMarkdownError && (
            <div className="flex items-start gap-2 p-6 text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="text-sm">Unable to load lesson content</span>
            </div>
          )}

          <nav className="p-2 space-y-1">
            {lessons.map((lesson, index) => {
              const isActive = activeLesson?.id === lesson.id;
              const isDone = completedIds.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
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

                  {/* Lesson info */}
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

        {/* ── RIGHT: Lesson Content ─────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {hasMarkdownError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-300">
                <AlertCircle size={32} className="mx-auto mb-3 opacity-70" />
                <p className="text-base font-medium">Unable to load lesson content</p>
              </div>
            </div>
          )}

          {activeLesson && !hasMarkdownError ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Lesson Header */}
              <Card className="bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl">
                <CardHeader className="pb-3">
                  {isActiveLessonComplete && (
                    <div className="flex items-center gap-2 text-xs text-green-400 mb-2">
                      <CheckCircle2 size={12} />
                      <span>Completed</span>
                    </div>
                  )}
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {activeLesson.title}
                  </CardTitle>
                  {/* Course image — only on first topic */}
                  {lessons.findIndex((l) => l.id === activeLesson.id) === 0 && (
                    <img
                      src={`/images/${course.title}.webp`}
                      alt={course.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      className="w-full max-w-[600px] rounded-xl mt-4 object-cover"
                    />
                  )}
                </CardHeader>
              </Card>

              {/* Lesson Body */}
              <Card className="bg-white/8 backdrop-blur-sm border border-white/12">
                <CardContent className="pt-6 pb-6">
                  {renderContent(activeLesson)}
                </CardContent>
              </Card>

              {/* Mark as Completed / Next Lesson */}
              <div className="flex items-center gap-3 flex-wrap">
                {isActiveLessonComplete ? (
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

                {/* Next lesson button */}
                {(() => {
                  const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id);
                  const nextLesson = lessons[currentIndex + 1];
                  return nextLesson ? (
                    <Button
                      variant="outline"
                      onClick={() => setActiveLesson(nextLesson)}
                      className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
                    >
                      Next Lesson
                      <ChevronRight size={16} />
                    </Button>
                  ) : null;
                })()}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}