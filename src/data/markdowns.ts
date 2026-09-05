// Central registry for markdown content loaded via Vite's import.meta.glob.
// Dynamically discovers all Stroke Info and Case Studies markdown files.

const strokeFiles = import.meta.glob<string>('./Stroke Info/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const caseFiles = import.meta.glob<string>('./Case Studies/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const modernMedicineFiles = import.meta.glob<string>('./Modern Medicines/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

export const markdownFiles: Record<string, string> = {};

// Register all Stroke Info files using their filename
for (const [path, content] of Object.entries(strokeFiles)) {
    const filename = path.split('/').pop() || path;
    markdownFiles[filename] = content;
    markdownFiles[filename.replace(/\s+/g, '-')] = content;
    markdownFiles[filename.replace(/-/g, ' ')] = content;
}

// Register all Case Studies files using their filename
for (const [path, content] of Object.entries(caseFiles)) {
    const filename = path.split('/').pop() || path;
    markdownFiles[filename] = content;
    markdownFiles[filename.replace(/\s+/g, '-')] = content;
    markdownFiles[filename.replace(/-/g, ' ')] = content;
}

// Register all Modern Medicines files using their filename
for (const [path, content] of Object.entries(modernMedicineFiles)) {
    const filename = path.split('/').pop() || path;
    markdownFiles[filename] = content;
    markdownFiles[filename.replace(/\s+/g, '-')] = content;
    markdownFiles[filename.replace(/-/g, ' ')] = content;
}