'use strict';

const numSort = (a, b) => a - b;

// Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
const flatten = (arr) => [].concat.apply([], arr);
const product = (sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map((x) => set.map((y) => [...x, y]))), [
    []
  ]);

class SearchEngine {

  constructor(bus) {
    this.bus = bus;
    this.initialize();
  }

  buildBins() {
    let tomeBin = this.searchExp.bins;
    tomeBin.occurrences += this.verseCount;
    tomeBin.verses += 1;

    let ref = this.tome.refs[this.verseIdx];
    let bookIdx = ref.bookIdx;
    let chapterIdx = ref.chapterIdx;
    let book = this.tome.books[bookIdx];
    let chapter = this.tome.chapters[chapterIdx];

    let bookBin = tomeBin.books.find((x) => x.bookIdx === bookIdx);
    if (!bookBin) {
      tomeBin.books.push({
        name: book.bookName,
        bookIdx: bookIdx,
        chapterIdx: null,
        start: book.firstVerseIdx,
        end: book.lastVerseIdx,
        occurrences: 0,
        verses: 0,
        chapters: []
      });
      bookBin = tomeBin.books[tomeBin.books.length - 1];
    }
    bookBin.occurrences += this.verseCount;
    bookBin.verses += 1;

    let chapterBin = bookBin.chapters.find((x) => x.chapterIdx === chapterIdx);
    if (!chapterBin) {
      bookBin.chapters.push({
        name: `Chapter ${chapter.chapterNum}`,
        bookIdx: null,
        chapterIdx: chapterIdx,
        start: chapter.firstVerseIdx,
        end: chapter.lastVerseIdx,
        occurrences: 0,
        verses: 0,
      });
      chapterBin = bookBin.chapters[bookBin.chapters.length - 1];
    }
    chapterBin.occurrences += this.verseCount;
    chapterBin.verses += 1;
  }

  buildRegExp(term, flags) {
    let regexStr = term.replace(/\*/g, '[\\w\']*');
    regexStr = term.endsWith('*') ?
      `\\b(${regexStr})` :
      `\\b(${regexStr})( |$)`;
    return new RegExp(regexStr, flags);
  }

  buildSearchCombinations() {
    this.searchExp.combinations = product(this.searchExp.patterns);
  }

