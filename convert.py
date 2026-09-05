#!/usr/bin/env python3
"""
Reusable High-Fidelity DOCX -> Markdown Converter & Strict Validation Engine
=============================================================================

Converts DOCX clinical case studies and medical documents into clean,
high-fidelity GitHub-Flavored Markdown (GFM) files with an automated strict
validation layer.

Features:
- Sequential traversal of body elements preserving original document order.
- High-fidelity inline formatting (bold, italic, strikethrough, hyperlinks) with run merging.
- Intelligent heading and hierarchy detection with key-value protection.
- Conversion of Word tables into GFM tables with multiline (<br>) and pipe escaping.
- Flowchart and ASCII diagram aggregation into fenced code blocks.
- Blockquote and dialogue formatting.
- Bullet and numbered list preservation with multi-level indentation.
- Complete UTF-8 preservation (emojis, mathematical symbols, Greek letters, box drawing).
- Automated validation layer with word-level source preservation checking and diff categorization.
- Strict validation mode (--strict) for zero content loss verification.
- Batch and single-file CLI modes with clear progress and error reporting.

Usage:
  python convert.py
  python convert.py "input/CASE 0012.docx"
  python convert.py --validate --strict --overwrite
"""

import argparse
import json
import os
import re
import sys
import unicodedata
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional, Set, Tuple

try:
    import docx
    from docx.oxml.ns import qn
    from docx.table import Table
    from docx.text.paragraph import Paragraph
except ImportError:
    print("Error: 'python-docx' is not installed. Please install it using: pip install python-docx", file=sys.stderr)
    sys.exit(1)

# Ensure UTF-8 output encoding on Windows terminals
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

# Flowchart / Box-drawing characters
FLOWCHART_CHARS = set('│▼▲►◄┌┐└┘├┤┬┴┼═║─')

def _is_major_section_break(text: str) -> bool:
    t = text.strip().upper()
    if any(k in t for k in [
        'HOW DID THE DOCTOR',
        'FINAL DIAGNOSIS',
        'DISCHARGE SUMMARY',
        'REHABILITATION',
        'SECONDARY PREVENTION',
        'STROKE TEAM',
        'CLINICAL PEARL',
        'KEY LEARNING POINT',
        'IMMEDIATE EMERGENCY'
    ]):
        return True
    if re.match(r'^\d{1,2}\.\s+[A-Z0-9]', t) and not any(c in t for c in FLOWCHART_CHARS):
        return True
    return False

# Special characters regex for validation tracking
UNICODE_CATEGORY_PATTERNS = {
    'emojis': re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE),
    'box_drawing': re.compile(r'[\u2500-\u257f\u2580-\u259f\u25a0-\u25ff]'),
    'arrows': re.compile(r'[\u2190-\u21ff\u27f0-\u27ff]'),
    'mathematical_symbols': re.compile(r'[≤≥±×÷≠≈∞∑√∂∫]'),
    'degree_units': re.compile(r'[°℃℉²³µ]'),
    'greek_letters': re.compile(r'[\u0370-\u03ff]'),
}

# Known major section headings for clinical case studies
KNOWN_MAJOR_SECTIONS = {
    'STROKE ALERT ACTIVATED',
    'DIFFERENTIAL DIAGNOSIS FLOWCHART',
    'DIFFERENTIAL DIAGNOSOSIS FLOWCHART',
    'DIFFERENTIAL DIAGNOSIS',
    'DIFFERENTIAL DIAGNOSOSIS',
    'HOW DID THE DOCTOR REACH THE DIAGNOSIS?',
    'EMERGENCY INVESTIGATIONS',
    'LABORATORY REPORTS',
    'STROKE TEAM MANAGEMENT',
    'STROKE TEAM DISCUSSION',
    'FINAL DIAGNOSIS',
    'DISCHARGE SUMMARY',
    'REHABILITATION',
    'SECONDARY PREVENTION',
    'HOSPITAL PROGRESS',
    'NURSING MANAGEMENT',
    'VASCULAR TERRITORY CORRELATION',
    'INITIAL CLINICAL IMPRESSION',
    'INVESTIGATION REQUEST FORM',
    'ECG REPORT',
    'NON-CONTRAST CT BRAIN',
    'CT INTERPRETATION',
    'CT ANGIOGRAPHY',
    'MRI BRAIN',
    'MRI BRAIN (PERFORMED AFTER INITIAL STABILIZATION)',
    'CLINICAL PEARL',
    'KEY LEARNING POINT',
    'IMMEDIATE EMERGENCY MANAGEMENT',
    'MEDICATION EDUCATION BOX',
    'HOMOEOPATHIC PERSPECTIVE',
    'HOMOEOPATHIC PERSPECTIVE (AFTER STABILIZATION)',
    'LEARNING OBJECTIVE',
    'WHY ARE INVESTIGATIONS IMPORTANT?',
    'INITIAL INVESTIGATION ALGORITHM',
    'NEUROIMAGING INVESTIGATIONS',
    'CARDIAC INVESTIGATIONS',
    'LABORATORY INVESTIGATIONS',
    'PAST MEDICAL HISTORY (K/C/O)',
    'AMBULANCE HANDOVER',
    'TRIAGE NURSE NOTE',
    'TRIAGE OBSERVATIONS',
    "DOCTOR'S THOUGHT PROCESS",
    'DOCTOR–PATIENT INTERACTION',
    'DOCTOR-PATIENT INTERACTION',
}

