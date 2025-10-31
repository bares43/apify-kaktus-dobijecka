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

describe('parseDateTimeFromText', () => {

  it('should parse date and time from text without spaces after dots', () => {

    const text = `
    <div class="richTextStyles"><h4><strong>9.7.2025 16:00 - 18:00</strong></h4><p><br></p><p><strong>Jak dobít kredit? </strong><br>Nejrychlejší to máš online <a href="/chces-pridat#dobiti">tady dole</a> a v apce nebo sámošce platební kartou. Jde to i přes Sazku, bankomat, internetové bankovnictví a prodejnu T-Mobile. Když nenajdeš Kaktus, zvol T-Mobile.<br><br><strong>Jak získat bonus? </strong><br>Dobij si během akce aspoň 200 Kč a dostaneš jednou tolik navíc. Získáš ho jen jednou za akci a maximálně 500 Kč. Přeposlání kreditu z jiného čísla není dobití. <br><br><strong>Jak bonusový kredit funguje?</strong><br>Můžeš ho použít na nákup balíčků, datování, volání, posílání SMS/MMS a čerpá se jako první. Nejde přeposílat na jiná čísla ani jím platit Premium SMS, Audiotex ani M-Platba. Má platnost 30 dní a kontrolovat ho můžeš v <a href="http://kaktus.gods.cz/aplikace/d/premium1">apce</a>, <a href="https://sluzby.mujkaktus.cz/moje-sluzby">sámošce</a> nebo vytočením *103#. <br><br><a href="https://www.mujkaktus.cz/api/download?docUrl=%2Fapi%2Fdocuments%2Ffile%2FOP-Odmena-za-dobiti-FB_09072025.pdf&amp;filename=OP-Odmena-za-dobiti-FB_09072025.pdf" rel="noopener noreferrer" target="_blank">Celé podmínky v PDF</a></p></div>
    `;

    assert.deepEqual(Utils.parseDateTimeFromText(text), {
      date: new Date(2025, 6, 9, 16, 0),
      startTime: '16:00',
      endTime: '18:00',
    });
  });

  it('should parse date and time from text with spaces after dots', () => {
    const text = '31. 10. 2025 20:00 - 22:00';

    assert.deepEqual(Utils.parseDateTimeFromText(text), {
      date: new Date(2025, 9, 31, 20, 0),
      startTime: '20:00',
      endTime: '22:00',
    });
  });

  it('should parse date and time from text with single digit day and month', () => {
    const text = '5. 3. 2025 08:30 - 10:45';

    assert.deepEqual(Utils.parseDateTimeFromText(text), {
      date: new Date(2025, 2, 5, 8, 30),
      startTime: '08:30',
      endTime: '10:45',
    });
  });

  it('should not parse date and time from text', () => {
    assert.isNull(Utils.parseDateTimeFromText(''));
  });

  it('should not parse invalid date and time format', () => {
    assert.isNull(Utils.parseDateTimeFromText('2025-10-31 20:00'));
  });
});