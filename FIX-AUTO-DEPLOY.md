# Fix Automatic Deployment Setup

## Problem Identified

The current Cloudflare Pages projects were created manually without Git integration, which is why automatic deployment from Git pushes isn't working.

**Current Status:**
- `staging-amba` project: No Git Provider
- `noamba` project: No Git Provider

## Solution: Set Up Git Integration

### Option 1: Recreate Projects with Git Integration (Recommended)

#### 1. Delete Existing Projects
```bash
# Delete the manually created projects
wrangler pages project delete staging-amba
wrangler pages project delete noamba
```

#### 2. Create New Projects with Git Integration

**For Staging:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your GitHub repository: `komapc/noamba`
5. Configure:
   - **Project name**: `staging-amba`
   - **Production branch**: `staging`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `src`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"

**For Production:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your GitHub repository: `komapc/noamba`
5. Configure:
   - **Project name**: `noamba`
   - **Production branch**: `master`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `src`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"

### Option 2: Use Wrangler CLI (Alternative)

If you prefer CLI setup, you can use the `wrangler pages project create` command with Git integration, but the dashboard method is more reliable for Git setup.

## Verification Steps

### 1. Check Git Integration
After setup, verify that projects show Git Provider:
```bash
wrangler pages project list
```

Should show:
```
│ staging-amba │ staging-amba.pages.dev │ GitHub      │ ... │
│ noamba       │ noamba.pages.dev       │ GitHub      │ ... │
```

### 2. Test Automatic Deployment

**Test Staging:**
```bash
# Make a small change
echo "<!-- Test auto-deploy -->" >> src/index.html
git add src/index.html
git commit -m "Test: automatic deployment"
git push origin staging
# Should automatically deploy to staging-amba.pages.dev
```

**Test Production:**
```bash
git checkout master
git merge staging
git push origin master
# Should automatically deploy to noamba.pages.dev
```

### 3. Monitor Deployments

Check deployment status:
```bash
# Check staging deployments
wrangler pages deployment list --project-name staging-amba

# Check production deployments
wrangler pages deployment list --project-name noamba
```

## Expected Workflow After Fix

### Development Workflow
1. **Work on staging branch**:
   ```bash
   git checkout staging
   # Make changes
   git add .
   git commit -m "Feature: new feature"
   git push origin staging
   # Automatically deploys to staging-amba.pages.dev
   ```

2. **Deploy to production**:
   ```bash
   git checkout master
   git merge staging
   git push origin master
   # Automatically deploys to noamba.pages.dev
   ```

### Benefits of Git Integration
- **Automatic deployment** on every push
- **Build logs** and deployment history
- **Rollback capability** to previous deployments
- **Preview deployments** for pull requests
- **Environment variables** management
- **Custom domains** configuration

## Troubleshooting

### If Git Integration Still Doesn't Work

1. **Check GitHub Permissions**:
   - Ensure Cloudflare has access to your repository
   - Check if the repository is private (may need special permissions)

2. **Verify Webhook**:
   - Go to GitHub repository settings
   - Check "Webhooks" section
   - Should see Cloudflare Pages webhook

3. **Check Build Settings**:
   - Ensure build command is correct
   - Verify output directory is `src`
   - Check that root directory is empty

4. **Manual Deployment Fallback**:
   ```bash
   # If auto-deploy fails, use manual deployment
   npm run deploy:staging
   npm run deploy:production
   ```

## Current Manual Deployment Commands

Until Git integration is fixed, you can use these commands:

```bash
# Deploy staging
npm run deploy:staging

# Deploy production  
npm run deploy:production
```

## Next Steps

1. **Set up Git integration** using the dashboard method above
2. **Test automatic deployment** with a small change
3. **Configure custom domains** for both environments
4. **Set up environment variables** if needed
5. **Monitor deployment logs** for any issues

This will give you true automatic deployment where every push to the respective branches automatically updates the live sites.
