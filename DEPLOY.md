# How to Upload / Deploy Your Newest Landing Page & Front Page

Your project is a **Vite + React** app. Here’s how to get your latest edits (including the landing page and front page) live.

---

## Option 1: Push to Git (recommended)

If your site is connected to **GitHub** (e.g. via Lovable, Vercel, or Netlify), pushing your branch usually triggers a new deploy.

### 1. Save your work

- Save all files (including `src/pages/Index.tsx` for the landing page and any other pages you edited).

### 2. Pull latest, then push

Your local branch is behind `origin/main` by a few commits. Update first, then push:

```powershell
cd C:\Users\C-R\lovable

# Get latest from remote (keeps others’ changes)
git pull origin main

# Stage your changes (landing page, front page, and everything else)
git add .

# Commit with a clear message
git commit -m "Update landing page and front page + export/history/API keys"

# Upload to remote
git push origin main
```

After the push, your hosting (Lovable, Vercel, Netlify, etc.) will build and deploy the new version.

---

## Option 2: Build and preview locally

To test the production build (including your newest landing/front page) on your machine:

```powershell
cd C:\Users\C-R\lovable
npm run build
npm run preview
```

Then open the URL shown (e.g. `http://localhost:4173`) to see the built site.

---

## Option 3: Deploy to a host manually

1. Build:

   ```powershell
   npm run build
   ```

2. Upload the **`dist`** folder to your host:
   - **Vercel**: Connect the repo and push; or drag-and-drop the `dist` folder in the Vercel dashboard.
   - **Netlify**: Same idea — connect repo or upload `dist`.
   - **Lovable**: Push to the linked Git repo; Lovable will build and deploy.

---

## Quick reference

| Goal                         | Command / action                          |
|-----------------------------|-------------------------------------------|
| Save and upload everything | `git add .` → `git commit -m "..."` → `git push origin main` |
| Get latest from remote     | `git pull origin main`                    |
| Test production build      | `npm run build` then `npm run preview`   |

Your **landing page** is `src/pages/Index.tsx`. Any changes there (and in other pages) are included when you commit and push or when you build and deploy the `dist` folder.
