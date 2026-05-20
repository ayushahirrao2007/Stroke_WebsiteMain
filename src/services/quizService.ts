// ─────────────────────────────────────────────────────────────
//  Quiz Service
//  Firestore operations for quiz result storage.
//  Data lives at: users/{uid}/quizResults/{courseId}
// ─────────────────────────────────────────────────────────────

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/** Shape of a quiz result stored in Firestore */
export interface QuizResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    answers: (number | null)[];
    completedAt: any;
    passed: boolean;
}

/**
 * Save (or overwrite) a quiz result for a given user + course.
 * On retake the previous result is replaced.
 */
export async function saveQuizResult(
    uid: string,
    courseId: string,
    result: Omit<QuizResult, 'completedAt'>
): Promise<void> {
    const ref = doc(db, 'users', uid, 'quizResults', courseId);
    await setDoc(ref, {
        ...result,
        completedAt: serverTimestamp(),
    });
}

/**
 * Fetch the stored quiz result for a user + course.
 * Returns null if the user has never submitted a quiz for this course.
 */
export async function getQuizResult(
    uid: string,
    courseId: string
): Promise<QuizResult | null> {
    const ref = doc(db, 'users', uid, 'quizResults', courseId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return snap.data() as QuizResult;
    }
    return null;
}
