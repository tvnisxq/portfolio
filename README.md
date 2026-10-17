# tanishq: portfolio

Next.js 16 + TypeScript, plain CSS. Blog posts are Markdown files. No database.

## Run locally

    npm install
    npm run dev

Open http://localhost:3000

## Edit

| What | Where |
| --- | --- |
| Name, social links, YouTube channel ID, projects | `lib/site.ts` |
| Blog posts | `content/posts/*.md` (frontmatter: `title`, `date`, `summary`) |
| Colors and fonts | top of `app/globals.css` |

## Your photo

Save a photo as `public/me.jpg` (or `.png` / `.webp`). It appears on the screen of the chrome TV in the
about section. The screen is landscape, so use a photo with your face near the center; it is cropped to
fit. Around 800px wide and under 200 KB is plenty. Until you add one, the TV shows "no signal".

## Resume

Save your resume as `public/resume.pdf`. The "resume" link on the home page opens `/resume`, which
shows it in the browser with an "open in new tab" link and a "download" button. Replace the file and
redeploy to update it.

## YouTube

Latest videos come from your channel's public RSS feed. No API key. It refreshes hourly.

## Instagram reels

Instagram has no public feed, so there are two modes.

**Manual (default).** Add entries to `data/reels.json` and save the thumbnails in `public/reels/`:

    [
      { "url": "https://www.instagram.com/reel/XXXXXXXXXXX/", "thumbnail": "/reels/one.jpg", "title": "optional caption" }
    ]

**Automatic.** Needs an Instagram Business or Creator account. Create a Meta app, add the Instagram
API with Instagram Login, generate a long-lived token, and set it as `INSTAGRAM_ACCESS_TOKEN`.
The token expires after 60 days; refresh it before then with
`GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<token>`.
If the call fails, the site falls back to `data/reels.json`.

## Deploy on Vercel

1. Push this folder to a new GitHub repo.
2. Go to vercel.com, choose "Add New Project", and import the repo.
3. (Optional) Add `INSTAGRAM_ACCESS_TOKEN` under Environment Variables.
4. Deploy. Every push to `main` redeploys. Add a custom domain under Settings, Domains.
