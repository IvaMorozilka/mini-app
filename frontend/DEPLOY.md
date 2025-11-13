# Deploying to GitHub Pages

This guide will help you deploy your Next.js static site to GitHub Pages.

## Important Note

✅ **Static generation is working!** The build successfully generates 145 static HTML pages, including all dynamic routes (`/category/[slug]` and `/service/[slug]`). All pages are pre-rendered at build time, so your site will load fast on GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your repository pushed to GitHub (or Gitverse, which can be synced to GitHub)

## Step 1: Configure GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

## Step 2: Update Repository Name (if needed)

If your repository is NOT at the root of GitHub Pages (e.g., `username.github.io`), you need to update the base path:

1. Open `frontend/next.config.ts`
2. Uncomment and update the `basePath` and `assetPrefix` lines:
   ```typescript
   basePath: '/your-repo-name',
   assetPrefix: '/your-repo-name',
   ```
3. Replace `your-repo-name` with your actual repository name

## Step 3: Push to GitHub

1. Make sure all your changes are committed:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   ```

2. If your repo is on Gitverse, you can either:
   - Push to GitHub directly
   - Or sync your Gitverse repo to GitHub

3. Push to the `main` branch:
   ```bash
   git push origin main
   ```

## Step 4: Deploy

1. The GitHub Actions workflow will automatically run when you push to `main`
2. Go to the **Actions** tab in your GitHub repository
3. Wait for the workflow to complete (it will build and deploy your site)
4. Once complete, your site will be available at:
   - `https://yourusername.github.io/your-repo-name/` (if using basePath)
   - `https://yourusername.github.io/` (if repository is `username.github.io`)

## How It Works

- ✅ The static export generates HTML files for **all routes** (145 pages total)
- ✅ All category pages (`/category/[slug]`) are pre-generated
- ✅ All service pages (`/service/[slug]`) are pre-generated
- ✅ The app uses Next.js client-side routing for smooth navigation
- ✅ The `404.html` file provides a fallback for any unmatched routes

## Manual Build (Optional)

If you want to test the build locally before deploying:

```bash
cd frontend
npm run build
```

The static files will be in the `frontend/out` directory. You can test it locally with a static file server:

```bash
npx serve frontend/out
```

## Troubleshooting

### 404 Errors

- All routes are pre-generated, so 404s should be rare
- If you see 404s, check that the build completed successfully
- The `404.html` file provides a fallback

### Assets Not Loading

- Check that `assetPrefix` matches your `basePath` (if using basePath)
- Ensure all asset paths are relative
- Verify the build output in `frontend/out` directory

### Build Fails

- Check the GitHub Actions logs for specific errors
- Make sure all dependencies are in `package.json`
- Verify Node.js version (should be 20.x)
- Ensure `data.json` is present in `frontend/lib/`

### Pages Not Loading

- All pages are pre-generated, so they should load directly
- Check the browser console for any JavaScript errors
- Verify that the GitHub Pages deployment completed successfully
