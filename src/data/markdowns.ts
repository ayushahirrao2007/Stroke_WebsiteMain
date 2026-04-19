// This module imports markdown files as raw strings using Vite's built-in ?raw import.
// Each key matches the `markdownFile` property in courses.ts.

import ischemicStrokeMd from './Stroke Info/Ischemic-Stroke.md?raw';
import hemorrhagicStrokeMd from './Stroke Info/Hemorrhagic Stroke.md?raw';
import lacunarStrokeMd from './Stroke Info/Lacunar-Stroke.md?raw';
import watershedStrokeMd from './Stroke Info/Watershed-Stroke.md?raw';
import brainstemStrokeMd from './Stroke Info/Brainstem-Stroke.md?raw';
import cerebellarInfarctsMd from './Stroke Info/Cerebellar Infarcts.md?raw';

export const markdownFiles: Record<string, string> = {
    'Ischemic-Stroke.md': ischemicStrokeMd,
    'Hemorrhagic Stroke.md': hemorrhagicStrokeMd,
    'Lacunar-Stroke.md': lacunarStrokeMd,
    'Watershed-Stroke.md': watershedStrokeMd,
    'Brainstem-Stroke.md': brainstemStrokeMd,
    'Cerebellar Infarcts.md': cerebellarInfarctsMd,
};