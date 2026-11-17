# Sanjay Krishna K — Portfolio

**Stack**: React · Vite · TypeScript · Tailwind CSS · Framer Motion · Remotion · HyperFrames

## Run it

```sh
npm install
npm run dev          # http://localhost:8080
```

## Editing content

All text lives in [`src/data/portfolio.ts`](src/data/portfolio.ts): profile, projects, experience and skills.

- **Résumé link**: put `resume.pdf` in `public/` and set `profile.resume = "resume.pdf"`.

## Project animations (Remotion)

The animated panels next to each featured project are Remotion compositions in
[`src/remotion/compositions.tsx`](src/remotion/compositions.tsx), played in the page with `@remotion/player`.
They are drawn in code (the ARCEUX Control one runs a real A* search) and only play while visible.

## Showreel video (HyperFrames)

The hero video is a HyperFrames composition in [`video/showreel/index.html`](video/showreel/index.html).
To change and re-render it (needs Node 22+ and FFmpeg):

```sh
cd video/showreel
npm run check        # lint + layout checks
npm run render       # → showreel-1080.mp4
# compress for the web (the site loads public/showreel-720.mp4):
ffmpeg -i showreel-1080.mp4 -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an ../../public/showreel-720.mp4
ffmpeg -ss 1.9 -i showreel-1080.mp4 -frames:v 1 -vf scale=1280:-1 ../../public/showreel-poster.jpg
```

## Deploy to Vercel

The project is configured for Vercel in [`vercel.json`](vercel.json) (Vite preset, `npm ci`, output `dist`,
SPA fallback, long-term caching for hashed assets).

**Option A: from GitHub**
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repository and click **Deploy**.
   No settings need changing.

**Option B: from the terminal**
```sh
npx vercel          # first run links the project and creates a preview URL
npx vercel --prod   # production deploy
```

## Other hosting

```sh
npm run build        # outputs dist/, served from the domain root
npm run deploy       # GitHub Pages at /portfolio/ (builds with BASE_PATH=/portfolio/)
```
