// Type declarations for Vite's ?raw and ?url import queries

declare module '*.md?raw' {
    const content: string;
    export default content;
}

declare module '*.md' {
    const content: string;
    export default content;
}
