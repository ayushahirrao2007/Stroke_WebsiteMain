import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course } from '../data/courses'; // For types

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'courses'));
                const fetchedCourses = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: Number(doc.id),
                        title: data.title,
                        image: data.image,
                        description: data.description,
                        markdownFile: data.markdownFile,
                        lessons: data.lessons || [],
                    } as Course;
                });
                
                // Sort by ID to maintain order
                fetchedCourses.sort((a, b) => a.id - b.id);
                
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Error fetching courses from Firestore:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading };
}

export function useCourse(id: string | undefined) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchCourse = async () => {
            try {
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCourse({
                        id: Number(docSnap.id),
                        title: data.title,
                        image: data.image,
                        description: data.description,
                        markdownFile: data.markdownFile,
                        lessons: data.lessons || [],
                    } as Course);
                } else {
                    console.log("No such course!");
                    setCourse(null);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    return { course, loading };
}
