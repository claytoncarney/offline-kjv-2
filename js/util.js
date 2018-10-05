'use strict';

export function activate(element) {
  element.classList.add('active');
}

export function centerScrollElement(scrollElement, element) {
  let y = element.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
}

export function deactivate(element) {
  element.classList.remove('active');
}

export function getChapter(tome, verseIdx) {
  let ref = tome.refs[verseIdx];
  let bookIdx = ref.bookIdx;
  let chapterIdx = ref.chapterIdx;
  let chapterName = tome.chapters[chapterIdx].chapterName;
  let chapter = {
    bookIdx,
    chapterIdx,
    chapterName
  };
  return chapter;
}

export function getDataBookIdx(element) {
  return parseInt(element.getAttribute('data-book-idx'));
}

export function getDataChapterIdx(element) {
  return parseInt(element.getAttribute('data-chapter-idx'));
}

export function getDataChapterName(element) {
  return element.getAttribute('data-chapter-name');
}

export function getDataVerseIdx(element) {
  return parseInt(element.getAttribute('data-verse-idx'));
}

export function hide(element) {
  element.classList.add('hide');
}

export function removeAllChildren(element) {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
}

export function show(element) {
  element.classList.remove('hide');
}
