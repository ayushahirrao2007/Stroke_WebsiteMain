import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course, courses as localCourses } from '../data/courses';

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>(localCourses);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'courses'));
                if (!snapshot.empty) {
                    const fetchedCourses = snapshot.docs.map(docSnap => {
                        const data = docSnap.data();
                        const numId = Number(docSnap.id);
                        const matchedLocal = localCourses.find(c => c.id === numId);
                        const image = (data.image && !data.image.includes('unsplash.com'))
                            ? data.image
                            : (matchedLocal?.image || data.image);
                        return {
                            id: isNaN(numId) ? docSnap.id : numId,
                            title: data.title || matchedLocal?.title,
                            image: image || matchedLocal?.image,
                            description: data.description || matchedLocal?.description,
                            markdownFile: data.markdownFile || matchedLocal?.markdownFile,
                            lessons: data.lessons || [],
                        } as Course;
                    });

                    // Map by ID so local courses (all 10) are guaranteed to be present
                    const courseMap = new Map<number | string, Course>();
                    localCourses.forEach(c => courseMap.set(c.id, c));
                    fetchedCourses.forEach(c => {
                        const existing = courseMap.get(c.id);
                        if (existing) {
                            courseMap.set(c.id, {
                                ...existing,
                                ...c,
                                title: c.title || existing.title,
                                image: c.image || existing.image,
                                markdownFile: c.markdownFile || existing.markdownFile,
                                description: c.description || existing.description,
                            });
                        } else {
                            courseMap.set(c.id, c);
                        }
                    });

                    const allCourses = Array.from(courseMap.values());
                    allCourses.sort((a, b) => Number(a.id) - Number(b.id));
                    setCourses(allCourses);
                } else {
                    setCourses(localCourses);
                }
            } catch (error) {
                console.error("Error fetching courses from Firestore, using local courses:", error);
                setCourses(localCourses);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading };
}

export function useCourse(id: string | undefined) {
    const [course, setCourse] = useState<Course | null>(() => {
        if (!id) return null;
        const numId = Number(id);
        return localCourses.find(c => c.id === numId) || null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const numId = Number(id);
        const matchedLocal = localCourses.find(c => c.id === numId);

        if (matchedLocal) {
            setCourse(matchedLocal);
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
                        id: isNaN(numId) ? docSnap.id : numId,
                        title: data.title,
                        image: data.image,
                        description: data.description,
                        markdownFile: data.markdownFile,
                        lessons: data.lessons || [],
                    } as Course);
                } else {
                    setCourse(null);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    return { course, loading };
}