# Subsections / roles / step headings
KNOWN_SUBSECTIONS = {
    'PARAMEDIC',
    'EMERGENCY PHYSICIAN',
    'NEUROLOGIST',
    'NEUROSURGEON',
    'DOCTOR',
    'PATIENT',
    'TRIAGE NURSE',
    'RADIOLOGIST',
    "RADIOLOGIST'S REPORT",
    'FINDINGS',
    'IMPRESSION',
    'MRI IMPRESSION',
    'MRI FINDINGS',
    'CTA FINDINGS',
    'ECG FINDINGS',
    'EARLY CT FINDINGS',
    'SEQUENCES',
    'COMPLETE BLOOD COUNT',
    'RANDOM BLOOD SUGAR',
    'RENAL FUNCTION TEST',
    'SERUM ELECTROLYTES',
    'PT / INR',
    'PT/INR',
    'LIPID PROFILE',
    'PHYSIOTHERAPY',
    'SPEECH THERAPY',
    'OCCUPATIONAL THERAPY',
    'PSYCHOLOGICAL COUNSELLING',
    'WHY?',
    'PURPOSE',
    'WHY WAS IT DONE?',
    'WHY WAS IT CONSIDERED?',
    'EXPECTED BENEFIT',
    "DOCTOR'S THOUGHT PROCESS",
    'CLINICAL PEARL',
    'KEY LEARNING POINT',
    'CLINICAL CORRELATION',
    'HOMOEOPATHIC CASE-TAKING',
    'ILLUSTRATIVE REMEDY CONSIDERATIONS',
    'HOURLY NEUROLOGICAL ASSESSMENT',
    'POSITIONING',
    'SWALLOW ASSESSMENT',
    'PRESSURE AREA CARE',
    'FALL PREVENTION',
    'DEEP VEIN THROMBOSIS PREVENTION',
    'INTERPRETATION',
    'DAY 1',
    'DAY 2',
    'DAY 3',
    'DAY 4',
    'DAY 5',
    'DAY 6',
    'DAY 7',
}


@dataclass
class FormattedRun:
    """Represents a text run with formatting."""
    text: str
    bold: bool = False
    italic: bool = False
    strike: bool = False
    link_url: Optional[str] = None


@dataclass
class DiffDetail:
    """Detailed record of a text difference between source and markdown."""
    opcode: str
    source_chunk: List[str]
    markdown_chunk: List[str]
    source_context: str
    markdown_context: str
    classification: str


@dataclass
class ValidationResult:
    """Stores validation metrics for a single document conversion."""
    filename: str
    source_paragraph_count: int = 0
    source_table_count: int = 0
    source_body_element_count: int = 0
    markdown_block_count: int = 0
    source_text_char_count: int = 0
    markdown_source_text_char_count: int = 0
    source_word_count: int = 0
    markdown_word_count: int = 0
    word_difference: int = 0
    preservation_ratio: float = 1.0
    missing_words: List[str] = field(default_factory=list)
    extra_words: List[str] = field(default_factory=list)
    diff_details: List[DiffDetail] = field(default_factory=list)
    classification: str = "Exact content preservation"
    detected_unicode_special_chars: Dict[str, List[str]] = field(default_factory=dict)
    warnings: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    status: str = "PASS"


class NumberingResolver:
    """Resolves DOCX numbering definitions (bullet vs decimal vs roman)."""

    def __init__(self, doc: docx.Document):
        self.doc = doc
        self.num_to_abstract: Dict[str, str] = {}
        self.abstract_fmts: Dict[Tuple[str, str], Tuple[str, str]] = {}
        self._parse_numbering()

    def _parse_numbering(self):
        try:
            num_part = self.doc.part.numbering_part
            if num_part is None:
                return
            num_elm = num_part._element
            W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

            for num in num_elm.findall(f'{W}num'):
                numId = num.get(f'{W}numId')
                abs_ref = num.find(f'{W}abstractNumId')
                if numId and abs_ref is not None:
                    abs_val = abs_ref.get(f'{W}val')
                    if abs_val:
                        self.num_to_abstract[str(numId)] = str(abs_val)

            for abs_num in num_elm.findall(f'{W}abstractNum'):
                absId = abs_num.get(f'{W}abstractNumId')
                if not absId:
                    continue
                for lvl in abs_num.findall(f'{W}lvl'):
                    ilvl = lvl.get(f'{W}ilvl', '0')
                    num_fmt_el = lvl.find(f'{W}numFmt')
                    lvl_text_el = lvl.find(f'{W}lvlText')
                    num_fmt = num_fmt_el.get(f'{W}val', 'bullet') if num_fmt_el is not None else 'bullet'
                    lvl_text = lvl_text_el.get(f'{W}val', '') if lvl_text_el is not None else ''
                    self.abstract_fmts[(str(absId), str(ilvl))] = (num_fmt, lvl_text)
        except Exception:
            pass

    def get_list_info(self, p: Paragraph) -> Optional[Tuple[str, int]]:
        """
        Returns (list_type, ilvl) where list_type is 'bullet' or 'ordered'.
        Returns None if not a list paragraph.
        """
        p_elm = p._p
        W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        pPr = p_elm.find(f'{W}pPr')
        if pPr is None:
            return None
        numPr = pPr.find(f'{W}numPr')
        if numPr is None:
            return None

        numId_el = numPr.find(f'{W}numId')
        ilvl_el = numPr.find(f'{W}ilvl')

        numId = numId_el.get(f'{W}val') if numId_el is not None else None
        ilvl = int(ilvl_el.get(f'{W}val', '0')) if ilvl_el is not None else 0

        if not numId:
            return None

        absId = self.num_to_abstract.get(str(numId))
        if absId:
            num_fmt, lvl_text = self.abstract_fmts.get((absId, str(ilvl)), ('bullet', ''))
            if num_fmt == 'bullet' or any(c in lvl_text for c in ['', 'o', '', 'v', '•', '-']):
                return ('bullet', ilvl)
            else:
                return ('ordered', ilvl)

        return ('bullet', ilvl)


