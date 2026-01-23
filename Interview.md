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
