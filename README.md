# ping-bot
Ping bot

## Routes

- ping
    - POST
    - target login
    - actions:
       - get google login
       - connect to calendar
       - authorization ?
          - yes: return boolean
          - no: return not authorized

Libs:
- Google
   - authorize OK
   - store authorization
   - ping calendar ~
- Slack
   - get google login
   - send google link
   - send boolean

## TODO

### Home
- Nice front page

### Slack
- validate text
- check if in DB
    - if yes: ask googlecalendar
    - if not return link to authorize
- Nice to have:
    - directily return token to user
- ask user to authorize