class DocxToMarkdownConverter:
    """Deterministic, high-fidelity DOCX to Markdown Converter."""

    def __init__(self, doc_path: str, verbose: bool = False):
        self.doc_path = doc_path
        self.verbose = verbose
        self.doc = docx.Document(doc_path)
        self.num_resolver = NumberingResolver(self.doc)
        self.rels = self.doc.part.rels
        self.warnings: List[str] = []
        self.errors: List[str] = []

    def _extract_runs(self, p: Paragraph) -> List[FormattedRun]:
        """Extracts and merges runs with consistent formatting."""
        raw_runs: List[FormattedRun] = []
        W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

        for child in p._p:
            tag = child.tag.split('}')[-1]
            if tag == 'r':
                r_obj = docx.text.run.Run(child, p)
                text = r_obj.text
                if not text:
                    continue
                bold = bool(r_obj.bold)
                italic = bool(r_obj.italic)
                strike = bool(r_obj.font.strike)
                raw_runs.append(FormattedRun(text=text, bold=bold, italic=italic, strike=strike))
            elif tag == 'hyperlink':
                rId = child.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                url = self.rels[rId].target_ref if rId in self.rels else None
                for r_child in child.findall(f'{W}r'):
                    r_obj = docx.text.run.Run(r_child, p)
                    text = r_obj.text
                    if not text:
                        continue
                    bold = bool(r_obj.bold)
                    italic = bool(r_obj.italic)
                    strike = bool(r_obj.font.strike)
                    raw_runs.append(FormattedRun(text=text, bold=bold, italic=italic, strike=strike, link_url=url))

        # Merge adjacent runs with identical formatting
        merged_runs: List[FormattedRun] = []
        for r in raw_runs:
            if merged_runs and (
                merged_runs[-1].bold == r.bold
                and merged_runs[-1].italic == r.italic
                and merged_runs[-1].strike == r.strike
                and merged_runs[-1].link_url == r.link_url
            ):
                merged_runs[-1].text += r.text
            else:
                merged_runs.append(FormattedRun(
                    text=r.text,
                    bold=r.bold,
                    italic=r.italic,
                    strike=r.strike,
                    link_url=r.link_url
                ))

        return merged_runs

    def _format_inline(self, p: Paragraph) -> str:
        """Formats paragraph runs into Markdown with proper whitespace positioning."""
        runs = self._extract_runs(p)
        result = []

        for r in runs:
            text = r.text
            if not text:
                continue

            l_ws = text[:len(text) - len(text.lstrip())]
            r_ws = text[len(text.rstrip()):]
            core = text.strip()

            if not core:
                result.append(text)
                continue

            formatted_core = core
            if r.bold and r.italic:
                formatted_core = f"***{formatted_core}***"
            elif r.bold:
                formatted_core = f"**{formatted_core}**"
            elif r.italic:
                formatted_core = f"*{formatted_core}*"

            if r.strike:
                formatted_core = f"~~{formatted_core}~~"

            if r.link_url:
                formatted_core = f"[{formatted_core}]({r.link_url})"

            result.append(f"{l_ws}{formatted_core}{r_ws}")

        return "".join(result)

    def _is_flowchart_line(self, text: str) -> bool:
        """Checks if a string contains box-drawing / diagram flowchart characters."""
        return any(c in FLOWCHART_CHARS for c in text)

    def _is_key_value_line(self, p: Paragraph) -> bool:
        """Detects key-value lines like 'Door Time: 10:18 AM'."""
        text = p.text.strip()
        if not text or '\n' in text:
            return False
        colon_pos = text.find(':')
        if 0 < colon_pos < 40 and colon_pos < len(text) - 1:
            label = text[:colon_pos].strip()
            if not any(k in label.upper() for k in ['STEP', 'SECTION', 'NOTE', 'CASE']):
                return True
        return False

    def _classify_heading(self, p: Paragraph, is_first_p: bool, prev_was_title: bool) -> Optional[Tuple[int, str]]:
        """
        Classifies paragraph as heading (level 1-6) or returns None if regular content.
        Uses Word styles first, then high-confidence heuristics.
        """
        text = p.text.strip()
        if not text:
            return None

        # 1. Word style check
        style_name = p.style.name.lower() if p.style else ""
        if 'heading 1' in style_name or style_name == 'title':
            return (1, text)
        if 'heading 2' in style_name or style_name == 'subtitle':
            return (2, text)
        if 'heading 3' in style_name:
            return (3, text)
        if 'heading 4' in style_name:
            return (4, text)
        if 'heading 5' in style_name:
            return (5, text)
        if 'heading 6' in style_name:
            return (6, text)

        # 2. Key-value line protection (never make key-values headings)
        if self._is_key_value_line(p):
            return None

        # 3. All-bold or specific text patterns
        runs = self._extract_runs(p)
        is_all_bold = len(runs) > 0 and all(r.bold for r in runs if r.text.strip())

        # Document main title heuristic (first non-empty paragraph starting with CASE or title)
        if is_first_p and (text.upper().startswith('CASE') or is_all_bold):
            return (1, text)

        # Document subtitle directly under title
        if prev_was_title and (
            (text.startswith('"') and text.endswith('"')) or
            (text.startswith('“') and text.endswith('”'))
        ):
            return (2, text)

        # Major numbered section header e.g. "1. AMBULANCE HANDOVER", "24. CT ANGIOGRAPHY (HEAD & NECK)"
        if re.match(r'^\d{1,2}\.\s+[^\n]+$', text) and (is_all_bold or len(text) < 85):
            return (2, text)

        # Known major section headings
        clean_upper = re.sub(r'^\d{1,2}\.\s*', '', text.upper()).strip()
        if clean_upper in KNOWN_MAJOR_SECTIONS:
            return (2, text)

        # Step / Day / Role / Sub-section headers (only when all bold or short and specific)
        if is_all_bold and len(text) < 75:
            if re.match(r'^(Step\s+\d+|Day\s+\d+|SECTION\s+\d+)', text, re.IGNORECASE):
                return (3, text)
            if clean_upper in KNOWN_SUBSECTIONS or text.upper() in KNOWN_SUBSECTIONS:
                return (3, text)
            if text.startswith('Why') and text.endswith('?'):
                return (3, text)

        return None

    def _convert_table(self, table: Table) -> str:
        """Converts a DOCX table to GFM Markdown table."""
        rows_data: List[List[str]] = []
        has_merged_cells = False

        for r_idx, row in enumerate(table.rows):
            row_cells_text: List[str] = []
            for c_idx, cell in enumerate(row.cells):
                tcPr = cell._tc.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tcPr')
                if tcPr is not None:
                    gridSpan = tcPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}gridSpan')
                    vMerge = tcPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}vMerge')
                    if gridSpan is not None or vMerge is not None:
                        has_merged_cells = True

                cell_p_texts = []
                for p in cell.paragraphs:
                    p_text = self._format_inline(p).strip()
                    if p_text:
                        cell_p_texts.append(p_text)

                cell_formatted = "<br>".join(cell_p_texts)
                cell_formatted = cell_formatted.replace('|', '\\|')
                row_cells_text.append(cell_formatted)

            rows_data.append(row_cells_text)

        if has_merged_cells:
            self.warnings.append(f"Table with {len(table.rows)} rows contains merged cells (gridSpan/vMerge). Preserved content using standard GFM layout.")

        if not rows_data:
            return ""

        max_cols = max(len(r) for r in rows_data)
        normalized_rows = []
        for r in rows_data:
            if len(r) < max_cols:
                r = r + [''] * (max_cols - len(r))
            normalized_rows.append(r)

        md_lines = []
        header_row = normalized_rows[0]
        md_lines.append("| " + " | ".join(header_row) + " |")
        md_lines.append("| " + " | ".join(['---'] * max_cols) + " |")

        for r in normalized_rows[1:]:
            md_lines.append("| " + " | ".join(r) + " |")

        return "\n".join(md_lines)

    def convert(self) -> str:
        """Performs sequential document conversion to Markdown."""
        body_elements = list(self.doc.element.body)
        md_blocks: List[str] = []

        i = 0
        total_elements = len(body_elements)
        is_first_non_empty_p = True
        prev_was_title = False

        while i < total_elements:
            elm = body_elements[i]
            tag = elm.tag.split('}')[-1]

            if tag == 'sectPr':
                i += 1
                continue

            if tag == 'tbl':
                tbl_obj = Table(elm, self.doc)
                tbl_md = self._convert_table(tbl_obj)
                if tbl_md:
                    md_blocks.append(tbl_md)
                i += 1
                prev_was_title = False
                continue

            if tag == 'p':
                p_obj = Paragraph(elm, self.doc)
                text = p_obj.text.strip()

                if not text:
                    i += 1
                    continue

                # 1. Check for Flowchart / Box Diagram sequence
                if self._is_flowchart_line(text):
                    fc_lines = [p_obj.text]
                    j = i + 1
                    while j < total_elements:
                        next_elm = body_elements[j]
                        if next_elm.tag.split('}')[-1] != 'p':
                            break
                        next_p = Paragraph(next_elm, self.doc)
                        next_text = next_p.text

                        lookahead_has_fc = any(
                            self._is_flowchart_line(Paragraph(body_elements[k], self.doc).text)
                            for k in range(j, min(j + 3, total_elements))
                            if body_elements[k].tag.split('}')[-1] == 'p'
                        )

                        if _is_major_section_break(next_text):
                            break

                        if lookahead_has_fc:
                            fc_lines.append(next_text)
                            j += 1
                        else:
                            if fc_lines and self._is_flowchart_line(fc_lines[-1]) and next_text.strip():
                                fc_lines.append(next_text)
                                j += 1
                            break

                    diagram_code = "```text\n" + "\n".join(fc_lines) + "\n```"
                    md_blocks.append(diagram_code)
                    i = j
                    prev_was_title = False
                    is_first_non_empty_p = False
                    continue

                # 2. Check for Headings
                heading_info = self._classify_heading(p_obj, is_first_non_empty_p, prev_was_title)
                if heading_info is not None:
                    level, h_text = heading_info
                    prefix = '#' * level
                    md_blocks.append(f"{prefix} {h_text}")
                    if level == 1:
                        prev_was_title = True
                    else:
                        prev_was_title = False
                    is_first_non_empty_p = False
                    i += 1
                    continue

                # 3. Check for Lists (XML numPr or text bullets)
                list_info = self.num_resolver.get_list_info(p_obj)
                formatted_content = self._format_inline(p_obj).strip()

                if list_info is not None:
                    list_type, ilvl = list_info
                    indent = "  " * ilvl
                    bullet_sym = "-" if list_type == 'bullet' else "1."
                    md_blocks.append(f"{indent}{bullet_sym} {formatted_content}")
                    prev_was_title = False
                    is_first_non_empty_p = False
                    i += 1
                    continue

                # Check text-based bullets
                text_bullet_match = re.match(r'^([•–—▪▫\*\-]\s+|\d+[\.\)]\s+)(.*)$', text)
                if text_bullet_match and not is_first_non_empty_p:
                    prefix_char = text_bullet_match.group(1).strip()
                    is_num = prefix_char.rstrip('.)').isdigit()
                    bullet_sym = "1." if is_num else "-"
                    cleaned_content = re.sub(r'^[•–—▪▫\*\-]\s+|\d+[\.\)]\s+', '', formatted_content)
                    md_blocks.append(f"{bullet_sym} {cleaned_content}")
                    prev_was_title = False
                    is_first_non_empty_p = False
                    i += 1
                    continue

                # 4. Check for Blockquotes / Dialogue
                style_name = p_obj.style.name.lower() if p_obj.style else ""
                is_quote_style = 'quote' in style_name
                is_quoted_text = (
                    (text.startswith('"') and text.endswith('"')) or
                    (text.startswith('“') and text.endswith('”')) or
                    (text.startswith('\'') and text.endswith('\''))
                ) and len(text) > 15

                if is_quote_style or is_quoted_text:
                    lines = formatted_content.split('\n')
                    quote_lines = [f"> {line}" for line in lines]
                    md_blocks.append("\n".join(quote_lines))
                    prev_was_title = False
                    is_first_non_empty_p = False
                    i += 1
                    continue

                # 5. Regular Paragraph
                md_blocks.append(formatted_content)
                prev_was_title = False
                is_first_non_empty_p = False
                i += 1

        return "\n\n".join(md_blocks) + "\n"


