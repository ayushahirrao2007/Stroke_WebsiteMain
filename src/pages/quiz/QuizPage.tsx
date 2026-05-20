import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizQuestion } from '../../data/quiz';
import { useQuizzes } from '../../hooks/useQuizzes';
import { useUserProgress } from '../../hooks/useUserProgress';
import { useQuizAccess } from '../../hooks/useQuizAccess';
import { useCourse } from '../../hooks/useCourses';
import { markdownFiles } from '../../data/markdowns';
import { parseMarkdownLessons } from '../../utils/parseMarkdown';
import { saveQuizResult } from '../../services/quizService';
import { AuthContext } from '../../context/AuthContext';
import { Loader2, Lock, BookOpen, CheckCircle2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  QuizPage
//  Displays the quiz for a given course (/course/:id/quiz).
//  Questions are fetched dynamically from Firestore.
//  Quiz is LOCKED until all lessons of the course are completed.
// ─────────────────────────────────────────────────────────────

type QuizState = 'in-progress' | 'submitted';

export function QuizPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { quizQuestions, loading } = useQuizzes();
    const { updateQuizScore } = useUserProgress();

    // ── Derive total lessons for this course ──────────────────
    const { course, loading: courseLoading } = useCourse(id);

    const totalLessons = useMemo(() => {
        if (!course) return 0;
        if (course.markdownFile && markdownFiles[course.markdownFile]) {
            return parseMarkdownLessons(markdownFiles[course.markdownFile]).length;
        }
        return course.lessons?.length ?? 0;
    }, [course]);

    // ── Quiz access gate ────────────────────────────────────
    const { isUnlocked, completedCount, completionPercent } = useQuizAccess(
        Number(id) || 0,
        totalLessons
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [quizState, setQuizState] = useState<QuizState>('in-progress');
    const [saving, setSaving] = useState(false);

    // Initialize answers array when quizQuestions load
    useEffect(() => {
        if (quizQuestions.length > 0 && answers.length === 0) {
            setAnswers(new Array(quizQuestions.length).fill(null));
        }
    }, [quizQuestions]);

    // ── Loading states ──────────────────────────────────────
    if (loading || courseLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4">
                <Loader2 className="animate-spin text-purple-400 mb-4" size={48} />
                <p className="text-purple-300">Loading quiz...</p>
            </div>
        );
    }

    // ── LOCKED SCREEN ───────────────────────────────────────
    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-12">
                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                    {/* Lock icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-white/20">
                        <Lock className="text-red-300" size={36} />
                    </div>

                    <h2 className="text-2xl font-extrabold text-white mb-2">
                        Quiz Locked
                    </h2>
                    <p className="text-purple-200 text-sm mb-6 leading-relaxed">
                        Complete all lessons to unlock the quiz.
                    </p>

                    {/* Progress indicator */}
                    <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-purple-300 flex items-center gap-1.5">
                                <BookOpen size={12} /> Lesson Progress
                            </span>
                            <span className="text-white">{completedCount}/{totalLessons}</span>
                        </div>
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-purple-300 mt-2">
                            {totalLessons - completedCount} lesson{totalLessons - completedCount !== 1 ? 's' : ''} remaining
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate(id ? `/course/${id}` : '/')}
                            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white
                                hover:from-purple-700 hover:to-blue-700 active:scale-95 transition-all duration-200 shadow-lg"
                        >
                            Continue Learning
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold
                                text-white hover:bg-white/20 active:scale-95 transition-all duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── No questions found ──────────────────────────────────
    if (quizQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4">
                <p className="text-purple-300">No quiz questions found.</p>
                <button
                    onClick={() => navigate(id ? `/course/${id}` : '/')}
                    className="mt-6 text-sm text-purple-400 hover:text-white underline underline-offset-2 transition"
                >
                    ← {id ? 'Back to course' : 'Back to Home'}
                </button>
            </div>
        );
    }

    const currentQuestion: QuizQuestion = quizQuestions[currentIndex];
    const totalQuestions = quizQuestions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const hasAnsweredCurrent = answers[currentIndex] !== null;

    // ── Handlers ────────────────────────────────────────────────
    const handleOptionSelect = (optionIndex: number) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[currentIndex] = optionIndex;
            return updated;
        });
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((i) => i + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
        }
    };

    const score = quizQuestions.reduce((acc, q, idx) => {
        return answers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    const handleSubmit = async () => {
        setQuizState('submitted');
        setSaving(true);

        try {
            // Save to existing quizScores system (untouched logic)
            if (id) {
                await updateQuizScore(Number(id), percentage);
            }

            // Save detailed result to users/{uid}/quizResults/{courseId}
            if (user && id) {
                await saveQuizResult(user.uid, id, {
                    score,
                    totalQuestions,
                    percentage,
                    answers,
                    passed,
                });
            }
        } catch (error) {
            console.error('Failed to save quiz result:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleRetake = () => {
        setAnswers(new Array(quizQuestions.length).fill(null));
        setCurrentIndex(0);
        setQuizState('in-progress');
    };

    // ────────────────────────────────────────────────────────────
    //  Result Screen
    // ────────────────────────────────────────────────────────────
    if (quizState === 'submitted') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
                    {/* Score ring */}
                    <div
                        className={`mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full text-4xl font-extrabold
              ${passed
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                                : 'bg-gradient-to-br from-red-400 to-rose-500 text-white'
                            }`}
                    >
                        {percentage}%
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {passed ? '🎉 Great Job!' : '📚 Keep Practicing!'}
                    </h2>
                    <p className="text-gray-500 mb-2">
                        You answered{' '}
                        <span className="font-semibold text-purple-700">{score}</span> out of{' '}
                        <span className="font-semibold text-purple-700">{totalQuestions}</span> questions correctly.
                    </p>
                    <p className={`text-sm font-medium mb-2 ${passed ? 'text-green-600' : 'text-red-500'}`}>
                        {passed ? 'You passed the quiz!' : 'You need 60% to pass. Try again!'}
                    </p>

                    {/* Save status */}
                    {saving ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-purple-500 mb-6">
                            <Loader2 className="animate-spin" size={14} />
                            Saving result...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 mb-6">
                            <CheckCircle2 size={14} />
                            Result saved
                        </div>
                    )}

                    {/* Per-question review */}
                    <div className="space-y-3 text-left mb-8">
                        {quizQuestions.map((q, idx) => {
                            const userAnswer = answers[idx];
                            const isCorrect = userAnswer === q.correctIndex;
                            return (
                                <div
                                    key={q.id}
                                    className={`rounded-xl px-4 py-3 text-sm border ${isCorrect
                                            ? 'border-green-200 bg-green-50 text-green-800'
                                            : 'border-red-200 bg-red-50 text-red-800'
                                        }`}
                                >
                                    <p className="font-medium mb-1">
                                        Q{idx + 1}. {q.question}
                                    </p>
                                    <p>
                                        Your answer:{' '}
                                        <span className="font-semibold">
                                            {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                                        </span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="text-green-700 mt-0.5">
                                            Correct: <span className="font-semibold">{q.options[q.correctIndex]}</span>
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleRetake}
                            className="flex-1 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white
                         hover:bg-purple-700 active:scale-95 transition-all duration-200 shadow-md"
                        >
                            Retake Quiz
                        </button>
                        <button
                            onClick={() => navigate(id ? `/course/${id}` : '/')}
                            className="flex-1 rounded-xl border border-purple-200 bg-white px-6 py-3 text-sm font-semibold
                         text-purple-700 hover:bg-purple-50 active:scale-95 transition-all duration-200"
                        >
                            {id ? 'Back to Course' : 'Back to Home'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────
    //  Quiz in-progress screen
    // ────────────────────────────────────────────────────────────
    const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-12">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">

                {/* ── Header bar ─────────────────────────────────────── */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-5">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-lg font-bold text-white">Course Quiz</h1>
                            {id && <p className="text-purple-200 text-xs mt-0.5">Course ID: {id}</p>}
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                            {currentIndex + 1} / {totalQuestions}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
                        <div
                            className="h-2 rounded-full bg-white transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                {/* ── Question body ───────────────────────────────────── */}
                <div className="px-8 py-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
                        Question {currentIndex + 1}
                    </p>
                    <h2 className="text-xl font-bold text-gray-800 mb-8 leading-snug">
                        {currentQuestion.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, optIndex) => {
                            const isSelected = answers[currentIndex] === optIndex;
                            return (
                                <label
                                    key={optIndex}
                                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 transition-all duration-200
                    ${isSelected
                                            ? 'border-purple-500 bg-purple-50 shadow-sm'
                                            : 'border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50/40'
                                        }`}
                                >
                                    {/* Custom radio */}
                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all
                      ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300 bg-white'}`}
                                    >
                                        {isSelected && (
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </div>

                                    <input
                                        type="radio"
                                        name={`question-${currentIndex}`}
                                        value={optIndex}
                                        checked={isSelected}
                                        onChange={() => handleOptionSelect(optIndex)}
                                        className="sr-only"
                                    />

                                    <span className={`text-sm font-medium ${isSelected ? 'text-purple-800' : 'text-gray-700'}`}>
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* ── Navigation footer ───────────────────────────────── */}
                <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600
                       hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-40
                       active:scale-95 transition-all duration-200"
                    >
                        ← Previous
                    </button>

                    {/* Dot indicators */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        {quizQuestions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-200
                  ${idx === currentIndex
                                        ? 'w-6 bg-purple-500'
                                        : answers[idx] !== null
                                            ? 'w-2 bg-purple-300'
                                            : 'w-2 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!hasAnsweredCurrent}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold
                         text-white shadow-md hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed
                         disabled:opacity-50 active:scale-95 transition-all duration-200"
                        >
                            Submit Quiz ✓
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!hasAnsweredCurrent}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold
                         text-white shadow-md hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed
                         disabled:opacity-50 active:scale-95 transition-all duration-200"
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>

            {/* Back link */}
            <button
                onClick={() => navigate(id ? `/course/${id}` : '/')}
                className="mt-6 text-sm text-purple-600 hover:text-purple-800 underline underline-offset-2 transition"
            >
                ← {id ? 'Back to course' : 'Back to Home'}
            </button>
        </div>
    );
}
