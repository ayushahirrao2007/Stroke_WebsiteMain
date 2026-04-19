import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizQuestions, QuizQuestion } from '../../data/quiz';

// ─────────────────────────────────────────────────────────────
//  QuizPage
//  Displays the quiz for a given course (/course/:id/quiz).
//  Questions are sourced from src/data/quiz.ts.
//  Questions will be provided by the client — edit quiz.ts only.
// ─────────────────────────────────────────────────────────────

type QuizState = 'in-progress' | 'submitted';

export function QuizPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(
        () => new Array(quizQuestions.length).fill(null)
    );
    const [quizState, setQuizState] = useState<QuizState>('in-progress');

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

    const handleSubmit = () => {
        setQuizState('submitted');
    };

    const handleRetake = () => {
        setAnswers(new Array(quizQuestions.length).fill(null));
        setCurrentIndex(0);
        setQuizState('in-progress');
    };

    // ── Score calculation ────────────────────────────────────────
    const score = quizQuestions.reduce((acc, q, idx) => {
        return answers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

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
                    <p className={`text-sm font-medium mb-8 ${passed ? 'text-green-600' : 'text-red-500'}`}>
                        {passed ? 'You passed the quiz!' : 'You need 60% to pass. Try again!'}
                    </p>

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
                            onClick={() => navigate(`/course/${id}`)}
                            className="flex-1 rounded-xl border border-purple-200 bg-white px-6 py-3 text-sm font-semibold
                         text-purple-700 hover:bg-purple-50 active:scale-95 transition-all duration-200"
                        >
                            Back to Course
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
                            <p className="text-purple-200 text-xs mt-0.5">Course ID: {id}</p>
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
                onClick={() => navigate(`/course/${id}`)}
                className="mt-6 text-sm text-purple-600 hover:text-purple-800 underline underline-offset-2 transition"
            >
                ← Back to course
            </button>
        </div>
    );
}
