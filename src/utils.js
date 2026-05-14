import { Actor } from 'apify';

export function parseDate(input) {
  // First try to match date in format DDMMYYYY from filename (e.g., 23062025)
  const filenameMatch = input.match(/(\d{2})(\d{2})(\d{4})\.pdf/);
  if (filenameMatch?.length === 4) {
    const day = parseInt(filenameMatch[1], 10);
    const month = parseInt(filenameMatch[2], 10);
    const year = parseInt(filenameMatch[3], 10);

    const parsedDate = new Date(year, month - 1, day);
    return new Validity(parsedDate);
  }

  return null;
}

export function isSameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function getResult(validity) {
  const { date } = validity;

  const result = {
    Date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
  };

  // Include time fields only when they are available
  if (validity.startTime) {
    result.From = validity.startTime;
  }
  if (validity.endTime) {
    result.To = validity.endTime;
  }

  return result;
}

export function parseDateTimeFromText(text) {
  // Parse date and time from HTML text like "9.7.2025 16:00 - 18:00" or "31. 10. 2025 20:00 - 22:00"

  // Match pattern: DD.MM.YYYY HH:MM - HH:MM or DD. MM. YYYY HH:MM - HH:MM (with optional spaces after dots)
  const dateTimeMatch = text.match(
    /(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
  );

  if (dateTimeMatch?.length === 8) {
    const day = parseInt(dateTimeMatch[1], 10);
    const month = parseInt(dateTimeMatch[2], 10);
    const year = parseInt(dateTimeMatch[3], 10);
    const startHour = parseInt(dateTimeMatch[4], 10);
    const startMinute = parseInt(dateTimeMatch[5], 10);
    const endHour = parseInt(dateTimeMatch[6], 10);
    const endMinute = parseInt(dateTimeMatch[7], 10);

    // Create start and end date objects
    const startDate = new Date(year, month - 1, day, startHour, startMinute);

    return {
      date: startDate, // For compatibility with existing code
      startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
    };
  }

  return null;
}

export async function handleResult(result) {
  await Actor.pushData(getResult(result));

  if (isSameDay(result.date, new Date())) {
    const { email: emailsData } = await Actor.getInput();

    if (emailsData) {
      for (const emailData of emailsData) {
        await sendEmail(emailData, result);
      }
    }
  }
}

export async function sendEmail(emailData, result) {
  let subject = `Kaktus dobíječka dnes`;

  if (result.startTime && result.endTime) {
    subject = `${subject} ${result.startTime} - ${result.endTime}`;
  }

  await Actor.call('apify/send-mail', {
    to: emailData.to,
    cc: emailData.cc,
    bcc: emailData.bcc,
    subject: subject,
    html: 'Podívat se na <a href="https://www.mujkaktus.cz/chces-pridat">web</a>',
  });
}

export const Utils = {
  parseDate,
  isSameDay,
  getResult,
  parseDateTimeFromText,
  handleResult,
  sendEmail,
};

export class Validity {
  constructor(date) {
    this.date = date;
  }
}
