# HeritageVoice 🌺
> **AI-Based Heritage Language Translator & Preservation Engine for Endangered Indian Languages (Kodava Takk & Tulu)**

HeritageVoice is a production-ready web application designed to document, translate, learn, and preserve vulnerable Indian regional languages starting with **Kodava (Coorgi)** and **Tulu**.

---

## 🌟 Key Features

1. **Bidirectional AI Translation**
   - Translate between **English ↔ Kodava Takk (ಕೊಡವ) ↔ Tulu (ತುಳು) ↔ Kannada (ಕನ್ನಡ)**.
   - Script Romanization pronunciation guides & confidence metrics.
   - Speech-to-Text (STT) mic input & Text-to-Speech (TTS) audio synthesizer.

2. **Interactive Dictionary & Phrasebook**
   - Categorized lexicon entries with native script, Romanization, definition, and cultural notes.
   - Audio pronunciation playback.

3. **Interactive 3D Flashcard Learning Hub**
   - Learning decks for Kodava & Tulu greetings, daily phrases, and heritage proverbs.
   - 3D flip card animations, audio listening, and mastery tracking.

4. **Community Crowdsourcing Hub**
   - Submit new vocabulary, phrases, and native speaker audio recordings via in-browser mic recorder.
   - Moderation queue (`/review`) where community elders and linguists can approve or reject entries.

5. **AI Model Fine-Tuning Pipeline (`/pipeline`)**
   - Interface to trigger simulated fine-tuning runs on approved crowdsourced data.
   - Real-time training logs, validation loss curves, and BLEU score calculations.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes + Python FastAPI Microservice (`nlp-service/`)
- **AI & NLP:** IndicBERT-v2, Gemini 2.5 API Bridge, Phonetic Transliteration Engine, Web Speech API (STT/TTS)
- **Database:** Prisma ORM with SQLite (zero-config local setup, easily switchable to PostgreSQL / Supabase)
- **Deployment:** Vercel (Next.js) + Render / Railway (FastAPI Python Service)

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- Node.js 18+ & npm
- Python 3.9+ (optional for FastAPI microservice)

### 1. Install Dependencies & Setup Database

```bash
# Clone repository
cd minip

# Install Node dependencies
npm install

# Push database schema to SQLite (dev.db)
npx prisma db push

# Seed SQLite database with Kodava & Tulu datasets
npx tsx prisma/seed.ts
```

### 2. Environment Variables (.env)

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
# Optional: Add Gemini API Key for zero-shot LLM translation fallback
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐍 Running Python FastAPI Microservice (Optional Dual Engine)

```bash
cd nlp-service
pip install -r requirements.txt
python main.py
```
FastAPI server will start on [http://localhost:8000](http://localhost:8000) with interactive Swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📂 Project Structure

```
minip/
├── prisma/
│   ├── schema.prisma              # Database schema (Languages, Entries, Contributions, Lessons)
│   └── seed.ts                    # Seeding script with Kodava & Tulu dataset
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page (Mission, Demo, Stats, NLP Methodology)
│   │   ├── translate/page.tsx     # Full Translator Page
│   │   ├── dictionary/page.tsx    # Dictionary & Phrasebook Page
│   │   ├── learn/page.tsx         # Learning Flashcard Deck Page
│   │   ├── contribute/page.tsx    # Community Crowdsourcing Page
│   │   ├── review/page.tsx        # Moderation Queue Page
│   │   ├── pipeline/page.tsx      # Model Fine-tuning Dashboard Page
│   │   └── api/                   # Next.js Route Handlers
│   ├── components/                # React UI Components (TranslatorBox, FlashcardDeck, etc.)
│   ├── lib/
│   │   ├── nlp/                   # Multi-tier NLP engine (translator, transliterater, audioSynth)
│   │   └── prisma.ts              # Prisma singleton instance
├── nlp-service/                   # FastAPI Python Microservice
│   ├── main.py
│   └── requirements.txt
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 📜 License
Open-source under MIT License. Dedicated to preserving vulnerable indigenous languages of India.
