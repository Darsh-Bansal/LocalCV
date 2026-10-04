# LocalCV

> **Your career data belongs to you. Your AI should work for you without requiring your career history to be uploaded to a cloud service.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-emerald.svg)](https://localfirstweb.dev/)
[![AI Model](https://img.shields.io/badge/Default%20Model-Gemma%203%204B-indigo.svg)](https://ollama.com/library/gemma3)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com/)

---

**LocalCV** is a production-grade, local-first AI career management application built for Hacktoberfest 2026’s *"Build for a Friend"* challenge.

It empowers developers, engineers, and professionals to store their complete career history privately on their own devices, auto-generate a published developer portfolio, and use local open-weight AI (Gemma via Ollama) to synthesize strictly verifiable, tailored resumes against any job description with **zero data exfiltration**.

---

## 🌟 Why LocalCV?

Most career platforms and modern resume builders operate on cloud-first data collection models:
- **Cloud Resume SaaS platforms** store your contact info, employment history, compensation, and references on remote servers.
- **Cloud AI tools** stream your entire life and career trajectory to commercial third-party LLM APIs (OpenAI, Anthropic) where data may be retained or subject to terms of service changes.
- **Hallucinations & False Claims:** Standard generative AI prompts often fabricate job titles, exaggerate metrics, or invent credentials you never achieved.

**LocalCV provides an uncompromising, local-first alternative:**
1. **100% On-Device:** Your Master Career Vault lives exclusively in your browser's IndexedDB database.
2. **Zero Cloud AI Dependency:** Resume synthesis is powered by a locally running open-weight model (Google Gemma 3 4B) hosted via Ollama on your machine.
3. **Strict No-Fabrication AI Guarantee:** The AI prompt acts as an evidence-ranking engine. It is strictly constrained to only select, reorder, and polish existing facts from your Career Vault.
4. **Offline Resilience:** The application continues functioning without internet connectivity after initial setup.

---

## ✨ Features

- 🏛️ **Career Vault:** Comprehensive, structured repository for personal info, education, work experiences, featured projects, industry certifications, skills categorized into 10 domains, and honors/awards.
- 🎯 **AI Resume Tailoring Engine:** Analyzes any pasted job description, extracts required competencies, ranks matching evidence from your vault, and synthesizes an ATS-ready resume in seconds.
- 🔍 **Evidence Traceability & AI Transparency:** Direct source mapping (`sourceId`) connects every bullet point and project back to its original record in your local database. Displays exact counts of analyzed projects, experiences, and skills.
- 🌐 **Instant Developer Portfolio:** Automatically translates your vault into a modern developer portfolio website with interactive tech filters, themes (Modern, Minimal, Cyber), and one-click export to a **standalone, self-contained single HTML file** deployable to GitHub Pages.
- 📄 **Direct PDF Export & Printing:** Client-side vector-quality PDF generation and print stylesheets formatted to prevent awkward page breaks.
- 💾 **Data Sovereignty & Portability:** One-click full JSON export and restore. Zero lock-in. Immediate one-click database erasure.
- 🌗 **Dark Mode & Responsive UI:** Crafted with a curated color system, responsive sidebar, smooth transitions, and accessible typography.
- 🚀 **Realistic Demo Data:** Jumpstart testing with a single click to load a sample senior engineering profile.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER'S LOCAL DEVICE                             │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Browser (React 18 + Vite)                      │  │
│  │                                                                  │  │
│  │   [ Dashboard ]  [ Career Vault ]  [ Portfolio ]  [ Generator ]  │  │
│  │                                                                  │  │
│  │     ▲                               ▲                            │  │
│  │     │ Read/Write                    │ Client-Side Export         │  │
│  │     ▼                               ▼                            │  │
│  │  ┌───────────────────────────────┐  ┌─────────────────────────┐  │  │
│  │  │ IndexedDB (Dexie.js Reactive) │  │ HTML5 Canvas / PDF Gen  │  │  │
│  │  │ Master Career Evidence Stores │  │ Standalone HTML Bundles │  │  │
│  │  └───────────────────────────────┘  └─────────────────────────┘  │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
│                                    │ HTTP (localhost only)             │
│                                    ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  Local Backend Bridge (:3001)                    │  │
│  │                 (Express / TypeScript Proxy)                     │  │
│  │                                                                  │  │
│  │   • Validates evidence schemas                                   │  │
│  │   • Injects anti-hallucination system prompts                    │  │
│  │   • Parses & validates model JSON structures                     │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
│                                    │ Native API (:11434)               │
│                                    ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          Ollama Runtime                          │  │
│  │                                                                  │  │
│  │   [ Gemma 3 4B Open Weights ] ───> Local GPU / Apple Silicon    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Ollama** (for local AI inference) — [Download from ollama.com](https://ollama.com)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/localcv.git
cd localcv

# Install all dependencies (root, frontend, and backend)
npm run install:all
```

### 2. Set Up Local AI Model (Gemma)
Make sure Ollama is installed and running, then pull the recommended model:
```bash
ollama pull gemma3:4b
```
*(Alternative models like `llama3.2`, `mistral`, or `qwen2.5` can be configured in Settings or via `OLLAMA_MODEL` environment variable).*

### 3. Run LocalCV
Start both the backend bridge and frontend development server with a single command:
```bash
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

---

## 🛡️ Privacy & Security Audit

LocalCV was built from day one on **Zero-Exfiltration Principles**:

| Layer | Implementation | Security Guarantee |
|---|---|---|
| **Career Vault Storage** | Browser IndexedDB (`dexie`) | Data is never transmitted across the internet; persists locally on device. |
| **AI Inference** | Local Ollama daemon (`127.0.0.1:11434`) | Prompts never leave your local machine or local loopback interface. |
| **PDF Generation** | HTML5 Canvas + `html2pdf.js` | PDF rendering runs 100% in-browser without cloud conversion microservices. |
| **Portfolio Export** | Pure client-side HTML builder | Exports a portable, clean `.html` bundle directly into your `Downloads` folder. |

### How to Verify Yourself:
1. Open Chrome/Firefox DevTools (`F12` or `Cmd+Option+I`).
2. Navigate to the **Network** tab.
3. Tailor a resume or edit your vault.
4. Notice that **100% of requests** are addressed exclusively to `localhost` / `127.0.0.1`.
5. Turn off your Wi-Fi: LocalCV remains completely operable offline.

---

## 🤖 Hallucination Prevention & Prompt Architecture

Traditional AI resume generators frequently make up false achievements or invent technical proficiencies. LocalCV employs a strict **Constrained Evidence-Selection Pipeline**:

1. **System Prompt Enforcement:**
   > *"The career profile supplied by the user is the ONLY source of factual information. You MUST NOT invent employers, job titles, projects, degrees, certifications, technologies, skills, metrics, achievements, or dates."*
2. **Traceable ID Mapping:** The AI response must return the exact `sourceId` for every experience and project selected.
3. **Structured JSON Output Schema:** The model is constrained to return a type-checked schema containing verified evidence arrays.
4. **Deterministic Fallback Engine:** If Ollama is offline or unavailable, LocalCV includes a deterministic keyword-matching heuristic engine that formats and ranks your vault evidence without crashing.

---

## 🧰 Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Storage:** IndexedDB via Dexie.js (`dexie-react-hooks`)
- **Document Export:** `html2pdf.js` client-side rendering
- **Notifications:** Sonner
- **Backend Bridge:** Node.js, Express, TypeScript, tsx
- **Local AI:** Ollama with Google's Gemma 3 4B (`gemma3:4b`)

---

## 🗺️ Roadmap & Hacktoberfest Contributions

We welcome open-source contributions! Here are some ideas:

- [ ] **Custom Resume Themes:** Add LaTeX-style academic resume templates.
- [ ] **Job Keyword Heatmap:** Visual comparison of JD keywords vs. Vault skills.
- [ ] **Multiple Persona Profiles:** Switch between "Frontend Developer", "DevOps Engineer", or "Data Scientist" sub-profiles.
- [ ] **WebLLM / WebGPU Direct Mode:** Direct in-browser LLM execution via WebGPU (zero backend required).
- [ ] **Cover Letter Generator:** Contextual cover letters based strictly on Career Vault stories.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
Built with ❤️ for privacy and user data sovereignty.
