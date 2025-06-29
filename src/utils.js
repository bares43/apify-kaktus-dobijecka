import { Actor } from 'apify';

export class Utils {

  static parseDate(input) {
   
    // from this input https://www.mujkaktus.cz/api/download?docUrl=%2Fapi%2Fdocuments%2Ffile%2FOP-Odmena-za-dobiti-FB_23062025.pdf&filename=OP-Odmena-za-dobiti-FB_23062025.pdf parse date 23. 6. 2025

    // First try to match date in format DDMMYYYY from filename (e.g., 23062025)
    const filenameMatch = input.match(/(\d{2})(\d{2})(\d{4})\.pdf/);
    if (filenameMatch?.length === 4) {
      const day = parseInt(filenameMatch[1]);
      const month = parseInt(filenameMatch[2]);
      const year = parseInt(filenameMatch[3]);

      const parsedDate = new Date(year, month - 1, day);
      return new Validity(parsedDate);
    }

    return null;
  }

  static isSameDay(a, b) {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  }

  static getResult(validity) {
    const { date } = validity;

    return {
      Date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
    };
  }

  static async sendEmail(emailData) {

    await Actor.call('apify/send-mail', {
      to: emailData.to,
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: `Kaktus dobíječka dnes`,
      text: '<a href="https://www.mujkaktus.cz/chces-pridat">Web</a>',
    });

  }

}

export class Validity {
  constructor(date) {
    this.date = date;
  }

}
