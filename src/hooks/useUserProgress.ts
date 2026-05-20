import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';

export interface UserProgress {
    completedLessons: string[];
    quizScores: Record<string, number>;
}

export function useUserProgress() {
    const { user } = useContext(AuthContext);
    const [progress, setProgress] = useState<UserProgress>({
        completedLessons: [],
        quizScores: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        // Listen for real-time updates to the user's progress
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProgress({
                    completedLessons: data.progress?.completedLessons || [],
                    quizScores: data.progress?.quizScores || {}
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user progress:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markLessonComplete = async (courseId: number, lessonId: number) => {
        if (!user) return;
        const lessonKey = `${courseId}_${lessonId}`;
        
        // Prevent duplicate updates
        if (progress.completedLessons.includes(lessonKey)) return;

        const newCompleted = [...progress.completedLessons, lessonKey];
        const userRef = doc(db, 'users', user.uid);
        
        try {
            await setDoc(userRef, {
                progress: {
                    ...progress,
                    completedLessons: newCompleted
                }
            }, { merge: true });
        } catch (error) {
            console.error("Failed to mark lesson complete:", error);
        }
    };

    const updateQuizScore = async (courseId: number, score: number) => {
        if (!user) return;
        
        const currentScore = progress.quizScores[courseId.toString()] || 0;
        
        // Only update if the new score is higher
        if (score <= currentScore) return;

        const newScores = {
            ...progress.quizScores,
            [courseId.toString()]: score
        };

        const userRef = doc(db, 'users', user.uid);
        
        try {
            await setDoc(userRef, {
                progress: {
                    ...progress,
                    quizScores: newScores
                }
            }, { merge: true });
        } catch (error) {
            console.error("Failed to update quiz score:", error);
        }
    };

    return { 
        progress, 
        loading, 
        markLessonComplete, 
        updateQuizScore 
    };
}
