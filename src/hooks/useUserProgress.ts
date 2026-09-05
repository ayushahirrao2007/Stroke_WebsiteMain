import { useState, useEffect, useContext } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';

export interface UserProgress {
    completedLessons: string[];
    quizScores: Record<string, number>;
    caseStudies: string[];
    anatomy: string[];
    cvs: string[];
    aboutStroke: string[];
    therapeutics: string[];
    modernMedicines: string[];
}

export function useUserProgress() {
    const { user } = useContext(AuthContext);
    const [progress, setProgress] = useState<UserProgress>({
        completedLessons: [],
        quizScores: {},
        caseStudies: [],
        anatomy: [],
        cvs: [],
        aboutStroke: [],
        therapeutics: [],
        modernMedicines: []
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
                    quizScores: data.progress?.quizScores || {},
                    caseStudies: data.progress?.caseStudies || [],
                    anatomy: data.progress?.anatomy || [],
                    cvs: data.progress?.cvs || [],
                    aboutStroke: data.progress?.aboutStroke || [],
                    therapeutics: data.progress?.therapeutics || [],
                    modernMedicines: data.progress?.modernMedicines || []
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

    const markItemComplete = async (field: 'caseStudies' | 'anatomy' | 'cvs' | 'aboutStroke' | 'therapeutics' | 'modernMedicines', itemId: string) => {
        if (!user) return;

        const currentList = progress[field] || [];

        // Prevent duplicate updates
        if (currentList.includes(itemId)) return;

        const newList = [...currentList, itemId];
        const userRef = doc(db, 'users', user.uid);

        try {
            await setDoc(userRef, {
                progress: {
                    ...progress,
                    [field]: newList
                }
            }, { merge: true });
        } catch (error) {
            console.error(`Failed to mark ${field} complete:`, error);
        }
    };

    const markCaseStudyComplete = async (caseId: string) => {
        await markItemComplete('caseStudies', caseId);
    };

    const markAnatomyComplete = async (topicId: string) => {
        await markItemComplete('anatomy', topicId);
    };

    const markCVSComplete = async (sectionId: string) => {
        await markItemComplete('cvs', sectionId);
    };

    const markAboutStrokeComplete = async (sectionId: string) => {
        await markItemComplete('aboutStroke', sectionId);
    };

    const markTherapeuticsComplete = async (lessonId: string) => {
        await markItemComplete('therapeutics', lessonId);
    };

    const markModernMedicinesComplete = async (sectionId: string) => {
        await markItemComplete('modernMedicines', sectionId);
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
        markCaseStudyComplete,
        markAnatomyComplete,
        markCVSComplete,
        markAboutStrokeComplete,
        markTherapeuticsComplete,
        markModernMedicinesComplete,
        updateQuizScore 
    };
}
