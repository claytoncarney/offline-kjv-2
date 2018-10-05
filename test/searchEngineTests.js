'use strict';

/*global QUnit*/

import { Archive } from '/js/tome/archive.js';
import { EventBus } from '/js/EventBus.js';
import { SearchEngine } from '/js/SearchEngine.js';

(function () {
  let archive = new Archive();
  let bus = new EventBus();
  let eng = new SearchEngine(bus);
  bus.publish('tome.update', archive.tomes['KJV']);

  // Assert values verified with King James Pure Bible Search
  // http://purebiblesearch.com/

  QUnit.module('Input Errors');

  QUnit.test('Empty Expression', function (assert) {
    let searchExp = eng.performSearch('');
    assert.equal(searchExp.type, 'EMPTY');
  });
  QUnit.test('Both Word and Phrase Expression', function (assert) {
    let searchExp = eng.performSearch('god,son of man');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Illegal Character in Expression', function (assert) {
    let searchExp = eng.performSearch('god+man');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('*');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('* god');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('god * man');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('god *');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('*,god');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('god, *, man');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let searchExp = eng.performSearch('god, *');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let searchExp = eng.performSearch('god,');
    assert.equal(searchExp.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let searchExp = eng.performSearch(',god');
    assert.equal(searchExp.type, 'INVALID');
  });

  QUnit.module('Word Search Expressions');

  QUnit.test('abed*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 15);
    assert.equal(searchExp.bins.verses, 14);
  });
  QUnit.test('@abed*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 0);
    assert.equal(searchExp.bins.verses, 0);
  });
  QUnit.test('abedn*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 15);
    assert.equal(searchExp.bins.verses, 14);
  });
  QUnit.test('accept*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 87);
    assert.equal(searchExp.bins.verses, 86);
  });
  QUnit.test('@Accept', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('@Accept*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('aha*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 221);
    assert.equal(searchExp.bins.verses, 188);
  });
  QUnit.test('@aha*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 3);
    assert.equal(searchExp.bins.verses, 3);
  });
  QUnit.test('angel', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 201);
    assert.equal(searchExp.bins.verses, 192);
  });
  QUnit.test('angel*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 297);
    assert.equal(searchExp.bins.verses, 283);
  });
  QUnit.test('@Angel*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 4);
    assert.equal(searchExp.bins.verses, 4);
  });
  QUnit.test("apostles'", function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 5);
    assert.equal(searchExp.bins.verses, 5);
  });
  QUnit.test('as*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 4938);
    assert.equal(searchExp.bins.verses, 4085);
  });
  QUnit.test('@as*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 4213);
    assert.equal(searchExp.bins.verses, 3490);
  });
  QUnit.test('@As*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 725);
    assert.equal(searchExp.bins.verses, 684);
  });
  QUnit.test('be*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 16269);
    assert.equal(searchExp.bins.verses, 11740);
  });
  QUnit.test('bethel', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 66);
    assert.equal(searchExp.bins.verses, 59);
  });
  QUnit.test('christ', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 555);
    assert.equal(searchExp.bins.verses, 522);
  });
  QUnit.test('christ*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 576);
    assert.equal(searchExp.bins.verses, 537);
  });
  QUnit.test('*circum*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 148);
    assert.equal(searchExp.bins.verses, 109);
  });
  QUnit.test('err*d', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 15);
    assert.equal(searchExp.bins.verses, 14);
  });
  QUnit.test('ex*d', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 147);
    assert.equal(searchExp.bins.verses, 143);
  });
  QUnit.test('fou*n', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 113);
    assert.equal(searchExp.bins.verses, 107);
  });
  QUnit.test('jehovah*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 7);
    assert.equal(searchExp.bins.verses, 7);
  });
  QUnit.test('@JEHOVAH*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 4);
    assert.equal(searchExp.bins.verses, 4);
  });
  QUnit.test("kings'", function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 5);
    assert.equal(searchExp.bins.verses, 5);
  });
  QUnit.test("@Kings'", function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('lamb*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 188);
    assert.equal(searchExp.bins.verses, 175);
  });
  QUnit.test('@lamb*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 158);
    assert.equal(searchExp.bins.verses, 147);
  });
  QUnit.test('@Lamb*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 30);
    assert.equal(searchExp.bins.verses, 28);
  });
  QUnit.test('lord', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 7830);
    assert.equal(searchExp.bins.verses, 6667);
  });
  QUnit.test('lord*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 8009);
    assert.equal(searchExp.bins.verses, 6781);
  });
  QUnit.test('@lord', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 234);
    assert.equal(searchExp.bins.verses, 207);
  });
  QUnit.test('@lord*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 289);
    assert.equal(searchExp.bins.verses, 256);
  });
  QUnit.test('@Lord', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1130);
    assert.equal(searchExp.bins.verses, 1067);
  });
  QUnit.test('@Lord*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1145);
    assert.equal(searchExp.bins.verses, 1079);
  });
  QUnit.test('@LORD*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 6575);
    assert.equal(searchExp.bins.verses, 5554);
  });
  QUnit.test('lordly', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('love*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 521);
    assert.equal(searchExp.bins.verses, 442);
  });
  QUnit.test('mal*s', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 41);
    assert.equal(searchExp.bins.verses, 41);
  });
  QUnit.test('net*ite*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 10);
    assert.equal(searchExp.bins.verses, 9);
  });
  QUnit.test('sojourn*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 74);
    assert.equal(searchExp.bins.verses, 72);
  });

  QUnit.module('Multiple-Word Search Expressions');

  QUnit.test('fall,living,god', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 3);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('forgive,sin', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 25);
    assert.equal(searchExp.bins.verses, 12);
  });
  QUnit.test('forgive*,sin*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 117);
    assert.equal(searchExp.bins.verses, 54);
  });
  QUnit.test('generation*,jacob', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 6);
    assert.equal(searchExp.bins.verses, 3);
  });
  QUnit.test('@God,scripture', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 14);
    assert.equal(searchExp.bins.verses, 6);
  });
  QUnit.test('good,fight', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 8);
    assert.equal(searchExp.bins.verses, 3);
  });
  QUnit.test('@LORD,spoken', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 245);
    assert.equal(searchExp.bins.verses, 105);
  });
  QUnit.test('shepherd,sheep', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 39);
    assert.equal(searchExp.bins.verses, 17);
  });
  QUnit.test('@Spirit,glory', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 12);
    assert.equal(searchExp.bins.verses, 5);
  });
  QUnit.test('thought*,way*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 16);
    assert.equal(searchExp.bins.verses, 6);
  });
  QUnit.test('thoughts,ways', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 8);
    assert.equal(searchExp.bins.verses, 2);
  });

  QUnit.module('Phrase Search Expressions');

  QUnit.test('be scattered', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 13);
    assert.equal(searchExp.bins.verses, 13);
  });
  QUnit.test('day of the lord', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 25);
    assert.equal(searchExp.bins.verses, 23);
  });
  QUnit.test('day of the lord*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 31);
    assert.equal(searchExp.bins.verses, 29);
  });
  QUnit.test('days of your fathers', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 2);
    assert.equal(searchExp.bins.verses, 2);
  });
  QUnit.test('forgive their sin', function (assert) {  // Exodus 32:32
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 2);
    assert.equal(searchExp.bins.verses, 2);
  });
  QUnit.test('good fight', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 2);
    assert.equal(searchExp.bins.verses, 2);
  });
  QUnit.test('in christ', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 77);
    assert.equal(searchExp.bins.verses, 76);
  });
  QUnit.test('lord god almighty', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 5);
    assert.equal(searchExp.bins.verses, 5);
  });
  QUnit.test('my thought', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
  QUnit.test('my thoughts', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 5);
    assert.equal(searchExp.bins.verses, 5);
  });
  QUnit.test('my thought*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 6);
    assert.equal(searchExp.bins.verses, 6);
  });
  QUnit.test('my way', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 11);
    assert.equal(searchExp.bins.verses, 11);
  });
  QUnit.test('my ways', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 24);
    assert.equal(searchExp.bins.verses, 24);
  });
  QUnit.test('my way*', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 35);
    assert.equal(searchExp.bins.verses, 35);
  });
  QUnit.test('the lord he', function (assert) {  // PBS reports 51/49, but 7 span adjacent verses
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 44);
    assert.equal(searchExp.bins.verses, 42);
  });
  QUnit.test('world itself', function (assert) {
    let searchExp = eng.performSearch(QUnit.config.current.testName);
    assert.equal(searchExp.bins.occurrences, 1);
    assert.equal(searchExp.bins.verses, 1);
  });
})();
