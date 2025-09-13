# Automatic Deployment Setup

## Overview

This guide sets up automatic deployment to Cloudflare Pages when you push to specific branches:

- **Push to `master`** → Auto-deploy to `https://noamba.komapc.workers.dev/` (Production)
- **Push to `staging`** → Auto-deploy to `https://staging-amba.komapc.workers.dev/` (Staging)

## Cloudflare Pages Auto-Deploy Configuration

### 1. Production Project Setup (Master Branch)

**Project Name**: `noamba`
**Repository**: `komapc/noamba`
**Branch**: `master`

**Setup Steps:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your GitHub repository: `komapc/noamba`
5. Configure project:
   - **Project name**: `noamba`
   - **Production branch**: `master`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `src`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"
7. Set custom domain: `noamba.komapc.workers.dev`

### 2. Staging Project Setup (Staging Branch)

**Project Name**: `staging-amba`
**Repository**: `komapc/noamba`
**Branch**: `staging`

**Setup Steps:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your GitHub repository: `komapc/noamba`
5. Configure project:
   - **Project name**: `staging-amba`
   - **Production branch**: `staging`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `src`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"
7. Set custom domain: `staging-amba.komapc.workers.dev`

## Automatic Deployment Workflow

### How It Works

1. **Push to `staging` branch**:
   - Cloudflare Pages detects the push
   - Automatically builds and deploys to `staging-amba.komapc.workers.dev`
   - Shows `[STAGING]` badge in the UI

2. **Push to `master` branch**:
   - Cloudflare Pages detects the push
   - Automatically builds and deploys to `noamba.komapc.workers.dev`
   - No staging badge (production environment)

### Branch Protection (Recommended)

Set up branch protection rules in GitHub:

1. **Master Branch Protection**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators in protection rules

2. **Staging Branch**:
   - Allow direct pushes for testing
   - Require pull request reviews for major changes

## Development Workflow

### Feature Development Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/new-feature
   # Make your changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Test on Staging**:
   ```bash
   git checkout staging
   git merge feature/new-feature
   git push origin staging
   # Automatically deploys to staging-amba.komapc.workers.dev
   ```

3. **Deploy to Production**:
   ```bash
   git checkout master
   git merge staging
   git push origin master
   # Automatically deploys to noamba.komapc.workers.dev
   ```

### Hotfix Process

For urgent fixes directly to production:

```bash
git checkout master
git checkout -b hotfix/urgent-fix
# Make urgent changes
git add .
git commit -m "Hotfix: urgent fix"
git push origin hotfix/urgent-fix
# Create PR and merge to master
# Auto-deploys to production
```

## Environment Variables

### Production Environment Variables
In Cloudflare Pages dashboard for `noamba` project:
- `ENVIRONMENT=production`
- `NODE_ENV=production`

### Staging Environment Variables
In Cloudflare Pages dashboard for `staging-amba` project:
- `ENVIRONMENT=staging`
- `NODE_ENV=development`

## Build Configuration

### Build Settings for Both Projects

**Build Command**: `echo "Static site - no build required"`
**Build Output Directory**: `src`
**Root Directory**: `/` (empty)

### Build Triggers

- **Production**: Only builds on push to `master` branch
- **Staging**: Builds on push to `staging` branch
- **Preview**: Builds on any pull request (optional)

## Monitoring Deployments

### Cloudflare Pages Dashboard

1. Go to your project dashboard
2. Click on "Deployments" tab
3. View deployment history and status
4. Check build logs for any errors

### GitHub Integration

1. Go to your repository settings
2. Click "Webhooks"
3. Verify Cloudflare Pages webhook is configured
4. Check webhook delivery logs

## Troubleshooting

### Common Issues

1. **Deployment Not Triggered**
   - Check if webhook is properly configured
   - Verify branch names match exactly
   - Check GitHub repository permissions

2. **Build Failures**
   - Review build logs in Cloudflare Pages
   - Check if all files are committed
   - Verify build settings are correct

3. **Environment Detection Issues**
   - Check if custom domains are set correctly
   - Verify DNS records are pointing to right projects
   - Test environment detection in browser console

### Debugging Steps

1. **Check Deployment Status**:
   ```bash
   # Check recent commits
   git log --oneline -5
   
   # Check branch status
   git branch -v
   ```

2. **Verify Cloudflare Pages**:
   - Check project settings in dashboard
   - Review deployment logs
   - Test custom domains

3. **Test Environment Detection**:
   ```javascript
   // Open browser console on deployed site
   console.log('Hostname:', window.location.hostname);
   console.log('Is Staging:', window.location.hostname.includes('staging-amba'));
   console.log('Is Production:', window.location.hostname.includes('noamba.komapc.workers.dev'));
   ```

## Security Considerations

### Access Control

1. **Repository Access**:
   - Limit who can push to `master` branch
   - Require pull request reviews
   - Use branch protection rules

2. **Cloudflare Access**:
   - Limit who can modify Pages projects
   - Use Cloudflare Access for additional security
   - Monitor deployment logs

### Environment Separation

- **Staging**: Safe for testing, can be unstable
- **Production**: Stable, requires careful review
- **Clear separation**: Different domains and environments

## Verification Checklist

- [ ] Production project connected to `master` branch
- [ ] Staging project connected to `staging` branch
- [ ] Custom domains configured correctly
- [ ] DNS records pointing to right projects
- [ ] Environment variables set
- [ ] Branch protection rules configured
- [ ] Webhook integration working
- [ ] Test push to staging triggers deployment
- [ ] Test push to master triggers deployment
- [ ] Environment detection working on both URLs

## Quick Test

### Test Staging Auto-Deploy
```bash
git checkout staging
echo "<!-- Test comment -->" >> src/index.html
git add src/index.html
git commit -m "Test: staging auto-deploy"
git push origin staging
# Check https://staging-amba.komapc.workers.dev/ in a few minutes
```

### Test Production Auto-Deploy
```bash
git checkout master
echo "<!-- Test comment -->" >> src/index.html
git add src/index.html
git commit -m "Test: production auto-deploy"
git push origin master
# Check https://noamba.komapc.workers.dev/ in a few minutes
```

## Benefits of Auto-Deploy

1. **No Manual Steps**: Push to branch = automatic deployment
2. **Consistent Process**: Same deployment process every time
3. **Fast Feedback**: See changes live within minutes
4. **Rollback Easy**: Previous deployments available in dashboard
5. **Team Collaboration**: Everyone can deploy by pushing to correct branch
