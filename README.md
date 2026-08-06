# koind website

A static, framework-free website (plain HTML/CSS/JS) showcasing the koind Korean-through-Hindi course. No build step, no npm — just open `index.html` in a browser.

## Pages
- `index.html` — home, with an animated Hangul syllable-block hero and a live lesson preview
- `chapters.html` — all 10 chapters / 21 lessons, expandable
- `vocabulary.html` — all 15 categories / 751 words, searchable + filterable
- `grammar.html` — all 14 grammar lessons with simple/medium/complex examples and a working 5-question practice quiz per lesson
- `sentences.html` — 23 daily-use sentences across 5 situations
- `contact.html` — contact form (opens the visitor's email client via `mailto:`) — **the email address and info in this file are placeholders**, swap them for your real details

## To view it
Just double-click `index.html` — everything runs client-side. Fonts load from Google Fonts over the internet, so an internet connection is needed for those (the content itself is all local).

## To host it
Any static host works — no server-side code, no database, no payment system:
- Drag the folder into **Netlify Drop** (netlify.com/drop)
- **GitHub Pages**: push this folder to a repo, enable Pages
- **Vercel**, **Cloudflare Pages**, or any basic web host

## Before going live
1. Open `contact.html` and replace the placeholder email/phone/location/social with your real details (search for `placeholder-tag` and `TODO` in that file).
2. Update the `mailto:` address inside the `<script>` at the bottom of `contact.html`.

## Content
All chapters, vocabulary, grammar explanations, examples, and quiz questions in `js/data.js` were written from scratch for this project — none of it is copied from any book or external source.
