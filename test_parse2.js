import fs from 'fs';

const raw = fs.readFileSync('d:/Projects/Brain Stroke/Main Website/src/data/Stroke Info/Hemorrhagic Stroke.md', 'utf-8');

function parseMarkdownLessons(raw) {
    const parts = raw.split(/(?=^# )/m).filter((part) => part.trim() !== '');

    return parts.map((section, i) => {
        const lines = section.split('\n');
        const titleLine = lines[0] ?? '';
        const title = titleLine.replace(/^#+\s*/, '').trim();
        const content = lines.slice(1).join('\n').trim();

        return { id: i + 1, title, contentLength: content.length };
    });
}

console.log(parseMarkdownLessons(raw));
