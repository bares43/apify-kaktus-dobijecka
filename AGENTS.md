# AGENTS.md - Project Guide for AI Coding Agents

## Project Overview

This is an **Apify scraper** designed to monitor and extract promotional information from the Kaktus mobile operator website. Specifically, it tracks the "Dobíječka" (top-up double) promotion - a promotional campaign where customers who top up their prepaid credit receive bonus credit.

**Key Facts:**
- **Project Name:** kaktus-dobijecka
- **Type:** Apify Actor (web scraper)
- **Target:** https://www.mujkaktus.cz/chces-pridat
- **Purpose:** Extract the date and time of the next "Dobíječka" promotion
- **Technology Stack:** Node.js, Apify SDK, Crawlee with Cheerio
- **Operator:** Kaktus (Czech mobile phone operator)

## What This Actor Does

The actor:
1. Scrapes the Kaktus website promotional page
2. Extracts the date and time of the next "Dobíječka" promotion
3. Stores the results in Apify dataset
4. Optionally sends email notifications if the promotion is happening today

### Output Format

The actor produces a JSON object with the following structure:

```json
{
  "Date": "2025-07-09",
  "From": "16:00",
  "To": "18:00"
}
```

**Note:** The `From` and `To` fields are optional and only included when time information is available on the website.

### Input Format

The actor accepts optional email configuration for notifications:

```json
{
  "email": [
    {
      "to": "your@mail.com"
    },
    {
      "to": "other@mail.com",
      "cc": "cc@mail.com",
      "bcc": "bcc@mail.com"
    }
  ]
}
```

If no email notification is needed, leave the input empty.

## How to Run

### Development Mode
```bash
apify run -p
```

This command:
- Runs the actor locally in purge mode (cleans storage before run)
- Uses local INPUT.json if present
- Stores results in `./storage/datasets/default/`

### Production
The actor runs on the Apify platform according to its scheduled configuration.

### Running Tests
```bash
npm test
```

This executes the Mocha test suite located in `test/test.js`.

## Project Structure

```
.
├── src/
│   ├── main.js       # Entry point, initializes crawler
│   ├── routes.js     # Request handler with scraping logic
│   └── utils.js      # Utility functions for parsing and email
├── test/
│   └── test.js       # Unit tests for parsing functions
├── .actor/
│   └── actor.json    # Apify actor metadata
├── INPUT_SCHEMA.json # Input validation schema
├── package.json      # Dependencies and scripts
└── README.md         # User-facing documentation
```

## How It Works

### Technical Implementation

The scraper uses a two-phase parsing strategy:

#### Phase 1: Parse from HTML Text (Primary Method)
Located in: `src/routes.js:9-15`

The scraper first attempts to extract date and time directly from the promotional text on the page. It looks for patterns like:
- `9.7.2025 16:00 - 18:00`
- `31. 10. 2025 20:00 - 22:00` (with spaces after dots)

This is handled by `Utils.parseDateTimeFromText()` in `src/utils.js:43-69`.

#### Phase 2: Parse from PDF Filename (Fallback Method)
Located in: `src/routes.js:17-32`

If Phase 1 fails, the scraper looks for PDF links containing promotional terms and conditions. The filename contains the date in format `DDMMYYYY.pdf` (e.g., `OP-Odmena-za-dobiti-FB_09072025.pdf`).

This is handled by `Utils.parseDate()` in `src/utils.js:5-19`.

### Email Notifications

When a promotion date matches today's date:
1. The actor checks input for email configuration
2. Sends notification via `apify/send-mail` actor
3. Email subject includes time range if available
4. Email body contains link to the promotional page

Implementation: `src/utils.js:71-103`

## Maintenance Guide

### When to Update This Actor

1. **Website Structure Changes**
   - If Kaktus redesigns their promotional page
   - If CSS selectors change (currently uses `div.richTextStyles`)
   - If PDF URL format changes

2. **Date Format Changes**
   - If the date/time format in promotional text changes
   - If PDF filename format changes

3. **New Data Requirements**
   - If you need to extract additional information (e.g., bonus amount, conditions)

### Common Maintenance Tasks

#### 1. Update CSS Selectors

If the website structure changes, update the selector in `src/routes.js:10`:
```javascript
const textResult = Utils.parseDateTimeFromText($('div.richTextStyles').text());
```

#### 2. Update Date Parsing Regex

Date/time parsing regex is in `src/utils.js:47`:
```javascript
const dateTimeMatch = text.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
```

PDF filename parsing regex is in `src/utils.js:8`:
```javascript
const filenameMatch = input.match(/(\d{2})(\d{2})(\d{4})\.pdf/);
```

#### 3. Update Target URL

If the promotional page URL changes, update `src/main.js:7`:
```javascript
const startUrls = ['https://www.mujkaktus.cz/chces-pridat'];
```

#### 4. Add New Tests

When adding new parsing logic or fixing bugs:
1. Add test cases to `test/test.js`
2. Run `npm test` to verify
3. Ensure all existing tests still pass

### Testing Strategy

The test suite covers:
- **Date parsing from PDF filenames** (`parseDate`)
- **Date/time parsing from text** (`parseDateTimeFromText`)
- **Date comparison** (`isSameDay`)

Test cases include:
- Various date formats (with/without spaces after dots)
- Single and double-digit days/months
- Time range extraction
- Invalid input handling

### Debugging Tips

1. **Check scraped content:**
   - Run locally with `apify run -p`
   - Add `console.log($('div.richTextStyles').text())` to see extracted text

2. **Test parsing functions:**
   - Use the test suite to verify regex patterns
   - Add new test cases for edge cases

3. **Verify output:**
   - Check `./storage/datasets/default/` after local run
   - Verify date format is `YYYY-MM-DD`

4. **Email issues:**
   - Verify INPUT.json has correct email configuration
   - Check that date matches today for emails to send
   - Review `apify/send-mail` actor logs

### Dependencies

- **apify** (^3.0.0): Apify SDK for actor development
- **crawlee** (^3.0.0): Web scraping and crawling library
- **cheerio**: HTML parsing (included in Crawlee)

Development dependencies:
- **mocha**: Test runner
- **chai**: Assertion library
- **eslint**: Code linting

### Linting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

## Recent Changes

Based on git history, recent updates include:
- Support for date format with spaces after dots (e.g., `31. 10. 2025`)
- Added time fields (`From`/`To`) to output when available
- Enhanced date/time parsing from promotional text
- Updated for new Kaktus website structure

## Troubleshooting

### No data extracted
1. Verify the target URL is accessible
2. Check if website structure has changed
3. Add debug logging to see what content is being scraped
4. Test parsing functions with current website content

### Wrong dates extracted
1. Check if date format on website has changed
2. Review regex patterns in `utils.js`
3. Add test cases for the new format
4. Update parsing logic accordingly

### Emails not sending
1. Ensure date matches today's date exactly
2. Verify INPUT.json has valid email configuration
3. Check Apify platform logs for `apify/send-mail` actor
4. Verify `apify/send-mail` actor is accessible

## Development Workflow

1. **Make changes** to source files
2. **Add tests** for new functionality
3. **Run tests**: `npm test`
4. **Lint code**: `npm run lint:fix`
5. **Test locally**: `apify run -p`
6. **Verify output** in `./storage/datasets/default/`
7. **Commit and push** changes
8. **Deploy** to Apify platform

## Additional Resources

- [Apify SDK Documentation](https://docs.apify.com/sdk/js)
- [Crawlee Documentation](https://crawlee.dev/)
- [Kaktus Website](https://www.mujkaktus.cz/chces-pridat)
