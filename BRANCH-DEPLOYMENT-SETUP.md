# Branch-to-URL Deployment Configuration

## Overview

This document explains how to connect your Git branches to the correct Cloudflare Pages URLs:

- **Master branch** → `https://noamba.komapc.workers.dev/` (Production)
- **Staging branch** → `https://staging-amba.komapc.workers.dev/` (Staging)

## Current Configuration Status

### ✅ Fixed Issues:
1. **Environment Detection**: Updated to recognize `staging-amba.komapc.workers.dev`
2. **Wrangler Configs**: Created separate configs for staging and production
3. **Deployment Scripts**: Updated package.json with correct project names
4. **Documentation**: Updated all references to use correct domain names

### 📁 Files Created/Modified:
- `wrangler.production.toml` - Production deployment config
- `wrangler.staging.toml` - Staging deployment config
- `src/script.js` - Updated environment detection logic
- `package.json` - Updated deployment scripts
- `STAGING-SETUP.md` - Updated with correct domain names

## Cloudflare Pages Setup

### 1. Production Project (Master Branch)

**Project Name**: `noamba`
**Branch**: `master`
**Custom Domain**: `noamba.komapc.workers.dev`

**Setup Steps:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Create new project: `noamba`
3. Connect to Git repository: `komapc/noamba`
4. Select branch: `master`
5. Build settings:
   - Build command: `echo "Static site - no build required"`
   - Build output directory: `src`
   - Root directory: `/` (empty)
6. Custom domain: `noamba.komapc.workers.dev`

### 2. Staging Project (Staging Branch)

**Project Name**: `staging-amba`
**Branch**: `staging`
**Custom Domain**: `staging-amba.komapc.workers.dev`

**Setup Steps:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Create new project: `staging-amba`
3. Connect to Git repository: `komapc/noamba`
4. Select branch: `staging`
5. Build settings:
   - Build command: `echo "Static site - no build required"`
   - Build output directory: `src`
   - Root directory: `/` (empty)
6. Custom domain: `staging-amba.komapc.workers.dev`

## DNS Configuration

### Required DNS Records

In your Cloudflare DNS settings for `komapc.workers.dev`:

1. **Production**:
   - Type: CNAME
   - Name: `noamba`
   - Target: `noamba.pages.dev`
   - Proxy: ✅ Enabled

2. **Staging**:
   - Type: CNAME
   - Name: `staging-amba`
   - Target: `staging-amba.pages.dev`
   - Proxy: ✅ Enabled

## Deployment Commands

### Using NPM Scripts

```bash
# Deploy staging branch to staging URL
npm run deploy:staging

# Deploy master branch to production URL
npm run deploy:production
```

### Using Wrangler CLI

```bash
# Deploy to staging
wrangler pages deploy src --config wrangler.staging.toml --project-name staging-amba

# Deploy to production
wrangler pages deploy src --config wrangler.production.toml --project-name noamba
```

## Environment Detection

The application automatically detects the environment based on the URL:

### Production Environment
- **URL**: `https://noamba.komapc.workers.dev/`
- **Detection**: `window.location.hostname.includes('noamba.komapc.workers.dev')`
- **Visual**: No staging badge
- **Console**: "🚀 Running in PRODUCTION environment"

### Staging Environment
- **URL**: `https://staging-amba.komapc.workers.dev/`
- **Detection**: `window.location.hostname.includes('staging-amba')`
- **Visual**: Orange `[STAGING]` badge in header
- **Console**: "🔧 Running in STAGING environment"

## Testing the Setup

### Test Production
```bash
curl -I https://noamba.komapc.workers.dev
# Should return 200 OK
# No staging badge visible
```

### Test Staging
```bash
curl -I https://staging-amba.komapc.workers.dev
# Should return 200 OK
# Orange [STAGING] badge visible
```

## Workflow

### Development Workflow
1. **Feature Development**: Work on `staging` branch
2. **Test on Staging**: Deploy to `staging-amba.komapc.workers.dev`
3. **Review & Test**: Verify functionality on staging URL
4. **Merge to Master**: When ready, merge `staging` → `master`
5. **Production Deploy**: Master branch auto-deploys to `noamba.komapc.workers.dev`

### Manual Deployment
```bash
# Switch to staging branch
git checkout staging
npm run deploy:staging

# Switch to master branch
git checkout master
npm run deploy:production
```

## Troubleshooting

### Common Issues

1. **Environment Detection Not Working**
   - Check browser console for environment logs
   - Verify hostname matches expected patterns
   - Test with `window.location.hostname` in console

2. **Staging Badge Not Showing**
   - Ensure URL contains `staging-amba`
   - Check if `EnvironmentManager.init()` is called
   - Verify `#environmentIndicator` element exists

3. **Deployment Fails**
   - Check Cloudflare API token is set
   - Verify project names match Cloudflare Pages projects
   - Ensure correct branch is checked out

4. **DNS Issues**
   - Wait for DNS propagation (up to 24 hours)
   - Verify CNAME records point to correct targets
   - Check Cloudflare proxy is enabled (orange cloud)

## Verification Checklist

- [ ] Production URL: `https://noamba.komapc.workers.dev/` works
- [ ] Staging URL: `https://staging-amba.komapc.workers.dev/` works
- [ ] Staging shows orange `[STAGING]` badge
- [ ] Production shows no staging badge
- [ ] Console logs show correct environment
- [ ] Both URLs serve the same application
- [ ] DNS records are properly configured
- [ ] Cloudflare Pages projects are connected to correct branches
