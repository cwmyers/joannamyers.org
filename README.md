# joannamyers.org — Colours of my life

Static site for Joanna Myers' blog, migrated from Blogger. Built with
[Eleventy](https://www.11ty.dev), hosted free on **GitHub Pages**, with an
in-site publishing UI (**Decap CMS**) that works from an iPad, and Google
Analytics tracking.

## Writing a post from an iPad (no computer needed)

1. Open **https://www.joannamyers.org/admin/** in Safari and log in with the
   GitHub account that has write access to this repo.
2. Click **Blog Posts → New Post**, write in the editor (it supports bold,
   headings, links, images, etc.), set the title and date.
3. Click **Publish**. The site rebuilds automatically and is live in ~1 minute.

Images can be uploaded directly in the editor and are stored in `src/images/`.

## Local development

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # outputs to _site/
```

## Site structure

```
src/
  posts/            # all blog posts (migrated from Blogger)
  images/           # uploaded images
  admin/            # Decap CMS editor
  _includes/        # templates (base, post)
  css/style.css     # all styling
  index.njk         # homepage (latest posts)
  archive.njk       # full archive by year
  about.md          # about page (CMS-editable)
  feed.njk          # RSS feed -> /feed.xml
```

Post URLs keep the original Blogger format (`/YYYY/MM/slug.html`) so all
existing links keep working. New posts get the same format automatically.

## Deploying

Automatic: any push to `main` triggers the GitHub Action in
`.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

## Setup checklist (one-time)

- [ ] **Repo**: push this repo to GitHub, e.g. `chris/joannamyers.org`, on branch `main`.
- [ ] **Pages**: in the repo, Settings → Pages → Source: **GitHub Actions**.
- [ ] **CMS backend**: edit `src/admin/config.yml`:
  - set `repo: chris/joannamyers.org`
  - create a GitHub OAuth App: Settings → Developer settings → OAuth Apps → New.
    - Homepage URL: `https://www.joannamyers.org`
    - Authorization callback URL: `https://www.joannamyers.org/admin/`
    - **Enable PKCE** ("Device Flow" not needed; tick PKCE if shown)
    - Paste the Client ID into `app_id:` (no client secret required with PKCE).
- [ ] **DNS** (at the domain registrar):
  - `CNAME` record: `www` → `chris.github.io` (or the Pages URL shown in repo settings)
  - `A` records for the apex `@` → `185.199.108.153`, `185.199.109.153`,
    `185.199.110.153`, `185.199.111.153`
  - In repo Settings → Pages, set custom domain to `www.joannamyers.org`
    and enable **Enforce HTTPS** once the certificate is issued.
- [ ] **Analytics**: already wired to Google Analytics property `G-CG83VJCL75`
  (the same GA4 property the blog used on Blogger — no changes needed).

## Migrating posts (already done)

`scripts/migrate-blogger.py` pulls all posts from the Blogger Atom feed and
writes them under `src/posts/`. It's idempotent and only needed if Blogger
content changed after the initial migration.
