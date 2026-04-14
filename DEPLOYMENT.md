# AngloEdge Deployment Checklist

Complete guide to taking your intelligence platform live.

---

## Pre-Launch Checklist

### Domain & Branding
- [ ] Register domain (e.g., angloedge.com)
- [ ] Update `astro.config.mjs` with your domain: `site: 'https://yourdomain.com'`
- [ ] Update `src/layouts/Base.astro` footer X handle if different from @angloedgee
- [ ] Verify logo `public/logo.svg` matches your brand
- [ ] Test dark mode toggle works correctly

### Content Preparation
- [ ] Review and finalize the 3 sample briefings (currently in `src/content/briefings/`)
- [ ] Replace with your own inaugural briefing content
- [ ] Add social media links and handles to footer
- [ ] Set up content calendar for future briefings

### Technical Setup
- [ ] GitHub repository created and code pushed
- [ ] Node.js 18+ installed locally
- [ ] `npm install` completed without errors
- [ ] `npm run dev` works locally (http://localhost:4321)
- [ ] `npm run build` completes successfully
- [ ] RSS feed validates at `/rss.xml`

### SEO & Analytics (Optional)
- [ ] Add Google Search Console verification
- [ ] Set up Google Analytics (add script to `src/layouts/Base.astro`)
- [ ] Verify Open Graph meta tags render correctly
- [ ] Test Twitter Card preview on x.com

---

## Netlify Deployment Steps

### 1. Create Netlify Account
- [ ] Sign up at [netlify.com](https://netlify.com)
- [ ] Authorize GitHub account

### 2. Deploy Site
1. Log in to Netlify dashboard
2. Click "New site from Git"
3. Select your GitHub repository
4. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `dist/`
   - (These are in `netlify.toml`, so should be automatic)
5. Click "Deploy site"

Netlify will automatically build and deploy within 2–5 minutes.

### 3. Connect Custom Domain
1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter your domain (e.g., `angloedge.com`)
4. Netlify will show you the DNS records to add at your registrar
5. Add the CNAME or A records to your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait 24–48 hours for DNS propagation
7. Enable automatic HTTPS (Netlify handles this)

### 4. Set Environment Variables (If Needed)
- Go to Site Settings → Build & Deploy → Environment
- Add any API keys, secrets, or config variables
- Netlify will inject these at build time

### 5. Configure Deployments
- Go to Site Settings → Build & Deploy → Deploy Contexts
- **Production**: Deploy from `main` branch
- **Preview**: Create PRs, Netlify will auto-preview changes
- **Branch deploys**: Optional, for staging environments

---

## Post-Launch

### Content Updates
Every time you push a new briefing:

```bash
# Create new article
echo '---
title: "Your Title"
description: "Summary"
pubDate: 2026-04-15
author: "AngloEdge"
tags: []
---

Article content...' > src/content/briefings/2026-04-15-slug.md

# Commit and push
git add src/content/
git commit -m "Add new briefing: Your Title"
git push origin main
```

Netlify will automatically:
1. Build the site
2. Generate new HTML + RSS feed
3. Deploy within 2–5 minutes
4. Make the post live at your domain

### Monitor
- Check Netlify dashboard for build status: app.netlify.com
- View access logs and analytics
- Monitor for any build failures (you'll get email alerts)

### Backups
- GitHub is your source of truth — all content is versioned
- Netlify retains deployment history
- Export RSS feed to archive if needed

---

## Growth Path

### Phase 1: Daily Briefings ✓ Complete
- Homepage with latest briefing
- Archive of posts
- RSS feed
- Dark/light mode
- Responsive design

### Phase 2: Research & Analysis
- Create `src/content/research/` markdown files
- Define schema in `src/content/config.ts` (similar to briefings)
- Create layout `src/layouts/Research.astro`
- Add `/research/[slug].astro` page route
- Optionally: paywall / subscriber-only gating

### Phase 3: Data & Screeners
- Use `src/content/data/` for datasets (CSV, JSON)
- Embed interactive visualizations using:
  - [TradingView lightweight-charts](https://tradingview.github.io/lightweight-charts/)
  - [Recharts](https://recharts.org/) for React components in Astro
  - Custom data tables with sorting/filtering
- Create dashboard pages

### Phase 4: Podcasts & Spaces
- Embed X Spaces recordings (already set up in `src/components/SpaceEmbed.astro`)
- Create `/podcast` section
- Add podcast RSS feed (use `@astrojs/rss` again)

### Phase 5: Community & Monetization
- Newsletter signup (Substack, ConvertKit embed)
- Subscriber-only notes (encrypted content or access control)
- Sponsor logos / ad placements
- Affiliate links for broker recommendations

---

## Troubleshooting Deployments

### Build Fails on Netlify
1. Check build logs at `app.netlify.com`
2. Common issues:
   - Node version mismatch: Set `NODE_VERSION` environment variable
   - Missing dependencies: Run `npm install` locally and push `package-lock.json`
   - TypeScript errors: Run `npm run build` locally to debug

### Site Returns 404
- Verify DNS records propagated: `nslookup yourdomain.com`
- Check Netlify domain assignment: Site Settings → Domain Management
- Clear browser cache (Cmd+Shift+R)

### RSS Feed Not Updating
- Rebuild the site: Site Settings → Build & Deploy → Trigger deploy
- Check RSS feed validation: [feedvalidator.org](https://feedvalidator.org)
- Verify all briefing files have valid frontmatter

---

## Security Notes

- **Environment Variables**: Never commit `.env.local` or secrets
- **HTTPS**: Netlify auto-enables — always enabled by default
- **Rate Limiting**: Netlify includes DDoS protection
- **Backups**: GitHub is version-controlled; Netlify has 24-month history

---

## Support & Resources

- **Astro Docs**: https://docs.astro.build
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Markdown Guide**: https://commonmark.org/help/
- **RSS Spec**: https://www.rssboard.org/rss-specification

---

## Quick Commands Reference

```bash
# Local development
npm run dev              # Start dev server (http://localhost:4321)
npm run build            # Build for production
npm run preview          # Preview production build locally

# Deployment
git add .
git commit -m "Briefing: Your Title"
git push origin main     # Netlify auto-builds and deploys

# Maintenance
npm update               # Update dependencies
npm audit fix            # Fix security vulnerabilities
```

---

## Next Steps

1. **Update brand assets**
   - Replace `public/logo.svg` with your final logo
   - Update colors in `tailwind.config.mjs` if different from navy/brass

2. **Finalize content**
   - Review/replace the 3 sample briefings
   - Write your launch briefing

3. **Set up GitHub**
   - Push the code to your GitHub repository
   - Ensure main branch is up-to-date

4. **Deploy to Netlify**
   - Follow the Netlify Deployment Steps above
   - Connect your custom domain

5. **Test everything**
   - Verify all pages load
   - Test dark mode toggle
   - Check RSS feed
   - Validate Open Graph tags with Twitter/Facebook preview tools

6. **Launch**
   - Announce via X (@angloedgee)
   - Share on relevant finance/tech communities
   - Submit RSS feed to podcast directories (if you add audio)

---

**AngloEdge is now ready to scale.** Focus on consistent, high-quality content. The platform will grow with you.

Good luck! 🚀
