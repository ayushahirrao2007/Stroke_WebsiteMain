
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
    image: 'https://images.unsplash.com/photo-1725689587796-af783f04c0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMG1lZGljYWwlMjBzdHVkZW50fGVufDF8fHx8MTc2NzgwODI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Learn the fundamental structures of the brain and how strokes affect different regions.',
    markdownFile: 'Ischemic-Stroke.md',
    lessons: [],
  },
  {
    id: 2,
    title: 'Hemorrhagic Stroke',
    image: 'https://images.unsplash.com/photo-1767378262839-9d615a266ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwbmV1cm9sb2d5fGVufDF8fHx8MTc2NzgwODI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Master the FAST method and other critical stroke identification techniques.',
    markdownFile: 'Hemorrhagic Stroke.md',
    lessons: [],
  },

  {
    id: 4,
    title: 'Lacunar Stroke',
    image: 'https://images.unsplash.com/photo-1674702727317-d29b2788dc4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzY3NzkxNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Comprehensive neurological examination techniques for stroke patients.',
    markdownFile: 'Lacunar-Stroke.md',
    lessons: [],
  },
  {
    id: 5,
    title: 'Watershed Stroke',
    image: 'https://images.unsplash.com/photo-1576670160060-c4e874631c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY3ODA4MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Post-stroke care, rehabilitation strategies, and patient communication.',
    markdownFile: 'Watershed-Stroke.md',
    lessons: [],
  },
  {
    id: 6,
    title: 'Brainstem Stroke',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Understand the critical presentation, diagnosis, and management of brainstem strokes.',
    markdownFile: 'Brainstem-Stroke.md',
    lessons: [],
  },
  {
    id: 7,
    title: 'Cerebellar Infarcts',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Learn about the etiology, clinical presentation, evaluation and management of cerebellar infarcts.',
    markdownFile: 'Cerebellar Infarcts.md',
    lessons: [],
  },
  {
    id: 8,
    title: 'TIA',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Learn about the etiology, clinical presentation, evaluation and management of cerebellar infarcts.',
    markdownFile: 'TIA.md',
    lessons: [],
  },
];
