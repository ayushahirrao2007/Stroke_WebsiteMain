
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
    id: 3,
    title: 'Cortical Ischemia Stroke',
    image: 'https://images.unsplash.com/photo-1679001976061-43be2417a90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJva2UlMjBhd2FyZW5lc3MlMjBoZWFsdGh8ZW58MXx8fHwxNzY3ODA4MDgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Time is brain. Learn rapid assessment protocols and emergency intervention.',
    lessons: [
      {
        id: 1,
        title: 'The Golden Hour',
        content: `The term "time is brain" reflects a stark reality: every minute a stroke goes untreated, approximately 1.9 million neurons die. In one hour, a stroke patient loses as many neurons as they would in 3.6 years of normal ageing.

**The Golden Hour in stroke care:**
The goal is to achieve reperfusion therapy (IV tPA or mechanical thrombectomy) as rapidly as possible after symptom onset.

**Key time benchmarks:**
• Door-to-CT: within 25 minutes of arrival
• Door-to-interpretation: within 45 minutes
• Door-to-needle (IV tPA): within 60 minutes
• IV tPA window: up to 4.5 hours from symptom onset (in eligible patients)
• Thrombectomy window: up to 6–24 hours (in selected patients with salvageable brain tissue)

**Pre-hospital actions:**
1. Call emergency services immediately — do NOT drive the patient yourself
2. Note the exact time symptoms began (or when the patient was last seen well)
3. Do not give food or water (aspiration risk)
4. Keep patient calm and lying flat unless breathing is compromised
5. Gather their medications and medical history for the hospital team`,
      },
      {
        id: 2,
        title: 'Initial Hospital Assessment',
        content: `On arrival at the emergency department, a structured, rapid assessment protocol is followed to determine stroke type and eligibility for reperfusion therapy.

**The stroke assessment sequence:**

1. **Airway, Breathing, Circulation (ABC)** — ensure the patient is stable
2. **NIHSS (NIH Stroke Scale)** — a standardised 15-item neurological examination scored 0–42. Assesses level of consciousness, vision, motor function, sensation, coordination, and language
3. **Blood glucose** — rule out hypoglycaemia immediately
4. **Blood pressure** — hypertension is common; generally do NOT aggressively lower BP before thrombolysis
5. **12-lead ECG** — detect atrial fibrillation (common cardioembolic source)
6. **CT brain (non-contrast)** — rule out haemorrhagic stroke
7. **CT angiogram** — identify large vessel occlusion amenable to thrombectomy
8. **Blood tests** — FBC, coagulation screen, renal function, troponin

**NIHSS score guidance:**
• 0: No symptoms | 1–4: Minor | 5–15: Moderate | 16–20: Moderate–severe | 21–42: Severe`,
      },
    ],
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
];
