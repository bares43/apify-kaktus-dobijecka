import { Actor } from 'apify';
import { createCheerioRouter } from 'crawlee';
import { Utils } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ $ }) => {
  for (const a of $('a')) {

    if (!$(a).attr('href')?.startsWith('https://www.mujkaktus.cz/api/download')
      || !$(a).attr('href')?.endsWith('.pdf')) {
      continue;
    }

    const text = $(a).attr('href');

    const validity = Utils.parseDate(text);

    if (validity) {
      await Actor.pushData(Utils.getResult(validity));

      if (Utils.isSameDay(validity.date, new Date())) {

        const { email: emailsData } = await Actor.getInput();

        if (emailsData) {
          for (const emailData of emailsData) {
            await Utils.sendEmail(emailData, validity);
          }
        }

      }

    }
  }
});