# Kaktus dobíječka

Actor which checks date of top up double action for Czech phone operator Kaktus. It returns date and from-to when this action was available for last time. It's possible to set e-mail for sending notification if the day is today.

## INPUT
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

If you don't want to send any email, just leave INPUT.json empty.

## OUTPUT
```json
{
  "Date": "2025-07-09",
	"From": "16:00",
	"To": "18:00"
 }
```

The "From" and "To" properties may be empty, depending on how the event is promoted on the Kaktus website.

## DEVELOPMENT

```bash
npm run lint
npm run lint:fix
npm run format
```
