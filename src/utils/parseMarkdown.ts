export interface ParsedLesson {
    id: number;
    title: string;
    content: string;
}

/**
 * Parses a raw markdown string into lesson objects.
 * Each `# Heading` becomes a separate lesson.
 */
export function parseMarkdownLessons(raw: string): ParsedLesson[] {
    // Split on H1 headings (lines starting with "# ")
    const parts = raw.split(/(?=^# )/m).filter((part) => part.trim() !== '');

    return parts.map((section, i) => {
        const lines = section.split('\n');
        // First line is "# Title"
        const titleLine = lines[0] ?? '';
        const title = titleLine.replace(/^#+\s*/, '').trim();
        // Rest is the content (strip leading blank line)
        const content = lines.slice(1).join('\n').trim();


        return { id: i + 1, title, content };
    });
}