  buildsearchExp(searchStr) {
    this.searchExp = {};
    this.searchExp.state = 'ERROR';
    this.searchExp.searchStr = searchStr;
    if (searchStr === '') {
      this.searchExp.type = 'EMPTY';
      return;
    }
    this.searchExp.type = 'INVALID';
    this.searchExp.flags = searchStr.startsWith('@') ? 'g' : 'gi';
    this.searchExp.searchTerms = this.searchExp.searchStr
      .replace('@', '')
      .trim()
      .replace(/ {2,}/g, ' ')
      .replace(/ *,+ */g, ',');
    if (this.searchExp.searchTerms.match(/[^a-z ,'*-]/i)) {
      return;
    }
    if (/^\*$|^\* | \* | \*$|^\*,|,\*,|,\*$/g.test(this.searchExp.searchTerms)) {
      return;
    }
    if (/^,|,$/g.test(this.searchExp.searchTerms)) {
      return;
    }
    if (
      this.searchExp.searchTerms.includes(' ') &&
      this.searchExp.searchTerms.includes(',')
    ) {
      return;
    }
    this.searchExp.terms = this.searchExp.searchTerms
      .replace(/-/g, '').split(/[ ,]/);
    if (
      this.searchExp.searchStr.includes(',') ||
      this.searchExp.terms.length === 1
    ) {
      this.searchExp.type = 'WORD';
    } else {
      this.searchExp.type = 'PHRASE';
    }
  }

  buildSearchIntersects() {
    let verses = new Set();
    this.searchExp.sets.forEach((set) => {
      let intersect = this.intersectAll(set);
      [...intersect].forEach((verse) => {
        verses.add(verse);
      });
    });
    this.searchExp.intersects = [...verses].sort(numSort);
  }

  buildSearchPatterns() {
    this.searchExp.tomeWords = 'OK';
    this.searchExp.patterns = [];
    let missingTerms = [];
    this.searchExp.terms.forEach((term) => {
      let regExp = this.buildRegExp(term, 'gi');
      let words = this.gettomeWords(regExp);
      if (words.length > 0) {
        this.searchExp.patterns.push(words);
      } else {
        missingTerms.push(term);
      }
    });
    if (missingTerms.length > 0) {
      this.searchExp.tomeWords = `'${missingTerms.join(', ')}' not found`;
    }
  }

  buildSearchPhraseVerses() {
    let allVerses = [...this.searchExp.intersects].sort(numSort);
    allVerses.forEach((idx) => {
      this.verseIdx = idx;
      let text = this.tome.verses[idx].replace(/[!();:,.?-]/g, '');
      let regExp = this.buildRegExp(
        this.searchExp.searchTerms, this.searchExp.flags
      );
      this.verseCount = (text.match(regExp) || []).length;
      if (this.verseCount > 0) {
        this.searchExp.verses.push(idx);
        this.buildBins();
      }
    });
  }

  buildSearchSets() {
    this.searchExp.sets = [];
    this.searchExp.combinations.forEach((combination) => {
      let comboSets = [];
      combination.forEach((word) => {
        comboSets.push(new Set(this.tome.wordVerses[word]));
      });
      this.searchExp.sets.push(comboSets);
    });
  }

  buildSearchWordVerses() {
    let allVerses = [...this.searchExp.intersects].sort(numSort);
    allVerses.forEach((idx) => {
      this.verseIdx = idx;
      let text = this.tome.verses[idx].replace(/[!();:,.?-]/g, '');
      this.verseCount = 0;
      this.searchExp.terms.every((term) => {
        let regExp = this.buildRegExp(term, this.searchExp.flags);
        let hits = (text.match(regExp) || []).length;
        if (hits === 0) {
          this.verseCount = 0;
          return false;
        } else {
          this.verseCount += hits;
          return true;
        }
      });
      if (this.verseCount > 0) {
        this.searchExp.verses.push(idx);
        this.buildBins();
      }
    });
  }

  buildSearchVerses() {
    this.searchExp.occurrences = 0;
    this.searchExp.verses = [];
    this.initializeBins();
    switch (this.searchExp.type) {
      case 'PHRASE':
        this.buildSearchPhraseVerses(this.searchExp);
        break;
      case 'WORD':
        this.buildSearchWordVerses(this.searchExp);
        break;
    }
  }

  findAllMatches(str, regEx) {
    let result;
    let matches = [];
    while ((result = regEx.exec(str)) !== null) {
      matches.push(result[1]);
    }
    return matches.length === 0 ? undefined : matches;
  }

  gettomeWords(regExp) {
    let tomeWords = [];
    let words = this.findAllMatches(this.tome.wordList, regExp);
    if (words) {
      tomeWords = tomeWords.concat(words);
    }
    return tomeWords;
  }

  initialize() {
    this.subscribe();
  }

  initializeBins() {
    this.searchExp.bins = {
      name: this.tome.name,
      bookIdx: null,
      chapterIdx: null,
      start: 0,
      end: this.tome.verses.length - 1,
      occurrences: 0,
      verses: 0,
      books: []
    };
  }

  intersectAll(...sets) {
    let numOfSets = sets.length;
    if (numOfSets == 0) {
      return undefined;
    }
    if (Array.isArray(sets[0])) {
      sets = [...sets[0]];
      numOfSets = sets.length;
    }
    if (numOfSets < 2) {
      return sets[0];
    }
    let intersect = this.intersection(sets[0], sets[1]);
    if (numOfSets == 2) {
      return intersect;
    }
    for (let i = 2; i < numOfSets; i++) {
      intersect = this.intersection(intersect, sets[i]);
    }
    return intersect;
  }

  intersection(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
  }

  performSearch(searchStr) {
    this.buildsearchExp(searchStr);
    if (
      this.searchExp.type === 'EMPTY' ||
      this.searchExp.type === 'INVALID'
    ) {
      return this.searchExp;
    }
    this.buildSearchPatterns();
    if (this.searchExp.tomeWords !== 'OK') {
      return this.searchExp;
    }
    this.searchExp.state = 'OK';
    this.buildSearchCombinations();
    this.buildSearchSets();
    this.buildSearchIntersects();
    this.buildSearchVerses();
    return this.searchExp;
  }

  subscribe() {
    this.bus.subscribe('tome.update',
      (tome) => {
        this.tomeUpdate(tome);
      }
    );
  }

  tomeUpdate(tome) {
    this.tome = tome;
  }

}

export {
  SearchEngine
};