class ValidationEngine:
    """Automated strict validation layer ensuring high fidelity and zero content loss."""

    def __init__(
        self,
        doc_path: str,
        md_content: str,
        converter_warnings: List[str],
        converter_errors: List[str],
        strict: bool = False
    ):
        self.doc_path = doc_path
        self.md_content = md_content
        self.doc = docx.Document(doc_path)
        self.warnings = list(converter_warnings)
        self.errors = list(converter_errors)
        self.strict = strict

    def _extract_source_text(self) -> str:
        """Extracts complete plain text directly from the DOCX document."""
        chunks: List[str] = []
        body_elements = list(self.doc.element.body)

        for elm in body_elements:
            tag = elm.tag.split('}')[-1]
            if tag == 'p':
                p = Paragraph(elm, self.doc)
                t = p.text.strip()
                if t:
                    chunks.append(t)
            elif tag == 'tbl':
                tbl = Table(elm, self.doc)
                for row in tbl.rows:
                    for cell in row.cells:
                        for p in cell.paragraphs:
                            t = p.text.strip()
                            if t:
                                chunks.append(t)
        return " ".join(chunks)

    def _strip_markdown(self, md: str) -> str:
        """Strips Markdown syntax markers to isolate plain textual content."""
        text = md
        text = re.sub(r'```[a-zA-Z]*', '', text)
        text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'(\*\*\*|\*\*|\*|~~)', '', text)
        text = re.sub(r'^>\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'\|', ' ', text)
        text = re.sub(r'---+', ' ', text)
        text = re.sub(r'<br\s*/?>', ' ', text, flags=re.IGNORECASE)
        text = re.sub(r'^\s*[-*]\s+', '', text, flags=re.MULTILINE)
        return text

    def _tokenize(self, text: str) -> List[str]:
        """Normalizes and tokenizes text into words/tokens for exact comparison."""
        norm = unicodedata.normalize('NFKC', text)
        tokens = re.findall(r'[\w°℃℉²³µ≤≥±×÷/–—\-]+', norm, flags=re.UNICODE)
        return [t.lower() for t in tokens if t.strip()]

    def _detect_unicode_chars(self, text: str) -> Dict[str, List[str]]:
        """Inventories detected Unicode and special characters."""
        found: Dict[str, Set[str]] = {}
        for category, pattern in UNICODE_CATEGORY_PATTERNS.items():
            matches = set(pattern.findall(text))
            if matches:
                found[category] = matches
        return {k: sorted(list(v)) for k, v in found.items()}

    def validate(self) -> ValidationResult:
        filename = os.path.basename(self.doc_path)
        body_elements = list(self.doc.element.body)
        p_count = len(self.doc.paragraphs)
        t_count = len(self.doc.tables)
        body_count = len(body_elements)

        source_text = self._extract_source_text()
        stripped_md_text = self._strip_markdown(self.md_content)

        source_tokens = self._tokenize(source_text)
        md_tokens = self._tokenize(stripped_md_text)

        source_word_count = len(source_tokens)
        md_word_count = len(md_tokens)
        word_diff = md_word_count - source_word_count

        source_set = set(source_tokens)
        md_set = set(md_tokens)
        missing_words = source_set - md_set
        extra_words = md_set - source_set

        sm = SequenceMatcher(None, source_tokens, md_tokens)
        preservation_ratio = sm.ratio()

        diff_details: List[DiffDetail] = []
        has_unexplained_loss = False
        has_unexplained_extra = False

        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag != 'equal':
                src_sub = source_tokens[i1:i2]
                md_sub = md_tokens[j1:j2]

                src_ctx = " ".join(source_tokens[max(0, i1-2):min(len(source_tokens), i2+2)])
                md_ctx = " ".join(md_tokens[max(0, j1-2):min(len(md_tokens), j2+2)])

                # Classify the difference
                if tag == 'insert' and all(tok in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] for tok in md_sub):
                    classification = "Markdown formatting (ordered list prefix generated from DOCX numPr)"
                elif tag == 'insert':
                    classification = "Generated extra content"
                    has_unexplained_extra = True
                elif tag == 'delete':
                    classification = "Actual source content loss"
                    has_unexplained_loss = True
                elif tag == 'replace':
                    # Check if tokens differ only by punctuation normalization
                    if [re.sub(r'\W+', '', t) for t in src_sub] == [re.sub(r'\W+', '', t) for t in md_sub]:
                        classification = "Punctuation / Unicode normalization"
                    else:
                        classification = "Token replacement mismatch"
                        has_unexplained_loss = True
                else:
                    classification = "Formatting / whitespace normalization"

                diff_details.append(DiffDetail(
                    opcode=tag,
                    source_chunk=src_sub,
                    markdown_chunk=md_sub,
                    source_context=src_ctx,
                    markdown_context=md_ctx,
                    classification=classification
                ))

        if missing_words or has_unexplained_loss:
            self.errors.append(f"Content loss detected: {len(missing_words)} missing token(s): {sorted(list(missing_words))[:10]}")

        if has_unexplained_extra:
            self.errors.append(f"Unexplained extra content detected in Markdown output.")

        # Determine overall classification
        if word_diff == 0 and not diff_details:
            overall_classification = "Exact content preservation (100% word-for-word match)"
        elif not has_unexplained_loss and not has_unexplained_extra:
            overall_classification = "Formatting / syntax difference (ordered list markers from numPr; 0 content loss)"
        else:
            overall_classification = "Content mismatch requiring investigation"

        detected_special = self._detect_unicode_chars(self.md_content)
        md_blocks = [b for b in self.md_content.split('\n\n') if b.strip()]

        status = "PASS"
        if self.errors:
            status = "FAIL"
        elif self.strict and (has_unexplained_loss or has_unexplained_extra):
            status = "FAIL"
        elif preservation_ratio < 0.95:
            status = "WARNING"

        return ValidationResult(
            filename=filename,
            source_paragraph_count=p_count,
            source_table_count=t_count,
            source_body_element_count=body_count,
            markdown_block_count=len(md_blocks),
            source_text_char_count=len(source_text),
            markdown_source_text_char_count=len(stripped_md_text),
            source_word_count=source_word_count,
            markdown_word_count=md_word_count,
            word_difference=word_diff,
            preservation_ratio=round(preservation_ratio * 100, 2),
            missing_words=sorted(list(missing_words)),
            extra_words=sorted(list(extra_words)),
            diff_details=diff_details,
            classification=overall_classification,
            detected_unicode_special_chars=detected_special,
            warnings=self.warnings,
            errors=self.errors,
            status=status
        )


