# Quran Search App

This app allows you to search the Quran by plain text, text with diacritics, or using diacritic patterns to find matching text.

---

## Features

### 1. General Text Search
- Search for any word or part of a word.  
  Example:  
  - Searching for `كلما` matches `كَلِمات` and `كُلَّما`.

### 2. Search with Diacritics
- Perform searches that differentiate between variations with diacritics.  
  Examples:  
  - `كُذِبُوا`  
  - `كَذَبُوا`  
  - `كُذِّبُوا`  
  - `كَذَّبُوا`

### 3. Search by Surah Name or Number
- Find all verses of a Surah by name or number.  
  Examples:  
  - `تو:` or `٩:` → All verses of Surah At-Tawbah.  
  - `تو:٥` or `٥:٩` → Verse 5 of Surah At-Tawbah.  
  - `:` → All verses of the Quran.

### 4. Search by Diacritic Patterns
- Find words matching specific diacritic patterns.  
  Example:  
  - `◌َ ◌ّ ◌ُ ◌َ` matches `رَبُّكَ`.

---

## Additional Details

### Supported Diacritics
The app supports the following diacritics:  
- **Fatha** ( ◌َ )  
- **Damma** ( ◌ُ )  
- **Kasra** ( ◌ِ )  
- Their tanween forms ( ◌ً ◌ٌ ◌ٍ )  
- **Shadda** ( ◌ّ )  
- **Sukun** ( ◌ْ )  
- Two special symbols: `-` and `+`.

### Special Symbols
1. **`-` Symbol**  
   - Matches unvoweled letters.  
   - Example:  
     - `- - -` matches `الم`.  
     - `◌َ - ◌ْ ◌َ ◌ْ ◌ِ ◌ِ -` matches `وَاسْتَغْفِرِي`.  
     - `- ◌ِ ◌ِ - ◌َ` matches `آمِنِينَ`.

2. **`+` Symbol (Wildcard Marker)**  
   - Matches any form, including all diacritics, special cases, and letters following a Shadda.

---

## Notes on Diacritic Usage
- The **Shadda** is treated as a diacritic, and its associated vowel is treated as a second diacritic.  
  Example: `◌ُ ◌ّ ◌َ` matches `ثُمَّ`.
- The **solar Alif** (ال الشمسية) is always followed by a Shadda.  
  Example: `- - ◌ّ ◌َ ◌ْ` matches `الشَّمْس`.  
  The **lunar Alif** (ال القمرية) has a silent Lam.  
  Example: `- ◌ْ ◌َ ◌َ` matches `الْقَمَر`.
- Tanween precedes the Alif.  
  Example: `◌ُ ◌ْ ◌َ - ◌ً -` matches `سُلْطَانًا`.