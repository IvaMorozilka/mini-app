# Quick Start: Deploy to GitHub Pages

## ✅ What's Already Done

1. ✅ Next.js configured for static export (`output: 'export'`)
2. ✅ All 145 pages pre-generated (including dynamic routes)
3. ✅ GitHub Actions workflow created (`.github/workflows/deploy.yml`)
4. ✅ Build tested and working

## 🚀 Next Steps

### 1. Push to GitHub

If your repository is on Gitverse, you need to push it to GitHub:

```bash
# Add GitHub remote (replace with your GitHub repo URL)
git remote add github https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push github main
```

Or if you want to replace the Gitverse remote:

```bash
# Remove Gitverse remote (if needed)
git remote remove origin

# Add GitHub remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

### 3. Update Base Path (if needed)

**Only if your repository is NOT `username.github.io`:**

1. Open `frontend/next.config.ts`
2. Uncomment and update these lines:
   ```typescript
   basePath: '/your-repo-name',
   assetPrefix: '/your-repo-name',
   ```
3. Replace `your-repo-name` with your actual repository name
4. Commit and push:
   ```bash
   git add frontend/next.config.ts
   git commit -m "Update basePath for GitHub Pages"
   git push
   ```

### 4. Deploy

1. The GitHub Actions workflow will run automatically when you push
2. Go to the **Actions** tab in your repository
3. Wait for the workflow to complete (usually 2-3 minutes)
4. Your site will be live at:
   - `https://yourusername.github.io/your-repo-name/` (if using basePath)
   - `https://yourusername.github.io/` (if repo is `username.github.io`)

## 📝 What Gets Generated

The build creates **145 static HTML pages**:
- 1 home page (`/`)
- 1 chat page (`/chat`)
- 1 profile page (`/profile`)
- 9 category pages (`/category/[slug]`)
- 130+ service pages (`/service/[slug]`)

All pages are pre-rendered, so they load instantly!

## 🔍 Verify Build Locally

Test the static build before deploying:

```bash
cd frontend
npm run build
npx serve out
```

Then visit `http://localhost:3000` to see your static site.

## 📚 More Details

See `DEPLOY.md` for detailed troubleshooting and advanced configuration.

