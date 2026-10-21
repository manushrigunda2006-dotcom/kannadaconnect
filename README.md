# ನಮ್ಮ (Namma) — Everyday Situation-First Kannada Companion

> **Hackathon Problem Statement:** "Kannada in Everyday Life" — A technology solution that helps people learn and use Kannada in real-world situations such as travelling, shopping, education, healthcare, transportation, and workplaces.

**Namma** (which means *"Ours"* in Kannada) is a practical, situation-first Kannada companion. Instead of boring users with abstract grammatical conjugation tables, Namma helps learners pick the exact real-world setting they are in (e.g., catching an auto in Indiranagar, bargaining at KR Market, talking to a clinic nurse, or having filter coffee with coworkers) and immediately speak, listen, bookmark, and practice authentic phrases with confidence.

---

## 🌟 Core Features Built

1. **Home / Daily Featured Phrase**
   - Welcoming banner introducing the situation-first philosophy.
   - Featured phrase of the day showing native Kannada script (ಕನ್ನಡ ಲಿಪಿ), phonetic romanization, English meaning, and practical cultural nuance.
   - Shuffle button to cycle featured moments on demand.

2. **Situation Picker (6 Real-World Domains)**
   - **Transport (ಸಾರಿಗೆ / Sārige):** Autos, BMTC buses, Namma Metro cards & route queries.
   - **Shopping (ಖರೀದಿ / Kharīdi):** Street markets, gentle bargaining, UPI payments, vegetable weights.
   - **Travel (ಪ್ರಯಾಣ / Prayāṇa):** Wayfinding, railway station directions, restaurant recommendations, hotel check-ins.
   - **Healthcare (ಆರೋಗ್ಯ / Ārōgya):** Expressing symptoms, pharmacy dosage instructions, clinic queries (*Communication aid only — Emergency: 112 / 108*).
   - **Workplace (ಕೆಲಸ / Kelasa):** Morning greetings, filter coffee invitations, polite peer requests, end-of-day sign-offs.
   - **Education (ಶಿಕ್ಷಣ / Shikshaṇa):** Doubts in class, library timings, asking for classmate notes, assignment deadlines.
   - **All Situations (ಎಲ್ಲಾ):** Global view showing the full curated collection.

3. **Searchable Phrasebook**
   - High-contrast, clean Kannada script rendering.
   - Instant search across **all three text representations**:
     - Native Kannada script (e.g. `ಬೆಲೆ`, `ಆಟೋ`)
     - Romanized phonetic spelling (e.g. `eshtu`, `munde`, `arthavagilla`)
     - English meaning (e.g. `price`, `meter`, `help`, `coffee`)
   - Play audio button with browser Web Speech synthesis and graceful fallback.
   - Save / Pocketbook bookmark button with instant state update.
   - Mark as Practiced button with visual feedback.
   - 1-click clipboard copy for messaging and note-taking.

4. **Pocketbook (ಜೇಬು ಪುಸ್ತಕ - Saved Phrases)**
   - Dedicated drawer/modal to view pinned phrases for rapid access on the road.
   - Filter saved phrases by situation.
   - Persists in `localStorage` (`namma_saved_phrases`) so page refreshes never lose saved items.
   - Empty saved state with helpful call to action.
   - 1-click clear pocketbook action with safety confirmation.

5. **Practice Progress Tracker (Local Demo)**
   - Clearly labeled demo tracker persisted locally in `localStorage` (`namma_practice_progress`).
   - Circular visual progress indicator showing daily goal achievement.
   - Streak counter (`🔥 1 Day Practice Streak`).
   - Daily Mission challenge: e.g. "Master 1 Transport phrase for Bengaluru autos!"
   - Working completion state: When the daily goal is reached, celebratory confetti fires (`canvas-confetti`) with a congratulatory Kannada badge (*"ಶಭಾಷ್!"*).
   - Configurable daily goal (3, 5, 8, 10 phrases) and reset button.

6. **Surprise Me (ಅನಿರೀಕ್ಷಿತ)**
   - Random phrase generator modal from any situation to practice spontaneous everyday conversation.
   - Audio playback, saving, and quick re-roll (*"Roll Another Phrase"*).

7. **Cultural & Linguistic Nuances Guide (Survival Tips)**
   - Golden suffix **"ರೀ" (Ri)**: How adding 'ri' to greetings and verbs adds warmth and respect.
   - Functional verbs: **"ಬೇಕು" (Bēku - want/need)** vs **"ಬೇಡ" (Bēḍa - don't want)**.
   - Numbers 1 through 10 in Kannada script, phonetic spelling, and English for market weights and auto fares.
   - Respectful addressing: **"ನೀವು" (Nīvu - polite/formal)** vs **"ನೀನು" (Nīnu - informal)**.

8. **Design System & Visual Identity**
   - Warm, local aesthetic: Soft ivory background (`#FDFBF7`), deep evergreen (`#1B4332`), and restrained tender lime / golden turmeric accents.
   - Responsive across smartphones, tablets, laptops, and wide monitors.
   - Accessible labels, visible keyboard focus rings (`focus-visible:ring-2`), semantic HTML buttons and headings.

---

## 🛠️ Tech Stack & Setup Choices

- **Framework:** React 19 + TypeScript (strictly typed, verified with `tsc -b` and `verbatimModuleSyntax`).
- **Build Tool:** Vite 8 (fast bundling and Hot Module Replacement).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom Kannada typography.
- **Icons:** `lucide-react`.
- **Celebration Animations:** `canvas-confetti`.
- **Linter:** `oxlint` (clean with 0 errors, 0 warnings).

---

## 🚀 How to Run the App

### Option A: From inside the `namma/` directory
```bash
cd namma
npm install
npm run dev
```

### Option B: From the root workspace directory
```bash
npm run dev:namma
```

To build for production:
```bash
cd namma
npm run build
```

To preview the production build:
```bash
cd namma
npm run preview
```

---

## 📢 Demo Transparency & Limitations

- **Speech Synthesis:** Uses the browser's standard Web Speech API (`window.speechSynthesis`). If the user's operating system or browser does not have a Kannada voice (`kn-IN` / `kn`) installed, the app displays a non-blocking toast notice and highlights the romanized phonetic syllable breakdown. Synthetic voices are never misrepresented as native human studio recordings.
- **Healthcare Communication Aid:** Healthcare phrases are purely linguistic aids to help describe symptoms or request medication in local clinics and pharmacies. They do not constitute medical advice. Karnataka emergency contacts (112 and 108) are prominently shown.
- **Mock & Local Data:** All phrases and user preferences (saved phrases, practice progress, streaks) reside in local storage for zero-dependency hackathon demonstration. No mock data is claimed to be a live cloud API.
