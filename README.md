# AngloEdge

Intelligence for UK capital markets. A Stratechery-inspired written publication architected to grow into a broader intelligence platform.

**Live at:** [angloedge.com](https://angloedge.com)  
**X:** [@angloedgee](https://x.com/angloedgee)

---

## 🏗️ Tech Stack

- **Framework:** [Astro 4](https://astro.build/) — static site generation
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) — utility-first CSS
- **Content:** Markdown-based content collections
- **Deployment:** [Netlify](https://netlify.com/)
- **Fonts:** Source Serif Pro (headings), Inter (UI)

---

## 📁 Folder Structure

```
angloedge/
├── public/                    # Static assets
│   └── logo.svg              # AngloEdge logo (used in header & favicon)
├── src/
│   ├── content/              # Content collections
│   │   ├── briefings/        # Daily briefing markdown files
│   │   │   ├── 2026-04-13-gilt-yields-surge.md
│   │   │   ├── 2026-04-12-ftse-250-ma.md
│   │   │   └── 2026-04-11-fca-crypto-crackdown.md
│   │   ├── research/         # Future: deeper research reports (.gitkeep)
│   │   ├── data/             # Future: datasets (.gitkeep)
│   │   └── config.ts         # Content collection schema definitions
│   ├── components/           # Reusable Astro components
│   │   ├── CookieConsent.astro  # GDPR cookie banner
│   │   ├── SpaceEmbed.astro     # X Spaces embed
│   │   └── TweetEmbed.astro     # X Tweet embed
│   ├── layouts/              # Page layouts
│   │   ├── Base.astro        # Main layout (header, nav, footer)
│   │   └── Briefing.astro    # Individual briefing page layout
│   ├── pages/                # Routes
│   │   ├── index.astro       # Homepage (latest briefing + archive)
│   │   ├── about.astro       # About page (mission, team, approach)
│   │   ├── services.astro    # Services page (research, speaking, advisory)
│   │   ├── contact.astro     # Contact form (Netlify Forms integration)
│   │   ├── privacy.astro     # Privacy policy (GDPR-compliant)
│   │   ├── briefings/
│   │   │   └── [slug].astro  # Dynamic briefing pages
│   │   └── rss.xml.ts        # RSS feed generation
│   ├── styles/
│   │   └── global.css        # Global styles (Tailwind imports)
│   └── env.d.ts              # TypeScript type definitions (auto-generated)
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── postcss.config.mjs        # PostCSS configuration
├── netlify.toml              # Netlify deployment config
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Installation

```bash
cd /Users/nicosey/projects/angloedge
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:4321/`

### Building for Production

```bash
npm run build
```

Output is generated in the `dist/` directory.

---

## ✍️ Adding New Briefings

Briefings are stored in `src/content/briefings/` as Markdown files.

### Creating a New Briefing

1. Create a new file: `src/content/briefings/YYYY-MM-DD-slug.md`
2. Use this template:

```markdown
---
title: "Your Briefing Title"
description: "Short one-sentence summary of the article."
pubDate: 2026-04-15
author: "AngloEdge"
tags: ["Tag1", "Tag2", "Tag3"]
---

Your article content here in Markdown format.

## Heading 2

Regular paragraph text.

### Heading 3

- Bullet point
- Another point
```

### Front Matter Fields

- **title** (required): Article headline
- **description** (required): One-sentence summary for homepage and RSS
- **pubDate** (required): Publication date (YYYY-MM-DD format)
- **author** (optional): Defaults to "AngloEdge"
- **tags** (optional): Array of tags for categorization
- **image** (optional): Featured image path

### Example: Embedding X Content

To embed an X Space or Tweet, use a link:

```markdown
## Community Insight

Listen to the latest discussions:
[Watch our latest Space →](https://x.com/angloedgee/spaces)
```

Component templates exist in `src/components/` if you need advanced usage:
- `SpaceEmbed.astro` — for X Spaces recordings
- `TweetEmbed.astro` — for embedded tweets

---

## 🎨 Design System

### Brand Colors

- **Navy:** `#0A2540` — Primary brand color
- **Brass/Gold:** `#B8956A` — Accent color
- **Background:** White (light) / `#0f172a` (dark)
- **Text:** Gray-900 (light) / Gray-100 (dark)

### Typography

- **Headlines:** Source Serif Pro (serif) — bold, tight line-height (1.4)
- **Body:** Source Serif Pro (serif) — readable, ~680px measure
- **UI:** Inter — headings, navigation, metadata

### Design Principles

- Restrained, editorial aesthetic (Stratechery / Financial Times)
- Generous whitespace and margins
- Serif body text for editorial credibility
- Narrow column width (~680px) for reading comfort
- British sensibility: understated, sophisticated

---

## 🛍️ Services & Commercialization

### About Page (`/about`)

Outlines AngloEdge's mission, approach, team background, and positioning. Links to contact form and X handle.

### Services Page (`/services`)

Lists three premium service offerings:

- **Market Research & Custom Reports** — £5,000–£25,000
  - Deep-dive research on specific sectors, regulatory regimes, market structures
  - 2–4 week turnaround

- **Speaking & Events** — Customized fees
  - Keynotes, boardroom sessions, investor roundtables
  - Tailored to audience and context

- **Bespoke Intelligence & Advisory** — £15,000+/quarter (minimum 3 months)
  - Ongoing intelligence subscriptions, market alerts, regulatory analysis
  - Customized workflows for M&A, macro, corporate treasury, hedge funds

Each service has a context-sensitive "Contact" button that pre-fills the contact form's enquiry type.

### Contact Form (`/contact`)

Netlify Forms integration (free tier) with:
- **Fields:** Name, Company/Organisation, Email, Enquiry Type, Message
- **Enquiry Types:** Custom Research, Speaking, Advisory/Retainer, General Inquiry, Media/Press
- **URL Pre-fill:** Visit `/contact?service=research` (or `speaking`/`advisory`) to pre-select the enquiry type

Form submissions are received and managed via Netlify dashboard.

---

## 🔒 GDPR & Privacy

### Cookie Consent Banner

- **Location:** Sticky footer on all pages
- **Behavior:** Displays after 500ms on first visit only
- **Storage:** Preference persists in localStorage (`angloedge_cookie_consent`)
- **Options:** Accept / Decline / Dismiss (Escape key)
- **Purpose:** GDPR-compliant consent before analytics tracking

### Privacy Policy (`/privacy`)

Comprehensive 2,000+ word policy covering:
- Data collection types (cookies, usage data, email)
- Use of data
- Cookie types (essential, analytics)
- Third-party services (Google Analytics, RSS feeds)
- User rights (access, erasure, rectification, opt-out)
- Data security (HTTPS encryption)
- GDPR compliance

**Note:** The analytics placeholder in `CookieConsent.astro` is ready for Google Analytics integration.

---

## 🧭 Navigation

Main navigation links (in header and throughout site):

- **Home** — Homepage with latest briefing hero and archive
- **Briefings** — Anchor link to briefing archive on homepage
- **About** — Mission, team, approach
- **Services** — Premium offerings (research, speaking, advisory)
- **Contact** — Contact form for inquiries

Logo links back to homepage.

---

The RSS feed is available at `/rss.xml` and is automatically generated from all briefings in the `src/content/briefings/` collection.

- Feed title: AngloEdge
- Description: Intelligence for UK capital markets
- Language: en-gb
- Updated: On rebuild (Netlify redeploys after content updates)

Subscribe: `https://angloedge.com/rss.xml`

---

## 🔍 SEO & Metadata

Every page includes:

- **Open Graph tags** (og:title, og:description, og:image, og:url)
- **Twitter Card support** (@angloedgee as site handle)
- **Semantic HTML** with proper heading hierarchy
- **Canonical URLs** (via site configuration)
- **Readable dates** in British format (e.g., "13 April 2026")

---

## 📦 Future Content Types

The following content collections are scaffolded but empty:

### `src/content/research/`
For deeper, subscriber-only research reports and analysis pieces. Schema can be created similar to briefings.

### `src/content/data/`
For datasets, CSV exports, and data visualizations. Can include interactive screeners or dashboards.

---

## 🌐 Deploying to Netlify

### Prerequisites
- Netlify account (sign up at [netlify.com](https://netlify.com))
- GitHub repository with code pushed

### Steps

1. **Connect GitHub to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Authorize GitHub and select the `angloedge` repository

2. **Configure Site**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These are already configured in `netlify.toml`

3. **Set Environment Variables (if needed)**
   - Go to Site Settings → Build & Deploy → Environment
   - Add any API keys or secrets

4. **Deploy**
   - Push commits to `main` branch
   - Netlify automatically builds and deploys
   - Site will be available at `https://<your-site-name>.netlify.app`

5. **Custom Domain**
   - Go to Site Settings → Domain Management
   - Add your custom domain (e.g., angloedge.com)
   - Update DNS records at your registrar to point to Netlify

### Deployment Status

View deployment logs and history at: `https://app.netlify.com/sites/<your-site-name>`

---

## 🔧 Customization

### Update Site Info

Edit the following files:

- **Site URL:** `astro.config.mjs` — `site: 'https://angloedge.com'`
- **Brand:** `src/layouts/Base.astro` — Header and footer text
- **Brand Colors:** `tailwind.config.mjs` — Update navy/brass hex values
- **RSS Feed:** `src/pages/rss.xml.ts` — Feed metadata

### Add New Pages

Create new `.astro` files in `src/pages/`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Page Title" description="Page description">
  <div class="max-w-prose mx-auto px-6 py-12">
    {/* Your content */}
  </div>
</Base>
```

### Modify Styles

- **Global styles:** `src/styles/global.css`
- **Layout styles:** Inline `<style>` tags in `.astro` files
- **Tailwind config:** `tailwind.config.mjs` — extend colors, fonts, spacing

---

## 📝 Writing Tips

### Tone & Voice
- Expert analysis with accessible language
- Cite data and regulatory sources
- Use em-dashes (—) and British spelling
- Keep paragraphs short (2–3 sentences)

### Formatting
- Use `**bold**` for important terms or companies
- Use `*italics*` for emphasis
- Use `##` and `###` headings to structure content
- Lists (`-` or `1.`) for key points
- Blockquotes (`>`) for highlighted insights

### Example Briefing Structure
```
[Title]

[Opening paragraph with market context]

## [Key Topic 1]

[Analysis paragraph(s)]

## [Key Topic 2]

[Analysis paragraph(s)]

## What Matters This Week

- **Event 1** (Date): Context
- **Event 2** (Date): Context

## Positioning / Outlook

[Closing analysis with actionable insight]
```

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
rm -rf node_modules .astro
npm install
npm run dev
```

### Changes not showing
- Astro has hot module reloading. Changes should reflect immediately.
- If not, restart the dev server.
- Check browser cache (Cmd+Shift+R on macOS).

### Build fails
```bash
npm run build
# Check dist/ folder for errors
```

---

## 📜 License

AngloEdge content is copyright. See individual briefings for attribution.

---

## 🙋 Support

For questions or feature requests, contact [@angloedgee](https://x.com/angloedgee) on X.
