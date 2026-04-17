// ─────────────────────────────────────────────────────────────
//  Quiz Data
//  Questions will be provided by the client.
//  To add real questions, replace the placeholder entries below
//  with the actual question objects following the same shape.
// ─────────────────────────────────────────────────────────────

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number; // 0-based index of the correct option
}

// Questions will be provided by the client.
export const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "[Placeholder] What is the most common type of stroke?",
        options: [
            "[Placeholder] Option A",
            "[Placeholder] Option B",
            "[Placeholder] Option C",
            "[Placeholder] Option D",
        ],
        correctIndex: 0,
    },
    {
        id: 2,
        question: "[Placeholder] Which of the following is an early warning sign of a stroke?",
        options: [
            "[Placeholder] Option A",
            "[Placeholder] Option B",
            "[Placeholder] Option C",
            "[Placeholder] Option D",
        ],
        correctIndex: 1,
    },
    {
        id: 3,
        question: "[Placeholder] What does the acronym FAST stand for in stroke awareness?",
        options: [
            "[Placeholder] Option A",
            "[Placeholder] Option B",
            "[Placeholder] Option C",
            "[Placeholder] Option D",
        ],
        correctIndex: 2,
    },
    {
        id: 4,
        question: "[Placeholder] Which brain region is most commonly affected in an ischemic stroke?",
        options: [
            "[Placeholder] Option A",
            "[Placeholder] Option B",
            "[Placeholder] Option C",
            "[Placeholder] Option D",
        ],
        correctIndex: 0,
    },
    {
        id: 5,
        question: "[Placeholder] What is the primary treatment for an ischemic stroke?",
        options: [
            "[Placeholder] Option A",
            "[Placeholder] Option B",
            "[Placeholder] Option C",
            "[Placeholder] Option D",
        ],
        correctIndex: 3,
    },
];
