# Why Did You Reject Me? 🔍  
**AI-Powered Application Rejection Explainability Platform**

---

## Module 1 — Resume Upload & Parsing ✅

### Architecture

```
hackathon_today/
├── frontend/          React + Vite (port 5173)
├── backend/           Node.js + Express (port 5000)
│   └── routes/
│       └── upload.js  Multer → ML service proxy
└── ml-service/        Python + Flask (port 8000)
    ├── app.py         Flask entry point
    ├── parser.py      PDF/DOCX text extraction + field parsing
    └── skill_extractor.py  NLP skill taxonomy matching
```

---

### Features

- ✅ **Drag & Drop Upload** — PDF and DOCX support (max 10MB)
- ✅ **Text Extraction** — `pdfplumber` for PDF, `python-docx` for DOCX
- ✅ **Structured Parsing** — Name, Email, Phone, CGPA, Education, Experience, Certifications, Projects
- ✅ **NLP Skill Extraction** — Multi-word phrase + single token matching against a curated taxonomy of 150+ skills
- ✅ **Profile Completeness Score** — Visual indicator of how complete the parsed profile is
- ✅ **Premium Dark UI** — Glassmorphism, animated background, smooth transitions

---

### Quick Start

**Option A — Automated Setup**
```bash
chmod +x setup.sh && ./setup.sh
```

**Option B — Manual Setup**

**Terminal 1 — ML Service (Python)**
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Running at http://localhost:8000
```

**Terminal 2 — Backend (Node.js)**
```bash
cd backend
npm install
npm run dev
# Running at http://localhost:5000
```

**Terminal 3 — Frontend (React)**
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:5173
```

Open **http://localhost:5173** 🎉

---

### API Reference

| Service | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Backend | `/api/upload` | POST | Upload resume (multipart) |
| Backend | `/api/health` | GET | Health check |
| ML | `/parse` | POST | Parse resume bytes |
| ML | `/health` | GET | ML service health |

---

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Vanilla CSS |
| Backend | Node.js, Express, Multer |
| ML | Python, Flask, pdfplumber, python-docx |
| NLP | Custom skill taxonomy + regex parsing |

---

### Coming Next

- **Module 2** — AI Decision Scoring (scikit-learn model)
- **Module 3** — Explainability (SHAP values, factor visualization)
- **Module 4** — Personalized Improvement Suggestions
