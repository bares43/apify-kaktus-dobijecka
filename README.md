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
  "Date": "2022-10-12",
 }
```