import { Actor } from 'apify';

export class Utils {

  static parseDate(input) {
    const dateRegexp = /(\d{1,2}\. ?\d{1,2}\. ?\d{4})[^\d]*(\d{1,2}:\d{1,2})[^\d]*(\d{1,2}:\d{1,2})/;

    const match = input.match(dateRegexp);

    if (match?.length === 4) {
      const date = match[1].split('.');

      const year = parseInt(date[2]);
      const month = parseInt(date[1]);
      const day = parseInt(date[0]);

      const parsedDate = new Date(year, month - 1, day);

      const from = match[2];
      const to = match[3];

      return new Validity(parsedDate, from, to);

    }

    return null;
  }

  static isSameDay(a, b) {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  }

  static getResult(validity, text) {
    const { date } = validity;

    return {
      Date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      From: validity.from,
      To: validity.to,
      Text: text,
    };
  }

  static async sendEmail(emailData, validity, text) {

    await Actor.call('apify/send-mail', {
      to: emailData.to,
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: `Kaktus dobíječka dnes od ${validity.from} do ${validity.to}`,
      text: text,
    });

  }

}

export class Validity {
  constructor(date, from, to) {
    this.date = date;
    this.from = from;
    this.to = to;
  }

}
