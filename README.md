# yoshi-jp-learner
Web-application for helping users learn Japanese.

Right now, only Hiragana and Katakana lessons are available.
-   Does not include Diagraphs or Diacritics

You can try the web-app here: https://yoshi-jp-learner-avoy.vercel.app/
*** Upgrading to a pro subscription is disabled by default, it was mainly added to see how the Stripe API integration works ***


## Technologies Used:
- Frontend: Next.js (React Framework)
- Backend: Drizzle (ORM for data management)
- Database: PostgreSQL (Relational Database) with NeonDB
- Authentication: Clerk (Secure Login/Registration)
- Payments: Stripe (not enabled)

## Features Implemented
- Hiragana and Katakana units, no diagraphs or diacritics
- Hearts and Points System
- "No Hearts Left" Popup
- Exit Confirmation Popups
- Ability to practice old lessons to regain hearts
- Leaderboard
- Quests and milestones
- Shop system to exchange points with hearts
- Pro Subscription Tier is coded to access unlimited hearts
- Landing Page
- Admin dashboard using React Admin
- ORM using DrizzleORM
- PostgresDB using NeonDB
- Responsive User Interface
- Component Based Development with React
- Authorization using Clerk
- Sound Effects

## Note: The goal of this projest was to develop my React and Typescript/JS skills while also being able to review the basics of the Japanese language.
- I had a ton of fun and I am looking forward to making other projects! Perhaps a future project can be implemented in this one; an idea that I had that can be useful is the usage of a Machine Learning model to help the user review more optimally.
