import sys

file_path = "d:/Projects/Brain Stroke/Main Website/src/data/Stroke Info/Hemorrhagic Stroke.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("## Hypertension", "## Hypertension\n\n![Hypertension](/assets/images/1-Hypertension.webp)"),
    ("## Cerebral Amyloid Angiopathy", "## Cerebral Amyloid Angiopathy\n\n![Cerebral Amyloid Angiopathy](/assets/images/2-Cerebral-Amyloid-Angiopathy.webp)"),
    ("## Causes of Subarachnoid Hemorrhage", "## Causes of Subarachnoid Hemorrhage\n\n![Causes of Subarachnoid Hemorrhage](/assets/images/3-Causes-of-Subarachnoid-Hemorrhage.webp)"),
    ("# Epidemiology", "# Epidemiology\n\n![Epidemiology](/assets/images/4-Epidemiology.webp)"),
    ("# Pathophysiology and Sites of Bleeding", "# Pathophysiology and Sites of Bleeding\n\n![Pathophysiology and Sites of Bleeding](/assets/images/5-Pathophysiology-and-Sites-of-Bleeding.webp)"),
    ("## Non-Aneurysmal Subarachnoid Hemorrhage", "## Non-Aneurysmal Subarachnoid Hemorrhage\n\n![Non-Aneurysmal Subarachnoid Hemorrhage](/assets/images/6-Non-Aneurysmal-Subarachnoid-Hemorrhage.webp)"),
    ("# Histopathology", "# Histopathology\n\n![Histopathology](/assets/images/7-Histopathology.webp)"),
    ("# History and Physical", "# History and Physical\n\n![History and Physical](/assets/images/8-History-and-Physical.webp)"),
    ("## Clinical Features of Subarachnoid Hemorrhage", "## Clinical Features of Subarachnoid Hemorrhage\n\n![Clinical Features of Subarachnoid Hemorrhage](/assets/images/9-Clinical-Features-of-Subarachnoid-Hemorrhage.webp)"),
    ("# Evaluation of Hemorrhagic Stroke", "# Evaluation of Hemorrhagic Stroke\n\n![Evaluation of Hemorrhagic Stroke](/assets/images/10-Evaluation-of-Hemorrhagic-Stroke.webp)"),
    ("# Treatment and Management ", "# Treatment and Management \n\n![Treatment and Management](/assets/images/11-Treatment-and-Management.webp)"),
    ("## Management of Increased Intracranial Pressure", "## Management of Increased Intracranial Pressure\n\n![Management of Increased Intracranial Pressure](/assets/images/12-Management-of-Increased-Intracranial-Pressure.webp)"),
    ("## Hemostatic Therapy", "## Hemostatic Therapy\n\n![Hemostatic and Antiepileptic Therapies](/assets/images/13-Hemostatic-and-Antiepileptic-Therapies.webp)"),
    ("### Decompressive Craniectomy", "### Decompressive Craniectomy\n\n![Decompressive Craniectomy](/assets/images/14-Decompressive-Craniectomy.webp)"),
    ("# Cerebroprotection", "# Cerebroprotection\n\n![Cerebroprotection](/assets/images/15-Cerebroprotection.webp)"),
    ("# General Care", "# General Care\n\n![General Care](/assets/images/16-General-Care.webp)"),
    ("# Differential Diagnosis", "# Differential Diagnosis\n\n![Differential Diagnosis](/assets/images/17-Differential-Diagnosis.webp)"),
    ("# Prognosis", "# Prognosis\n\n![Prognosis](/assets/images/18-Prognosis.webp)"),
    ("# Complications", "# Complications\n\n![Complications](/assets/images/19-Complications.webp)"),
    ("# Prevention and Patient Education", "# Prevention and Patient Education\n\n![Prevention and Patient Education](/assets/images/20-Prevention-and-Patient-Education.webp)")
]

for src, dest in replacements:
    content = content.replace(src, dest, 1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
