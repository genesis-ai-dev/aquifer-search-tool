export type ScriptureReference = {
    bookCode: string;
    startChapter: number;
    endChapter: number;
    startVerse: number;
    endVerse: number;
  };

  const bookCodes = {
    'GEN': ['Gen', 'Gn', '1M'],
    'EXO': ['Ex', '2M'],
    'LEV': ['Lev', 'Lv', '3M'],
    'NUM': ['Nm', 'Nu', '4M'],
    'DEU': ['Deut', 'Dt', '5M'],
    'JOS': ['Josh', 'Jos'],
    'JDG': ['Jdg', 'Judg'],
    'RUT': ['Ru', 'Rth'],
    '1SA': ['1Sam', '1Sm'],
    '2SA': ['2Sam', '2Sm'],
    '1KI': ['1Kg', '1K'],
    '2KI': ['2Kg', '2K'],
    '1CH': ['1Ch'],
    '2CH': ['2Ch'],
    'EZR': ['Ezr'],
    'NEH': ['Neh'],
    'EST': ['Est'],
    'JOB': ['Jb', 'Job'],
    'PSA': ['Ps'],
    'PRO': ['Pr'],
    'ECC': ['Ec', 'Qoh'],
    'SNG': ['Sos', 'Song'],
    'ISA': ['Isa'],
    'JER': ['Jer', 'Jr'],
    'LAM': ['Lam', 'Lm'],
    'EZK': ['Ezek', 'Ezk'],
    'DAN': ['Dn', 'Dan'],
    'HOS': ['Hos', 'Hs'],
    'JOL': ['Joel', 'Jl'],
    'AMO': ['Am'],
    'OBA': ['Ob'],
    'JON': ['Jon'],
    'MIC': ['Mi', 'Mc'],
    'NAM': ['Na'],
    'HAB': ['Hab'],
    'ZEP': ['Zep', 'Zp'],
    'HAG': ['Hag', 'Hg'],
    'ZEC': ['Zc', 'Zec'],
    'MAL': ['Mal', 'Ml'],
    'MAT': ['Mt', 'Mat'],
    'MRK': ['Mk', 'Mar'],
    'LUK': ['Lk', 'Lu'],
    'JHN': ['Jn', 'Joh'],
    'ACT': ['Ac'],
    'ROM': ['Ro', 'Rm'],
    '1CO': ['1Co'],
    '2CO': ['2Co'],
    'GAL': ['Gal', 'Gl'],
    'EPH': ['Ep'],
    'PHP': ['Php', 'Philip'],
    'COL': ['Col'],
    '1TH': ['1Th'],
    '2TH': ['2Th'],
    '1TI': ['1Ti', '1Tm'],
    '2TI': ['2Ti', '2Tm'],
    'TIT': ['Tit'],
    'PHM': ['Phile', 'Phm'],
    'HEB': ['Hb', 'Heb'],
    'JAS': ['Ja', 'Jm'],
    '1PE': ['1Pe', '2Pt'],
    '2PE': ['2Pe', '2Pt'],
    '1JN': ['1Jn', '1Jo', '1Jh'],
    '2JN': ['2Jn', '2Jo', '2Jh'],
    '3JN': ['3Jn', '3Jo', '3Jh'],
    'JUD': ['Ju', 'Jd'],
    'REV': ['Rev', 'Rv']
  };

 export function parseScriptureReference(input: string): ScriptureReference {
    // Normalize the input string
    const normalizedInput = input.replace(/\s+/g, '').toUpperCase();

    // Updated regex to match book, chapters, and verses
    const regex = /^(\d)?(\D+)(\d+)?(?::(\d+))?(?:-(\d+)?(?::(\d+))?)?$/;
    const match = normalizedInput.match(regex);

    if (!match) {
    return { bookCode: '', startChapter: 0, endChapter: 0, startVerse: 0, endVerse: 0 };
    }

    const [, bookPrefix, bookName, startChapter, startVerse, endChapterOrVerse, endVerse] = match;

    // Normalize book name for comparison
    const fullBookName = `${bookPrefix || ''}${bookName}`.toUpperCase();

    // Determine the book code
    let bookCode = '';
    for (const [code, names] of Object.entries(bookCodes)) {
    if (names.some(name => fullBookName.startsWith(name.toUpperCase()))) {
        bookCode = code;
        break;
    }
    }
  
    // Parse numbers
    const startChap = parseInt(startChapter) || 0;
    let endChap = startChap;
    let startVer = parseInt(startVerse) || 0;
    let endVer = parseInt(endVerse) || 0;
  
    if (endChapterOrVerse !== undefined) {
      if (endVerse === undefined) { // If it's a range of verses in the same chapter
        endVer = parseInt(endChapterOrVerse);
      } else { // If it's a range including chapters
        endChap = parseInt(endChapterOrVerse);
      }
    }
  
    if (startVer !== 0 && endVer === 0) {
      endVer = startVer;
    }
  
    return {
      bookCode,
      startChapter: startChap,
      endChapter: endChap,
      startVerse: startVer,
      endVerse: endVer,
    };
  }