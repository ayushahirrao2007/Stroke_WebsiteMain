import fs from 'fs';

const raw = fs.readFileSync('src/data/Stroke Info/Hypertension-role.md', 'utf-8');

function parseIntoSections(raw: string) {
    const rawLines = raw.split(/\r?\n/);
    const sections = [];
    let current = null;
    let sectionCounter = 0;

    for (const rawLine of rawLines) {
        const line = rawLine;
        
        // Match either # or ## headings
        const isHeading = /^(?:#{1,2})\s/.test(line);

        // Skip anything before the first heading
        if (!current && !isHeading) {
            continue;
        }

        // Found a section heading
        if (isHeading) {
            if (current) {
                sections.push(current);
            }
            sectionCounter++;
            current = {
                id: sectionCounter,
                title: line.replace(/^(?:#{1,2})\s*/, '').trim(),
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

console.log(parseIntoSections(raw));