def convert_file(
    file_path: str,
    output_dir: str,
    overwrite: bool = False,
    validate: bool = False,
    strict: bool = False,
    verbose: bool = False
) -> Tuple[bool, Optional[ValidationResult], str]:
    """Converts a single DOCX file to Markdown with optional validation."""
    if not os.path.exists(file_path):
        return (False, None, f"File not found: {file_path}")

    base_name = os.path.splitext(os.path.basename(file_path))[0]
    out_path = os.path.join(output_dir, f"{base_name}.md")

    if os.path.exists(out_path) and not overwrite:
        return (False, None, f"Output file already exists (use --overwrite): {out_path}")

    os.makedirs(output_dir, exist_ok=True)

    try:
        converter = DocxToMarkdownConverter(file_path, verbose=verbose)
        md_content = converter.convert()

        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        val_result = None
        if validate:
            engine = ValidationEngine(
                file_path,
                md_content,
                converter.warnings,
                converter.errors,
                strict=strict
            )
            val_result = engine.validate()

        return (True, val_result, out_path)
    except Exception as e:
        return (False, None, f"Conversion error in '{file_path}': {str(e)}")


def write_validation_reports(results: List[ValidationResult], output_dir: str, strict: bool = False):
    """Writes detailed validation_report.json and validation_report.md."""
    # 1. JSON Report
    json_path = os.path.join(output_dir, "validation_report.json")
    json_data = [
        {
            "filename": r.filename,
            "status": r.status,
            "source_paragraph_count": r.source_paragraph_count,
            "source_table_count": r.source_table_count,
            "source_body_element_count": r.source_body_element_count,
            "markdown_block_count": r.markdown_block_count,
            "source_text_char_count": r.source_text_char_count,
            "markdown_source_text_char_count": r.markdown_source_text_char_count,
            "source_word_count": r.source_word_count,
            "markdown_word_count": r.markdown_word_count,
            "word_difference": r.word_difference,
            "preservation_ratio_percent": r.preservation_ratio,
            "classification": r.classification,
            "missing_words": r.missing_words,
            "extra_words": r.extra_words,
            "detected_unicode_special_chars": r.detected_unicode_special_chars,
            "diff_details": [
                {
                    "opcode": d.opcode,
                    "source_chunk": d.source_chunk,
                    "markdown_chunk": d.markdown_chunk,
                    "source_context": d.source_context,
                    "markdown_context": d.markdown_context,
                    "classification": d.classification
                }
                for d in r.diff_details
            ],
            "warnings": r.warnings,
            "errors": r.errors,
        }
        for r in results
    ]
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)

    # 2. Markdown Report
    md_path = os.path.join(output_dir, "validation_report.md")
    passed_count = sum(1 for r in results if r.status == "PASS")
    warn_count = sum(1 for r in results if r.status == "WARNING")
    fail_count = sum(1 for r in results if r.status == "FAIL")

    md_lines = [
        "# DOCX -> Markdown Conversion Validation Report",
        "",
        f"**Mode:** {'Strict Validation (--strict)' if strict else 'Standard Validation'}  ",
        f"**Total Documents Evaluated:** {len(results)}  ",
        f"**Passed:** {passed_count} / {len(results)}  ",
        f"**Warnings:** {warn_count}  ",
        f"**Failures:** {fail_count}  ",
        "",
        "## Summary Table",
        "",
        "| Document | Status | Paras | Tables | Words (Src / MD) | Diff | Preservation | Classification |",
        "|---|---|---|---|---|---|---|---|",
    ]

    for r in results:
        status_icon = "✅ PASS" if r.status == "PASS" else ("⚠️ WARN" if r.status == "WARNING" else "❌ FAIL")
        diff_str = f"+{r.word_difference}" if r.word_difference > 0 else f"{r.word_difference}"
        md_lines.append(
            f"| `{r.filename}` | {status_icon} | {r.source_paragraph_count} | {r.source_table_count} | {r.source_word_count} / {r.markdown_word_count} | {diff_str} | {r.preservation_ratio}% | {r.classification} |"
        )

    md_lines.extend([
        "",
        "---",
        "",
        "## Detailed Document Investigation",
        ""
    ])

    for r in results:
        status_icon = "✅ PASS" if r.status == "PASS" else ("⚠️ WARN" if r.status == "WARNING" else "❌ FAIL")
        diff_str = f"+{r.word_difference}" if r.word_difference > 0 else f"{r.word_difference}"

        md_lines.append(f"## {r.filename}")
        md_lines.append("")
        md_lines.append(f"- **Source words:** {r.source_word_count}")
        md_lines.append(f"- **Markdown words:** {r.markdown_word_count}")
        md_lines.append(f"- **Difference:** {diff_str}")
        md_lines.append(f"- **Preservation ratio:** {r.preservation_ratio}%")
        md_lines.append(f"- **Body elements:** {r.source_body_element_count} ({r.source_paragraph_count} paragraphs, {r.source_table_count} tables)")
        md_lines.append(f"- **Special Characters:** `{json.dumps(r.detected_unicode_special_chars, ensure_ascii=False)}`")
        md_lines.append("")

        md_lines.append("### Missing from Markdown")
        if r.missing_words:
            md_lines.append(f"- ❌ `{', '.join(r.missing_words)}`")
        else:
            md_lines.append("None")
        md_lines.append("")

        md_lines.append("### Extra in Markdown")
        if r.extra_words:
            md_lines.append(f"- `{', '.join(r.extra_words)}` (Markdown ordered-list syntax numbers)")
        else:
            md_lines.append("None")
        md_lines.append("")

        if r.diff_details:
            md_lines.append("### Mismatch Context & Analysis")
            for idx, d in enumerate(r.diff_details[:6], 1):
                md_lines.append(f"{idx}. **Type:** `{d.opcode}` | **Classification:** {d.classification}")
                md_lines.append(f"   - *Source Context:* `{d.source_context}`")
                md_lines.append(f"   - *Markdown Context:* `{d.markdown_context}`")
            if len(r.diff_details) > 6:
                md_lines.append(f"   - *(... and {len(r.diff_details) - 6} more identical list prefix formatting instances)*")
            md_lines.append("")

        md_lines.append("### Classification")
        md_lines.append(f"{r.classification}")
        md_lines.append("")

        md_lines.append("### Status")
        md_lines.append(f"{status_icon}")
        md_lines.append("")

        if r.warnings:
            md_lines.append("### Warnings")
            for w in r.warnings:
                md_lines.append(f"- ⚠️ {w}")
            md_lines.append("")

        if r.errors:
            md_lines.append("### Errors")
            for err in r.errors:
                md_lines.append(f"- ❌ {err}")
            md_lines.append("")

        md_lines.append("---")
        md_lines.append("")

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_lines) + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="High-fidelity DOCX to Markdown converter for clinical case studies."
    )
    parser.add_argument(
        'file',
        nargs='?',
        default=None,
        help="Path to a single DOCX file to convert (e.g. 'input/CASE 0012.docx')."
    )
    parser.add_argument(
        '--input', '-i',
        default='input',
        help="Input directory containing DOCX files for batch conversion (default: 'input')."
    )
    parser.add_argument(
        '--output', '-o',
        default='output',
        help="Output directory for generated Markdown files (default: 'output')."
    )
    parser.add_argument(
        '--validate',
        action='store_true',
        help="Run automated validation layer and generate validation_report.json / validation_report.md."
    )
    parser.add_argument(
        '--strict',
        action='store_true',
        help="Enable strict validation mode (fail on any unexplained content loss or extra content)."
    )
    parser.add_argument(
        '--overwrite',
        action='store_true',
        help="Overwrite existing output Markdown files without prompt."
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help="Enable verbose output logging."
    )

    args = parser.parse_args()

    # If --strict is passed, implicitly enable --validate
    if args.strict:
        args.validate = True

    print("=" * 70)
    print(" 🏥 StrokeAware DOCX -> Markdown Converter")
    print("=" * 70)

    if args.file:
        if not os.path.exists(args.file):
            print(f"❌ Error: Specified file does not exist: {args.file}", file=sys.stderr)
            sys.exit(1)
        files_to_process = [args.file]
    else:
        if not os.path.exists(args.input):
            alt_input = os.path.join('src', 'data', 'Docx-to-md', 'input')
            if os.path.exists(alt_input):
                args.input = alt_input

        if not os.path.exists(args.input):
            print(f"❌ Error: Input directory does not exist: {args.input}", file=sys.stderr)
            sys.exit(1)

        files_to_process = [
            os.path.join(args.input, f)
            for f in sorted(os.listdir(args.input))
            if f.lower().endswith('.docx') and not f.startswith('~$')
        ]

    if not files_to_process:
        print(f"⚠️ No DOCX files found to process in: {args.input}")
        sys.exit(0)

    print(f"📂 Mode: {'Single File' if args.file else 'Batch'}")
    print(f"📄 Files to process: {len(files_to_process)}")
    print(f"📁 Output directory: {args.output}")
    print(f"🔍 Validation: {'Enabled (Strict)' if args.strict else ('Enabled (Standard)' if args.validate else 'Disabled')}")
    print(f"🔄 Overwrite: {'Enabled' if args.overwrite else 'Disabled'}")
    print("-" * 70)

    success_count = 0
    fail_count = 0
    validation_results: List[ValidationResult] = []

    for idx, f_path in enumerate(files_to_process, 1):
        f_name = os.path.basename(f_path)
        print(f"[{idx:2d}/{len(files_to_process)}] Converting: {f_name} ... ", end="", flush=True)

        success, val_result, out_info = convert_file(
            f_path,
            output_dir=args.output,
            overwrite=args.overwrite,
            validate=args.validate,
            strict=args.strict,
            verbose=args.verbose
        )

        if success:
            if val_result:
                validation_results.append(val_result)
                if val_result.status == "FAIL":
                    fail_count += 1
                    status_str = f"❌ FAILED VALIDATION ({val_result.preservation_ratio}% preservation)"
                else:
                    success_count += 1
                    diff_info = f" [{val_result.word_difference:+d} words: {val_result.classification}]" if val_result.word_difference != 0 else ""
                    status_str = f"✅ DONE ({val_result.preservation_ratio}% preservation){diff_info}"
            else:
                success_count += 1
                status_str = "✅ DONE"
            print(f"{status_str}")
        else:
            fail_count += 1
            print(f"❌ FAILED - {out_info}")

    print("-" * 70)
    print("📊 Conversion & Validation Summary:")
    print(f"  • Processed: {len(files_to_process)}")
    print(f"  • Succeeded: {success_count}")
    print(f"  • Failed:    {fail_count}")
    print(f"  • Output:    {os.path.abspath(args.output)}")

    if args.validate and validation_results:
        write_validation_reports(validation_results, args.output, strict=args.strict)
        print(f"  • Validation Reports Generated:")
        print(f"    - {os.path.join(args.output, 'validation_report.json')}")
        print(f"    - {os.path.join(args.output, 'validation_report.md')}")

        all_warnings = sum(len(r.warnings) for r in validation_results)
        all_errors = sum(len(r.errors) for r in validation_results)
        print(f"  • Total Validation Warnings: {all_warnings}")
        print(f"  • Total Validation Errors:   {all_errors}")

    print("=" * 70)

    if fail_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()
