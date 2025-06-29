import { assert } from 'chai';

import { Utils, Validity } from '../src/utils.js';

describe('isSameDay', () => {

  it('should should return true for same days', () => {
    assert.isTrue(Utils.isSameDay(new Date(), new Date()));
    assert.isTrue(Utils.isSameDay(new Date(2022, 9, 23), new Date(2022, 9, 23, 15, 10, 0)));
  });

  it('should should return false for different days', () => {
    assert.isFalse(Utils.isSameDay(new Date(2022, 10, 23), new Date(2022, 9, 23)));
  });

});

describe('parseDate', () => {

  it('should parse date from string', () => {
    assert.deepEqual(Utils.parseDate('https://www.mujkaktus.cz/api/download?docUrl=%2Fapi%2Fdocuments%2Ffile%2FOP-Odmena-za-dobiti-FB_23062025.pdf&filename=OP-Odmena-za-dobiti-FB_23062025.pdf'), new Validity(new Date(2025, 5, 23)));
  });

  it('should not parse date from string', () => {
    assert.isNull(Utils.parseDate('https://sluzby.mujkaktus.cz/moje-sluzby'));
  });
});