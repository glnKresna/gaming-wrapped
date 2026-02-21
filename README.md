# 🎮 Steam Wrapped 

A simple web application built as a personal testing ground to learn full-stack development with Next.js and TypeScript. It uses the Steam Web API to fetch a user's public gaming data and displays it in a Steam Replay/Spotify Wrapped style summary dashboard.

**Live Demo:** [gaming-wrapped.vercel.app](https://gaming-wrapped.vercel.app/)

## ✨ Features

* **Profile Stats:** Calculates total games owned, games played, and total playtime hours.
* **Genre Breakdown:** Displays user's most played game tags/genres in donut chart.
* **Top Games:** Highlights the most heavily played games in the user's library.
* **Wishlist Reminder:** Pulls current items from the user's public Steam wishlist.
* **API Rate Limiting:** Includes a custom in-memory rate limiter on the Next.js API route to prevent Steam API spam.
* **Robust Backend API:** Custom Next.js API route that handles Vanity URL resolution, data fetching, and safe error parsing.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Charts:** [Recharts](https://recharts.org/)
* **Data Source:** [Steam Web API](https://steamapi.xpaw.me/)

## 🚀 Running Locally

To run this project on your own machine, you will need to generate a free Steam API key from the [Steam Developer Portal](https://steamcommunity.com/dev/apikey).

1. Clone the repository:
   ```bash
   git clone [https://github.com/glnKresna/gaming-wrapped.git](https://github.com/glnKresna/gaming-wrapped.git)
   cd gaming-wrapped
   ```

2. Install the dependencies (this project uses `pnpm`):
```bash
pnpm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Steam API key:
```
STEAM_API_KEY=your_steam_api_key_here
```

4. Start the development server:
```bash
pnpm dev
```

5. Open http://localhost:3000 in your browser to see the app running.