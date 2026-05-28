# Agent Call Summary AI

A complete, production-ready web application for real estate sales agents to instantly convert customer call notes into clean, structured summaries using Anthropic's Claude API.

## Features
- Support for mixed Telugu/English text inputs
- Instant AI-driven information extraction (Budget, Plot Size, Location, Next Action)
- History tracking saved directly to the browser
- Dashboard with key metrics (Hot leads, Site visits)
- Export to CSV functionality
- Fully responsive, beautiful UI built with Tailwind CSS

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React (Icons)
- Anthropic API

## Setup Instructions

1. Clone or download the repository.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Configuration

Since this is a client-side prototype, you must provide your Anthropic API Key directly in the app.
1. Open the app in your browser.
2. Navigate to **Settings**.
3. Paste your Anthropic API Key (`sk-ant-...`) and click **Save Settings**.
4. You are now ready to log new calls!

> **Warning:** This application stores the API key in your browser's local storage. This approach is intended for prototyping and internal demos only. Do not deploy this application publicly without moving the API calls to a secure backend server.

## Vercel Deployment

This app is pre-configured for Vercel deployment as a Single Page Application (SPA) with a `vercel.json` file.

1. Install the Vercel CLI or connect your GitHub repository to Vercel.
2. If using CLI, simply run:
   \`\`\`bash
   vercel
   \`\`\`
3. Accept the default configuration prompts.

## Env Config
An `.env.example` file is provided, but because the API key is entered via the UI, no environment variables are strictly required to run the frontend code.
