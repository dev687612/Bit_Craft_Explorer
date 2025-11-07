# Bit Craft Explorer

Bit Craft Explorer is an interactive web app for learning and experimenting with lossless data compression. It focuses on Huffman Coding and LZW (Lempel–Ziv–Welch), providing visual feedback on how each algorithm performs for different file types.

## Features

- Upload common file formats (PDF, DOC/DOCX, JPG, PNG, TXT) and compare Huffman and LZW compression results.
- Practice modules for Huffman coding exercises and algorithmic walkthroughs.
- Responsive UI with light/dark theme toggle that respects system preferences.
- Built-in charts and tables to help explain compression ratios and performance.

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS with shadcn/ui component primitives
- TanStack Query for async data handling
- Lucide icons and utility helpers in `src/lib`

## Getting Started

```bash
git clone https://github.com/dev687612/Bit_Craft_Explorer.git
cd Bit_Craft_Explorer/bit-craft-explorer
npm install
npm run dev
```

Open the provided local URL (default `http://localhost:5173`) to explore the app.

## Available Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – create a production build in `dist`
- `npm run preview` – preview the production build locally
- `npm run lint` – lint the project with ESLint

## Project Structure

- `src/pages` – top-level pages (Home, Algorithms, Compress, Learn, About, practice modules)
- `src/components` – navigation, theme toggle, and reusable UI elements
- `src/lib` – compression algorithms, utilities, and theme provider
- `public` – static assets
- `dist` – production build output (generated)

## License

This project is open-source under the MIT License. See `LICENSE` (or add one if needed).
