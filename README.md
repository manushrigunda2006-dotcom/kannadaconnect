# KannadaConnect (ಕನ್ನಡಕನೆಕ್ಟ್) – Learn Kannada Through Real-Life Situations

> **Hackathon Problem Statement:** "Kannada in Everyday Life: Develop a technology solution that helps people learn and use Kannada in real-world situations such as travelling, shopping, education, healthcare, transportation, and workplaces."
>
> **Project Tagline:** *Learn Kannada. Use it in real life.*
>
> 🌐 **Live Production Deployment:** [https://namma-tau.vercel.app](https://namma-tau.vercel.app)

---

## 🌟 1. Project Overview

**KannadaConnect** is a practical, situation-first Kannada communication platform engineered specifically for non-native speakers living, working, and studying in Karnataka.

Rather than overwhelming learners with dry grammatical conjugations and abstract textbook vocabulary, KannadaConnect equips users to handle the exact everyday situations they encounter in Bengaluru and across Karnataka:
- Hailing an auto rickshaw and politely asking for the meter.
- Buying fresh vegetables at Gandhi Bazaar or KR Market and scanning PhonePe/Google Pay.
- Boarding a crowded BMTC bus and communicating stops to the conductor.
- Explaining fever, throat pain, or symptoms at a clinic and clarifying medication times.
- Borrowing notes or checking library closing hours on a college campus.
- Greeting coworkers and sharing filter coffee during tech office breaks.

Every learning phrase is verified, beginner-friendly, and accompanied by native Kannada script (ಕನ್ನಡ ಲಿಪಿ), Romanised pronunciation with syllable breakdown, accurate English meaning, audio pronunciation, difficulty levels, and cultural street tips.

---

## 🎯 2. Target Users

1. **Working Professionals & IT Engineers:** Non-native residents relocating to Bengaluru, Mysuru, Hubballi, and Mangaluru who want to integrate with teammates and local culture.
2. **College & University Students:** Freshers from across India navigating college campuses, libraries, hostels, and canteens.
3. **Daily Commuters:** Commuters using BMTC buses, Namma Metro, and auto rickshaws every morning and evening.
4. **Families & Homemakers:** Everyday street shoppers negotiating with local vegetable, fruit, and flower vendors.
5. **New Residents & Travellers:** Anyone needing immediate survival phrases for clinics, hospitals, directions, or emergencies.

---

## 🚀 3. Key Features Built

### A. Home / Dashboard
- Welcoming hero introducing the situation-first philosophy: *"Your everyday life in Karnataka, made easier."*
- **Daily Featured Phrase** with audio playback, practice tracking, bookmarking, and instant shuffle.
- Visual cards for all **6 core situations**.
- Instant search bar with pre-configured quick suggestion pills (*"Bus Stop?", "How much?", "I need help", "Speak slowly", "Google Pay"*).
- Daily practice goal tracker and streak counter with celebratory confetti (`canvas-confetti`).
- *"Made for Everyday Karnataka"* cultural touchpoint cards.

### B. 6 Real-Life Situations (60 Verified Phrases)
Ten authentic, verified phrases in each of the 6 core domains (exceeds the 8-phrase minimum requirement):
1. **Public Transportation (ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ):** BMTC bus bays, route numbers, auto meters, metro smart card tokens, and alighting in crowds.
2. **Shopping & Markets (ಖರೀದಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ):** Asking prices per kg, gentle bargaining (*"Svalpa kammi māḍi"*), UPI QR billing, asking for fresh produce, and complimentary coriander.
3. **Travel & Directions (ಪ್ರಯಾಣ ಮತ್ತು ದಾರಿ):** Wayfinding, landmarks, left/right/straight instructions, railway station distances, and darshini restaurant inquiries.
4. **Healthcare & Emergencies (ಆರೋಗ್ಯ ಮತ್ತು ತುರ್ತು):** Describing fever, sore throat, stomach ache, doctor consultation hours, and taking tablets after food.
5. **Education & College (ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು):** Library timings, borrowing unit notes, assignment deadlines, campus canteen locations, and group study.
6. **Workplace & Professional (ಕೆಲಸ ಮತ್ತು ವೃತ್ತಿ):** Cordial morning greetings, filter coffee invites, asking for peer assistance, WFH status, and polite leave notifications.

Each phrase card includes:
- Authentic Kannada script
- Phonetic Romanised transliteration
- Syllable breakdown notes
- English meaning
- Cultural context tip
- Difficulty badge (`Beginner`, `Intermediate`, `Essential`)
- Usage style badge (`Polite`, `Casual`, `Formal`)
- Browser text-to-speech audio button with speed control
- Bookmark to Pocketbook button
- Mark as Practiced button
- 1-click clipboard copy

### C. Interactive Conversation Simulator (Role-Play)
Predefined, client-side conversation trees allowing learners to role-play 6 realistic scenarios:
1. **Hailing an Auto in Indiranagar** (with driver Manjunath)
2. **Vegetable Bargain at Gandhi Bazaar** (with vendor Ramesh Aṇṇā)
3. **BMTC Bus to Silk Board** (with conductor Gangadhar)
4. **Explaining Symptoms at a Clinic** (with Dr. Sharada)
5. **Campus Library & Borrowing Notes** (with Class Rep Pooja)
6. **First Week at Work: Coffee Break Chat** (with Tech Lead Karthik)

Features:
- Character speech bubbles with native Kannada text, Romanised syllables, English translation, and audio voice playback.
- Learner objective prompt.
- **"Reveal Hint"** toggle providing cultural clues before answering.
- 3 response options per step (1 culturally and grammatically ideal response, 2 distractors/impolite options).
- Real-time feedback explaining *why* the chosen option works best.
- Score tracker, XP rewards (+15 XP per correct turn), and celebratory completion modal.

### D. Smart Phrase Finder
- Client-side search across Kannada script, English translation, Romanised phonetics, and contextual tags.
- Instant search suggestion chips (*"Where is the bus stop?", "How much?", "I need help", "Please speak slowly", "Google Pay"*).
- Multi-dimensional filters: Situation category, difficulty level (`All`, `Beginner`, `Intermediate`, `Essential`), and usage style.
- Helpful empty state with 1-click reset.

### E. Pronunciation & Speaking Studio
- Syllable breakdown chips for accurate phonetic articulation.
- Multi-speed browser speech synthesis: `0.7x (Slow Learner)`, `0.85x (Natural)`, `1.0x (Fluent)`.
- Optional browser Web Speech Recognition (`webkitSpeechRecognition` / `SpeechRecognition`) in Kannada (`kn-IN`).
- Live microphone transcript display with phonetic comparison score and gentle coaching guidance.
- Graceful fallbacks for browsers without speech recognition; microphone access is strictly optional.

### F. Daily Challenges & Quizzes
- Four interactive quiz formats:
  1. Translation Quizzes (Kannada ⇄ English)
  2. Contextual Situational Quizzes
  3. Fill-in-the-Blank Sentence Completion
  4. Audio Listening Comprehension
- Daily 5-Question Sprint mode.
- Instant feedback with grammatical explanations.
- XP point awards (+10 XP per correct question) and unlockable achievement badges.

### G. Personal Progress Dashboard
- Live metrics: Total Phrases Practiced, Current Streak, XP Points, Completed Scenarios, and Quiz Accuracy %.
- Category Mastery Breakdown (% progress bars across all 6 situations).
- **Smart Recommendation Engine:** Automatically calculates the user's lowest-mastery category and offers a tailored study suggestion.
- **Achievement Badges:** 7 unlockable badges (*First Word, Namma Auto Pro, Market Bargainer, Street Dialogue Ace, Kannada Quiz Ace, Streak Hero, Bengaluru Local*).
- Recently practiced phrases timeline.
- **Judge Demo Profile Loader:** 1-click button to load a realistic 4-day streak, 19 phrases, 420 XP, 3 scenarios, and 5 badges.
- Safe progress reset with confirmation modal.
- Local browser storage transparency notice.

### H. Kannada Quick Help (Emergency & Street Survival Aid)
- High-contrast, mobile-first quick reference for urgent moments on the road.
- Direct click-to-call links for official emergency numbers:
  - **Police / Universal Emergency:** `112`
  - **Ambulance:** `108`
  - **Women Helpline:** `1091`
  - **Traffic Police:** `103`
- One-tap audio speech for emergency phrases (*"Please help me!", "Where is the nearest hospital?", "I am lost, which road is this?", "Please speak slowly"*).
- Prominent medical & legal disclaimer.

### I. Settings & Accessibility
- **Multilingual Interface:** UI labels translate dynamically into **English, Kannada (ಕನ್ನಡ), Hindi (हिंदी), and Telugu (తెలుగు)**.
- Default phrase difficulty preference filter.
- Text-to-speech rate controller (0.7x, 0.85x, 1.0x).
- Accessibility toggles: **Reduced Motion** (disables animations/confetti) and **High Contrast Mode**.
- Reset all stored data with confirmation safeguard.

### J. Extra Features
- **Pocketbook (Saved Bookmarks):** Dedicated modal to access pinned phrases offline.
- **Trip Backpack (Custom Lists):** Create personalized collections for specific trips (e.g. *"Indiranagar Saturday Market"*, *"Campus First Day"*) with 1-click clipboard export for WhatsApp.
- **First-Visit Onboarding:** Guides first-time visitors to choose their primary goal in Karnataka.
- **Surprise Phrase Generator:** Spontaneous random phrase practice.
- **Mobile Bottom Navigation Bar:** Ergonomic 1-thumb switching on smartphones.

---

## 💻 4. Technology Stack

- **Frontend Framework:** React 19 + TypeScript (strictly typed, verified with `tsc -b`).
- **Build Tool:** Vite 8 (Hot Module Replacement, production build in < 1 second).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom Kannada typography.
- **Fonts:** Google Fonts `Noto Sans Kannada` + `Plus Jakarta Sans`.
- **Icons:** `lucide-react`.
- **Animations:** `canvas-confetti`.
- **Audio & Speech:** Standard Web Speech API (`SpeechSynthesis` + `webkitSpeechRecognition`).
- **Storage:** Local browser storage (`localStorage`) with safe JSON parsing and backward migration support.
- **Linter:** `oxlint` (clean with 0 errors, 0 warnings).

---

## 📁 5. Project Structure

```
namma/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.tsx                 # Brand logo, global XP, nav tabs, action buttons
│   │   ├── HeroDailyPhrase.tsx        # Hero banner, featured phrase, quick search
│   │   ├── SituationPicker.tsx        # 6 real-world situation cards
│   │   ├── PhraseGrid.tsx             # Filterable, searchable phrasebook
│   │   ├── PhraseCard.tsx             # Interactive phrase card (script, audio, copy, bookmark)
│   │   ├── ConversationSimulator.tsx  # Interactive role-play dialogue simulator
│   │   ├── PronunciationStudio.tsx    # Speech playback (0.7x-1.0x) & optional mic STT
│   │   ├── QuizSection.tsx            # Translation, context, fill-blank & listening quizzes
│   │   ├── QuickHelp.tsx              # Emergency helplines (112/108) & survival phrases
│   │   ├── ProgressDashboard.tsx      # Analytics, category mastery, badges, judge loader
│   │   ├── PocketbookModal.tsx        # Saved phrases drawer
│   │   ├── TripBackpackModal.tsx      # Custom trip lists with 1-click clipboard export
│   │   ├── SettingsModal.tsx          # Language (En/Kn/Hi/Te), speed, accessibility
│   │   ├── OnboardingModal.tsx        # First-time goal selection modal
│   │   ├── CultureGuideModal.tsx      # Survival grammar ('Ri', 'Bēku', numbers 1-10)
│   │   ├── SurpriseModal.tsx          # Random phrase generator
│   │   ├── MobileBottomNav.tsx        # Mobile thumb navigation bar
│   │   ├── Toast.tsx                  # Toast notification container
│   │   └── Footer.tsx                 # Footer with problem statement & reset
│   ├── data/
│   │   ├── situations.ts              # 6 situation definitions & styling
│   │   ├── phrases.ts                 # 60 verified Kannada phrases with metadata
│   │   ├── scenarios.ts               # 6 structured dialogue trees for simulator
│   │   ├── quizzes.ts                 # 20+ quiz questions & achievement badges
│   │   └── translations.ts            # Multilingual UI dictionaries (En, Kn, Hi, Te)
│   ├── services/
│   │   └── aiService.ts               # Documented integration contract for backend LLM
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── utils/
│   │   ├── speech.ts                  # Web Speech synthesis & recognition helpers
│   │   └── storage.ts                 # LocalStorage persistence & judge profile loader
│   ├── App.tsx                        # Main application orchestrator & router
│   ├── index.css                      # Tailwind v4 directives & font imports
│   └── main.tsx                       # React DOM root entry
├── index.html                         # Document HTML with Kannada fonts
├── package.json                       # Scripts and dependencies
├── tsconfig.json                      # Strict TypeScript configuration
└── vite.config.ts                     # Vite + React + Tailwind v4 configuration
```

---

## 🛠️ 6. Installation & Development

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or yarn or bun

### Step 1: Clone or navigate to the project
```bash
cd namma
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Run the local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Run Type Checking & Production Build
```bash
npm run build
```
The output will be bundled cleanly into `dist/`.

### Step 5: Run Linter
```bash
npm run lint
```
Runs `oxlint` with 0 errors and 0 warnings.

---

## 🔐 7. Authentication & Cloud Profile Architecture (Supabase Auth)

KannadaConnect features a secure, privacy-first authentication and cloud synchronization system built using **Supabase Auth** and PostgreSQL with **Row Level Security (RLS)**.

### A. Core Architecture & Philosophy

1. **Unrestricted Guest Access:**
   - Anyone can open KannadaConnect and immediately start learning, practicing phrases, bookmarking, and taking quizzes without an account.
   - Guest data is preserved safely in local browser storage (`localStorage`).

2. **Full Auth Lifecycle:**
   - **Sign Up:** Email, password (min. 6 characters), confirm password with mismatch detection, and learner display name.
   - **Log In:** Email & password authentication directly against Supabase.
   - **Forgot Password:** Self-service password reset email dispatched via Supabase.
   - **Log Out:** Cleans active session and returns learner safely to Guest mode.
   - **Show / Hide Password:** Accessible eye toggle buttons for password inspection.
   - **Validation:** Clear, accessible inline error messages and email format checks.

3. **Automatic Deduplicating Cloud Merge:**
   - When a guest signs in or creates an account, KannadaConnect seamlessly merges all local browser progress into their cloud profile without creating duplicate records:
     - Practiced phrase IDs: mathematical set union.
     - Bookmarks (Pocketbook): mathematical set union.
     - Streaks: maximum consecutive days retained.
     - XP Points: maximum score retained.
     - Badges: mathematical set union.
     - Custom Backpack Trips: merged by collection ID/name.

4. **Security & Zero Plaintext Passwords:**
   - **No passwords** are ever stored in the application database, client storage, or frontend code. Password hashing and authentication are strictly handled by Supabase Auth.
   - **Public Client Key Only:** Only the anonymous public client key (`VITE_SUPABASE_ANON_KEY`) is included in client bundles. Service-role keys and private server secrets are never exposed.
   - **Row Level Security (RLS):** Policies in Postgres enforce `auth.uid() = user_id`, guaranteeing learners can only access and modify their own records.
   - **Resilient Fallback:** Automatically backs up progress to Supabase `user_metadata` in addition to Postgres tables, so cloud sync functions out-of-the-box even before running SQL scripts.

5. **Learner Profile Page (`/profile`):**
   - Accessible directly from the top navigation bar and mobile bottom nav.
   - Displays learner display name, email, cloud sync status, target daily goal, practiced phrase count & list, streak days, XP, and full achievement badge shelf.
   - Allows signed-in learners to update their display name and adjust their daily learning goal (3, 5, 10, or 15 phrases/day).

---

## 🛠️ 8. Supabase Setup & Environment Variables

If you wish to link your own Supabase project for multi-device sync, follow these 3 steps:

### Step 1: Create a Free Supabase Project
1. Visit [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase dashboard, go to **Project Settings → API**.
3. Copy your **Project URL** and the **`anon` `public` key**.

### Step 2: Configure Environment Variables
Create a file named `.env.local` in `namma/` (or add them in your Vercel Project Settings under **Environment Variables**):

```env
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anonymous Public Key (Safe for frontend; protected by RLS)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*(Refer to `.env.example` in the repository for reference).*

### Step 3: Run the Database Schema (Optional but Recommended)
Open the **SQL Editor** in your Supabase dashboard and run the script located at `supabase/schema.sql`:

```sql
create table if not exists public.user_learning_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  saved_phrase_ids jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_learning_profiles enable row level security;

create policy "Users can view own learning profile"
  on public.user_learning_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own learning profile"
  on public.user_learning_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own learning profile"
  on public.user_learning_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

> **Note:** If environment variables are not configured, KannadaConnect continues to operate smoothly in **Guest Mode**, saving all data to local browser storage, and clearly informs the user in the UI that cloud synchronization requires Supabase configuration.

---

## 🌐 9. Deployment Instructions

### Deploy to Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run from inside `namma/`:
   ```bash
   vercel
   ```
3. Set the Framework Preset to **Vite** and Build Command to `npm run build`.

### Deploy to Netlify
1. Connect your Git repository on Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

### Deploy to GitHub Pages
1. Build the production bundle: `npm run build`
2. Push the contents of the `dist/` directory to your `gh-pages` branch.

---

## 🎤 9. Hackathon 3-Minute Live Demo Script

Follow this script for a presentation to judges:

| Time | Stage | Action & What to Say |
|---|---|---|
| **0:00 - 0:30** | **The Problem** | *"In Karnataka, millions of non-native students and professionals face everyday communication barriers—hailing autos, buying groceries, or visiting clinics. Rather than teaching abstract grammar, KannadaConnect teaches situation-first spoken Kannada."* Show the homepage, daily featured phrase, and the 6 real-world domain cards. |
| **0:30 - 1:00** | **Search & Audio** | Type *"meter"* or *"bus"* in the Smart Phrase Finder. Show how it immediately finds matching phrases across Kannada script, English, and Romanised pronunciation. Click **"Listen Audio"** to demonstrate Web Speech synthesis. |
| **1:00 - 1:45** | **Role-Play Simulator** | Switch to the **Role-Play Simulator** tab. Select the *"Hailing an Auto in Indiranagar"* scenario. Click **"Reveal Hint"** to explain cultural etiquette (*"ri"* suffix), play the driver's audio, choose the polite option (*"Mīṭar hāki banni sar"*), and show the real-time cultural feedback explaining why it fits. |
| **1:45 - 2:15** | **Quiz & Studio** | Jump to **Challenges & Quizzes**. Take a quick translation or listening question, answer correctly to earn XP and trigger celebratory confetti. Open **Pronunciation Studio** to show syllable breakdowns and the 0.7x learner speed controller. |
| **2:15 - 2:40** | **Progress & Judge Demo** | Go to the **Progress** tab. Click **"Load Judge Demo Profile"** to instantly demonstrate active usage: 19 phrases, 4-day streak, 420 XP, 3 completed scenarios, and 5 unlocked achievement badges. Show the **Smart Recommendation Engine** suggesting the lowest-mastery category. |
| **2:40 - 3:00** | **Emergency & Mobile View** | Switch to the **Quick Help** tab. Show the emergency helpline integration (112 / 108 / 1091) and 1-tap street phrases. Resize the window to mobile width to showcase the responsive mobile bottom navigation bar. |

---

## ⚠️ 10. Known Limitations & Architectural Notes

1. **Browser Speech Synthesis Availability:** Kannada synthetic voice quality depends on the host operating system. Chromium on Windows and Android provides high-quality speech; browsers without native Kannada TTS fall back to Indian English phonetic vocalization or clear visual syllable guidance.
2. **Speech Recognition Microphone Support:** Web Speech Recognition (`webkitSpeechRecognition`) is supported primarily in Chromium-based browsers (Chrome, Edge, Brave, Android Chrome). For unsupported browsers (Firefox, Safari desktop), KannadaConnect displays a graceful informational banner without degrading the listening or reading experience.
3. **Emergency Services:** KannadaConnect is an educational communication aid and does not provide automated dispatch. Direct call links (`tel:112`, `tel:108`) allow users to immediately reach official first responders.

---

## 🚀 11. Future Enhancements

- **Server-Side LLM Conversation Partner:** Integrate Google Gemini via a secure server endpoint (`/api/chat`) for open-ended conversation practice with conversational context evaluation.
- **Offline PWA Support:** Complete ServiceWorker caching of static assets and audio cache for zero-connectivity underground metro rides.
- **Audio Accent Library:** High-fidelity native speaker voice recordings from diverse Karnataka regions (Bengaluru, Coastal Karavali, North Karnataka).
- **Gamified City Map:** A visual roadmap of Karnataka locations unlocking as learners complete scenarios.

---

## 📄 License

MIT License. Crafted with ❤️ for everyday Karnataka.
