# Doc Analyzer

A local, privacy-first document intelligence platform built on **FastAPI**, **Ollama**, and **Qdrant**. Upload documents, ask questions in natural language, and get streaming AI-powered answers — all running on your own machine.

---

## What It Does

- **Ingest** documents (PDF, Word, Excel, CSV, plain text, RTF, code files, web URLs)
- **Embed** content using a local Ollama embedding model (`mxbai-embed-large`)
- **Store** vector embeddings in Qdrant (in-memory or persisted to disk)
- **Query** using natural language — retrieve relevant chunks and stream LLM responses
- **Save** Q&A pairs as notes in a local SQLite database
- **Switch roles** to shape LLM responses (legal, financial, technical, travel, etc.)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web Framework | FastAPI |
| LLM & Embeddings | Ollama (local, no API key needed) |
| Vector Database | Qdrant |
| Note Storage | SQLite |
| Containerisation | Docker / Docker Compose |

---

## Supported File Types

| Category | Extensions |
|---|---|
| Documents | `.pdf`, `.doc`, `.docx`, `.rtf`, `.txt`, `.md` |
| Spreadsheets / Data | `.xlsx`, `.xls`, `.csv`, `.ods`, `.json` |
| Config / Markup | `.yaml`, `.yml`, `.toml`, `.xml`, `.html` |
| Code (40+ languages) | `.py`, `.js`, `.ts`, `.go`, `.rs`, `.java`, `.sql`, `.sh`, … |
| Web | Any URL |

---

## Architecture

```
Upload → Processor (by file type)
       → Text Chunks (RecursiveCharacterTextSplitter)
       → Ollama Embeddings (mxbai-embed-large)
       → Qdrant Vector Store

Query  → Embed Question
       → Similarity Search (top-4 chunks)
       → Build Prompt (role + context + question)
       → Stream LLM Response (Ollama)
       → Optionally save as Note (SQLite)
```

---

## Key Configuration (`.env`)

| Variable | Default | Description |
|---|---|---|
| `LLM_MODEL` | `gemma3:12b` | Ollama chat model |
| `EMBEDDING_MODEL` | `mxbai-embed-large:latest` | Ollama embedding model |
| `EMBEDDING_VECTOR_SIZE` | `1024` | Must match the embedding model output |
| `QDRANT_DB_PATH` | `./data/qdrant` | Vector DB persistence directory |
| `CHUNK_SIZE` | `2000` | Text chunk size (characters) |
| `CHUNK_OVERLAP` | `100` | Overlap between consecutive chunks |
| `APP_USERNAME` / `APP_PASSWORD` | `admin` / `changeme` | HTTP Basic Auth credentials |

> **Common embedding model vector sizes:**
> - `mxbai-embed-large` → 1024
> - `nomic-embed-text` → 768
> - `all-minilm` → 384

---

## Prompt Roles

Role prompts live in `src/prompts/*.md`. Each file's stem becomes a role key:

| File | Role Key | Purpose |
|---|---|---|
| `default.md` | `default` | General-purpose assistant |
| `legal.md` | `legal` | Legal document analysis |
| `financial.md` | `financial` | Financial report analysis |
| `technical.md` | `technical` | Technical documentation |
| `travel.md` | `travel` | Travel planning assistant |

Add a new `.md` file to `src/prompts/` and call `registry.reload()` — no server restart needed.

---

## Quick Start

### With Docker

```bash
# Copy and configure environment
cp .env.example .env

# Start the app
docker compose up --build
```

### Without Docker

```bash
# Install dependencies
pip install -r requirements.txt

# Pull required Ollama models
ollama pull mxbai-embed-large
ollama pull gemma3:12b

# Run
uvicorn src.app:app --reload
```

The app will be available at `http://localhost:8000`.

---

## Project Structure

```
src/
  app.py                  # FastAPI application & routes
  config/
    prompts.py            # PromptRegistry — auto-discovers role prompts
  models/
    document.py           # Document dataclass (chunk + metadata)
    note.py               # Note dataclass (Q&A record)
  processors/
    factory.py            # Maps file extensions to processors
    rag_processor.py      # Embedding, vector storage, query & streaming
    pdf_processor.py      # PDF + OCR
    word_processor.py     # .doc / .docx
    text_processor.py     # Plain text / Markdown
    table_processor.py    # Spreadsheets / CSV / JSON
    code_processor.py     # Source code (40+ languages)
    rtf_processor.py      # RTF
    web_processor.py      # Web URLs
  prompts/                # Role prompt .md files
  services/
    document_service.py   # File registry & collection management
    note_service.py       # SQLite-backed Q&A note persistence
  utils/
    text_splitter.py      # RecursiveCharacterTextSplitter
tests/                    # Unit & integration tests
```

---

## Notes

- All processing is **local** — no data leaves your machine.
- Qdrant defaults to **in-memory** mode; set `QDRANT_DB_PATH` to persist across restarts.
- The embedding model and LLM must both be available in your local Ollama instance before starting.
