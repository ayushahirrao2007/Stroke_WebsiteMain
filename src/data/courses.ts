export interface Lesson {
  id: number;
  title: string;
  content: string;
}

// Lesson type for markdown-parsed lessons (content is required but sourced from the .md file)
export interface MarkdownLesson {
  id: number;
  title: string;
  content: string;
}

export interface Course {
  id: number;
  title: string;
  image: string;
  description: string;
  lessons: Lesson[];
  markdownFile?: string;
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'Ischemic Stroke',
    image: '/images/ischemic_stroke.webp',
    description: 'Learn the fundamental structures of the brain and how strokes affect different regions.',
    markdownFile: 'Ischemic-Stroke.md',
    lessons: [],
  },
  {
    id: 2,
    title: 'Hemorrhagic Stroke',
    image: '/images/hemorrhagic_stroke.webp',
    description: 'Master the FAST method and other critical stroke identification techniques.',
    markdownFile: 'Hemorrhagic Stroke.md',
    lessons: [],
  },
  {
    id: 3,
    title: 'Lacunar Stroke',
    image: '/images/lacunar_stroke.webp',
    description: 'Comprehensive neurological examination techniques for stroke patients.',
    markdownFile: 'Lacunar-Stroke.md',
    lessons: [],
  },
  {
    id: 4,
    title: 'Watershed Stroke',
    image: '/images/watershed_stroke.webp',
    description: 'Post-stroke care, rehabilitation strategies, and patient communication.',
    markdownFile: 'Watershed-Stroke.md',
    lessons: [],
  },
  {
    id: 5,
    title: 'Brainstem Stroke',
    image: '/images/brainstem_stroke.webp',
    description: 'Understand the critical presentation, diagnosis, and management of brainstem strokes.',
    markdownFile: 'Brainstem-Stroke.md',
    lessons: [],
  },
  {
    id: 6,
    title: 'Cerebellar Infarcts',
    image: '/images/cerebellar_infarcts.webp',
    description: 'Learn about the etiology, clinical presentation, evaluation and management of cerebellar infarcts.',
    markdownFile: 'Cerebellar Infarcts.md',
    lessons: [],
  },
  {
    id: 7,
    title: 'TIA',
    image: '/images/tia.webp',
    description: 'Learn about the etiology, clinical presentation, evaluation and management of transient ischemic attacks.',
    markdownFile: 'TIA.md',
    lessons: [],
  },
  {
    id: 8,
    title: 'Investigations in Stroke',
    image: '/images/investigations_in_stroke.jpg',
    description: 'Learn diagnostic neuroimaging, cardiac workup, laboratory tests, and acute emergency algorithms.',
    markdownFile: 'Investigations in Stroke.md',
    lessons: [],
  },
  {
    id: 9,
    title: 'Differential Diagnosis',
    image: '/images/differential_diagnosis.jpg',
    description: 'Systematically differentiate acute stroke from common mimics like hypoglycemia, seizures, and migraines.',
    markdownFile: 'Differential Diagnosis.md',
    lessons: [],
  },
  {
    id: 10,
    title: 'Complications of Stroke',
    image: '/images/complications_of_stroke.jpg',
    description: 'Understand, prevent, and manage neurological and systemic complications after acute stroke.',
    markdownFile: 'Complications of Stroke.md',
    lessons: [],
  },
  {
    id: 11,
    title: 'CT & MRI Interpretation',
    image: '/images/ct_mri_interpretation.jpg',
    description: 'Systematic approach for interpreting CT and MRI scans, ischemic signs, hemorrhage, and vascular territories.',
    markdownFile: 'CT N MRI.md',
    lessons: [],
  },
  {
    id: 12,
    title: 'Stroke Pearls & Pitfalls',
    image: '/images/stroke_pearls.jpg',
    description: 'High-yield clinical pearls, common diagnostic mistakes, FAST vs BE-FAST, NIHSS scoring, and mnemonics.',
    markdownFile: 'STROKE PEARLS.md',
    lessons: [],
  },
];
