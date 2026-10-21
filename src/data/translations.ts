import type { InterfaceLanguage } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  startLearning: string;
  exploreSituations: string;
  navHome: string;
  navLearn: string;
  navSimulator: string;
  navPronounce: string;
  navQuizzes: string;
  navQuickHelp: string;
  navProgress: string;
  navSettings: string;
  pocketbook: string;
  surpriseMe: string;
  survivalTips: string;
  searchPlaceholder: string;
  allSituations: string;
  filterByDifficulty: string;
  allDifficulties: string;
  essentialOnly: string;
  beginner: string;
  intermediate: string;
  practicePhrase: string;
  saved: string;
  save: string;
  listen: string;
  speaking: string;
  copy: string;
  copied: string;
  tip: string;
  dailyGoal: string;
  streak: string;
  xpPoints: string;
  phrasesPracticed: string;
  resetProgress: string;
  interfaceLanguageNotice?: string;
}

export const TRANSLATIONS: Record<InterfaceLanguage, TranslationStrings> = {
  en: {
    appName: 'KannadaConnect',
    tagline: 'Learn Kannada. Use it in real life.',
    heroHeading: 'Your everyday life in Karnataka, made easier.',
    heroSubheading: 'Master practical spoken Kannada for travel, shopping, healthcare, education, transport, and workplaces with audio, role-play dialogues, and instant phrase search.',
    startLearning: 'Start Learning',
    exploreSituations: 'Explore Real-Life Situations',
    navHome: 'Home',
    navLearn: 'Learn & Situations',
    navSimulator: 'Role-Play Simulator',
    navPronounce: 'Pronunciation Studio',
    navQuizzes: 'Challenges & Quizzes',
    navQuickHelp: 'Quick Help (Emergency)',
    navProgress: 'Progress',
    navSettings: 'Settings',
    pocketbook: 'Pocketbook',
    surpriseMe: 'Surprise Me',
    survivalTips: 'Survival Tips',
    searchPlaceholder: 'Search phrases, English meanings, or keywords (e.g. bus, price, help)...',
    allSituations: 'All Situations',
    filterByDifficulty: 'Filter Level',
    allDifficulties: 'All Levels',
    essentialOnly: 'Essential Only',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    practicePhrase: 'Mark Practiced',
    saved: 'Saved',
    save: 'Save',
    listen: 'Listen',
    speaking: 'Speaking...',
    copy: 'Copy',
    copied: 'Copied!',
    tip: 'Tip',
    dailyGoal: 'Daily Goal',
    streak: 'Streak',
    xpPoints: 'XP',
    phrasesPracticed: 'Phrases Practiced',
    resetProgress: 'Reset Progress',
  },
  kn: {
    appName: 'ಕನ್ನಡಕನೆಕ್ಟ್ (KannadaConnect)',
    tagline: 'ಕನ್ನಡ ಕಲಿಯಿರಿ. ನಿಜ ಜೀವನದಲ್ಲಿ ಬಳಸಿ.',
    heroHeading: 'ಕರ್ನಾಟಕದಲ್ಲಿ ನಿಮ್ಮ ದೈನಂದಿನ ಜೀವನವನ್ನು ಸುಲಭಗೊಳಿಸಿ.',
    heroSubheading: 'ಪ್ರಯಾಣ, ಖರೀದಿ, ಆರೋಗ್ಯ, ಶಿಕ್ಷಣ, ಸಾರಿಗೆ ಮತ್ತು ಉದ್ಯೋಗಕ್ಕಾಗಿ ಪ್ರಾಯೋಗಿಕ ಕನ್ನಡ ಸಂಭಾಷಣೆ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಪಾತ್ರಾಭಿನಯದ ಮೂಲಕ ಕಲಿಯಿರಿ.',
    startLearning: 'ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ',
    exploreSituations: 'ಸನ್ನಿವೇಶಗಳನ್ನು ನೋಡಿ',
    navHome: 'ಮುಖಪುಟ',
    navLearn: 'ಸನ್ನಿವೇಶಗಳು & ನುಡಿಗಟ್ಟು',
    navSimulator: 'ಸಂಭಾಷಣಾ ಸಿಮುಲೇಟರ್',
    navPronounce: 'ಉಚ್ಚಾರಣಾ ಸ್ಟುಡಿಯೋ',
    navQuizzes: 'ಕ್ವಿಜ್ & ಸವಾಲುಗಳು',
    navQuickHelp: 'ತ್ವರಿತ ಸಹಾಯ (ತುರ್ತು)',
    navProgress: 'ಕಲಿಕೆಯ ಪ್ರಗತಿ',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    pocketbook: 'ಜೇಬು ಪುಸ್ತಕ',
    surpriseMe: 'ಅನಿರೀಕ್ಷಿತ ನುಡಿ',
    survivalTips: 'ಬದುಕುಳಿಯುವ ಸಲಹೆಗಳು',
    searchPlaceholder: 'ನುಡಿಗಟ್ಟು, ಇಂಗ್ಲಿಷ್ ಅರ್ಥ ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ (ಉದಾ: ಬಸ್, ಬೆಲೆ, ಸಹಾಯ)...',
    allSituations: 'ಎಲ್ಲಾ ಸನ್ನಿವೇಶಗಳು',
    filterByDifficulty: 'ಮಟ್ಟ ಆಯ್ಕೆ',
    allDifficulties: 'ಎಲ್ಲಾ ಮಟ್ಟಗಳು',
    essentialOnly: 'ಅತ್ಯಗತ್ಯ ಮಾತ್ರ',
    beginner: 'ಆರಂಭಿಕ',
    intermediate: 'ಮಧ್ಯಮ',
    practicePhrase: 'ಅಭ್ಯಾಸ ಮಾಡಿದೆ',
    saved: 'ಉಳಿಸಲಾಗಿದೆ',
    save: 'ಉಳಿಸಿ',
    listen: 'ಕೇಳಿ',
    speaking: 'ಧ್ವನಿ ನುಡಿಯುತ್ತಿದೆ...',
    copy: 'ಕಾಪಿ',
    copied: 'ಕಾಪಿಯಾಗಿದೆ!',
    tip: 'ಸಲಹೆ',
    dailyGoal: 'ದೈನಂದಿನ ಗುರಿ',
    streak: 'ಸತತ ದಿನಗಳು',
    xpPoints: 'ಅಂಕಗಳು (XP)',
    phrasesPracticed: 'ಅಭ್ಯಾಸವಾದ ನುಡಿಗಟ್ಟುಗಳು',
    resetProgress: 'ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ',
    interfaceLanguageNotice: 'ಗಮನಿಸಿ: ಇಂಟರ್‌ಫೇಸ್ ಕನ್ನಡದಲ್ಲಿದೆ. ಮೂಲ ಕಲಿಕಾ ವಿಷಯವು ಲಿಪಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ವಿವರಣೆಗಳೆರಡನ್ನೂ ಒಳಗೊಂಡಿದೆ.',
  },
  hi: {
    appName: 'कन्नडकनेक्ट (KannadaConnect)',
    tagline: 'कन्नड सीखें। वास्तविक जीवन में उपयोग करें।',
    heroHeading: 'कर्नाटक में आपका दैनिक जीवन, अब और भी आसान।',
    heroSubheading: 'यात्रा, खरीदारी, स्वास्थ्य, शिक्षा, परिवहन और कार्यस्थल के लिए व्यावहारिक कन्नड़ भाषा बातचीत, उच्चारण और सिमुलेशन के साथ सीखें।',
    startLearning: 'सीखना शुरू करें',
    exploreSituations: 'वास्तविक परिस्थितियां देखें',
    navHome: 'होम',
    navLearn: 'परिस्थितियां और वाक्यांश',
    navSimulator: 'बातचीत सिमुलेटर',
    navPronounce: 'उच्चारण स्टूडियो',
    navQuizzes: 'क्विज़ और चुनौतियां',
    navQuickHelp: 'त्वरित मदद (आपातकालीन)',
    navProgress: 'प्रगति',
    navSettings: 'सेटिंग्स',
    pocketbook: 'पॉकेटबुक (सेव किए गए)',
    surpriseMe: 'रैंडम वाक्य',
    survivalTips: 'आवश्यक टिप्स',
    searchPlaceholder: 'वाक्यांश, अंग्रेजी अर्थ या कीवर्ड खोजें (उदा: बस, दाम, मदद)...',
    allSituations: 'सभी परिस्थितियां',
    filterByDifficulty: 'कठिनाई स्तर',
    allDifficulties: 'सभी स्तर',
    essentialOnly: 'केवल आवश्यक',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    practicePhrase: 'अभ्यास किया',
    saved: 'सहेजा गया',
    save: 'सहेजें',
    listen: 'सुनें',
    speaking: 'बोल रहा है...',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया!',
    tip: 'सुझाव',
    dailyGoal: 'दैनिक लक्ष्य',
    streak: 'दैनिक स्ट्रीक',
    xpPoints: 'अंक (XP)',
    phrasesPracticed: 'अभ्यास किए गए वाक्यांश',
    resetProgress: 'प्रगति रीसेट करें',
    interfaceLanguageNotice: 'सूचना: इंटरफ़ेस लेबल हिंदी में अनुवादित हैं। सीखने वाले वाक्यांश प्रामाणिक कन्नड़ लिपि और लिप्यंतरण में उपलब्ध हैं।',
  },
  te: {
    appName: 'కన్నడకనెక్ట్ (KannadaConnect)',
    tagline: 'కన్నడ నేర్చుకోండి. నిజ జీవితంలో వాడండి.',
    heroHeading: 'కర్ణాటకలో మీ దైనందిన జీవితం మరింత సులభం.',
    heroSubheading: 'ప్రయాణం, కొనుగోళ్లు, ఆరోగ్యం, కళాశాల, రవాణా మరియు ఉద్యోగ రంగాల్లో మాట్లాడే కన్నడను సంభాషణలు, ఆడియో మరియు రోల్-ప్లే ద్వారా నేర్చుకోండి.',
    startLearning: 'నేర్చుకోవడం ప్రారంభించండి',
    exploreSituations: 'పరిస్థితులను చూడండి',
    navHome: 'హోమ్',
    navLearn: 'సందర్భాలు & వాక్యాలు',
    navSimulator: 'సంభాషణ సిమ్యులేటర్',
    navPronounce: 'ఉచ్ఛారణ స్టూడియో',
    navQuizzes: 'క్విజ్‌లు & సవాళ్లు',
    navQuickHelp: 'త్వరిత సహాయం (అత్యవసరం)',
    navProgress: 'పురోగతి',
    navSettings: 'సెట్టింగ్‌లు',
    pocketbook: 'పాకెట్‌బుక్',
    surpriseMe: 'యాదృచ్ఛిక వాక్యం',
    survivalTips: 'ముఖ్యమైన చిట్కాలు',
    searchPlaceholder: 'వాక్యాలు, ఆంగ్ల అర్థాలు లేదా కీవర్డ్‌లను శోధించండి (ఉదా: బస్సు, ధర, సహాయం)...',
    allSituations: 'అన్ని సందర్భాలు',
    filterByDifficulty: 'స్థాయి ఫిల్టర్',
    allDifficulties: 'అన్ని స్థాయిలు',
    essentialOnly: 'ముఖ్యమైనవి మాత్రమే',
    beginner: 'ప్రారంభ స్థాయి',
    intermediate: 'మధ్యస్థ స్థాయి',
    practicePhrase: 'సాధన చేశాను',
    saved: 'భద్రపరచబడింది',
    save: 'భద్రపరచు',
    listen: 'వినండి',
    speaking: 'మాట్లాడుతోంది...',
    copy: 'కాపీ',
    copied: 'కాపీ చేయబడింది!',
    tip: 'చిట్కా',
    dailyGoal: 'రోజువారీ లక్ష్యం',
    streak: 'స్ట్రీక్',
    xpPoints: 'పాయింట్లు (XP)',
    phrasesPracticed: 'సాధన చేసిన వాక్యాలు',
    resetProgress: 'పురోగతిని రీసెట్ చేయండి',
    interfaceLanguageNotice: 'గమనిక: ఇంటర్‌ఫేస్ తెలుగులో ఉంది. అసలు అభ్యాస వాక్యాలు కన్నడ లిపి, రొమనైజ్డ్ ఉచ్ఛారణ మరియు ఆంగ్లంలో అందించబడతాయి.',
  },
};
