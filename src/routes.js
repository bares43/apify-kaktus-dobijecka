import { Actor } from 'apify';
import { createCheerioRouter } from 'crawlee';
import { Utils } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ $ }) => {
  for (const h3 of $('h3')) {

    const text = $(h3).text();

    const validity = Utils.parseDate(text);

    if (validity) {
      await Actor.pushData(Utils.getResult(validity, text));

      if (Utils.isSameDay(validity.date, new Date())) {

        const { email: emailsData } = await Actor.getInput();

        if (emailsData) {
          for (const emailData of emailsData) {
            await Utils.sendEmail(emailData, validity, text);
          }
        }

      }

    }
  }
});