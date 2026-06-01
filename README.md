# tobygregg.com

Epic personal portfolio — dark space aesthetic, green/blue accents.

---

## File Structure

```
/
├── index.html              ← Home page
├── pages/
│   ├── latest.html         ← Blog/posts page
│   └── contact.html        ← Contact form
├── css/
│   ├── global.css          ← Shared styles, nav, footer, variables
│   ├── home.css            ← Home page styles
│   ├── latest.css          ← Latest page styles
│   └── contact.css         ← Contact page styles
├── js/
│   ├── components.js       ← ⭐ Edit nav + footer HERE for all pages
│   ├── global.js           ← Cursor, scroll reveal, tilt, magnetic
│   ├── hero-canvas.js      ← Particle network canvas
│   ├── home.js             ← Home page + latest preview
│   ├── latest.js           ← Blog posts, filter, modal, share
│   └── contact.js          ← Contact form submit
└── images/
    ├── posts/              ← Images for blog post HTML
    ├── toby-main.jpg       ← ⭐ Hero photo (portrait, 3:4 ratio ideal)
    ├── toby-about.jpg      ← ⭐ About section photo (candid)
    ├── toby-music.jpg      ← ⭐ Music section (guitar/studio)
    ├── toby-engineering.jpg← ⭐ Engineering (workshop/electronics)
    └── toby-video.jpg      ← ⭐ Videography (on-location/camera)
```

---

## Setup Steps

### 1. Add your images
Drop these into `/images/`:
- `toby-main.jpg` — hero portrait, roughly 3:4
- `toby-about.jpg` — casual/candid
- `toby-music.jpg` — guitar, studio, performing
- `toby-engineering.jpg` — electronics, desk, 3D printer
- `toby-video.jpg` — camera, on-location filming

### 2. Connect Google Sheets for blog posts

1. Create a Google Sheet with columns: `date`, `title`, `tag`, `html`
   - `tag` values: `Engineering`, `Music`, `Videography`, `Studies`, `Other`
   - `html` column: paste HTML for the post body (can include `<img>`, `<code>`, etc.)
2. File → Share → Publish to web → Sheet 1 → CSV → Publish
3. Copy the published CSV URL
4. Paste it into **both**:
   - `js/home.js` — line 5: `const SHEET_CSV_URL = '...'`
   - `js/latest.js` — line 5: `const SHEET_CSV_URL = '...'`

### 3. Set up Formspree (contact form)
1. Go to [formspree.io](https://formspree.io) and create a free form
2. Copy your form ID (looks like `xpwzabcd`)
3. Replace `YOUR_FORMSPREE_ID` in `pages/contact.html`

### 4. Update social links
All social links are in `js/components.js` (nav/footer) and in the HTML files.
Search for `PLACEHOLDER` to find Spotify/YouTube links to update.

### 5. Update LinkedIn/GitHub URLs
Search for `tobygregg` across all files and update with your actual usernames.

---

## Editing Nav & Footer

Edit **`js/components.js`** only — changes apply to all 3 pages automatically.

---

## Blog Post HTML Tips

In your Google Sheet `html` column, you can use:
```html
<h2>My heading</h2>
<p>Paragraph text here.</p>
<img src="/images/posts/my-image.jpg" alt="description">
<code>inline code</code>
<pre><code>code block</code></pre>
<a href="https://example.com">link</a>
<blockquote>quoted text</blockquote>
```

Store images referenced in posts in `/images/posts/`.

---

## GitHub Pages Deploy

Push to GitHub → Settings → Pages → Source: main branch, root `/`.
Your site will be live at `https://tobygregg.github.io` or your custom domain.
