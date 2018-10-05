'use strict';

import { kjv } from './kjv.js';
import { apocrypha } from './apocrypha.js';

class Archive {

  constructor() {
    this.tomes = {};
    this.intialize();
  }

  intialize() {
    this.tomes[kjv.name] = kjv;
    this.tomes[apocrypha.name] = apocrypha;
  }

}

export { Archive };
