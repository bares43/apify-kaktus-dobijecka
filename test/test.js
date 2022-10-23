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
    assert.deepEqual(Utils.parseDate('Pokud si dneska 12. 10. 2022 od 17:00 do 20:00 hodin dobiješ alespoň 200 Kč, dáme ti dvojnásob'), new Validity(new Date(2022, 9, 12), '17:00', '20:00'));
  });

  it('should not parse date from string', () => {
    assert.notDeepEqual(Utils.parseDate('Pokud si dneska 13. 10. 2022 od 17:00 do 20:00 hodin dobiješ alespoň 200 Kč, dáme ti dvojnásob'), new Validity(new Date(2022, 9, 12), '17:00', '20:00'));
    assert.isNull(Utils.parseDate('test'));
  });
});