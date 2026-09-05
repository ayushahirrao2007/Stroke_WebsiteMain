# 🏥 High-Fidelity DOCX → Markdown Converter

A high-performance, deterministic DOCX to Markdown converter CLI tool built for clinical case documents, medical algorithms, structured laboratory tables, and clinical dialogue transcripts.

---

## 🚀 Features

- **Sequential Body Element Traversal**: Preserves 100% of the original document order (paragraphs, tables, callouts, diagrams).
- **High-Fidelity Inline Formatting**: Preserves bold (`**text**`), italic (`*text*`), bold-italic (`***text***`), strikethrough (`~~text~~`), and hyperlinks with adjacent run merging to prevent malformed tags like `**CASE 00****12**`.
- **Intelligent Heading Hierarchy**:
  - Direct mapping of Word styles (`Heading 1` - `Heading 6`, `Title`, `Subtitle`).
  - High-confidence heuristic detection for numbered case sections (`1. AMBULANCE HANDOVER`, `27. FINAL DIAGNOSIS`, etc.).
  - Explicit key-value protection (e.g. `Door Time: 10:18 AM` remains an inline bold label, never converted to a heading).
- **GFM Table Conversion**: Converts DOCX tables into GitHub Flavored Markdown tables with cell newline preservation via `<br>`, pipe character escaping (`\|`), and merged-cell detection.
- **ASCII & Box-Drawing Flowchart Aggregation**: Automatically identifies multi-line box diagrams (`│`, `▼`, `┌`, `─`, `┼`, etc.) and groups them into fenced ````text ... ```` code blocks.
- **Blockquote & Dialogue Detection**: Automatically converts speaker dialogue and medical quotes into Markdown blockquotes (`> ...`).
- **Complete List Hierarchy**: Queries document numbering definitions (`w:numPr`) to preserve bullet lists (`- item`) and numbered lists (`1. item`) with multi-level indentation.
- **Full UTF-8 Symbol Preservation**: Preserves emojis (🔴), arrows (→, ↔), mathematical symbols (≤, ≥, ±, ×), degree units (°C, m²), and Greek characters.
- **Automated Validation Layer**: Independent source-text extraction comparing word-level preservation between the source DOCX and generated Markdown, producing `validation_report.json` and `validation_report.md`.

---

## 📦 Directory Structure

```
.
├── input/                  # Source DOCX clinical case documents
├── output/                 # Generated Markdown (.md) and validation reports
├── convert.py              # Main executable CLI converter
├── README.md               # Tool documentation and usage guide
└── validation_report.json  # Generated validation metrics (when using --validate)
```

---

## 💻 Usage

### 1. Batch Conversion (All files in `input/`)

```bash
python convert.py
```

### 2. Single Document Conversion

```bash
python convert.py "input/CASE 0012.docx"
```

### 3. Automated Validation Mode

Run conversion with the automated validation layer to produce `validation_report.json` and `validation_report.md`:

```bash
python convert.py --validate
```

Or for a single file:

```bash
python convert.py "input/CASE 0012.docx" --validate
```

### 4. Overwrite Existing Files

```bash
python convert.py --overwrite --validate
```

### 5. Custom Directories

```bash
python convert.py --input "custom_input" --output "custom_output" --validate --overwrite
```

---

## 🛠️ CLI Options

| Option | Short | Description | Default |
|---|---|---|---|
| `file` | | Optional single DOCX file to convert | `None` (Batch mode) |
| `--input` | `-i` | Input directory containing DOCX files | `input` |
| `--output` | `-o` | Output directory for generated Markdown files | `output` |
| `--validate` | | Run validation checks & generate reports | `False` |
| `--overwrite` | | Allow overwriting existing `.md` files | `False` |
| `--verbose` | `-v` | Enable verbose debugging output | `False` |
| `--help` | `-h` | Display help message and options | |

---

## 🔍 Validation Engine & Quality Metrics

When `--validate` is passed, the tool performs independent ground-truth verification:

1. **Source Text Extraction**: Extracts all text from paragraphs and table cells directly from DOCX XML.
2. **Markdown Stripping**: Strips formatting syntax (headings `#`, bold/italic `**`/`*`, table pipes `|`, blockquotes `>`, code blocks ````) to extract the plain textual content.
3. **Word Token Preservation**: Normalizes text (Unicode NFKC) and performs word-by-word sequence matching.
4. **Metrics Collected**:
   - `source_paragraph_count`
   - `source_table_count`
   - `source_body_element_count`
   - `markdown_block_count`
   - `source_word_count` vs `markdown_word_count`
   - `preservation_ratio` (Target: 100.0%)
   - `detected_unicode_special_chars` (emojis, arrows, math, units, box drawing)
   - `warnings` & `errors`

Reports are saved to `output/validation_report.json` and `output/validation_report.md`.

---

## 📋 Exit Codes

- `0`: All files converted and validated successfully.
- `1`: One or more files failed conversion or encountered fatal errors.
