"use strict";
(() => {
  // src/ui/state.ts
  var DEFAULT_STATE = {
    mode: "atlas",
    category: "consonants",
    selectedLanguageId: "ipa",
    activePhonemeId: null
  };
  var state = { ...DEFAULT_STATE };
  var listeners = [];
  function getState() {
    return state;
  }
  function subscribe(fn) {
    listeners.push(fn);
  }
  function notify() {
    for (const fn of listeners)
      fn(state);
  }
  function setMode(mode) {
    if (state.mode !== mode) {
      state = { ...state, mode };
      notify();
    }
  }
  function setCategory(category) {
    if (state.category !== category) {
      state = { ...state, category };
      notify();
    }
  }
  function setSelectedLanguage(id) {
    if (state.selectedLanguageId !== id) {
      state = { ...state, selectedLanguageId: id, activePhonemeId: null };
      notify();
    }
  }
  function setActivePhoneme(id) {
    if (state.activePhonemeId !== id) {
      state = { ...state, activePhonemeId: id };
      notify();
    }
  }

  // src/data/languages/english.ts
  var english = {
    id: "english",
    name: "English",
    family: "Indo-European \u203A Germanic",
    region: "Global",
    type: "real",
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "pen", gloss: "writing instrument", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "bed", gloss: "sleeping furniture", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "ten", gloss: "number", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "dog", gloss: "canine", highlight: "d" }] },
      { ipaId: "k", romanization: "k / c", examples: [{ word: "cat", gloss: "feline", highlight: "c" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "go", gloss: "move", highlight: "g" }] },
      { ipaId: "tsh_vl", romanization: "ch", examples: [{ word: "church", gloss: "religious building", highlight: "ch" }] },
      { ipaId: "tsh_vd", romanization: "j", examples: [{ word: "judge", gloss: "arbiter", highlight: "j" }] },
      { ipaId: "f", romanization: "f", examples: [{ word: "fan", gloss: "cooling device", highlight: "f" }] },
      { ipaId: "v", romanization: "v", examples: [{ word: "van", gloss: "vehicle", highlight: "v" }] },
      { ipaId: "theta", romanization: "th", examples: [{ word: "thin", gloss: "not thick", highlight: "th" }] },
      { ipaId: "eth", romanization: "th", examples: [{ word: "this", gloss: "demonstrative", highlight: "th" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "sun", gloss: "star", highlight: "s" }] },
      { ipaId: "z", romanization: "z", examples: [{ word: "zoo", gloss: "animal park", highlight: "z" }] },
      { ipaId: "sh", romanization: "sh", examples: [{ word: "ship", gloss: "vessel", highlight: "sh" }] },
      { ipaId: "zh", romanization: "zh / s", examples: [{ word: "measure", gloss: "quantity", highlight: "su" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "hat", gloss: "headwear", highlight: "h" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "moon", gloss: "satellite", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "now", gloss: "at this time", highlight: "n" }] },
      { ipaId: "ng", romanization: "ng", examples: [{ word: "sing", gloss: "make music", highlight: "ng" }] },
      { ipaId: "alveolar_approx", romanization: "r", examples: [{ word: "run", gloss: "move fast", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "leaf", gloss: "plant part", highlight: "l" }] },
      { ipaId: "j", romanization: "y", examples: [{ word: "yes", gloss: "affirmative", highlight: "y" }] },
      { ipaId: "w", romanization: "w", examples: [{ word: "water", gloss: "liquid", highlight: "w" }] }
    ],
    vowels: [
      { ipaId: "close_front_unrounded", romanization: "ee / ea", examples: [{ word: "feet", gloss: "body part", highlight: "ee" }] },
      { ipaId: "near_close_front_unrounded", romanization: "i", examples: [{ word: "sit", gloss: "be seated", highlight: "i" }] },
      { ipaId: "near_close_back_rounded", romanization: "u", examples: [{ word: "bull", gloss: "male bovine", highlight: "u" }] },
      { ipaId: "close_back_rounded", romanization: "oo", examples: [{ word: "food", gloss: "nourishment", highlight: "oo" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "ay / a", examples: [{ word: "eight", gloss: "number", highlight: "igh" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", examples: [{ word: "over", gloss: "above", highlight: "o" }] },
      { ipaId: "open_mid_front_unrounded", romanization: "e", examples: [{ word: "bet", gloss: "wager", highlight: "e" }] },
      { ipaId: "open_mid_central_unrounded", romanization: "ea", examples: [{ word: "earn", gloss: "receive", highlight: "ear" }] },
      { ipaId: "open_mid_back_unrounded", romanization: "u", examples: [{ word: "run", gloss: "move fast", highlight: "u" }] },
      { ipaId: "open_mid_back_rounded", romanization: "ough", examples: [{ word: "ought", gloss: "should", highlight: "ough" }] },
      { ipaId: "near_open_front_unrounded", romanization: "a", examples: [{ word: "hat", gloss: "headwear", highlight: "a" }] },
      { ipaId: "open_back_unrounded", romanization: "a / o", examples: [{ word: "hot", gloss: "warm", highlight: "o" }] },
      { ipaId: "mid_central", romanization: "a (unstressed)", examples: [{ word: "about", gloss: "concerning", highlight: "a" }] }
    ],
    specialFeatures: [
      {
        title: "Rhoticity",
        description: 'English /r/ is a retroflex or bunched approximant (\u0279), not a trill. Whether /r/ is pronounced after a vowel (as in "car") depends on dialect \u2014 rhotic dialects (American, Irish) pronounce it; non-rhotic dialects (British RP) drop it.'
      },
      {
        title: "Voiced / voiceless TH distinction",
        description: 'English is one of only a handful of languages to use the dental fricatives \u03B8 and \xF0 as phonemes. Most languages that have ever had them have lost them. The two sounds are spelled identically ("th") but differ: "thin" (\u03B8) vs. "this" (\xF0).'
      },
      {
        title: "Lack of phonemic length",
        description: 'English does not use vowel length as a phoneme \u2014 the distinction between "long" and "short" vowels in English spelling refers to vowel quality, not duration.'
      }
    ]
  };

  // src/data/languages/spanish.ts
  var spanish = {
    id: "spanish",
    name: "Spanish",
    nativeName: "Espa\xF1ol",
    family: "Indo-European \u203A Romance",
    region: "Latin America, Spain, Equatorial Guinea",
    type: "real",
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "padre", gloss: "father", highlight: "p" }] },
      { ipaId: "b", romanization: "b / v", examples: [{ word: "boca", gloss: "mouth", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "todo", gloss: "all", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "dos", gloss: "two", highlight: "d" }] },
      { ipaId: "tsh_vl", romanization: "ch", examples: [{ word: "chico", gloss: "boy / small", highlight: "ch" }] },
      { ipaId: "k", romanization: "c / qu / k", examples: [{ word: "casa", gloss: "house", highlight: "c" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gato", gloss: "cat", highlight: "g" }] },
      { ipaId: "f", romanization: "f", examples: [{ word: "fuego", gloss: "fire", highlight: "f" }] },
      { ipaId: "theta", romanization: "c / z", examples: [{ word: "ciudad", gloss: "city", highlight: "c" }, { word: "(Castilian only)", gloss: "" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "sol", gloss: "sun", highlight: "s" }] },
      { ipaId: "x", romanization: "j / g", examples: [{ word: "mujer", gloss: "woman", highlight: "j" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "madre", gloss: "mother", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "noche", gloss: "night", highlight: "n" }] },
      { ipaId: "palatal_nasal", romanization: "\xF1", examples: [{ word: "a\xF1o", gloss: "year", highlight: "\xF1" }] },
      { ipaId: "ng", romanization: "n (before k/g)", examples: [{ word: "banco", gloss: "bank", highlight: "n" }] },
      { ipaId: "r", romanization: "rr", examples: [{ word: "perro", gloss: "dog", highlight: "rr" }] },
      { ipaId: "alveolar_tap", romanization: "r", examples: [{ word: "pero", gloss: "but", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "luna", gloss: "moon", highlight: "l" }] },
      { ipaId: "j", romanization: "y / ll", examples: [{ word: "yo", gloss: "I", highlight: "y" }] },
      { ipaId: "w", romanization: "u / hu", examples: [{ word: "agua", gloss: "water", highlight: "u" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "casa", gloss: "house", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", examples: [{ word: "mesa", gloss: "table", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", examples: [{ word: "s\xED", gloss: "yes", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", examples: [{ word: "sol", gloss: "sun", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", examples: [{ word: "luz", gloss: "light", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Five pure vowels",
        description: "Spanish has one of the simplest vowel systems among major world languages \u2014 exactly five vowels, each with a single stable quality. No reduced vowels, no schwa, no length distinctions. This is why Spanish-influenced English (and English-influenced Spanish) show characteristic vowel substitution errors."
      },
      {
        title: "Rr vs. r contrast",
        description: 'Spanish maintains a phonemic distinction between the alveolar tap /\u027E/ (single "r" in medial position, as in "pero" \u2014 but) and the alveolar trill /r/ ("rr" or initial "r", as in "perro" \u2014 dog). These minimal pairs are real and lexically contrastive.'
      },
      {
        title: "Dialectal TH",
        description: 'Castilian Spanish uses the voiceless dental fricative /\u03B8/ for the letters "c" (before e/i) and "z". Latin American and Andalusian Spanish merge these to /s/ \u2014 a feature called "seseo." Both are standard in their regions.'
      }
    ]
  };

  // src/data/languages/arabic.ts
  var arabic = {
    id: "arabic",
    name: "Arabic",
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    family: "Afro-Asiatic \u203A Semitic",
    region: "Middle East, North Africa",
    type: "real",
    script: {
      name: "Arabic Script",
      direction: "rtl",
      type: "abjad",
      description: "Arabic is written right-to-left in an abjad \u2014 consonants are written, vowels are largely omitted in everyday text. Short vowels can be shown as diacritical marks (called \u1E25arak\u0101t) in educational texts, religious texts, and poetry. Consonant letters connect to each other within words; most letters have four forms depending on position."
    },
    consonants: [
      { ipaId: "b", romanization: "b", nativeScript: "\u0628", examples: [{ word: "bayt", gloss: "house", highlight: "b" }] },
      { ipaId: "t", romanization: "t", nativeScript: "\u062A", examples: [{ word: "t\u012Bn", gloss: "figs", highlight: "t" }] },
      { ipaId: "theta", romanization: "th", nativeScript: "\u062B", examples: [{ word: "thal\u0101tha", gloss: "three", highlight: "th" }] },
      { ipaId: "d", romanization: "d", nativeScript: "\u062F", examples: [{ word: "d\u0101r", gloss: "home", highlight: "d" }] },
      { ipaId: "eth", romanization: "dh", nativeScript: "\u0630", examples: [{ word: "dhahab", gloss: "gold", highlight: "dh" }] },
      { ipaId: "k", romanization: "k", nativeScript: "\u0643", examples: [{ word: "kit\u0101b", gloss: "book", highlight: "k" }] },
      { ipaId: "q", romanization: "q", nativeScript: "\u0642", examples: [{ word: "qamar", gloss: "moon", highlight: "q" }] },
      { ipaId: "glottal_stop", romanization: "\u02BE", nativeScript: "\u0621 / \u0623", examples: [{ word: "\u02BEamr", gloss: "matter / command", highlight: "\u02BE" }] },
      { ipaId: "f", romanization: "f", nativeScript: "\u0641", examples: [{ word: "f\u012B", gloss: "in", highlight: "f" }] },
      { ipaId: "s", romanization: "s", nativeScript: "\u0633", examples: [{ word: "sam\u0101\u02BE", gloss: "sky", highlight: "s" }] },
      { ipaId: "sh", romanization: "sh", nativeScript: "\u0634", examples: [{ word: "shams", gloss: "sun", highlight: "sh" }] },
      { ipaId: "x", romanization: "kh", nativeScript: "\u062E", examples: [{ word: "khubz", gloss: "bread", highlight: "kh" }] },
      { ipaId: "uvular_fric_vd", romanization: "gh", nativeScript: "\u063A", examples: [{ word: "ghurfa", gloss: "room", highlight: "gh" }] },
      { ipaId: "pharyngeal_fric_vl", romanization: "\u1E25", nativeScript: "\u062D", examples: [{ word: "\u1E25ay\u0101t", gloss: "life", highlight: "\u1E25" }] },
      { ipaId: "pharyngeal_fric_vd", romanization: "\u0295", nativeScript: "\u0639", examples: [{ word: "\u0295ayn", gloss: "eye / spring", highlight: "\u0295" }] },
      { ipaId: "h", romanization: "h", nativeScript: "\u0647", examples: [{ word: "huwwa", gloss: "he", highlight: "h" }] },
      { ipaId: "m", romanization: "m", nativeScript: "\u0645", examples: [{ word: "m\u0101\u02BE", gloss: "water", highlight: "m" }] },
      { ipaId: "n", romanization: "n", nativeScript: "\u0646", examples: [{ word: "n\u0101r", gloss: "fire", highlight: "n" }] },
      { ipaId: "r", romanization: "r", nativeScript: "\u0631", examples: [{ word: "r\u012B\u1E25", gloss: "wind", highlight: "r" }] },
      { ipaId: "l", romanization: "l", nativeScript: "\u0644", examples: [{ word: "layl", gloss: "night", highlight: "l" }] },
      { ipaId: "j", romanization: "y", nativeScript: "\u064A", examples: [{ word: "yawm", gloss: "day", highlight: "y" }] },
      { ipaId: "w", romanization: "w", nativeScript: "\u0648", examples: [{ word: "walad", gloss: "boy / child", highlight: "w" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", nativeScript: "\u064E (fat\u1E25a)", examples: [{ word: "kataba", gloss: "he wrote", highlight: "a" }] },
      { ipaId: "close_front_unrounded", romanization: "\u012B", nativeScript: "\u064A (long)", examples: [{ word: "k\u012Bl", gloss: "mile", highlight: "\u012B" }] },
      { ipaId: "close_back_rounded", romanization: "\u016B", nativeScript: "\u0648 (long)", examples: [{ word: "n\u016Br", gloss: "light", highlight: "\u016B" }] },
      { ipaId: "open_mid_front_unrounded", romanization: "i", nativeScript: "\u0650 (kasra)", examples: [{ word: "bint", gloss: "girl", highlight: "i" }] },
      { ipaId: "open_mid_back_rounded", romanization: "u", nativeScript: "\u064F (\u1E0Damma)", examples: [{ word: "mudun", gloss: "cities", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Pharyngeal consonants",
        description: 'Arabic has two pharyngeal fricatives \u2014 the voiceless \u0127 ("\u1E25") and voiced \u0295 ("\u0295") \u2014 produced deep in the throat where the pharynx narrows. These are entirely absent from European languages and are the consonants most difficult for speakers of those languages to acquire.'
      },
      {
        title: "Emphatic consonants",
        description: 'Arabic has four pharyngealized ("emphatic") consonants: \u1E6D, \u1E63, \u1E0D, and \u1E93. These are produced with the base articulation of t/s/d/z but with the tongue root drawn back toward the pharynx simultaneously. They "darken" surrounding vowels, so /a/ near an emphatic sounds like /\u0251/ (as in "hot" in British English).'
      },
      {
        title: "Triconsonantal roots",
        description: "Arabic vocabulary is organized around three-consonant roots. The root k-t-b carries the semantic field of writing: kataba (he wrote), kit\u0101b (book), k\u0101tib (writer), maktab (office). Learning a root unlocks a family of related words simultaneously."
      },
      {
        title: "Abjad writing",
        description: "Standard written Arabic omits short vowels entirely. A native reader supplies them from context and root knowledge. This means the same string of consonants can represent several words \u2014 disambiguation comes from meaning and grammar, not from the letters on the page."
      }
    ]
  };

  // src/data/languages/japanese.ts
  var japanese = {
    id: "japanese",
    name: "Japanese",
    nativeName: "\u65E5\u672C\u8A9E",
    family: "Japonic (isolate)",
    region: "Japan",
    type: "real",
    script: {
      name: "Three-script system",
      direction: "ltr",
      type: "syllabary",
      description: "Japanese uses three scripts simultaneously. Hiragana (\u3072\u3089\u304C\u306A) is a syllabary of 46 characters for native Japanese words and grammar particles. Katakana (\u30AB\u30BF\u30AB\u30CA) is a parallel syllabary used for foreign loanwords, onomatopoeia, and emphasis. Kanji (\u6F22\u5B57) are logographic characters borrowed from Chinese, each representing a morpheme."
    },
    consonants: [
      { ipaId: "p", romanization: "p", nativeScript: "\u3071", examples: [{ word: "pan", gloss: "bread", highlight: "p" }] },
      { ipaId: "b", romanization: "b", nativeScript: "\u3070", examples: [{ word: "bara", gloss: "rose", highlight: "b" }] },
      { ipaId: "t", romanization: "t", nativeScript: "\u305F", examples: [{ word: "tori", gloss: "bird", highlight: "t" }] },
      { ipaId: "d", romanization: "d", nativeScript: "\u3060", examples: [{ word: "doko", gloss: "where", highlight: "d" }] },
      { ipaId: "ts_vl", romanization: "ts", nativeScript: "\u3064", examples: [{ word: "tsuki", gloss: "moon", highlight: "ts" }] },
      { ipaId: "tsh_vl", romanization: "ch", nativeScript: "\u3061", examples: [{ word: "chichi", gloss: "father", highlight: "ch" }] },
      { ipaId: "tsh_vd", romanization: "j", nativeScript: "\u3058", examples: [{ word: "jikan", gloss: "time", highlight: "j" }] },
      { ipaId: "k", romanization: "k", nativeScript: "\u304B", examples: [{ word: "kaze", gloss: "wind", highlight: "k" }] },
      { ipaId: "g", romanization: "g", nativeScript: "\u304C", examples: [{ word: "gomi", gloss: "trash", highlight: "g" }] },
      { ipaId: "f", romanization: "f", nativeScript: "\u3075", examples: [{ word: "fune", gloss: "boat", highlight: "f" }] },
      { ipaId: "s", romanization: "s", nativeScript: "\u3055", examples: [{ word: "sakura", gloss: "cherry blossom", highlight: "s" }] },
      { ipaId: "sh", romanization: "sh", nativeScript: "\u3057", examples: [{ word: "shima", gloss: "island", highlight: "sh" }] },
      { ipaId: "z", romanization: "z", nativeScript: "\u3056", examples: [{ word: "zakura", gloss: "(rare)", highlight: "z" }] },
      { ipaId: "h", romanization: "h", nativeScript: "\u306F", examples: [{ word: "hana", gloss: "flower", highlight: "h" }] },
      { ipaId: "m", romanization: "m", nativeScript: "\u307E", examples: [{ word: "mizu", gloss: "water", highlight: "m" }] },
      { ipaId: "n", romanization: "n", nativeScript: "\u306A / \u3093", examples: [{ word: "nami", gloss: "wave", highlight: "n" }] },
      { ipaId: "alveolar_tap", romanization: "r", nativeScript: "\u3089", examples: [{ word: "ringo", gloss: "apple", highlight: "r" }] },
      { ipaId: "j", romanization: "y", nativeScript: "\u3084", examples: [{ word: "yama", gloss: "mountain", highlight: "y" }] },
      { ipaId: "w", romanization: "w", nativeScript: "\u308F", examples: [{ word: "watashi", gloss: "I", highlight: "w" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", nativeScript: "\u3042", examples: [{ word: "ame", gloss: "rain", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", nativeScript: "\u3048", examples: [{ word: "eki", gloss: "station", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", nativeScript: "\u3044", examples: [{ word: "ishi", gloss: "stone", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", nativeScript: "\u304A", examples: [{ word: "umi", gloss: 'sea \u2014 note: "o" in different context', highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", nativeScript: "\u3046", examples: [{ word: "umi", gloss: "sea", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Moraic rhythm",
        description: "Japanese organizes time in moras \u2014 roughly syllable-sized units of equal duration. Long vowels (e.g., \u304A\u304B\u3042\u3055\u3093 ok\u0101san \u2014 mother) take two moras. The syllable-final nasal \u3093 is its own mora. This means pitch, rhythm, and word boundaries all operate on mora counts, not syllable counts."
      },
      {
        title: "Pitch accent",
        description: 'Standard Japanese (Tokyo dialect) uses a pitch accent system. Words have a "nucleus" after which pitch drops sharply. The position of this nucleus is lexically distinctive: hashi can mean bridge (H\xC0sh\xEC), chopsticks (H\xC1sh\xEC), or edge (hash\xCD) depending on where pitch falls.'
      },
      {
        title: 'Japanese "r"',
        description: 'The Japanese r (\u3089 ri \u308B re \u308D ro \u3089 ra \u308C re) is neither a trill nor an approximant \u2014 it is an alveolar tap (\u027E), similar to the "r" in Spanish "pero" or the American English "d/t" in "butter." This is why Japanese speakers substitute it for English /l/ and /r/ both \u2014 their language has one sound that partially matches each.'
      },
      {
        title: "Minimal consonant inventory",
        description: "Japanese has fewer consonant phonemes than almost any other major language \u2014 no voiced fricatives except /z/, no /\u03B8/, no /v/ natively, no /l/. This simplicity is counterbalanced by a complex morphology and the three-script writing system."
      }
    ]
  };

  // src/data/languages/hindi.ts
  var hindi = {
    id: "hindi",
    name: "Hindi",
    nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940",
    family: "Indo-European \u203A Indo-Aryan",
    region: "India",
    type: "real",
    script: {
      name: "Devanagari",
      direction: "ltr",
      type: "abugida",
      description: "Devanagari is an abugida \u2014 each character represents a consonant with an inherent /a/ vowel. Other vowels are written as diacritics attached to the consonant. A special mark (vir\u0101ma) suppresses the inherent vowel in consonant clusters. The script reads left-to-right and is used for Hindi, Sanskrit, Marathi, Nepali, and many other languages."
    },
    consonants: [
      { ipaId: "p", romanization: "p", nativeScript: "\u092A", examples: [{ word: "paani", gloss: "water", highlight: "p" }] },
      { ipaId: "b", romanization: "b", nativeScript: "\u092C", examples: [{ word: "baap", gloss: "father", highlight: "b" }] },
      { ipaId: "t", romanization: "t", nativeScript: "\u0924", examples: [{ word: "teen", gloss: "three", highlight: "t" }] },
      { ipaId: "d", romanization: "d", nativeScript: "\u0926", examples: [{ word: "dil", gloss: "heart", highlight: "d" }] },
      { ipaId: "retroflex_stop_vl", romanization: "\u1E6D", nativeScript: "\u091F", examples: [{ word: "\u1E6Dop", gloss: "top (borrowed)", highlight: "\u1E6D" }] },
      { ipaId: "retroflex_stop_vd", romanization: "\u1E0D", nativeScript: "\u0921", examples: [{ word: "\u1E0D\u0101k", gloss: "mail / post", highlight: "\u1E0D" }] },
      { ipaId: "tsh_vl", romanization: "c", nativeScript: "\u091A", examples: [{ word: "chaand", gloss: "moon", highlight: "ch" }] },
      { ipaId: "tsh_vd", romanization: "j", nativeScript: "\u091C", examples: [{ word: "jal", gloss: "water (formal)", highlight: "j" }] },
      { ipaId: "k", romanization: "k", nativeScript: "\u0915", examples: [{ word: "kaam", gloss: "work", highlight: "k" }] },
      { ipaId: "g", romanization: "g", nativeScript: "\u0917", examples: [{ word: "ghar", gloss: "house", highlight: "g" }] },
      { ipaId: "f", romanization: "f", nativeScript: "\u092B\u093C", examples: [{ word: "film", gloss: "movie", highlight: "f" }] },
      { ipaId: "v", romanization: "v", nativeScript: "\u0935", examples: [{ word: "vaada", gloss: "promise", highlight: "v" }] },
      { ipaId: "s", romanization: "s", nativeScript: "\u0938", examples: [{ word: "sab", gloss: "all", highlight: "s" }] },
      { ipaId: "sh", romanization: "sh", nativeScript: "\u0936", examples: [{ word: "shahar", gloss: "city", highlight: "sh" }] },
      { ipaId: "h", romanization: "h", nativeScript: "\u0939", examples: [{ word: "hath", gloss: "hand", highlight: "h" }] },
      { ipaId: "m", romanization: "m", nativeScript: "\u092E", examples: [{ word: "maa", gloss: "mother", highlight: "m" }] },
      { ipaId: "n", romanization: "n", nativeScript: "\u0928", examples: [{ word: "naam", gloss: "name", highlight: "n" }] },
      { ipaId: "retroflex_nasal", romanization: "\u1E47", nativeScript: "\u0923", examples: [{ word: "ra\u1E47", gloss: "battle (Sanskrit)", highlight: "\u1E47" }] },
      { ipaId: "palatal_nasal", romanization: "\xF1", nativeScript: "\u091E", examples: [{ word: "j\xF1\u0101n", gloss: "knowledge", highlight: "\xF1" }] },
      { ipaId: "ng", romanization: "\u1E45", nativeScript: "\u0919", examples: [{ word: "a\u1E45ga", gloss: "body part (Sanskrit)", highlight: "\u1E45" }] },
      { ipaId: "alveolar_tap", romanization: "r", nativeScript: "\u0930", examples: [{ word: "rang", gloss: "color", highlight: "r" }] },
      { ipaId: "retroflex_flap", romanization: "\u1E5B", nativeScript: "\u0921\u093C", examples: [{ word: "la\u1E5Bkaa", gloss: "boy", highlight: "\u1E5B" }] },
      { ipaId: "l", romanization: "l", nativeScript: "\u0932", examples: [{ word: "log", gloss: "people", highlight: "l" }] },
      { ipaId: "j", romanization: "y", nativeScript: "\u092F", examples: [{ word: "yaar", gloss: "friend", highlight: "y" }] },
      { ipaId: "w", romanization: "w", nativeScript: "\u0935", examples: [{ word: "waqt", gloss: "time", highlight: "w" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", nativeScript: "\u0905 / \u093E", examples: [{ word: "aaj", gloss: "today", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", nativeScript: "\u090F / \u0947", examples: [{ word: "ek", gloss: "one", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i / \u012B", nativeScript: "\u0907 / \u093F", examples: [{ word: "idhar", gloss: "here", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", nativeScript: "\u0913 / \u094B", examples: [{ word: "oonth", gloss: "camel", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u / \u016B", nativeScript: "\u0909 / \u0941", examples: [{ word: "upar", gloss: "above", highlight: "u" }] },
      { ipaId: "mid_central", romanization: "\u0259", nativeScript: "inherent vowel", examples: [{ word: "kam", gloss: "less", highlight: "a" }] },
      { ipaId: "open_mid_front_unrounded", romanization: "ai", nativeScript: "\u0910 / \u0948", examples: [{ word: "aisi", gloss: "like this", highlight: "ai" }] }
    ],
    specialFeatures: [
      {
        title: "Aspirated stops",
        description: "Hindi has a four-way distinction in stops: voiceless unaspirated (k), voiceless aspirated (kh), voiced unaspirated (g), and voiced aspirated (gh). The aspirated sounds are produced with a puff of air. All four are phonemically contrastive: pal (moment) vs. phal (fruit) vs. bal (strength) vs. bhal (error)."
      },
      {
        title: "Retroflex consonants",
        description: "Hindi has a series of retroflex consonants (\u1E6D, \u1E0D, \u1E47, \u1E63) where the tongue tip curls back to touch the roof of the mouth. This is a feature of South Asian languages not found in European or Semitic families. The retroflex sounds contrast with dental stops: t\u012Bn (three, dental) vs. \u1E6D\u012Bn (tin, retroflex)."
      },
      {
        title: "Devanagari abugida structure",
        description: "Each Devanagari consonant carries an inherent /a/ sound unless modified. A vowel diacritic replaces the inherent vowel: \u0915 = ka, \u0915\u093F = ki, \u0915\u094B = ko. The vir\u0101ma mark (\u094D) silences the inherent vowel for consonant clusters: \u0915\u094D\u0924 = kta (written kt)."
      }
    ]
  };

  // src/data/languages/russian.ts
  var russian = {
    id: "russian",
    name: "Russian",
    nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    family: "Indo-European \u203A Slavic",
    region: "Russia, former Soviet Union",
    type: "real",
    script: {
      name: "Cyrillic",
      direction: "ltr",
      type: "alphabet",
      description: "Russian uses the Cyrillic alphabet, developed in the 9th century to write Old Church Slavonic. The Russian Cyrillic alphabet has 33 letters. Two special letters \u2014 the hard sign (\u044A) and soft sign (\u044C) \u2014 do not represent sounds directly but modify surrounding consonants. The soft sign palatalizes the preceding consonant; the hard sign marks a morpheme boundary without palatalization."
    },
    consonants: [
      { ipaId: "p", romanization: "p", nativeScript: "\u043F", examples: [{ word: "papa", gloss: "father", highlight: "p" }] },
      { ipaId: "b", romanization: "b", nativeScript: "\u0431", examples: [{ word: "brat", gloss: "brother", highlight: "b" }] },
      { ipaId: "t", romanization: "t", nativeScript: "\u0442", examples: [{ word: "tam", gloss: "there", highlight: "t" }] },
      { ipaId: "d", romanization: "d", nativeScript: "\u0434", examples: [{ word: "dom", gloss: "house", highlight: "d" }] },
      { ipaId: "ts_vl", romanization: "ts", nativeScript: "\u0446", examples: [{ word: "tsar", gloss: "emperor", highlight: "ts" }] },
      { ipaId: "tsh_vl", romanization: "ch", nativeScript: "\u0447", examples: [{ word: "chay", gloss: "tea", highlight: "ch" }] },
      { ipaId: "k", romanization: "k", nativeScript: "\u043A", examples: [{ word: "kot", gloss: "cat", highlight: "k" }] },
      { ipaId: "g", romanization: "g", nativeScript: "\u0433", examples: [{ word: "gora", gloss: "mountain", highlight: "g" }] },
      { ipaId: "f", romanization: "f", nativeScript: "\u0444", examples: [{ word: "fon", gloss: "background", highlight: "f" }] },
      { ipaId: "v", romanization: "v", nativeScript: "\u0432", examples: [{ word: "voda", gloss: "water", highlight: "v" }] },
      { ipaId: "s", romanization: "s", nativeScript: "\u0441", examples: [{ word: "syn", gloss: "son", highlight: "s" }] },
      { ipaId: "z", romanization: "z", nativeScript: "\u0437", examples: [{ word: "zima", gloss: "winter", highlight: "z" }] },
      { ipaId: "sh", romanization: "sh", nativeScript: "\u0448", examples: [{ word: "shkola", gloss: "school", highlight: "sh" }] },
      { ipaId: "zh", romanization: "zh", nativeScript: "\u0436", examples: [{ word: "zhizn", gloss: "life", highlight: "zh" }] },
      { ipaId: "x", romanization: "kh", nativeScript: "\u0445", examples: [{ word: "khleb", gloss: "bread", highlight: "kh" }] },
      { ipaId: "m", romanization: "m", nativeScript: "\u043C", examples: [{ word: "mat", gloss: "mother", highlight: "m" }] },
      { ipaId: "n", romanization: "n", nativeScript: "\u043D", examples: [{ word: "noch", gloss: "night", highlight: "n" }] },
      { ipaId: "r", romanization: "r", nativeScript: "\u0440", examples: [{ word: "reka", gloss: "river", highlight: "r" }] },
      { ipaId: "l", romanization: "l", nativeScript: "\u043B", examples: [{ word: "les", gloss: "forest", highlight: "l" }] },
      { ipaId: "j", romanization: "y / j", nativeScript: "\u0439", examples: [{ word: "yug", gloss: "south", highlight: "y" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", nativeScript: "\u0430", examples: [{ word: "tam", gloss: "there", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "ye / e", nativeScript: "\u0435", examples: [{ word: "net", gloss: "no", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", nativeScript: "\u0438", examples: [{ word: "idi", gloss: "go!", highlight: "i" }] },
      { ipaId: "close_central_unrounded", romanization: "y", nativeScript: "\u044B", examples: [{ word: "syn", gloss: "son", highlight: "y" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", nativeScript: "\u043E", examples: [{ word: "okno", gloss: "window", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", nativeScript: "\u0443", examples: [{ word: "utro", gloss: "morning", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Palatalization \u2014 the defining feature",
        description: `Nearly every Russian consonant has a "soft" (palatalized) counterpart, where the tongue simultaneously rises toward the palate. This is marked by the soft sign (\u044C) or by a front vowel following. The pair \u0431rat (brother) vs. \u0431\u0440\u0430\u0442\u044C bryat' (to take) differs only in whether the final \u0442 is palatalized. Russian has ~34 consonant pairs (hard/soft) that are phonemically distinct.`
      },
      {
        title: "The central vowel \u044B",
        description: "Russian has a close central unrounded vowel /\u0268/ (the letter \u044B) with no equivalent in most European languages. It is produced like /i/ but with the tongue further back. After consonant + soft sign, /i/ appears; after hard consonants, /\u0268/ appears. The pair \u043C\u0438\u0440 /mir/ (peace / world) vs. \u043C\u044B\u0440 /m\u0268r/ (village commune, archaic) illustrates the distinction."
      },
      {
        title: "Vowel reduction",
        description: "Unstressed vowels in Russian are significantly reduced. The letter \u043E in an unstressed syllable is usually pronounced as /\u0250/ (near the /a/ sound). The letter \u0435 unstressed becomes /\u026A/. This means the same word sounds differently depending on which syllable is stressed \u2014 stress is lexical and must be memorized."
      }
    ]
  };

  // src/data/languages/german.ts
  var german = {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    family: "Indo-European \u203A Germanic",
    region: "Germany, Austria, Switzerland",
    type: "real",
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "Pfad", gloss: "path", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "Buch", gloss: "book", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "Tor", gloss: "gate", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "Dach", gloss: "roof", highlight: "d" }] },
      { ipaId: "ts_vl", romanization: "z / tz", examples: [{ word: "Zeit", gloss: "time", highlight: "z" }] },
      { ipaId: "tsh_vl", romanization: "tsch", examples: [{ word: "deutsch", gloss: "German", highlight: "tsch" }] },
      { ipaId: "k", romanization: "k / c / ck", examples: [{ word: "Kopf", gloss: "head", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gut", gloss: "good", highlight: "g" }] },
      { ipaId: "f", romanization: "f / v", examples: [{ word: "Feuer", gloss: "fire", highlight: "f" }] },
      { ipaId: "v", romanization: "w", examples: [{ word: "Wasser", gloss: "water", highlight: "w" }] },
      { ipaId: "s", romanization: "s / ss / \xDF", examples: [{ word: "Stein", gloss: "stone", highlight: "s" }] },
      { ipaId: "z", romanization: "s (initial)", examples: [{ word: "Sonne", gloss: "sun", highlight: "S" }] },
      { ipaId: "sh", romanization: "sch", examples: [{ word: "Schiff", gloss: "ship", highlight: "Sch" }] },
      { ipaId: "zh", romanization: "g (loanwords)", examples: [{ word: "Garage", gloss: "garage", highlight: "g" }] },
      { ipaId: "palatal_fric_vl", romanization: "ch (front)", examples: [{ word: "ich", gloss: "I", highlight: "ch" }] },
      { ipaId: "x", romanization: "ch (back)", examples: [{ word: "Bach", gloss: "stream", highlight: "ch" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "Haus", gloss: "house", highlight: "h" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "Mond", gloss: "moon", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "Nacht", gloss: "night", highlight: "n" }] },
      { ipaId: "ng", romanization: "ng", examples: [{ word: "singen", gloss: "to sing", highlight: "ng" }] },
      { ipaId: "uvular_fric_vd", romanization: "r", examples: [{ word: "rot", gloss: "red", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "Licht", gloss: "light", highlight: "l" }] },
      { ipaId: "j", romanization: "j", examples: [{ word: "Jahr", gloss: "year", highlight: "j" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "Gast", gloss: "guest", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e / ee / eh", examples: [{ word: "Meer", gloss: "sea", highlight: "ee" }] },
      { ipaId: "open_mid_front_unrounded", romanization: "e (short)", examples: [{ word: "Bett", gloss: "bed", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i / ie / ih", examples: [{ word: "Tier", gloss: "animal", highlight: "ie" }] },
      { ipaId: "near_close_front_unrounded", romanization: "i (short)", examples: [{ word: "mit", gloss: "with", highlight: "i" }] },
      { ipaId: "close_mid_front_rounded", romanization: "\xF6 / \xF6h", examples: [{ word: "sch\xF6n", gloss: "beautiful", highlight: "\xF6" }] },
      { ipaId: "open_mid_front_rounded", romanization: "\xF6 (short)", examples: [{ word: "H\xF6lle", gloss: "hell", highlight: "\xF6" }] },
      { ipaId: "close_front_rounded", romanization: "\xFC / \xFCh", examples: [{ word: "\xFCber", gloss: "over / about", highlight: "\xFC" }] },
      { ipaId: "near_close_front_rounded", romanization: "\xFC (short)", examples: [{ word: "h\xFCbsch", gloss: "pretty", highlight: "\xFC" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o / oo / oh", examples: [{ word: "Boot", gloss: "boat", highlight: "oo" }] },
      { ipaId: "close_back_rounded", romanization: "u / uh", examples: [{ word: "Hut", gloss: "hat", highlight: "u" }] },
      { ipaId: "mid_central", romanization: "e (unstressed)", examples: [{ word: "Liebe", gloss: "love", highlight: "e" }] }
    ],
    specialFeatures: [
      {
        title: "Front rounded vowels",
        description: "German has two front rounded vowels \u2014 \xFC /y/ (close front rounded) and \xF6 /\xF8/ (close-mid front rounded) \u2014 not found in English. These are produced like /i/ and /e/ but with rounded lips. French has the same vowels (spelled u and eu). These are among the sounds English speakers find most difficult to acquire."
      },
      {
        title: "Uvular R",
        description: 'Standard German /r/ is typically realized as a voiced uvular fricative /\u0281/ (like the French r) rather than a trill. In final position after a vowel ("Uhr" \u2014 clock), it often reduces to a vocalic /\u0250/. This uvular articulation is characteristic of German, French, and Danish among major European languages.'
      },
      {
        title: "CH allophony",
        description: 'The letter combination "ch" represents two distinct sounds depending on the preceding vowel. After front vowels (i, e, \xFC, \xF6) and consonants: the voiceless palatal fricative /\xE7/ (ich, recht). After back vowels (a, o, u) and au: the voiceless velar fricative /x/ (Bach, hoch). This is allophonic \u2014 predictable from context \u2014 so German speakers perceive them as one sound.'
      },
      {
        title: "Final devoicing",
        description: 'All voiced obstruents (b, d, g, v, z) become voiceless at the end of a syllable. "Rad" (wheel, /d/ at end) is pronounced /rat/. When a suffix follows: "R\xE4der" (wheels) restores the /d/. This explains otherwise puzzling spelling/pronunciation pairs.'
      }
    ]
  };

  // src/data/languages/french.ts
  var french = {
    id: "french",
    name: "French",
    nativeName: "Fran\xE7ais",
    family: "Indo-European \u203A Romance",
    region: "France, Belgium, Switzerland, Quebec, Francophone Africa",
    type: "real",
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "p\xE8re", gloss: "father", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "beau", gloss: "beautiful", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "terre", gloss: "earth", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "deux", gloss: "two", highlight: "d" }] },
      { ipaId: "k", romanization: "c / qu / k", examples: [{ word: "c\u0153ur", gloss: "heart", highlight: "c" }] },
      { ipaId: "g", romanization: "g / gu", examples: [{ word: "guerre", gloss: "war", highlight: "gu" }] },
      { ipaId: "f", romanization: "f / ph", examples: [{ word: "feu", gloss: "fire", highlight: "f" }] },
      { ipaId: "v", romanization: "v", examples: [{ word: "vent", gloss: "wind", highlight: "v" }] },
      { ipaId: "s", romanization: "s / c (soft)", examples: [{ word: "soleil", gloss: "sun", highlight: "s" }] },
      { ipaId: "z", romanization: "z / liaison s", examples: [{ word: "maison", gloss: "house", highlight: "s" }] },
      { ipaId: "sh", romanization: "ch", examples: [{ word: "chat", gloss: "cat", highlight: "ch" }] },
      { ipaId: "zh", romanization: "j / g (soft)", examples: [{ word: "jour", gloss: "day", highlight: "j" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "mer", gloss: "sea", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "nuit", gloss: "night", highlight: "n" }] },
      { ipaId: "palatal_nasal", romanization: "gn", examples: [{ word: "montagne", gloss: "mountain", highlight: "gn" }] },
      { ipaId: "ng", romanization: "ng (loanwords)", examples: [{ word: "camping", gloss: "camping", highlight: "ng" }] },
      { ipaId: "uvular_fric_vd", romanization: "r", examples: [{ word: "rouge", gloss: "red", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "lune", gloss: "moon", highlight: "l" }] },
      { ipaId: "j", romanization: "y", examples: [{ word: "yeux", gloss: "eyes", highlight: "y" }] },
      { ipaId: "w", romanization: "w / ou", examples: [{ word: "oui", gloss: "yes", highlight: "ou" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "chat", gloss: "cat", highlight: "a" }] },
      { ipaId: "open_back_unrounded", romanization: "\xE2", examples: [{ word: "p\xE2te", gloss: "paste", highlight: "\xE2" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "\xE9", examples: [{ word: "\xE9t\xE9", gloss: "summer", highlight: "\xE9" }] },
      { ipaId: "open_mid_front_unrounded", romanization: "\xE8 / \xEA", examples: [{ word: "f\xEAte", gloss: "celebration", highlight: "\xEA" }] },
      { ipaId: "close_front_unrounded", romanization: "i / y", examples: [{ word: "\xEEle", gloss: "island", highlight: "\xEE" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o / \xF4 / au / eau", examples: [{ word: "eau", gloss: "water", highlight: "eau" }] },
      { ipaId: "open_mid_back_rounded", romanization: "o (open)", examples: [{ word: "or", gloss: "gold", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "ou", examples: [{ word: "loup", gloss: "wolf", highlight: "ou" }] },
      { ipaId: "close_front_rounded", romanization: "u", examples: [{ word: "lune", gloss: "moon", highlight: "u" }] },
      { ipaId: "near_close_front_rounded", romanization: "u (lax)", examples: [{ word: "nul", gloss: "zero", highlight: "u" }] },
      { ipaId: "close_mid_front_rounded", romanization: "eu / \u0153u", examples: [{ word: "feu", gloss: "fire", highlight: "eu" }] },
      { ipaId: "open_mid_front_rounded", romanization: "eu (open) / \u0153", examples: [{ word: "peur", gloss: "fear", highlight: "eu" }] },
      { ipaId: "mid_central", romanization: "e (unstressed)", examples: [{ word: "le", gloss: "the (m)", highlight: "e" }] },
      // Nasal vowels — the signature French feature
      { ipaId: "nasal_open_front", romanization: "an / en / am / em", examples: [{ word: "vent", gloss: "wind", highlight: "en" }] },
      { ipaId: "nasal_open_mid_front", romanization: "in / im / ain / ein", examples: [{ word: "vin", gloss: "wine", highlight: "in" }] },
      { ipaId: "nasal_open_mid_back", romanization: "on / om", examples: [{ word: "bon", gloss: "good", highlight: "on" }] },
      { ipaId: "nasal_open_mid_front_rounded", romanization: "un / um", examples: [{ word: "un", gloss: "a / one", highlight: "un" }] }
    ],
    specialFeatures: [
      {
        title: "Nasal vowels \u2014 the French signature",
        description: 'French has four nasal vowels (\u0251\u0303, \u025B\u0303, \u0254\u0303, \u0153\u0303) produced with the soft palate lowered so air passes through the nose simultaneously. The following consonant is not pronounced: "vin" (wine) is /v\u025B\u0303/, not /vin/. These are the same nasal vowels developed in Bou\xE9ni but arrived at through a different historical process.'
      },
      {
        title: "Front rounded vowels",
        description: 'French has three front rounded vowels: /y/ (spelled u \u2014 as in "lune"), /\xF8/ (spelled eu/\u0153u \u2014 as in "feu"), and /\u0153/ (spelled eu \u2014 as in "peur"). The /y/ is particularly challenging for English speakers: pronounce /i/ then round the lips without moving the tongue.'
      },
      {
        title: "Liaison and elision",
        description: `French word boundaries are highly fluid. In liaison, a normally-silent final consonant is pronounced when the next word begins with a vowel: "les amis" becomes /le.z\u203Fami/. In elision, the final vowel of certain words drops: "le + ami" \u2192 "l'ami." These processes make French sound remarkably different from its written form.`
      },
      {
        title: "Uvular R",
        description: "Like German, standard French /r/ is realized as a voiced uvular fricative /\u0281/ \u2014 produced at the back of the mouth where the uvula meets the back of the tongue. This is quite different from Spanish or Italian /r/ and is one of the most recognizable features of the French accent."
      }
    ]
  };

  // src/data/languages/chinese.ts
  var chinese = {
    id: "chinese",
    name: "Mandarin Chinese",
    nativeName: "\u666E\u901A\u8BDD",
    family: "Sino-Tibetan",
    region: "China, Taiwan, Singapore",
    type: "real",
    script: {
      name: "Chinese Characters (Hanzi)",
      direction: "ltr",
      type: "logographic",
      description: "Mandarin is written primarily in logographic Chinese characters (\u6C49\u5B57 H\xE0nz\xEC), where each character represents a morpheme (meaning unit). Simplified characters are used in mainland China; traditional characters in Taiwan and Hong Kong. Pinyin (\u62FC\u97F3) is the standard romanization system using Latin letters and tone marks."
    },
    consonants: [
      { ipaId: "p", romanization: "b (unaspirated)", nativeScript: "b", examples: [{ word: "b\u0101 \u516B", gloss: "eight", highlight: "b" }] },
      { ipaId: "b", romanization: "\u2014 (not standard)", nativeScript: "\u2014", examples: [{ word: "no voiced bilabial in Mandarin", gloss: "" }] },
      { ipaId: "t", romanization: "d (unaspirated)", nativeScript: "d", examples: [{ word: "d\xE0 \u5927", gloss: "big", highlight: "d" }] },
      { ipaId: "k", romanization: "g (unaspirated)", nativeScript: "g", examples: [{ word: "g\u0101o \u9AD8", gloss: "tall", highlight: "g" }] },
      { ipaId: "ts_vl", romanization: "z (unaspirated)", nativeScript: "z", examples: [{ word: "z\u01D0 \u5B50", gloss: "child / seed", highlight: "z" }] },
      { ipaId: "retroflex_affricate_vl", romanization: "zh (unaspirated)", nativeScript: "zh", examples: [{ word: "zh\u014Dng \u4E2D", gloss: "center / China", highlight: "zh" }] },
      { ipaId: "alveopalatal_affricate_vl", romanization: "j (unaspirated)", nativeScript: "j", examples: [{ word: "j\xECn \u8FDB", gloss: "enter", highlight: "j" }] },
      { ipaId: "f", romanization: "f", nativeScript: "f", examples: [{ word: "f\u0113i \u98DE", gloss: "fly", highlight: "f" }] },
      { ipaId: "s", romanization: "s", nativeScript: "s", examples: [{ word: "s\xEC \u56DB", gloss: "four", highlight: "s" }] },
      { ipaId: "retroflex_fric_vl", romanization: "sh", nativeScript: "sh", examples: [{ word: "sh\u0101n \u5C71", gloss: "mountain", highlight: "sh" }] },
      { ipaId: "alveopalatal_fric_vl", romanization: "x", nativeScript: "x", examples: [{ word: "xi\u01CEo \u5C0F", gloss: "small", highlight: "x" }] },
      { ipaId: "x", romanization: "h", nativeScript: "h", examples: [{ word: "h\u01CEo \u597D", gloss: "good", highlight: "h" }] },
      { ipaId: "m", romanization: "m", nativeScript: "m", examples: [{ word: "m\u0101o \u732B", gloss: "cat", highlight: "m" }] },
      { ipaId: "n", romanization: "n", nativeScript: "n", examples: [{ word: "n\u01CEi \u5976", gloss: "milk", highlight: "n" }] },
      { ipaId: "ng", romanization: "ng (coda)", nativeScript: "ng", examples: [{ word: "w\xE1ng \u738B", gloss: "king", highlight: "ng" }] },
      { ipaId: "retroflex_approx", romanization: "r", nativeScript: "r", examples: [{ word: "r\xE9n \u4EBA", gloss: "person", highlight: "r" }] },
      { ipaId: "l", romanization: "l", nativeScript: "l", examples: [{ word: "l\xE1i \u6765", gloss: "come", highlight: "l" }] },
      { ipaId: "j", romanization: "y", nativeScript: "y", examples: [{ word: "y\u012B \u4E00", gloss: "one", highlight: "y" }] },
      { ipaId: "w", romanization: "w", nativeScript: "w", examples: [{ word: "w\u01D2 \u6211", gloss: "I", highlight: "w" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", nativeScript: "a", examples: [{ word: "b\u0101 \u516B", gloss: "eight", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e (in -ie, -\xFCe)", nativeScript: "e", examples: [{ word: "y\u011B \u4E5F", gloss: "also", highlight: "e" }] },
      { ipaId: "close_mid_back_unrounded", romanization: "e (standalone)", nativeScript: "e", examples: [{ word: "\xE8 \u997F", gloss: "hungry", highlight: "e" }] },
      { ipaId: "mid_central", romanization: "e (in -en, -eng)", nativeScript: "e", examples: [{ word: "g\u0113n \u6839", gloss: "root", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", nativeScript: "i", examples: [{ word: "n\u01D0 \u4F60", gloss: "you", highlight: "i" }] },
      { ipaId: "close_front_rounded", romanization: "\xFC / u (after j/q/x/y)", nativeScript: "\xFC", examples: [{ word: "y\u01D4 \u96E8", gloss: "rain", highlight: "\xFC" }] },
      { ipaId: "close_back_rounded", romanization: "u", nativeScript: "u", examples: [{ word: "t\u01D4 \u571F", gloss: "earth / soil", highlight: "u" }] },
      { ipaId: "near_close_back_rounded", romanization: "o (in -ong)", nativeScript: "o", examples: [{ word: "d\u014Dng \u51AC", gloss: "winter", highlight: "o" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o (standalone)", nativeScript: "o", examples: [{ word: "w\u01D2 \u6211", gloss: "I / me", highlight: "o" }] }
    ],
    specialFeatures: [
      {
        title: "Four tones plus neutral",
        description: "Standard Mandarin has four lexical tones plus a neutral tone. First tone (\u02C9): high level \u2014 m\u0101 (mother). Second tone (\u02CA): rising \u2014 m\xE1 (hemp / numb). Third tone (\u02C7): dipping \u2014 m\u01CE (horse). Fourth tone (\u02CB): falling \u2014 m\xE0 (scold). Neutral tone (no mark): short, unstressed. These are not stress patterns \u2014 they are changes in fundamental frequency, and they are phonemically contrastive."
      },
      {
        title: "Aspirated vs. unaspirated stops",
        description: "Mandarin distinguishes aspirated and unaspirated voiceless stops. The Pinyin letters p, t, k, c, ch, q represent aspirated (with a puff of air), while b, d, g, z, zh, j represent the unaspirated versions. There is no voiced/voiceless distinction as in English \u2014 both sets are voiceless, differing only in aspiration."
      },
      {
        title: "Retroflex and alveolo-palatal series",
        description: "Mandarin has two series of sibilants that English conflates: retroflex (zh, ch, sh, r \u2014 tongue curled back) and alveolo-palatal (j, q, x \u2014 tongue at the palate). These are allophones in certain dialects but phonemically distinct in Standard Mandarin. The retroflex series occurs before a, e, o, u; the palatal series before i and \xFC."
      }
    ]
  };

  // src/data/languages/mittoli.ts
  var mittoli = {
    id: "mittoli",
    name: "Standard Mittoli",
    nativeName: "Mittoloss",
    family: "Proto-Western (Azhoran)",
    region: "Central and western Azhora \u2014 Mittolo, the Caeras valley cities, and their trade networks",
    type: "conlang",
    script: {
      name: "Cael Script",
      direction: "ltr",
      type: "alphabet",
      description: "The Cael Script is named for the root *cael* (water, flow) and originates in marks carved by river-traders to identify cargo. Written left to right, it is a true alphabet: all vowels are written. 28 characters total: 18 consonants and 10 vowel characters (5 pure vowels, 2 diphthongs, and 3 positional variants for vowels appearing after certain consonants). The script is not reproduced here in native form \u2014 this entry uses the standard scholarly romanization.",
      characterTable: [
        { character: "p", represents: "/p/ voiceless bilabial stop" },
        { character: "b", represents: "/b/ voiced bilabial stop" },
        { character: "t", represents: "/t/ voiceless alveolar stop" },
        { character: "d", represents: "/d/ voiced alveolar stop" },
        { character: "k", represents: "/k/ voiceless velar stop" },
        { character: "g", represents: "/g/ voiced velar stop" },
        { character: "v", represents: "/v/ voiced labiodental fricative" },
        { character: "s", represents: "/s/ voiceless alveolar fricative" },
        { character: "z", represents: "/z/ voiced alveolar fricative" },
        { character: "zh", represents: "/\u0292/ voiced postalveolar fricative", notes: "Only before back vowels a, o, u, and diphthong ae" },
        { character: "th", represents: "/\u03B8/ voiceless dental fricative" },
        { character: "h", represents: "/h/ voiceless glottal fricative" },
        { character: "m", represents: "/m/ bilabial nasal" },
        { character: "n", represents: "/n/ alveolar nasal" },
        { character: "ny", represents: "/\u0272/ palatal nasal", notes: "Only before front vowels e, i" },
        { character: "l", represents: "/l/ alveolar lateral approximant" },
        { character: "r", represents: "/\u027E/ alveolar tap (single r) / /r/ alveolar trill (double rr)" },
        { character: "a", represents: "/a/ open front unrounded vowel" },
        { character: "e", represents: "/e/ close-mid front unrounded vowel" },
        { character: "i", represents: "/i/ close front unrounded vowel" },
        { character: "o", represents: "/o/ close-mid back rounded vowel" },
        { character: "u", represents: "/u/ close back rounded vowel" },
        { character: "ae", represents: "/a\u026A\u032F/ rising diphthong", notes: "The signature sound of Mittoli \u2014 appears in ~1 in 6 words" },
        { character: "oe", represents: "/\u0254\u026A\u032F/ rounded diphthong" }
      ]
    },
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "pyross", gloss: "ash; fire-residue", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "baell", gloss: "bay; deep water", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "trin", gloss: "three", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "drossael", gloss: "rupture; the breaking moment", highlight: "d" }] },
      { ipaId: "k", romanization: "k", examples: [{ word: "kael", gloss: "water; flow (the Cael root)", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gala", gloss: "bright place; open ground", highlight: "g" }] },
      { ipaId: "v", romanization: "v", examples: [{ word: "voranor", gloss: "to perceive (sensory)", highlight: "v" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "sorn", gloss: "stone (river-smoothed)", highlight: "s" }] },
      { ipaId: "z", romanization: "z", examples: [{ word: "zeth", gloss: "path; route", highlight: "z" }] },
      { ipaId: "zh", romanization: "zh", examples: [{ word: "zhora", gloss: "(suffix: continent; expanse)", highlight: "zh" }, { word: "Azhora", gloss: "the continent", highlight: "zh" }] },
      { ipaId: "theta", romanization: "th", examples: [{ word: "thel", gloss: "edge; boundary; shore", highlight: "th" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "hael", gloss: "breath; wind above", highlight: "h" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "mittolo", gloss: "the Mittolo region (forested heartland)", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "nill", gloss: "stone (immovable)", highlight: "n" }] },
      { ipaId: "palatal_nasal", romanization: "ny", examples: [{ word: "nyros", gloss: "trading port (proper noun root)", highlight: "ny" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "lissael", gloss: "river (the Lizeem)", highlight: "l" }] },
      { ipaId: "alveolar_tap", romanization: "r", examples: [{ word: "ros", gloss: "water in motion", highlight: "r" }] },
      { ipaId: "r", romanization: "rr", examples: [{ word: "rraell", gloss: "(rare; used in ritual texts)", highlight: "rr" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "gala", gloss: "open ground", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", examples: [{ word: "vel", gloss: "moving; current", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", examples: [{ word: "mil", gloss: "sense; feeling", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", examples: [{ word: "voss", gloss: "silence; still space", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", examples: [{ word: "cos", gloss: "a road; a route", highlight: "u" }] },
      // Diphthongs — shown as vowels since they are vowel phonemes
      { ipaId: "close_mid_front_unrounded", romanization: "ae", examples: [{ word: "cael", gloss: "water; flow", highlight: "ae" }, { word: "azhora", gloss: "the continent (stress: a-ZH\xD3R-a)", highlight: "a" }] }
    ],
    specialFeatures: [
      {
        title: "The ae diphthong \u2014 signature sound",
        description: 'The rising diphthong ae /a\u026A\u032F/ appears in roughly one in six Mittoli words and gives the language its characteristic reaching, forward-leaning quality. Stress shifts to any syllable containing ae: c\xE1-el \u2192 ca-\xC9L-os (water-place). Northern dialects collapse ae to a flat /a/ or /e/, which is the first thing that marks a northern speaker to southern ears. The ae at the end of a verse line means the poem is "open" \u2014 expecting a response.'
      },
      {
        title: "Gemination is phonemically meaningful",
        description: "Double consonants are held longer and change meaning: nill (stone, immovable) vs. nil (nothing, empty). coss (hard travel) vs. cos (a road). ss, ll, nn all occur. In formal oral tradition, a geminate at the end of a sentence can be carried across into the next clause, linking them acoustically \u2014 a feature the written text can record but cannot fully represent."
      },
      {
        title: "Three-aspect verb system",
        description: 'Mittoli verbs take three aspects. Imperfective (unmarked default): ongoing, habitual action. Perfective (ve- prefix): completed action. Prospective (ae- prefix): intended, wished-for, anticipated, or expected action \u2014 without specifying which. Aemilom can mean "I intend to see," "I expect to see," "I wish to see," or "I will probably see." Legal Mittoli uses adverbial qualifiers to resolve this ambiguity.'
      },
      {
        title: "Permitted clusters and word-final vowels",
        description: "Onset clusters: tr-, dr-, sm-, sn-, vr-, st-, str-, kl-, gl-, ny-. Coda clusters: -lm, -rm, -nt, -nd, -ss, -th, -st, -sk. Word-final vowels are common and give the language its open, flowing quality. Northern Mittoli drops unstressed final vowels systematically: Mittolo \u2192 Mttol, Gala \u2192 Gal."
      }
    ],
    worldContext: "Standard Mittoli is the prestige dialect of the Caeras Valley cities and the dominant language of commerce and scholarship in central and western Azhora. It is based on the speech of a specific river-trading civilization and bears the marks of that origin in its script (named for water), its vocabulary (river-oriented basic roots), and its flowing phonology. The Academy in the Caeras Valley maintains and propagates the standard form; whether they are preserving it or ossifying it is a matter of ongoing academic debate that the Academy finds unproductive."
  };

  // src/data/languages/moreshi.ts
  var moreshi = {
    id: "moreshi",
    name: "Moreshi",
    nativeName: "al-Mariis\u0308i",
    family: "Moreshi (Azhoran \u2014 unrelated to any other family)",
    region: "The Morosh\xE9 Desert \u2014 oasis communities, canyon country, nomadic herding cultures",
    type: "conlang",
    script: {
      name: "Kha\u1E6D\u1E6D",
      direction: "rtl",
      type: "abjad",
      description: 'Kha\u1E6D\u1E6D (meaning "the line") is an abjad \u2014 it records consonants only. Vowels are omitted in ordinary writing; a literate reader supplies them from context and root knowledge. An optional set of vowel diacritics called tashkiil exists for pedagogical texts, religious inscriptions, and documents for foreign readers. The script is written right-to-left. Consonant characters connect within words. The oldest Kha\u1E6D\u1E6D inscriptions are found on canyon walls and appear to predate the current desert climate \u2014 the script was already in use when the Morosh\xE9 was wetter.',
      characterTable: [
        { character: "b", represents: "/b/ voiced bilabial stop" },
        { character: "m", represents: "/m/ bilabial nasal" },
        { character: "f", represents: "/f/ voiceless labiodental fricative" },
        { character: "w", represents: "/w/ labio-velar approximant (also a root consonant)" },
        { character: "t", represents: "/t/ voiceless dental/alveolar stop" },
        { character: "d", represents: "/d/ voiced dental/alveolar stop" },
        { character: "s", represents: "/s/ voiceless alveolar fricative" },
        { character: "z", represents: "/z/ voiced alveolar fricative" },
        { character: "n", represents: "/n/ alveolar nasal" },
        { character: "r", represents: "/r/ alveolar trill" },
        { character: "l", represents: "/l/ alveolar lateral approximant" },
        { character: "\u1E6D", represents: "/t\u02E4/ emphatic (pharyngealized) alveolar stop", notes: "Colors adjacent /a/ toward [\u0251]" },
        { character: "\u1E63", represents: "/s\u02E4/ emphatic (pharyngealized) alveolar fricative", notes: "Colors adjacent /i/ toward [\u025B]" },
        { character: "\u1E0D", represents: "/d\u02E4/ emphatic (pharyngealized) alveolar stop" },
        { character: "sh", represents: "/\u0283/ voiceless postalveolar fricative" },
        { character: "y", represents: "/j/ palatal approximant (also a root consonant)" },
        { character: "k", represents: "/k/ voiceless velar stop" },
        { character: "g", represents: "/g/ voiced velar stop" },
        { character: "q", represents: "/q/ voiceless uvular stop" },
        { character: "x", represents: "/x/ voiceless uvular fricative" },
        { character: "gh", represents: "/\u0263/ voiced velar/uvular fricative" },
        { character: "\u1E25", represents: "/\u0127/ voiceless pharyngeal fricative", notes: 'Mittoli speakers describe this as "too many kinds of h"' },
        { character: "\u0295", represents: "/\u0295/ voiced pharyngeal fricative" },
        { character: "\u0294", represents: "/\u0294/ glottal stop" }
      ]
    },
    consonants: [
      { ipaId: "b", romanization: "b", examples: [{ word: "bayt", gloss: "shelter; dwelling", highlight: "b" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "maraa\u1E63", gloss: "desert-guide", highlight: "m" }] },
      { ipaId: "f", romanization: "f", examples: [{ word: "fard", gloss: "individual; alone", highlight: "f" }] },
      { ipaId: "w", romanization: "w", examples: [{ word: "waadi", gloss: "dry riverbed", highlight: "w" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "tariiq", gloss: "route; way", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "dahab", gloss: "gold", highlight: "d" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "samaa", gloss: "sky", highlight: "s" }] },
      { ipaId: "z", romanization: "z", examples: [{ word: "zaman", gloss: "time; era", highlight: "z" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "nahr", gloss: "river", highlight: "n" }] },
      { ipaId: "r", romanization: "r", examples: [{ word: "riih", gloss: "wind", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "layl", gloss: "night", highlight: "l" }] },
      { ipaId: "sh", romanization: "sh", examples: [{ word: "shams", gloss: "sun", highlight: "sh" }] },
      { ipaId: "j", romanization: "y", examples: [{ word: "yawm", gloss: "day", highlight: "y" }] },
      { ipaId: "k", romanization: "k", examples: [{ word: "kalb", gloss: "dog; loyal follower", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "ghaym", gloss: "cloud", highlight: "g" }] },
      { ipaId: "q", romanization: "q", examples: [{ word: "qamar", gloss: "moon", highlight: "q" }] },
      { ipaId: "x", romanization: "x / kh", examples: [{ word: "xaraabaab", gloss: "ruins (places that fell)", highlight: "x" }] },
      { ipaId: "gamma", romanization: "gh", examples: [{ word: "gharb", gloss: "west; direction of the open sea", highlight: "gh" }] },
      { ipaId: "pharyngeal_fric_vl", romanization: "\u1E25", examples: [{ word: "\u1E25arr", gloss: "heat; desert heat specifically", highlight: "\u1E25" }] },
      { ipaId: "pharyngeal_fric_vd", romanization: "\u0295", examples: [{ word: "\u0295ayn", gloss: "eye; spring; well", highlight: "\u0295" }] },
      { ipaId: "glottal_stop", romanization: "\u0294", examples: [{ word: "\u0294umm", gloss: "mother; principal route", highlight: "\u0294" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "hawaa", gloss: "air; atmosphere", highlight: "h" }] },
      // Emphatic consonants — shown as variants of their base phonemes
      { ipaId: "t", romanization: "\u1E6D (emphatic)", examples: [{ word: "\u1E6Dariiq", gloss: "route (emphatic register)", highlight: "\u1E6D" }] },
      { ipaId: "s", romanization: "\u1E63 (emphatic)", examples: [{ word: "\u1E63awt", gloss: "voice; vote", highlight: "\u1E63" }] },
      { ipaId: "d", romanization: "\u1E0D (emphatic)", examples: [{ word: "\u1E0Darb", gloss: "strike; way (in idiom)", highlight: "\u1E0D" }] },
      // Canyon Moreshi uvular trill
      { ipaId: "uvular_trill", romanization: "rr (Canyon only)", examples: [{ word: "(Canyon dialect only)", gloss: 'Canyon speakers maintain the uvular trill /\u0280/ alongside regular /r/. They say this distinction "encodes something" \u2014 that the two r-sounds refer to different categories of experience. They decline to merge them.' }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "kataba", gloss: "he wrote", highlight: "a" }] },
      { ipaId: "open_back_unrounded", romanization: "aa", examples: [{ word: "mara\u1E63a", gloss: "it spread / extended", highlight: "a" }, { word: "(long a \u2014 doubled in romanization)", gloss: "" }] },
      { ipaId: "close_front_unrounded", romanization: "i", examples: [{ word: "bint", gloss: "daughter", highlight: "i" }] },
      { ipaId: "close_back_rounded", romanization: "u", examples: [{ word: "mudun", gloss: "cities", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Pharyngeal consonants",
        description: 'Moreshi has two pharyngeal fricatives \u2014 the voiceless \u0127 and voiced \u0295 \u2014 produced by constricting the pharynx. These are entirely absent from Mittoli phonology. A Mittoli speaker encountering Moreshi for the first time typically reports "too many kinds of /h/." The \u0295 has a distinctive strangled quality that is described, by those who have learned to produce it, as feeling like the sound is pulled from deeper in the throat than the mouth.'
      },
      {
        title: "Emphatic consonants",
        description: 'Three consonants have pharyngealized ("emphatic") variants: \u1E6D /t\u02E4/, \u1E63 /s\u02E4/, \u1E0D /d\u02E4/. These color surrounding vowels: /a/ near an emphatic becomes more open and back, /i/ shifts toward /\u025B/. The distinction is largely invisible to untrained outside listeners but fully audible to Moreshi speakers, for whom it is as salient as the voiced/voiceless distinction is for English speakers.'
      },
      {
        title: "Triconsonantal root system",
        description: "Moreshi vocabulary is organized around three-consonant roots. The root K-T-B carries the semantic field of writing: kataba (he wrote), kitaab (a book), kaatib (a writer), maktab (an office). Words are formed by interlacing these consonants with vowel patterns. A Moreshi speaker who learns one root has access to all its derived forms simultaneously \u2014 a structural efficiency that Mittoli speakers find either profound or incomprehensible, depending on whether they have invested in learning it."
      },
      {
        title: "Three vowels, length meaningful",
        description: `Moreshi has only three vowel qualities: /a/, /i/, /u/ \u2014 each with short and long variants (a/aa, i/ii, u/uu). Mittoli's five-vowel system with two diphthongs feels vowel-rich and imprecise to a Moreshi speaker. The canonical Oasis saying: "Three good tools will do what seven mediocre ones only attempt." There are no diphthongs \u2014 sequences that would produce glides resolve into consonantal /w/ or /y/.`
      },
      {
        title: "The Qadimuur ritual register",
        description: "A register used in the oldest desert traditions that linguists cannot fully analyze. It uses the Moreshi sound system but contains syntactic structures that do not match any known Moreshi language form. It may be a preserved proto-language form, or a ritual creation designed to be opaque. The desert peoples do not discuss it in terms that help resolve the question."
      }
    ],
    worldContext: "Moreshi is completely unrelated to the western (Mittoli/Pyrosi) language families \u2014 it represents a separate lineage predating any contact between the desert and the western continent. The Kha\u1E6D\u1E6D script's canyon inscriptions predate the current desert climate, which means the script was already in use when the Morosh\xE9 was a different place. The desert peoples know this. They do not find it remarkable. Their script is older than the desert."
  };

  // src/data/languages/boueni.ts
  var boueni = {
    id: "boueni",
    name: "Bou\xE9ni",
    nativeName: "B\xF5wel",
    family: "Proto-Western (Azhoran) \u2014 most distant surviving relative of Mittoli",
    region: "Southern Azhora \u2014 the Bou\xE9n peninsula and the Azner island chain",
    type: "conlang",
    script: {
      name: "Cael Bou\xE9ni (adapted Cael Script)",
      direction: "ltr",
      type: "alphabet",
      description: "Bou\xE9ni has no indigenous script \u2014 its oldest navigational tradition was oral and marked with practical notational symbols on hull-wood and tide-poles. When written Bou\xE9ni became necessary for trade with Mittoli speakers, the community adapted the Cael alphabet, adding four characters for sounds Mittoli lacks: the five nasal vowels (treated as modified vowel characters) and an additional character for initial /w/. This adapted system is called Cael Bou\xE9ni by speakers. Mittoli scholars find this acknowledgment insufficient. The Bou\xE9ni find it an accurate description of a tool they have repurposed."
    },
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "pel", gloss: "sea-route; path through water", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "baell", gloss: "deep bay; sheltered water", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "tel", gloss: "to ford; the crossing place", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "d\u0129", gloss: "two (cf. Mittoli dae)", highlight: "d" }] },
      { ipaId: "k", romanization: "k", examples: [{ word: "kuv", gloss: "four (cf. Mittoli cov)", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gael", gloss: "water-crossing; ford", highlight: "g" }] },
      { ipaId: "f", romanization: "f", examples: [{ word: "feln", gloss: "fog; navigational fog specifically", highlight: "f" }] },
      { ipaId: "v", romanization: "v", examples: [{ word: "vel", gloss: "current; deep pull", highlight: "v" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "sr\u0129", gloss: "three (cf. Mittoli trin \u2014 tr- cluster simplified)", highlight: "s" }] },
      { ipaId: "z", romanization: "z", examples: [{ word: "zoth", gloss: "trade; exchange (proper noun root)", highlight: "z" }] },
      { ipaId: "sh", romanization: "sh", examples: [{ word: "shael", gloss: "salt water (marine context)", highlight: "sh" }] },
      { ipaId: "zh", romanization: "zh", examples: [{ word: "zhael", gloss: "tide; tidal movement", highlight: "zh" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "mael", gloss: "fog-path; route navigated by feel", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "nael", gloss: "night-passage", highlight: "n" }] },
      { ipaId: "palatal_nasal", romanization: "\xF1", examples: [{ word: "\xF1aell", gloss: "the interior; land away from sea", highlight: "\xF1" }, { word: "(same as Mittoli ny [\u0272] \u2014 different romanization convention)", gloss: "" }] },
      { ipaId: "r", romanization: "r", examples: [{ word: "rael", gloss: "tidal rip; fast current", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "lorn", gloss: "harbor; sheltered bay", highlight: "l" }] },
      { ipaId: "j", romanization: "y", examples: [{ word: "yaell", gloss: "wind-direction", highlight: "y" }] },
      { ipaId: "w", romanization: "w", examples: [{ word: "wael", gloss: "deep water; the open sea", highlight: "w" }, { word: "(note: w word-initial is more prominent in Bou\xE9ni than Mittoli permits)", gloss: "" }] }
    ],
    vowels: [
      // Oral vowels — identical quality to Mittoli
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "auwel", gloss: "sea-speech; the Bou\xE9ni self-name for the language", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", examples: [{ word: "vel", gloss: "cold; the cold", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", examples: [{ word: "ishi", gloss: "stone anchor; mooring", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", examples: [{ word: "oul", gloss: "the outer current taking hold of a hull", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", examples: [{ word: "unu", gloss: "depth; fathomless", highlight: "u" }] },
      // Nasal vowels — THE defining Bouéni phonological feature
      { ipaId: "nasal_open_central", romanization: "\xE3", examples: [{ word: "w\xE3", gloss: "the open sea (nasal context)", highlight: "\xE3" }] },
      { ipaId: "nasal_close_mid_front", romanization: "\u1EBD", examples: [{ word: "\u1EBDtael", gloss: "verb prospective aspect marker", highlight: "\u1EBD" }] },
      { ipaId: "nasal_close_front", romanization: "\u0129", examples: [{ word: "d\u0129", gloss: "two (cf. Mittoli dae \u2014 diphthong \u2192 nasal vowel)", highlight: "\u0129" }, { word: "sr\u0129", gloss: "three (cf. Mittoli trin)", highlight: "\u0129" }] },
      { ipaId: "nasal_close_mid_back", romanization: "\xF5", examples: [{ word: "v\u1EBDl", gloss: "the current, the deep pull (vs. vel = cold)", highlight: "\xF5" }] },
      { ipaId: "nasal_close_back", romanization: "\u0169", examples: [{ word: "\u0169leth", gloss: "substrate-derived; appears in sea-depth vocabulary", highlight: "\u0169" }] }
    ],
    specialFeatures: [
      {
        title: "Nasal vowels \u2014 the defining feature",
        description: "Each of Bou\xE9ni's five oral vowels has a nasal counterpart produced with the soft palate lowered so air passes through the nose simultaneously. Written with a tilde (\xE3, \u1EBD, \u0129, \xF5, \u0169). These are fully phonemic: vel (cold) vs. v\u1EBDl (the current; the deep pull) is a minimal pair. The nasal vowels developed from Proto-Western vowel + nasal consonant sequences; the final consonant was absorbed. The process is complete and irreversible \u2014 there is no rule producing them synchronically."
      },
      {
        title: "The Proto-Western connection",
        description: 'Bou\xE9ni is the most distant living relative of Mittoli. Systematic correspondences are clear once known but not intuitive: Proto-Western *th [\u03B8] \u2192 Bou\xE9ni /s/ (so everywhere Mittoli says "th," Bou\xE9ni says "s"); Proto-Western *ae diphthong \u2192 Bou\xE9ni nasal vowel \u0129 (so Mittoli dae = two, Bou\xE9ni d\u0129); word-final *-os \u2192 Bou\xE9ni *-o (s dropped); penultimate stress \u2192 initial stress (Bou\xE9ni words launch themselves forward). The number words show the correspondence most cleanly.'
      },
      {
        title: "Initial stress \u2014 words that launch",
        description: "Bou\xE9ni stress falls on the first syllable of every word, without exception. Mittoli has penultimate stress. A Bou\xE9ni speaker's words sound like they are launching themselves; a Mittoli speaker's words sound, to Bou\xE9ni ears, like they are thinking about whether to commit. Initial stress also caused unstressed final syllables to erode over time, which is why Bou\xE9ni has fewer case endings than the ancestor language."
      },
      {
        title: "The substrate mystery",
        description: 'Bou\xE9ni contains vocabulary and structural features that cannot be traced to Proto-Western \u2014 they come from something else, called the "substrate." The substrate favors open syllables, vowel sequences (VCV forms), and words beginning with /w/ followed by vowels. Its phonological profile differs from the Forest Mittoli substrate. Bou\xE9ni linguists say their ancestors came from the sea. Outside linguists have not been able to disprove this.'
      }
    ],
    worldContext: "Bou\xE9ni is the language of a people whose oral tradition centers on navigation, deep water, and the knowledge that the sea itself holds. The navigational marks scratched on hull-wood and cave walls are not a script \u2014 they are a record of water, not speech. When the language needed to be written for trade purposes, it borrowed a tool (the Cael alphabet) and made it serve different ends. Whether this flexibility reflects pragmatism or a cultural relationship with knowledge that differs from Mittoli scholarly traditions is a question both communities have formed opinions about."
  };

  // src/data/languages/pyrosi.ts
  var pyrosi = {
    id: "pyrosi",
    name: "West Pyrosi",
    nativeName: "Pyrossel",
    family: "Proto-Western (Azhoran) \u2014 sister branch to Mittoli",
    region: "The Pyros regions \u2014 Gala, Talermolis, and the terraced uplands",
    type: "conlang",
    script: {
      name: "Ossic Script",
      direction: "ltr",
      type: "abugida",
      description: "Named for *oss* (to mark; to cut into something permanent). An abugida: each character represents a consonant with an inherent vowel /a/. Other vowels are shown by diacritics attached to the character. A silent carrier character called *kholv* (the gap; the intake of breath) bears vowel diacritics at word-initial position. The script originates in marks carved into volcanic basalt \u2014 hence the angular, bold character forms reflecting the physical demands of stone-cutting. Taler dialect uses Ossic exclusively and maintains the full character inventory. West Pyrosi uses Ossic alongside Cael: Ossic for formal, sacred, and agricultural records; Cael for trade correspondence.",
      characterTable: [
        { character: "toss", represents: "/t/ \u2014 ta", notes: '"fire-mark"' },
        { character: "deth", represents: "/d/ \u2014 da", notes: '"the downward stroke"' },
        { character: "pyrr", represents: "/p/ \u2014 pa", notes: '"ash-release"' },
        { character: "bassell", represents: "/b/ \u2014 ba", notes: '"deep voice; root sound"' },
        { character: "kell", represents: "/k/ \u2014 ka", notes: '"the cut; the edge"' },
        { character: "gelloss", represents: "/g/ \u2014 ga", notes: '"wide-mouth; an opening"' },
        { character: "phaer", represents: "/p\u02B0/ \u2014 pha", notes: '"aspirate-fire"' },
        { character: "khaen", represents: "/x/ \u2014 kha", notes: `"stone's inner voice"` },
        { character: "fell", represents: "/f/ \u2014 fa", notes: '"wind through cracks"' },
        { character: "vaell", represents: "/v/ \u2014 va", notes: '"warm current"' },
        { character: "soss", represents: "/s/ \u2014 sa", notes: '"the steam-mark"' },
        { character: "zell", represents: "/z/ \u2014 za", notes: '"the tremor-line"' },
        { character: "llaer", represents: "/\u026C/ \u2014 lla", notes: '"the sidewind" \u2014 voiceless lateral fricative' },
        { character: "moss", represents: "/m/ \u2014 ma", notes: '"mountain-form; two peaks"' },
        { character: "neth", represents: "/n/ \u2014 na", notes: '"the hearth-circle" \u2014 shares name with intimate register prefix' },
        { character: "nnael", represents: "/n\u02D0/ \u2014 nna", notes: '"the doubled-hearth" \u2014 geminate nasal' },
        { character: "rael", represents: "/r/ \u2014 ra", notes: '"rolling stone"' },
        { character: "rraell", represents: "/r\u030A/ \u2014 rra", notes: `"the land's own voice" \u2014 Taler only: voiceless trill` },
        { character: "lell", represents: "/l/ \u2014 la", notes: '"lateral channel; the side-path"' },
        { character: "hael", represents: "/h/ \u2014 ha", notes: '"breath above"' },
        { character: "kholv", represents: "(silent carrier)", notes: '"the gap; the intake of breath" \u2014 bears vowel diacritics at word-initial position' }
      ]
    },
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "pyross", gloss: "ash; fire-residue; memory-in-matter", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "baell", gloss: "deep; foundational", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "toss", gloss: "fire-mark; the character for /t/", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "deth", gloss: "the downward stroke", highlight: "d" }] },
      { ipaId: "k", romanization: "k", examples: [{ word: "kell", gloss: "the cut; the edge", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gelloss", gloss: "wide-mouth; an opening", highlight: "g" }] },
      { ipaId: "f", romanization: "f", examples: [{ word: "fell", gloss: "wind through cracks", highlight: "f" }] },
      { ipaId: "v", romanization: "v", examples: [{ word: "vaell", gloss: "warm current (Class I: living)", highlight: "v" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "soss", gloss: "the steam-mark", highlight: "s" }] },
      { ipaId: "z", romanization: "z", examples: [{ word: "zell", gloss: "the tremor-line", highlight: "z" }] },
      { ipaId: "x", romanization: "kh", examples: [{ word: "khoth", gloss: "volcanic ridge", highlight: "kh" }, { word: "(frequent in Fire Memory register)", gloss: "" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "hael", gloss: "breath above; the sky register", highlight: "h" }] },
      { ipaId: "alveolar_lat_fric_vl", romanization: "ll", examples: [{ word: "lleth", gloss: "volcanic soil; latent-ground", highlight: "ll" }, { word: "llos", gloss: "volcanic ash", highlight: "ll" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "moss", gloss: "mountain-form", highlight: "m" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "neth", gloss: "the hearth-circle; intimacy", highlight: "n" }] },
      { ipaId: "r", romanization: "r", examples: [{ word: "rael", gloss: "rolling stone", highlight: "r" }] },
      { ipaId: "alveolar_trill_vl", romanization: "rr (Taler only)", examples: [{ word: "(voiceless trill /r\u030A \u2014 Taler dialect)", gloss: "Taler's reflex of Proto-Western *th [\u03B8], which Mittoli preserved as a dental fricative, West Pyrosi turned into plain /r/, and Taler kept as a voiceless trill. The most studied three-way split in Azhoran comparative linguistics." }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "lell", gloss: "lateral channel; the side-path", highlight: "l" }] }
    ],
    vowels: [
      { ipaId: "open_front_unrounded", romanization: "a", examples: [{ word: "pyross-a", gloss: "of the ash (genitive)", highlight: "a" }] },
      { ipaId: "close_mid_front_unrounded", romanization: "e", examples: [{ word: "kell-e", gloss: "of the edge", highlight: "e" }] },
      { ipaId: "close_front_unrounded", romanization: "i", examples: [{ word: "neth-i", gloss: "to/for the hearth-circle", highlight: "i" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o", examples: [{ word: "gelloss-o", gloss: "(locative for Class II)", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u", examples: [{ word: "vaell-u", gloss: "(accusative for Class I)", highlight: "u" }] },
      // The two long vowels that are the Pyrosi reflex of Proto-Western diphthongs
      { ipaId: "close_mid_front_unrounded", romanization: "\u011B (long \u0113)", examples: [{ word: "m\u011Bll", gloss: "fire-memory (long mid front vowel)", highlight: "\u011B" }, { word: '(Pyrosi reflex of Proto-Western ae diphthong \u2014 "Mittoli arrives; Pyrosi has already arrived")', gloss: "" }] },
      { ipaId: "close_mid_back_rounded", romanization: "\xF4 (long \u014D)", examples: [{ word: "v\xF4ss", gloss: "the fixed silence", highlight: "\xF4" }] }
    ],
    specialFeatures: [
      {
        title: "The register system \u2014 relationships spoken into every sentence",
        description: 'Pyrosi grammar encodes the social relationship between speaker and listener directly in verb forms. Four registers: vaer-vel (sky-current) for distant/formal; k\u011Bl-taloss (fire-memory) for ancestors/sacred; kael-k\u011Bl (water-fire) for peers in formal context; neth- (hearth) for intimates. A Pyrosi speaker cannot produce a grammatically complete sentence without declaring the relationship in which it is spoken. "I hear the relationship before I hear the meaning," said one outside scholar.'
      },
      {
        title: "The voiceless lateral fricative /\u026C/",
        description: 'The ll [\u026C] \u2014 voiceless lateral fricative \u2014 is the most immediately recognizable sound of West Pyrosi to outside ears. Produced by placing the tongue in lateral position and blowing air over both sides: a hissing, dry sound. Mittoli speakers describe it as "wind through dry grass." It appears with striking frequency in the deepest volcanic and memory vocabulary: llos (volcanic ash), lleth (volcanic soil), llyr (embodied memory). When those topics arise, the language develops a characteristic hiss.'
      },
      {
        title: "Two noun classes \u2014 moving and fixed",
        description: "Class I (lossan): people, animals, fire, wind, water in motion, growing plants. Things that have internal motion. Class II (ossvan): stone, ash, dormant soil, still water, structures, memory, language itself. Things that constitute a place rather than inhabit it. Fire is Class I even though not biologically alive. Memory is Class II even though it belongs to living people \u2014 in Pyrosi understanding, memory stays, embedded in the body like volcanic heat in soil. The same substance shifts class if its state changes: flowing lava (I) vs. hardened lava (II)."
      },
      {
        title: "Taler pitch accent",
        description: "Taler dialect preserves a Proto-Western pitch accent system. Two accent values: vel (high/rising \u2014 living, active things) and ass (low/falling \u2014 fixed, ancient things). Lexically distinctive: t\xE1l (active fire) vs. t\xE0l (the fire that characterized this place, the volcanic nature embedded in the land). West Pyrosi has residual pitch accent in formal contexts; everyday speech has let it collapse to stress. East Pyrosi has fixed initial stress, under Mittoli influence."
      }
    ],
    worldContext: "The Pyrosi family names itself not for fire but for what fire leaves behind \u2014 ash, residue, memory-in-matter. This is the language of a people who understand the volcanic ground they live on as a form of living record, and their language carries this orientation in its deepest vocabulary: the most frequent words are for what the land is, what it remembers, and what it has done. The Ossic script began in stone, and stone-carving remains the most prestigious form of writing. A fire-memory elder who commits something to basalt has made it permanent in the way that fire makes things permanent \u2014 by burning away everything that was not essential."
  };

  // src/data/languages/grassic.ts
  var grassic = {
    id: "grassic",
    name: "Central Grassic",
    nativeName: "Vel-Auwel",
    family: "Grassic (Azhoran \u2014 no known relatives)",
    region: "The Plains \u2014 the geographical center of Azhora",
    type: "conlang",
    script: {
      name: "No script \u2014 Caull cord notation",
      direction: "other",
      type: "other",
      description: "Grassic has no indigenous script. This absence is old enough and consistent enough to be architectural rather than accidental. What Grassic has instead: the caull (knotted cord records) and the Memory Grass network. A caull encodes legal claims and route descriptions through knot position, type, and subsidiary cord configuration \u2014 but it cannot encode free speech, only predicates in legal formula format. Memory Grass sites retain impressions of events, readable by trained observers and cross-referenced against oral tradition. The oral tradition holds the index; the land holds the archive. The academic romanization (Vel-Auwel rendered in Cael-derived letters) is the only standardized written form."
    },
    consonants: [
      { ipaId: "p", romanization: "p", examples: [{ word: "pael", gloss: "to lift; that-which-rises", highlight: "p" }] },
      { ipaId: "b", romanization: "b", examples: [{ word: "baul", gloss: "to sink; that-which-settles", highlight: "b" }] },
      { ipaId: "t", romanization: "t", examples: [{ word: "thraun", gloss: "that-which-is-traveled-in-established-pattern (= route)", highlight: "t" }] },
      { ipaId: "d", romanization: "d", examples: [{ word: "daul", gloss: "to witness; land-witness form", highlight: "d" }] },
      { ipaId: "k", romanization: "k", examples: [{ word: "kaul", gloss: "that-which-retains; Memory Grass (the caull knot name)", highlight: "k" }] },
      { ipaId: "g", romanization: "g", examples: [{ word: "gaul", gloss: "the lateral; off-route; border context", highlight: "g" }] },
      { ipaId: "s", romanization: "s", examples: [{ word: "sor", gloss: "to practice; sor-practice (oral transmission)", highlight: "s" }] },
      { ipaId: "h", romanization: "h", examples: [{ word: "hael", gloss: "breath; sky", highlight: "h" }] },
      { ipaId: "n", romanization: "n", examples: [{ word: "nell", gloss: "wintering; the cold season", highlight: "n" }] },
      { ipaId: "m", romanization: "m", examples: [{ word: "maun", gloss: "elder; that-which-has-accumulated-time", highlight: "m" }] },
      { ipaId: "ng", romanization: "ng", examples: [{ word: "ngaul", gloss: "the land's memory; permanent retention", highlight: "ng" }] },
      { ipaId: "alveolar_tap", romanization: "r", examples: [{ word: "raun", gloss: "to-move-following-water; a river", highlight: "r" }] },
      { ipaId: "l", romanization: "l", examples: [{ word: "lael", gloss: "to carry forward; an obligation", highlight: "l" }] },
      { ipaId: "w", romanization: "w", examples: [{ word: "wol", gloss: "that-which-flows-seasonally (= a river)", highlight: "w" }] },
      { ipaId: "j", romanization: "y", examples: [{ word: "yael", gloss: "to speak toward; to address", highlight: "y" }] }
    ],
    vowels: [
      // Front group (vel-auwel — "bright-speech")
      { ipaId: "close_mid_front_unrounded", romanization: "e (front group)", examples: [{ word: "vel", gloss: "fast-movement; that-which-runs", highlight: "e" }, { word: '(vel-auwel = "route-speech" \u2014 front vowel harmony class)', gloss: "" }] },
      { ipaId: "close_front_unrounded", romanization: "i (front group)", examples: [{ word: "ishi", gloss: "that-which-holds-position; a stone", highlight: "i" }] },
      // Back group (au-auwel — "dark-speech")
      { ipaId: "open_front_unrounded", romanization: "a (back group)", examples: [{ word: "aul", gloss: "the land-witness; land memory", highlight: "a" }, { word: '(au-auwel = "dark-speech" \u2014 back vowel harmony class)', gloss: "" }] },
      { ipaId: "close_mid_back_rounded", romanization: "o (back group)", examples: [{ word: "sor", gloss: "practice; transmission", highlight: "o" }] },
      { ipaId: "close_back_rounded", romanization: "u (back group)", examples: [{ word: "auuwel", gloss: "land-speech; the Grassic language (Auwel)", highlight: "u" }] }
    ],
    specialFeatures: [
      {
        title: "Vowel harmony \u2014 bright speech and dark speech",
        description: `Every multi-morpheme Grassic word draws its vowels from one of two sets: front group (e, i \u2014 called vel-auwel, "bright-speech": current experience, direct knowing) or back group (a, o, u \u2014 called au-auwel, "dark-speech": received tradition, older knowledge, the land's register). A word with a front-group root takes front-group variants of all grammatical suffixes; a back-group root takes back-group variants. The exception: the land-witness evidential suffix -aul is always dark vowels regardless of root \u2014 land memory is always ancient.`
      },
      {
        title: "No noun-verb distinction",
        description: 'Every Grassic root is a predicate \u2014 something that can be asserted, that takes subjects, objects, and temporal and evidential marking. There is no separate morphological class of nouns. "The horse" = vel- (that-which-runs). "The river" = wol- (that-which-flows-seasonally) or tel- (that-which-is-crossed) depending on context. A route is not a thing that exists; it is a thing that is done. Outside scholars find this profoundly disorienting. Plains peoples find it unremarkable because they have no alternative grammar to compare it to.'
      },
      {
        title: "Five evidentials",
        description: `Grassic grammatically encodes the speaker's source of knowledge for every assertion. Five evidentials, from weakest to strongest: hearsay (-yel: "I was told"); personal inference (-thel: "I conclude from evidence"); direct sensory (-vel: "I perceived this"); participatory (-kel: "I was part of this"); and the highest \u2014 land-witness (-aul: "the land itself confirms this," from a Memory Grass reading). The land-witness evidential carries the most legal weight in dispute resolution. It does not harmonize with vowel harmony \u2014 it is always -aul.`
      },
      {
        title: "Polysynthetic verb structure",
        description: "Grassic verbs encode subject, object, spatial prefix, temporal suffix, and evidential marker in a single word. A single predicate root surrounded by its affixes can constitute a grammatically complete utterance that would take a full English sentence to express. The words are short roots with long chains of affixes rather than multi-syllable roots."
      },
      {
        title: "Minimal consonant inventory \u2014 accessible surface, alien structure",
        description: "Seventeen consonants \u2014 smaller than any other documented Azhoran family. No pharyngeals, no uvulars, no retroflex, no unfamiliar fricatives (only s and h). A Mittoli scholar hearing Grassic for the first time can usually produce a recognizable approximation of any word. This accessibility has repeatedly misled outside scholars into thinking Grassic is simple. It is not. The strangeness is in the grammar."
      }
    ],
    worldContext: 'The Grassic family has no documented relatives anywhere on Azhora or in any explored territory. Every comparative linguistics survey of the past three centuries notes this. None has resolved it. The standard hypothesis \u2014 that the Plains peoples are the oldest population on the continent, predating all others, and that Grassic is a remnant of what was spoken across Azhora before the western and desert families arrived \u2014 is consistent with the evidence. The Academy notes that the evidence is "consistent with multiple interpretations." Plains elders find this statement technically accurate and diplomatically transparent in equal measure.'
  };

  // src/data/index.ts
  var LANGUAGES = [
    english,
    spanish,
    arabic,
    japanese,
    hindi,
    russian,
    german,
    french,
    chinese,
    mittoli,
    moreshi,
    boueni,
    pyrosi,
    grassic
  ];
  var LANGUAGE_MAP = new Map(
    LANGUAGES.map((l) => [l.id, l])
  );
  var LANGUAGE_GROUPS = [
    {
      label: "Real Languages",
      ids: ["english", "spanish", "arabic", "japanese", "hindi", "russian", "german", "french", "chinese"]
    },
    {
      label: "Azhoran Conlangs",
      ids: ["mittoli", "moreshi", "boueni", "pyrosi", "grassic"]
    }
  ];

  // src/ui/sidebar.ts
  function buildModeToggle() {
    const wrap = document.createElement("div");
    wrap.className = "mode-toggle";
    for (const [id, label] of [["atlas", "IPA Atlas"], ["phonology", "Language View"]]) {
      const btn = document.createElement("button");
      btn.className = "mode-btn";
      btn.dataset.mode = id;
      btn.textContent = label;
      btn.addEventListener("click", () => setMode(id));
      wrap.appendChild(btn);
    }
    return wrap;
  }
  function buildCategoryButtons() {
    const wrap = document.createElement("div");
    wrap.className = "category-buttons";
    wrap.id = "category-buttons";
    for (const [id, label] of [["consonants", "Consonants"], ["vowels", "Vowels"]]) {
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.dataset.cat = id;
      btn.textContent = label;
      btn.addEventListener("click", () => setCategory(id));
      wrap.appendChild(btn);
    }
    return wrap;
  }
  function buildLanguageList() {
    const wrap = document.createElement("div");
    wrap.className = "lang-list";
    const ipaBtn = document.createElement("button");
    ipaBtn.className = "lang-btn lang-ipa";
    ipaBtn.dataset.langId = "ipa";
    ipaBtn.textContent = "IPA (all sounds)";
    ipaBtn.addEventListener("click", () => setSelectedLanguage("ipa"));
    wrap.appendChild(ipaBtn);
    for (const group of LANGUAGE_GROUPS) {
      const groupLabel = document.createElement("div");
      groupLabel.className = "lang-group-label";
      groupLabel.textContent = group.label;
      wrap.appendChild(groupLabel);
      for (const id of group.ids) {
        const lang = LANGUAGE_MAP.get(id);
        if (!lang)
          continue;
        const btn = document.createElement("button");
        btn.className = "lang-btn";
        btn.dataset.langId = id;
        if (lang.type === "conlang")
          btn.classList.add("is-conlang");
        const nameSpan = document.createElement("span");
        nameSpan.className = "lang-btn-name";
        nameSpan.textContent = lang.name;
        btn.appendChild(nameSpan);
        if (lang.nativeName) {
          const nativeSpan = document.createElement("span");
          nativeSpan.className = "lang-btn-native";
          nativeSpan.textContent = lang.nativeName;
          btn.appendChild(nativeSpan);
        }
        btn.addEventListener("click", () => setSelectedLanguage(id));
        wrap.appendChild(btn);
      }
    }
    return wrap;
  }
  var sidebarEl = null;
  function buildSidebar() {
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";
    const title = document.createElement("h1");
    title.textContent = "Phoneme Chart";
    sidebar.appendChild(title);
    sidebar.appendChild(buildModeToggle());
    sidebar.appendChild(buildCategoryButtons());
    const langLabel = document.createElement("div");
    langLabel.className = "section-label";
    langLabel.textContent = "Select Language";
    sidebar.appendChild(langLabel);
    sidebar.appendChild(buildLanguageList());
    sidebarEl = sidebar;
    return sidebar;
  }
  function updateSidebar(state2) {
    if (!sidebarEl)
      return;
    sidebarEl.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === state2.mode);
    });
    const catWrap = sidebarEl.querySelector("#category-buttons");
    if (catWrap) {
      catWrap.style.display = state2.mode === "atlas" ? "" : "none";
      catWrap.querySelectorAll(".cat-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.cat === state2.category);
      });
    }
    sidebarEl.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langId === state2.selectedLanguageId);
    });
  }

  // src/data/phonemes.ts
  var VOWELS = [
    // CLOSE
    { id: "close_front_unrounded", symbol: "i", category: "vowel", height: "close", backness: "front", rounded: false, description: "Close Front Unrounded Vowel", audioFile: "Close_front_unrounded_vowel.ogg" },
    { id: "close_front_rounded", symbol: "y", category: "vowel", height: "close", backness: "front", rounded: true, description: "Close Front Rounded Vowel", audioFile: "Close_front_rounded_vowel.ogg" },
    { id: "close_central_unrounded", symbol: "\u0268", category: "vowel", height: "close", backness: "central", rounded: false, description: "Close Central Unrounded Vowel", audioFile: "Close_central_unrounded_vowel.ogg" },
    { id: "close_central_rounded", symbol: "\u0289", category: "vowel", height: "close", backness: "central", rounded: true, description: "Close Central Rounded Vowel", audioFile: "Close_central_rounded_vowel.ogg" },
    { id: "close_back_unrounded", symbol: "\u026F", category: "vowel", height: "close", backness: "back", rounded: false, description: "Close Back Unrounded Vowel", audioFile: "Close_back_unrounded_vowel.ogg" },
    { id: "close_back_rounded", symbol: "u", category: "vowel", height: "close", backness: "back", rounded: true, description: "Close Back Rounded Vowel", audioFile: "Close_back_rounded_vowel.ogg" },
    // NEAR-CLOSE
    { id: "near_close_front_unrounded", symbol: "\u026A", category: "vowel", height: "near_close", backness: "near_front", rounded: false, description: "Near-close Near-front Unrounded Vowel", audioFile: "Near-close_near-front_unrounded_vowel.ogg" },
    { id: "near_close_front_rounded", symbol: "\u028F", category: "vowel", height: "near_close", backness: "near_front", rounded: true, description: "Near-close Near-front Rounded Vowel", audioFile: "Near-close_near-front_rounded_vowel.ogg" },
    { id: "near_close_back_rounded", symbol: "\u028A", category: "vowel", height: "near_close", backness: "near_back", rounded: true, description: "Near-close Near-back Rounded Vowel", audioFile: "Near-close_near-back_rounded_vowel.ogg" },
    // CLOSE-MID
    { id: "close_mid_front_unrounded", symbol: "e", category: "vowel", height: "close_mid", backness: "front", rounded: false, description: "Close-mid Front Unrounded Vowel", audioFile: "Close-mid_front_unrounded_vowel.ogg" },
    { id: "close_mid_front_rounded", symbol: "\xF8", category: "vowel", height: "close_mid", backness: "front", rounded: true, description: "Close-mid Front Rounded Vowel", audioFile: "Close-mid_front_rounded_vowel.ogg" },
    { id: "close_mid_central_unrounded", symbol: "\u0258", category: "vowel", height: "close_mid", backness: "central", rounded: false, description: "Close-mid Central Unrounded Vowel", audioFile: "Close-mid_central_unrounded_vowel.ogg" },
    { id: "close_mid_central_rounded", symbol: "\u0275", category: "vowel", height: "close_mid", backness: "central", rounded: true, description: "Close-mid Central Rounded Vowel", audioFile: "Close-mid_central_rounded_vowel.ogg" },
    { id: "close_mid_back_unrounded", symbol: "\u0264", category: "vowel", height: "close_mid", backness: "back", rounded: false, description: "Close-mid Back Unrounded Vowel", audioFile: "Close-mid_back_unrounded_vowel.ogg" },
    { id: "close_mid_back_rounded", symbol: "o", category: "vowel", height: "close_mid", backness: "back", rounded: true, description: "Close-mid Back Rounded Vowel", audioFile: "Close-mid_back_rounded_vowel.ogg" },
    // MID
    { id: "mid_central", symbol: "\u0259", category: "vowel", height: "mid", backness: "central", rounded: false, description: "Mid Central Vowel (Schwa)", audioFile: "Mid-central_vowel.ogg" },
    // OPEN-MID
    { id: "open_mid_front_unrounded", symbol: "\u025B", category: "vowel", height: "open_mid", backness: "front", rounded: false, description: "Open-mid Front Unrounded Vowel", audioFile: "Open-mid_front_unrounded_vowel.ogg" },
    { id: "open_mid_front_rounded", symbol: "\u0153", category: "vowel", height: "open_mid", backness: "front", rounded: true, description: "Open-mid Front Rounded Vowel", audioFile: "Open-mid_front_rounded_vowel.ogg" },
    { id: "open_mid_central_unrounded", symbol: "\u025C", category: "vowel", height: "open_mid", backness: "central", rounded: false, description: "Open-mid Central Unrounded Vowel", audioFile: "Open-mid_central_unrounded_vowel.ogg" },
    { id: "open_mid_central_rounded", symbol: "\u025E", category: "vowel", height: "open_mid", backness: "central", rounded: true, description: "Open-mid Central Rounded Vowel", audioFile: "Open-mid_central_rounded_vowel.ogg" },
    { id: "open_mid_back_unrounded", symbol: "\u028C", category: "vowel", height: "open_mid", backness: "back", rounded: false, description: "Open-mid Back Unrounded Vowel", audioFile: "Open-mid_back_unrounded_vowel2.ogg" },
    { id: "open_mid_back_rounded", symbol: "\u0254", category: "vowel", height: "open_mid", backness: "back", rounded: true, description: "Open-mid Back Rounded Vowel", audioFile: "Open-mid_back_rounded_vowel.ogg" },
    // NEAR-OPEN
    { id: "near_open_front_unrounded", symbol: "\xE6", category: "vowel", height: "near_open", backness: "front", rounded: false, description: "Near-open Front Unrounded Vowel", audioFile: "Near-open_front_unrounded_vowel.ogg" },
    { id: "near_open_central", symbol: "\u0250", category: "vowel", height: "near_open", backness: "central", rounded: false, description: "Near-open Central Vowel", audioFile: "Near-open_central_unrounded_vowel.ogg" },
    // OPEN
    { id: "open_front_unrounded", symbol: "a", category: "vowel", height: "open", backness: "front", rounded: false, description: "Open Front Unrounded Vowel", audioFile: "Open_front_unrounded_vowel.ogg" },
    { id: "open_front_rounded", symbol: "\u0276", category: "vowel", height: "open", backness: "front", rounded: true, description: "Open Front Rounded Vowel", audioFile: "Open_front_rounded_vowel.ogg" },
    { id: "open_back_unrounded", symbol: "\u0251", category: "vowel", height: "open", backness: "back", rounded: false, description: "Open Back Unrounded Vowel", audioFile: "Open_back_unrounded_vowel.ogg" },
    { id: "open_back_rounded", symbol: "\u0252", category: "vowel", height: "open", backness: "back", rounded: true, description: "Open Back Rounded Vowel", audioFile: "Open_back_rounded_vowel.ogg" },
    // NASAL VOWELS (used by French, Boueni — shown in phonology view only)
    { id: "nasal_open_front", symbol: "\u0251\u0303", category: "vowel", height: "open", backness: "back", rounded: false, isNasal: true, description: "Nasal Open Back Unrounded Vowel" },
    { id: "nasal_open_mid_front", symbol: "\u025B\u0303", category: "vowel", height: "open_mid", backness: "front", rounded: false, isNasal: true, description: "Nasal Open-mid Front Unrounded Vowel" },
    { id: "nasal_open_mid_back", symbol: "\u0254\u0303", category: "vowel", height: "open_mid", backness: "back", rounded: true, isNasal: true, description: "Nasal Open-mid Back Rounded Vowel" },
    { id: "nasal_open_mid_front_rounded", symbol: "\u0153\u0303", category: "vowel", height: "open_mid", backness: "front", rounded: true, isNasal: true, description: "Nasal Open-mid Front Rounded Vowel" },
    // Boueni nasal vowels
    { id: "nasal_open_central", symbol: "\xE3", category: "vowel", height: "open", backness: "front", rounded: false, isNasal: true, description: "Nasal Open Central Vowel" },
    { id: "nasal_close_mid_front", symbol: "\u1EBD", category: "vowel", height: "close_mid", backness: "front", rounded: false, isNasal: true, description: "Nasal Close-mid Front Unrounded Vowel" },
    { id: "nasal_close_front", symbol: "\u0129", category: "vowel", height: "close", backness: "front", rounded: false, isNasal: true, description: "Nasal Close Front Unrounded Vowel" },
    { id: "nasal_close_mid_back", symbol: "\xF5", category: "vowel", height: "close_mid", backness: "back", rounded: true, isNasal: true, description: "Nasal Close-mid Back Rounded Vowel" },
    { id: "nasal_close_back", symbol: "\u0169", category: "vowel", height: "close", backness: "back", rounded: true, isNasal: true, description: "Nasal Close Back Rounded Vowel" }
  ];
  var CONSONANTS = [
    // PLOSIVES
    { id: "p", symbol: "p", category: "consonant", manner: "plosive", place: "bilabial", voiced: false, description: "Voiceless Bilabial Plosive", audioFile: "Voiceless_bilabial_plosive.ogg" },
    { id: "b", symbol: "b", category: "consonant", manner: "plosive", place: "bilabial", voiced: true, description: "Voiced Bilabial Plosive", audioFile: "Voiced_bilabial_plosive.ogg" },
    { id: "t", symbol: "t", category: "consonant", manner: "plosive", place: "alveolar", voiced: false, description: "Voiceless Alveolar Plosive", audioFile: "Voiceless_alveolar_plosive.ogg" },
    { id: "d", symbol: "d", category: "consonant", manner: "plosive", place: "alveolar", voiced: true, description: "Voiced Alveolar Plosive", audioFile: "Voiced_alveolar_plosive.ogg" },
    { id: "retroflex_stop_vl", symbol: "\u0288", category: "consonant", manner: "plosive", place: "retroflex", voiced: false, description: "Voiceless Retroflex Plosive", audioFile: "Voiceless_retroflex_stop.oga" },
    { id: "retroflex_stop_vd", symbol: "\u0256", category: "consonant", manner: "plosive", place: "retroflex", voiced: true, description: "Voiced Retroflex Plosive", audioFile: "Voiced_retroflex_stop.oga" },
    { id: "palatal_stop_vl", symbol: "c", category: "consonant", manner: "plosive", place: "palatal", voiced: false, description: "Voiceless Palatal Plosive", audioFile: "Voiceless_palatal_plosive.ogg" },
    { id: "palatal_stop_vd", symbol: "\u025F", category: "consonant", manner: "plosive", place: "palatal", voiced: true, description: "Voiced Palatal Plosive", audioFile: "Voiced_palatal_plosive.ogg" },
    { id: "k", symbol: "k", category: "consonant", manner: "plosive", place: "velar", voiced: false, description: "Voiceless Velar Plosive", audioFile: "Voiceless_velar_plosive.ogg" },
    { id: "g", symbol: "g", category: "consonant", manner: "plosive", place: "velar", voiced: true, description: "Voiced Velar Plosive", audioFile: "Voiced_velar_plosive_02.ogg" },
    { id: "q", symbol: "q", category: "consonant", manner: "plosive", place: "uvular", voiced: false, description: "Voiceless Uvular Plosive", audioFile: "Voiceless_uvular_plosive.ogg" },
    { id: "uvular_stop_vd", symbol: "\u0262", category: "consonant", manner: "plosive", place: "uvular", voiced: true, description: "Voiced Uvular Plosive", audioFile: "Voiced_uvular_stop.oga" },
    { id: "pharyngeal_stop", symbol: "\u02A1", category: "consonant", manner: "plosive", place: "pharyngeal", voiced: false, description: "Pharyngeal Plosive", audioFile: "Epiglottal_stop.ogg" },
    { id: "glottal_stop", symbol: "\u0294", category: "consonant", manner: "plosive", place: "glottal", voiced: false, description: "Glottal Stop", audioFile: "Glottal_stop.ogg" },
    // AFFRICATES (flagged, placed in plosive row)
    { id: "ts_vl", symbol: "ts", category: "consonant", manner: "plosive", place: "alveolar", voiced: false, isAffricate: true, description: "Voiceless Alveolar Affricate", audioFile: "Voiceless_alveolar_sibilant_affricate.oga" },
    { id: "ts_vd", symbol: "dz", category: "consonant", manner: "plosive", place: "alveolar", voiced: true, isAffricate: true, description: "Voiced Alveolar Affricate", audioFile: "Voiced_alveolar_sibilant_affricate.oga" },
    { id: "tsh_vl", symbol: "t\u0283", category: "consonant", manner: "plosive", place: "postalveolar", voiced: false, isAffricate: true, description: "Voiceless Postalveolar Affricate", audioFile: "Voiceless_palato-alveolar_affricate.ogg" },
    { id: "tsh_vd", symbol: "d\u0292", category: "consonant", manner: "plosive", place: "postalveolar", voiced: true, isAffricate: true, description: "Voiced Postalveolar Affricate", audioFile: "Voiced_palato-alveolar_affricate.ogg" },
    { id: "retroflex_affricate_vl", symbol: "\u0288\u0282", category: "consonant", manner: "plosive", place: "retroflex", voiced: false, isAffricate: true, description: "Voiceless Retroflex Affricate", audioFile: "Voiceless_retroflex_affricate.ogg" },
    { id: "retroflex_affricate_vd", symbol: "\u0256\u0290", category: "consonant", manner: "plosive", place: "retroflex", voiced: true, isAffricate: true, description: "Voiced Retroflex Affricate", audioFile: "Voiced_retroflex_affricate.ogg" },
    { id: "alveopalatal_affricate_vl", symbol: "t\u0255", category: "consonant", manner: "plosive", place: "palatal", voiced: false, isAffricate: true, description: "Voiceless Alveolo-palatal Affricate", audioFile: "Voiceless_alveolo-palatal_affricate.ogg" },
    { id: "alveopalatal_affricate_vd", symbol: "d\u0291", category: "consonant", manner: "plosive", place: "palatal", voiced: true, isAffricate: true, description: "Voiced Alveolo-palatal Affricate", audioFile: "Voiced_alveolo-palatal_affricate.ogg" },
    // NASALS
    { id: "m", symbol: "m", category: "consonant", manner: "nasal", place: "bilabial", voiced: true, description: "Bilabial Nasal", audioFile: "Bilabial_nasal.ogg" },
    { id: "labiodental_nasal", symbol: "\u0271", category: "consonant", manner: "nasal", place: "labiodental", voiced: true, description: "Labiodental Nasal", audioFile: "Labiodental_nasal.ogg" },
    { id: "n", symbol: "n", category: "consonant", manner: "nasal", place: "alveolar", voiced: true, description: "Alveolar Nasal", audioFile: "Alveolar_nasal.ogg" },
    { id: "retroflex_nasal", symbol: "\u0273", category: "consonant", manner: "nasal", place: "retroflex", voiced: true, description: "Retroflex Nasal", audioFile: "Retroflex_nasal.ogg" },
    { id: "palatal_nasal", symbol: "\u0272", category: "consonant", manner: "nasal", place: "palatal", voiced: true, description: "Palatal Nasal", audioFile: "Palatal_nasal.ogg" },
    { id: "ng", symbol: "\u014B", category: "consonant", manner: "nasal", place: "velar", voiced: true, description: "Velar Nasal", audioFile: "Velar_nasal.ogg" },
    { id: "uvular_nasal", symbol: "\u0274", category: "consonant", manner: "nasal", place: "uvular", voiced: true, description: "Uvular Nasal", audioFile: "Uvular_nasal.ogg" },
    // TRILLS
    { id: "bilabial_trill_vl", symbol: "\u0299\u0325", category: "consonant", manner: "trill", place: "bilabial", voiced: false, description: "Voiceless Bilabial Trill", audioFile: "Voiceless_bilabial_trill_with_aspiration.ogg" },
    { id: "bilabial_trill", symbol: "\u0299", category: "consonant", manner: "trill", place: "bilabial", voiced: true, description: "Voiced Bilabial Trill", audioFile: "Bilabial_trill.ogg" },
    { id: "alveolar_trill_vl", symbol: "r\u0325", category: "consonant", manner: "trill", place: "alveolar", voiced: false, description: "Voiceless Alveolar Trill", audioFile: "Voiceless_alveolar_trill.ogg" },
    { id: "r", symbol: "r", category: "consonant", manner: "trill", place: "alveolar", voiced: true, description: "Voiced Alveolar Trill", audioFile: "Alveolar_trill.ogg" },
    { id: "uvular_trill_vl", symbol: "\u0280\u0325", category: "consonant", manner: "trill", place: "uvular", voiced: false, description: "Voiceless Uvular Trill", audioFile: "Voiceless_uvular_trill.ogg" },
    { id: "uvular_trill", symbol: "\u0280", category: "consonant", manner: "trill", place: "uvular", voiced: true, description: "Voiced Uvular Trill", audioFile: "Uvular_trill.ogg" },
    { id: "epiglottal_trill", symbol: "\u029C", category: "consonant", manner: "trill", place: "pharyngeal", voiced: false, description: "Voiceless Epiglottal Trill", audioFile: "Voiceless_epiglottal_trill.ogg" },
    // TAPS & FLAPS
    { id: "labiodental_flap", symbol: "\u2C71", category: "consonant", manner: "tap_flap", place: "labiodental", voiced: true, description: "Labiodental Flap", audioFile: "Labiodental_flap.ogg" },
    { id: "alveolar_tap", symbol: "\u027E", category: "consonant", manner: "tap_flap", place: "alveolar", voiced: true, description: "Alveolar Tap", audioFile: "Alveolar_tap.ogg" },
    { id: "retroflex_flap", symbol: "\u027D", category: "consonant", manner: "tap_flap", place: "retroflex", voiced: true, description: "Retroflex Flap", audioFile: "Retroflex_flap.ogg" },
    { id: "epiglottal_flap", symbol: "\u02A1\u0306", category: "consonant", manner: "tap_flap", place: "pharyngeal", voiced: false, description: "Epiglottal Tap", audioFile: "Epiglottal_flap.oga" },
    // FRICATIVES
    { id: "bilabial_fric_vl", symbol: "\u0278", category: "consonant", manner: "fricative", place: "bilabial", voiced: false, description: "Voiceless Bilabial Fricative", audioFile: "Voiceless_bilabial_fricative.ogg" },
    { id: "bilabial_fric_vd", symbol: "\u03B2", category: "consonant", manner: "fricative", place: "bilabial", voiced: true, description: "Voiced Bilabial Fricative", audioFile: "Voiced_bilabial_fricative.ogg" },
    { id: "f", symbol: "f", category: "consonant", manner: "fricative", place: "labiodental", voiced: false, description: "Voiceless Labiodental Fricative", audioFile: "Voiceless_labiodental_fricative.ogg" },
    { id: "v", symbol: "v", category: "consonant", manner: "fricative", place: "labiodental", voiced: true, description: "Voiced Labiodental Fricative", audioFile: "Voiced_labiodental_fricative.ogg" },
    { id: "theta", symbol: "\u03B8", category: "consonant", manner: "fricative", place: "dental", voiced: false, description: "Voiceless Dental Fricative", audioFile: "Voiceless_dental_fricative.ogg" },
    { id: "eth", symbol: "\xF0", category: "consonant", manner: "fricative", place: "dental", voiced: true, description: "Voiced Dental Fricative", audioFile: "Voiced_dental_fricative.ogg" },
    { id: "s", symbol: "s", category: "consonant", manner: "fricative", place: "alveolar", voiced: false, description: "Voiceless Alveolar Fricative", audioFile: "Voiceless_alveolar_sibilant.ogg" },
    { id: "z", symbol: "z", category: "consonant", manner: "fricative", place: "alveolar", voiced: true, description: "Voiced Alveolar Fricative", audioFile: "Voiced_alveolar_sibilant.ogg" },
    { id: "sh", symbol: "\u0283", category: "consonant", manner: "fricative", place: "postalveolar", voiced: false, description: "Voiceless Postalveolar Fricative", audioFile: "Voiceless_palato-alveolar_sibilant.ogg" },
    { id: "zh", symbol: "\u0292", category: "consonant", manner: "fricative", place: "postalveolar", voiced: true, description: "Voiced Postalveolar Fricative", audioFile: "Voiced_palato-alveolar_sibilant.ogg" },
    { id: "retroflex_fric_vl", symbol: "\u0282", category: "consonant", manner: "fricative", place: "retroflex", voiced: false, description: "Voiceless Retroflex Fricative", audioFile: "Voiceless_retroflex_sibilant.ogg" },
    { id: "retroflex_fric_vd", symbol: "\u0290", category: "consonant", manner: "fricative", place: "retroflex", voiced: true, description: "Voiced Retroflex Fricative", audioFile: "Voiced_retroflex_sibilant.ogg" },
    { id: "palatal_fric_vl", symbol: "\xE7", category: "consonant", manner: "fricative", place: "palatal", voiced: false, description: "Voiceless Palatal Fricative", audioFile: "Voiceless_palatal_fricative.ogg" },
    { id: "palatal_fric_vd", symbol: "\u029D", category: "consonant", manner: "fricative", place: "palatal", voiced: true, description: "Voiced Palatal Fricative", audioFile: "Voiced_palatal_fricative.ogg" },
    { id: "alveopalatal_fric_vl", symbol: "\u0255", category: "consonant", manner: "fricative", place: "palatal", voiced: false, description: "Voiceless Alveolo-palatal Fricative", audioFile: "Voiceless_alveolo-palatal_sibilant.ogg" },
    { id: "alveopalatal_fric_vd", symbol: "\u0291", category: "consonant", manner: "fricative", place: "palatal", voiced: true, description: "Voiced Alveolo-palatal Fricative", audioFile: "Voiced_alveolo-palatal_sibilant.ogg" },
    { id: "x", symbol: "x", category: "consonant", manner: "fricative", place: "velar", voiced: false, description: "Voiceless Velar Fricative", audioFile: "Voiceless_velar_fricative.ogg" },
    { id: "gamma", symbol: "\u0263", category: "consonant", manner: "fricative", place: "velar", voiced: true, description: "Voiced Velar Fricative", audioFile: "Voiced_velar_fricative.ogg" },
    { id: "uvular_fric_vl", symbol: "\u03C7", category: "consonant", manner: "fricative", place: "uvular", voiced: false, description: "Voiceless Uvular Fricative", audioFile: "Voiceless_uvular_fricative.ogg" },
    { id: "uvular_fric_vd", symbol: "\u0281", category: "consonant", manner: "fricative", place: "uvular", voiced: true, description: "Voiced Uvular Fricative", audioFile: "Voiced_uvular_fricative.ogg" },
    { id: "pharyngeal_fric_vl", symbol: "\u0127", category: "consonant", manner: "fricative", place: "pharyngeal", voiced: false, description: "Voiceless Pharyngeal Fricative", audioFile: "Voiceless_pharyngeal_fricative.ogg" },
    { id: "pharyngeal_fric_vd", symbol: "\u0295", category: "consonant", manner: "fricative", place: "pharyngeal", voiced: true, description: "Voiced Pharyngeal Fricative", audioFile: "Voiced_pharyngeal_fricative.ogg" },
    { id: "h", symbol: "h", category: "consonant", manner: "fricative", place: "glottal", voiced: false, description: "Voiceless Glottal Fricative", audioFile: "Voiceless_glottal_fricative.ogg" },
    { id: "h_voiced", symbol: "\u0266", category: "consonant", manner: "fricative", place: "glottal", voiced: true, description: "Voiced Glottal Fricative", audioFile: "Voiced_glottal_fricative.ogg" },
    // LATERAL FRICATIVES
    { id: "alveolar_lat_fric_vl", symbol: "\u026C", category: "consonant", manner: "lateral_fricative", place: "alveolar", voiced: false, description: "Voiceless Alveolar Lateral Fricative", audioFile: "Voiceless_alveolar_lateral_fricative.ogg" },
    { id: "alveolar_lat_fric_vd", symbol: "\u026E", category: "consonant", manner: "lateral_fricative", place: "alveolar", voiced: true, description: "Voiced Alveolar Lateral Fricative", audioFile: "Voiced_alveolar_lateral_fricative.ogg" },
    { id: "retroflex_lat_fric_vl", symbol: "\u026D\u030A\u02D4", category: "consonant", manner: "lateral_fricative", place: "retroflex", voiced: false, description: "Voiceless Retroflex Lateral Fricative", audioFile: "Voiceless_retroflex_lateral_fricative.ogg" },
    { id: "palatal_lat_fric_vl", symbol: "\u028E\u031D\u030A", category: "consonant", manner: "lateral_fricative", place: "palatal", voiced: false, description: "Voiceless Palatal Lateral Fricative", audioFile: "Voiceless_palatal_lateral_fricative.ogg" },
    { id: "velar_lat_fric_vl", symbol: "\u029F\u031D\u030A", category: "consonant", manner: "lateral_fricative", place: "velar", voiced: false, description: "Voiceless Velar Lateral Fricative", audioFile: "Voiced_velar_lateral_fricative.ogg" },
    // APPROXIMANTS
    { id: "labiodental_approx", symbol: "\u028B", category: "consonant", manner: "approximant", place: "labiodental", voiced: true, description: "Labiodental Approximant", audioFile: "Labiodental_approximant.ogg" },
    { id: "alveolar_approx", symbol: "\u0279", category: "consonant", manner: "approximant", place: "alveolar", voiced: true, description: "Alveolar Approximant", audioFile: "Alveolar_approximant.ogg" },
    { id: "retroflex_approx", symbol: "\u027B", category: "consonant", manner: "approximant", place: "retroflex", voiced: true, description: "Retroflex Approximant", audioFile: "Retroflex_approximant.ogg" },
    { id: "j", symbol: "j", category: "consonant", manner: "approximant", place: "palatal", voiced: true, description: "Palatal Approximant", audioFile: "Palatal_approximant.ogg" },
    { id: "velar_approx", symbol: "\u0270", category: "consonant", manner: "approximant", place: "velar", voiced: true, description: "Velar Approximant", audioFile: "Voiced_velar_approximant.ogg" },
    { id: "w", symbol: "w", category: "consonant", manner: "approximant", place: "velar", voiced: true, description: "Labio-velar Approximant", audioFile: "Voiced_labio-velar_approximant.ogg" },
    // LATERAL APPROXIMANTS
    { id: "l", symbol: "l", category: "consonant", manner: "lateral_approximant", place: "alveolar", voiced: true, description: "Alveolar Lateral Approximant", audioFile: "Alveolar_lateral_approximant.ogg" },
    { id: "retroflex_lat_approx", symbol: "\u026D", category: "consonant", manner: "lateral_approximant", place: "retroflex", voiced: true, description: "Retroflex Lateral Approximant", audioFile: "Retroflex_lateral_approximant.ogg" },
    { id: "palatal_lat_approx", symbol: "\u028E", category: "consonant", manner: "lateral_approximant", place: "palatal", voiced: true, description: "Palatal Lateral Approximant", audioFile: "Palatal_lateral_approximant.ogg" },
    { id: "velar_lat_approx", symbol: "\u029F", category: "consonant", manner: "lateral_approximant", place: "velar", voiced: true, description: "Velar Lateral Approximant", audioFile: "Velar_lateral_approximant.ogg" },
    { id: "uvular_lat_approx", symbol: "\u029F\u0320", category: "consonant", manner: "lateral_approximant", place: "uvular", voiced: true, description: "Uvular Lateral Approximant", audioFile: "Uvular_lateral_approximant.ogg" }
  ];
  var ALL_PHONEMES = [...VOWELS, ...CONSONANTS];
  var PHONEME_MAP = new Map(
    ALL_PHONEMES.map((p) => [p.id, p])
  );
  var CONSONANT_MANNERS = [
    "plosive",
    "nasal",
    "trill",
    "tap_flap",
    "fricative",
    "lateral_fricative",
    "approximant",
    "lateral_approximant"
  ];
  var MANNER_LABELS = {
    plosive: "Plosive",
    nasal: "Nasal",
    trill: "Trill",
    tap_flap: "Tap / Flap",
    fricative: "Fricative",
    lateral_fricative: "Lateral Fricative",
    approximant: "Approximant",
    lateral_approximant: "Lateral Approximant"
  };
  var CONSONANT_PLACES = [
    "bilabial",
    "labiodental",
    "dental",
    "alveolar",
    "postalveolar",
    "retroflex",
    "palatal",
    "velar",
    "uvular",
    "pharyngeal",
    "glottal"
  ];
  var PLACE_LABELS = {
    bilabial: "Bilabial",
    labiodental: "Labiodental",
    dental: "Dental",
    alveolar: "Alveolar",
    postalveolar: "Postalveolar",
    retroflex: "Retroflex",
    palatal: "Palatal",
    velar: "Velar",
    uvular: "Uvular",
    pharyngeal: "Pharyngeal",
    glottal: "Glottal"
  };
  var VOWEL_HEIGHTS = [
    "close",
    "near_close",
    "close_mid",
    "mid",
    "open_mid",
    "near_open",
    "open"
  ];
  var HEIGHT_LABELS = {
    close: "Close",
    near_close: "Near-close",
    close_mid: "Close-mid",
    mid: "Mid",
    open_mid: "Open-mid",
    near_open: "Near-open",
    open: "Open"
  };
  var VOWEL_BACKNESSES = [
    "front",
    "near_front",
    "central",
    "near_back",
    "back"
  ];
  var BACKNESS_LABELS = {
    front: "Front",
    near_front: "Near-front",
    central: "Central",
    near_back: "Near-back",
    back: "Back"
  };

  // src/render/atlas.ts
  var onPhonemeClick = () => {
  };
  function setPhonemeClickHandler(fn) {
    onPhonemeClick = fn;
  }
  function audioPath(file) {
    return `audio/${file}`;
  }
  function playAudio(audioFile) {
    const audio = new Audio(audioPath(audioFile));
    audio.play().catch(() => {
    });
  }
  function languageIpaSet(lang) {
    if (!lang)
      return null;
    const ids = /* @__PURE__ */ new Set();
    for (const p of lang.consonants)
      ids.add(p.ipaId);
    for (const p of lang.vowels)
      ids.add(p.ipaId);
    return ids;
  }
  function phonemeCell(phoneme, langSet, lang) {
    const div = document.createElement("div");
    div.className = "phoneme-token";
    div.dataset.id = phoneme.id;
    if (langSet) {
      if (langSet.has(phoneme.id)) {
        div.classList.add("lang-active");
      } else {
        div.classList.add("lang-dim");
      }
    }
    const sym = document.createElement("span");
    sym.className = "ipa-symbol";
    sym.textContent = phoneme.symbol;
    div.appendChild(sym);
    if (lang && langSet && langSet.has(phoneme.id)) {
      const allPhonemes = [...lang.consonants, ...lang.vowels];
      const lp = allPhonemes.find((p) => p.ipaId === phoneme.id);
      if (lp) {
        const rom = document.createElement("span");
        rom.className = "rom-label";
        rom.textContent = lp.romanization;
        div.appendChild(rom);
      }
    }
    if (phoneme.isAffricate)
      div.classList.add("is-affricate");
    div.addEventListener("click", () => {
      if (phoneme.audioFile)
        playAudio(phoneme.audioFile);
      onPhonemeClick(phoneme.id);
    });
    return div;
  }
  function renderConsonantChart(lang) {
    const langSet = languageIpaSet(lang);
    const wrap = document.createElement("div");
    wrap.className = "chart-scroll";
    const table = document.createElement("table");
    table.className = "phoneme-table consonant-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));
    for (const place of CONSONANT_PLACES) {
      const th = document.createElement("th");
      th.textContent = PLACE_LABELS[place];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const manner of CONSONANT_MANNERS) {
      const row = document.createElement("tr");
      const rowHeader = document.createElement("th");
      rowHeader.textContent = MANNER_LABELS[manner];
      row.appendChild(rowHeader);
      for (const place of CONSONANT_PLACES) {
        const td = document.createElement("td");
        const phonemes = ALL_PHONEMES.filter(
          (p) => p.category === "consonant" && p.manner === manner && p.place === place
        );
        phonemes.sort((a, b) => {
          if (a.isAffricate !== b.isAffricate)
            return a.isAffricate ? 1 : -1;
          if (a.voiced !== b.voiced)
            return a.voiced ? 1 : -1;
          return 0;
        });
        for (const p of phonemes) {
          td.appendChild(phonemeCell(p, langSet, lang));
        }
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }
  function renderVowelChart(lang) {
    const langSet = languageIpaSet(lang);
    const wrap = document.createElement("div");
    wrap.className = "chart-scroll";
    const table = document.createElement("table");
    table.className = "phoneme-table vowel-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));
    for (const back of VOWEL_BACKNESSES) {
      const th = document.createElement("th");
      th.textContent = BACKNESS_LABELS[back];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const height of VOWEL_HEIGHTS) {
      const row = document.createElement("tr");
      const rowHeader = document.createElement("th");
      rowHeader.textContent = HEIGHT_LABELS[height];
      row.appendChild(rowHeader);
      for (const back of VOWEL_BACKNESSES) {
        const td = document.createElement("td");
        const phonemes = ALL_PHONEMES.filter(
          (p) => p.category === "vowel" && p.height === height && p.backness === back && !p.isNasal
        );
        phonemes.sort((a, b) => (a.rounded ? 1 : 0) - (b.rounded ? 1 : 0));
        for (const p of phonemes) {
          td.appendChild(phonemeCell(p, langSet, lang));
        }
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }
  function renderPhonemeDescription(phonemeId, lang) {
    const phoneme = PHONEME_MAP.get(phonemeId);
    const panel = document.createElement("div");
    panel.className = "description-panel";
    if (!phoneme) {
      panel.innerHTML = '<p class="hint">Select a phoneme to see details</p>';
      return panel;
    }
    const symBig = document.createElement("div");
    symBig.className = "desc-symbol";
    symBig.textContent = phoneme.symbol;
    panel.appendChild(symBig);
    const desc = document.createElement("div");
    desc.className = "desc-name";
    desc.textContent = phoneme.description;
    panel.appendChild(desc);
    if (phoneme.audioFile) {
      const audioBtn = document.createElement("button");
      audioBtn.className = "audio-btn";
      audioBtn.innerHTML = "&#9654; Listen";
      audioBtn.addEventListener("click", () => playAudio(phoneme.audioFile));
      panel.appendChild(audioBtn);
    }
    if (lang) {
      const allLangPhonemes = [...lang.consonants, ...lang.vowels];
      const lp = allLangPhonemes.find((p) => p.ipaId === phonemeId);
      if (lp) {
        const langSection = document.createElement("div");
        langSection.className = "desc-lang-section";
        const romLine = document.createElement("p");
        romLine.innerHTML = `<span class="desc-label">In ${lang.name}:</span> <strong>${lp.romanization}</strong>`;
        langSection.appendChild(romLine);
        if (lp.nativeScript) {
          const scriptLine = document.createElement("p");
          scriptLine.innerHTML = `<span class="desc-label">Written:</span> <span class="native-script">${lp.nativeScript}</span>`;
          langSection.appendChild(scriptLine);
        }
        if (lp.examples && lp.examples.length > 0) {
          const exDiv = document.createElement("div");
          exDiv.className = "desc-examples";
          for (const ex of lp.examples) {
            const item = document.createElement("div");
            item.className = "example-item";
            let html = `<span class="example-word">${ex.word}</span>`;
            if (ex.gloss)
              html += ` <span class="example-gloss">"${ex.gloss}"</span>`;
            item.innerHTML = html;
            exDiv.appendChild(item);
          }
          langSection.appendChild(exDiv);
        }
        panel.appendChild(langSection);
      } else {
        const absent = document.createElement("p");
        absent.className = "desc-absent";
        absent.textContent = `Not used in ${lang.name}`;
        panel.appendChild(absent);
      }
    }
    const attr = document.createElement("p");
    attr.className = "audio-attr";
    if (phoneme.audioFile) {
      attr.innerHTML = 'Audio: <a href="https://commons.wikimedia.org/wiki/Commons:GNU_Free_Documentation_License,_version_1.2" target="_blank">Free Software Foundation</a>';
    }
    panel.appendChild(attr);
    return panel;
  }

  // src/render/phonology.ts
  function playAudio2(file) {
    new Audio(`audio/${file}`).play().catch(() => {
    });
  }
  function phonemeCard(lp) {
    const phoneme = PHONEME_MAP.get(lp.ipaId);
    const card = document.createElement("div");
    card.className = "phon-card";
    const sym = document.createElement("div");
    sym.className = "phon-ipa";
    sym.textContent = phoneme ? phoneme.symbol : lp.ipaId;
    card.appendChild(sym);
    const rom = document.createElement("div");
    rom.className = "phon-rom";
    rom.textContent = lp.romanization;
    card.appendChild(rom);
    if (lp.nativeScript) {
      const ns = document.createElement("div");
      ns.className = "phon-native";
      ns.textContent = lp.nativeScript;
      card.appendChild(ns);
    }
    if (lp.examples && lp.examples.length > 0) {
      const ex = lp.examples[0];
      if (ex.word) {
        const exDiv = document.createElement("div");
        exDiv.className = "phon-example";
        exDiv.textContent = ex.word;
        if (ex.gloss) {
          const gloss = document.createElement("span");
          gloss.className = "phon-gloss";
          gloss.textContent = `"${ex.gloss}"`;
          exDiv.appendChild(gloss);
        }
        card.appendChild(exDiv);
      }
    }
    if (phoneme?.audioFile) {
      card.classList.add("has-audio");
      card.title = `\u25B6 ${phoneme.description}`;
      card.addEventListener("click", () => playAudio2(phoneme.audioFile));
    } else if (phoneme) {
      card.title = phoneme.description;
    }
    return card;
  }
  function scriptPanel(lang) {
    const sc = lang.script;
    const section = document.createElement("section");
    section.className = "phon-section script-section";
    const h = document.createElement("h3");
    h.textContent = sc.name;
    section.appendChild(h);
    const meta = document.createElement("p");
    meta.className = "script-meta";
    const typeLabel = {
      alphabet: "Alphabet",
      abjad: "Abjad (consonants only)",
      abugida: "Abugida (consonant + inherent vowel)",
      syllabary: "Syllabary",
      logographic: "Logographic",
      other: "Other notation"
    };
    const dirLabel = { ltr: "Left-to-right", rtl: "Right-to-left", other: "Non-linear" };
    meta.innerHTML = `<strong>${typeLabel[sc.type] || sc.type}</strong> &nbsp;\xB7&nbsp; ${dirLabel[sc.direction] || sc.direction}`;
    section.appendChild(meta);
    const desc = document.createElement("p");
    desc.className = "script-desc";
    desc.textContent = sc.description;
    section.appendChild(desc);
    if (sc.characterTable && sc.characterTable.length > 0) {
      const details = document.createElement("details");
      details.className = "char-table-details";
      const summary = document.createElement("summary");
      summary.textContent = `Character inventory (${sc.characterTable.length} entries)`;
      details.appendChild(summary);
      const table = document.createElement("table");
      table.className = "char-table";
      const thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>Character</th><th>Represents</th><th>Notes</th></tr>";
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      for (const entry of sc.characterTable) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="char-glyph">${entry.character}</td><td>${entry.represents}</td><td>${entry.notes || ""}</td>`;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      details.appendChild(table);
      section.appendChild(details);
    }
    return section;
  }
  function specialFeaturesSection(features) {
    const section = document.createElement("section");
    section.className = "phon-section features-section";
    const h = document.createElement("h3");
    h.textContent = "Phonological Features";
    section.appendChild(h);
    for (const feat of features) {
      const item = document.createElement("div");
      item.className = "feature-item";
      const title = document.createElement("strong");
      title.textContent = feat.title;
      item.appendChild(title);
      const desc = document.createElement("p");
      desc.textContent = feat.description;
      item.appendChild(desc);
      section.appendChild(item);
    }
    return section;
  }
  function renderPhonologyView(lang) {
    const view = document.createElement("div");
    view.className = "phonology-view";
    const header = document.createElement("div");
    header.className = "phon-header";
    const nameRow = document.createElement("div");
    nameRow.className = "phon-name-row";
    const name = document.createElement("h2");
    name.textContent = lang.name;
    nameRow.appendChild(name);
    if (lang.nativeName) {
      const native = document.createElement("span");
      native.className = "phon-native-name";
      native.textContent = lang.nativeName;
      nameRow.appendChild(native);
    }
    if (lang.type === "conlang") {
      const badge = document.createElement("span");
      badge.className = "conlang-badge";
      badge.textContent = "Conlang";
      nameRow.appendChild(badge);
    }
    header.appendChild(nameRow);
    const family = document.createElement("p");
    family.className = "phon-family";
    family.textContent = `${lang.family}${lang.region ? ` \xB7 ${lang.region}` : ""}`;
    header.appendChild(family);
    view.appendChild(header);
    if (lang.script) {
      view.appendChild(scriptPanel(lang));
    }
    if (lang.consonants.length > 0) {
      const section = document.createElement("section");
      section.className = "phon-section";
      const h = document.createElement("h3");
      h.textContent = `Consonants (${lang.consonants.length})`;
      section.appendChild(h);
      const grid = document.createElement("div");
      grid.className = "phon-grid";
      for (const lp of lang.consonants) {
        grid.appendChild(phonemeCard(lp));
      }
      section.appendChild(grid);
      view.appendChild(section);
    }
    if (lang.vowels.length > 0) {
      const section = document.createElement("section");
      section.className = "phon-section";
      const h = document.createElement("h3");
      const nasalCount = lang.vowels.filter((v) => {
        const p = PHONEME_MAP.get(v.ipaId);
        return p?.isNasal;
      }).length;
      h.textContent = `Vowels (${lang.vowels.length}${nasalCount > 0 ? `, incl. ${nasalCount} nasal` : ""})`;
      section.appendChild(h);
      const grid = document.createElement("div");
      grid.className = "phon-grid";
      for (const lp of lang.vowels) {
        grid.appendChild(phonemeCard(lp));
      }
      section.appendChild(grid);
      view.appendChild(section);
    }
    if (lang.specialFeatures && lang.specialFeatures.length > 0) {
      view.appendChild(specialFeaturesSection(lang.specialFeatures));
    }
    if (lang.worldContext) {
      const section = document.createElement("section");
      section.className = "phon-section context-section";
      const h = document.createElement("h3");
      h.textContent = "World Context";
      section.appendChild(h);
      const p = document.createElement("p");
      p.textContent = lang.worldContext;
      section.appendChild(p);
      view.appendChild(section);
    }
    return view;
  }

  // src/main.ts
  var chartArea;
  var descArea;
  function render(state2) {
    updateSidebar(state2);
    const lang = state2.selectedLanguageId !== "ipa" ? LANGUAGE_MAP.get(state2.selectedLanguageId) ?? null : null;
    if (state2.mode === "phonology") {
      descArea.style.display = "none";
      chartArea.innerHTML = "";
      if (!lang) {
        chartArea.innerHTML = '<div class="hint-block"><p>Select a language from the sidebar to view its phoneme inventory.</p></div>';
      } else {
        chartArea.appendChild(renderPhonologyView(lang));
      }
    } else {
      descArea.style.display = "";
      chartArea.innerHTML = "";
      const chart = state2.category === "consonants" ? renderConsonantChart(lang) : renderVowelChart(lang);
      chartArea.appendChild(chart);
      descArea.innerHTML = "";
      descArea.appendChild(renderPhonemeDescription(state2.activePhonemeId ?? "", lang));
    }
  }
  function init() {
    const app = document.getElementById("app");
    const sidebar = buildSidebar();
    app.appendChild(sidebar);
    const main = document.createElement("main");
    main.className = "main-area";
    chartArea = document.createElement("div");
    chartArea.className = "chart-area";
    main.appendChild(chartArea);
    descArea = document.createElement("div");
    descArea.className = "desc-area";
    main.appendChild(descArea);
    app.appendChild(main);
    setPhonemeClickHandler((id) => {
      setActivePhoneme(id);
    });
    subscribe(render);
    render(getState());
  }
  document.addEventListener("DOMContentLoaded", init);
})();
