import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { courses } from "../data/courses";
import { quizQuestions } from "../data/quiz";

export const seedDatabase = async () => {
    try {
        console.log("Starting database seeding...");

        // Seed Courses
        for (const course of courses) {
            const courseRef = doc(db, "courses", course.id.toString());
            await setDoc(courseRef, {
                title: course.title,
                image: course.image,
                description: course.description,
                markdownFile: course.markdownFile || null,
                lessons: course.lessons || [],
            });
            console.log(`Seeded course: ${course.title}`);
        }

        // Seed Quizzes
        // We will store them in a single document for now, or as individual documents in a 'quizzes' collection
        // Let's store them as individual documents in a 'quizzes' collection
        for (const question of quizQuestions) {
            const quizRef = doc(db, "quizzes", question.id.toString());
            await setDoc(quizRef, {
                question: question.question,
                options: question.options,
                correctIndex: question.correctIndex,
            });
            console.log(`Seeded quiz question: ${question.id}`);
        }

        console.log("Database seeding completed successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding database: ", error);
        return false;
    }
};
