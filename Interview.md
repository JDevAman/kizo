# Technical Interviews:

## Tech Skill Q/A

1. How did you handle Double Transactions?
   Using Select.. for update and Transaction

2. You have added Redis and BullMQ. How will you handle Dual Write Problem?
   Will be using Transactional Outbox Pattern along with Change Data Capture Tools

## Soft Skill Q/A

---

## Architecture

API Gateway (Auth, User, Dashboard) -> [Core Business] (Payment & Transaction Microservice) -> (Queue) -> [Mock](Bank Microservice)

Table:
User -> RefreshToken, UserBalance, Transaction
Transaction (has Idempotncy Key) -> BankTransfer (to be stored in queue and will be exposed to)

### Questions

#### Error Handling

1. Try Catch only written at controller level.
2. Pino instead of console.log() / console.error().

#### Redis:

1. How did you find which APIs to cache?
   Only those APIs which have high Read to Write Ration (1000:1) were cached.

2. How did you decide TTL for records?
   Current

   - User Profile: 10 mins
   - User Dashboard: 5 mins

3. How are you handling Cache Invalidation?

#### BullMQ

Producer pushing to queue successfully.

Kizo-Worker to process records now.

Recon Job: _/30 _ \* \* \*

---

┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ │
│ │ │ │ │ └ day of week (0 - 7, 1L - 7L, where 0 or 7 is Sunday)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31, L for the last day of the month)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)
