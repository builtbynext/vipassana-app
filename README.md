# Vercel-ready Next.js shell

This is a minimal Next.js app set up so your existing JSX UI can be deployed on Vercel.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

   Then open `http://localhost:3000` in your browser.

3. Build for production:

   ```bash
   npm run build
   npm start
   ```

## Integrating your JSX

The main route is defined in `app/page.jsx`. Replace the placeholder JSX inside the `Page` component with your existing JSX UI, adjusting it so it exports a React component rather than calling `ReactDOM.render`.

If your JSX touches `window` or `document`, move that logic into React effects/hooks so it only runs on the client.

## Deploying to Vercel

Once this project is pushed to GitHub:

- Import the repo in the Vercel dashboard.
- Framework preset: **Next.js**.
- Build command: `next build` (default).
- Output directory: `.next` (default).

No `vercel.json` is required for a basic setup.

