// ─────────────────────────────────────────────────────────────
//  useQuizAccess
//  Derives quiz lock/unlock state from the existing
//  completedLessons array — no extra Firestore reads needed.
//
//  VALIDATION IS STRICTLY PER-COURSE:
//  - Filters completedLessons by "{courseId}_" prefix
//  - Compares count against totalLessons for THAT course only
//  - Other courses' progress has zero effect
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useContext } from 'react';
import { useUserProgress } from './useUserProgress';
import { AuthContext } from '../context/AuthContext';
import { getQuizResult, type QuizResult } from '../services/quizService';

interface QuizAccessState {
    /** true when every lesson in THIS course has been completed */
    isUnlocked: boolean;
    /** number of lessons the user has finished for THIS course */
    completedCount: number;
    /** total lessons that must be completed for THIS course */
    totalLessons: number;
    /** percentage of THIS course's lessons completed (0-100) */
    completionPercent: number;
    /** the most recent stored quiz result, if any */
    lastResult: QuizResult | null;
    /** true while the hook is fetching the stored result */
    loadingResult: boolean;
}

/**
 * Per-course quiz access hook.
 *
 * @param courseId     numeric course id (e.g. 1, 2, 3)
 * @param totalLessons total lesson count for THIS specific course
 */
export function useQuizAccess(courseId: number, totalLessons: number): QuizAccessState {
    const { user } = useContext(AuthContext);
    const { progress } = useUserProgress();
    const [lastResult, setLastResult] = useState<QuizResult | null>(null);
    const [loadingResult, setLoadingResult] = useState(true);

    // ── PER-COURSE completion check ─────────────────────────────
    // Only count entries that match THIS course's prefix: "{courseId}_"
    // e.g. courseId=1 → only "1_1", "1_2", "1_3" etc.
    // courseId=2 progress does NOT affect courseId=1 quiz.
    const coursePrefix = `${courseId}_`;
    const completedForThisCourse = progress.completedLessons.filter(
        (key) => key.startsWith(coursePrefix)
    );
    const completedCount = completedForThisCourse.length;

    // Quiz unlocks ONLY when ALL lessons of THIS course are done
    const isUnlocked = totalLessons > 0 && completedCount >= totalLessons;

    const completionPercent =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // ── Fetch stored quiz result (resets on courseId change) ─────
    useEffect(() => {
        // Reset state when courseId changes
        setLastResult(null);
        setLoadingResult(true);

        if (!user || courseId === 0) {
            setLoadingResult(false);
            return;
        }

        let cancelled = false;
        const fetchResult = async () => {
            try {
                const result = await getQuizResult(user.uid, courseId.toString());
                if (!cancelled) setLastResult(result);
            } catch (err) {
                console.error('Failed to fetch quiz result:', err);
            } finally {
                if (!cancelled) setLoadingResult(false);
            }
        };

        fetchResult();
        return () => { cancelled = true; };
    }, [user, courseId]);

    return {
        isUnlocked,
        completedCount,
        totalLessons,
        completionPercent,
        lastResult,
        loadingResult,
    };
}
