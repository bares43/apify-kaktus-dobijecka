import { createCheerioRouter } from 'crawlee';
import { Utils } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ $ }) => {
  // let's try to parse date and time from text
  const textResult = Utils.parseDateTimeFromText(
    $('div.richTextStyles').text(),
  );

  if (textResult) {
    await Utils.handleResult(textResult);
    return;
  }

  // if not, let's try to parse date from PDF terms filename
  for (const a of $('a')) {
    if (
      !$(a).attr('href')?.startsWith('https://www.mujkaktus.cz/api/download') ||
      !$(a).attr('href')?.endsWith('.pdf')
    ) {
      continue;
    }

    const text = $(a).attr('href');

    const validity = Utils.parseDate(text);

    if (validity) {
      await Utils.handleResult(validity);
    }
  }
});
