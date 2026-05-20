export interface ParsedLesson {
    id: number;
    title: string;
    content: string;
}

/**
 * Parses a raw markdown string into lesson objects.
 * Each `# Heading` becomes a separate lesson in the left panel.
 * `##` and `###` are treated as subtopics within the lesson content.
 */
export function parseMarkdownLessons(raw: string): ParsedLesson[] {
    const rawLines = raw.split(/\r?\n/);
    const sections: ParsedLesson[] = [];
    let current: ParsedLesson | null = null;
    let sectionCounter = 0;

    for (const rawLine of rawLines) {
        const line = rawLine;
        
        // Match ONLY # headings for main topics
        const isHeading = /^#\s/.test(line);

        // Skip anything before the first heading
        if (!current && !isHeading) {
            continue;
        }

        // Found a main section heading
        if (isHeading) {
            if (current) {
                sections.push(current);
            }
            sectionCounter++;
            current = {
                id: sectionCounter,
                title: line.replace(/^#\s*/, '').trim(),
                content: '',
            };
            continue;
        }

        // Accumulate lines if we are inside a section
        if (current) {
            current.content += (current.content ? '\n' : '') + line;
        }
    }

    if (current) {
        sections.push(current);
    }

    return sections;
}
