const fs = require('fs');
const content = fs.readFileSync('d:/Projects/Brain Stroke/Main Website/src/data/Stroke Info/Brainstem-Stroke.md', 'utf8');
const lines = content.split('\n');

const newLines = [];
let inList = false;

const h2s = ['Introduction', 'Etiology', 'Epidemiology', 'Pathophysiology',
    'History and Physical Examination', 'Evaluation', 'Treatment / Management',
    'Differential Diagnosis', 'Pertinent Studies and Ongoing Trials', 'Prognosis',
    'Complications', 'Postoperative and Rehabilitation Care', 'Mortality'];

const h3s = ['Ischemic Brainstem Strokes', 'Hemorrhagic Brainstem Strokes',
    'Clinical Presentation', 'Physical Examination',
    'Initial Assessment and Investigations', 'Laboratory and Cardiovascular Evaluation',
    'Brainstem Stroke Syndromes', 'General Syndromes', 'Midbrain Syndromes', 'Pontine Syndromes', 'Medullary Syndromes',
    'Diagnostic Imaging Details', 'Classification Systems', 'Clinical Correlation',
    'Initial Stabilization', 'Reperfusion Therapy in Ischemic Stroke',
    'Intravenous Thrombolysis (tPA)', 'Mechanical Thrombectomy',
    'Management of Hemorrhagic Brainstem Stroke', 'Conservative (Medical) Management',
    'Surgical Management', 'Supportive and Nursing Care', 'Rehabilitation and Secondary Prevention',
    'Risk Factor Management', 'Emerging Therapies', 'Structural and Neoplastic Conditions',
    'Demyelinating and Inflammatory Disorders', 'Traumatic Conditions', 'Vascular and Neurological Mimics',
    'Infectious Conditions', 'Metabolic and Systemic Causes', 'Functional Disorders', 'Key Clinical Consideration',
    'Inclusion Criteria for the STIPE Trial', 'Clinical Significance', 'Predictors of Poor Outcome',
    'Ischemic Brainstem Stroke Outcomes', 'Hemorrhagic Brainstem Stroke Outcomes', 'Prognostic Indicators and Scoring',
    'Neurological Complications', 'Cranial Nerve and Functional Impairments', 'Structural and Acute Complications', 'Systemic and Secondary Complications', 'Neuropsychiatric and Long-Term Effects',
    'Management of Dysphagia', 'Management of Ataxia', 'Management of Dysarthria', 'Motor Weakness (Paresis)', 'Management of Diplopia', 'Overall Rehabilitation Outcome'];

// Keep track of \r for windows
for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    let trimmed = raw.trim();

    // remove starting hashes
    while (trimmed.startsWith('#')) {
        trimmed = trimmed.substring(1).trim();
    }

    if (trimmed === '') {
        newLines.push(raw);
        continue;
    }

    if (i === 0 || trimmed === 'Brainstem Stroke') {
        newLines.push('# ' + trimmed);
        continue;
    }

    if (h2s.includes(trimmed)) {
        newLines.push('## ' + trimmed);
        inList = false;
        continue;
    }
    if (h3s.includes(trimmed)) {
        newLines.push('### ' + trimmed);
        inList = false;
        continue;
    }

    // Check Bullet
    if (!trimmed.endsWith('.') && !trimmed.endsWith(':') && !trimmed.endsWith('?') && trimmed.length < 90 && !trimmed.startsWith('-')) {
        let prevIdx = i - 1;
        while (prevIdx >= 0 && lines[prevIdx].trim() === '') {
            prevIdx--;
        }
        if (prevIdx >= 0 && lines[prevIdx].trim().endsWith(':')) {
            newLines.push('- ' + trimmed);
            inList = true;
            continue;
        } else if (inList) {
            newLines.push('- ' + trimmed);
            continue;
        }
    } else {
        inList = false;
    }

    // formatting bold
    let newLineStr = trimmed.startsWith('-') ? raw : raw; // retain original unless mutated fully

    const syndromeMatch = trimmed.match(/^([A-Za-z0-9 /\-]+ syndrome):/i);
    if (syndromeMatch && !trimmed.startsWith('##')) {
        newLineStr = raw.replace(syndromeMatch[1] + ':', '**' + syndromeMatch[1] + ':**');
    } else {
        const terms = ['Assessment', 'Management strategies', 'Treatment options', 'Treatment strategies', 'Inclusion Criteria', 'Exclusion Criteria', 'Administration', 'Medial structures (near the midline)', 'Lateral structures'];
        for (const term of terms) {
            if (trimmed.startsWith(term + ':')) {
                newLineStr = raw.replace(term + ':', '**' + term + ':**');
                break;
            }
        }
    }
    if (trimmed.startsWith('-') && !newLineStr.trim().startsWith('-')) {
        newLines.push('- ' + newLineStr.trim());
    } else {
        newLines.push(newLineStr);
    }
}

fs.writeFileSync('d:/Projects/Brain Stroke/Main Website/src/data/Stroke Info/Brainstem-Stroke.md', newLines.join('\n'));
