import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { QuizQuestion } from '../data/quiz';

export function useQuizzes() {
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'quizzes'));
                const fetchedQuizzes = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: Number(doc.id),
                        question: data.question,
                        options: data.options,
                        correctIndex: data.correctIndex,
                    } as QuizQuestion;
                });
                
                // Sort by ID to maintain order
                fetchedQuizzes.sort((a, b) => a.id - b.id);
                
                setQuizQuestions(fetchedQuizzes);
            } catch (error) {
                console.error("Error fetching quizzes from Firestore:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return { quizQuestions, loading };
}
