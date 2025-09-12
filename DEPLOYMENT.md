# Cloudflare Pages Deployment Guide

## Staging Environment Setup

### Method 1: Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Pages Dashboard**
   - Visit: https://dash.cloudflare.com/pages
   - Click "Create a project"

2. **Connect Repository**
   - Choose "Connect to Git"
   - Select your GitHub repository: `komapc/noamba`
   - Choose branch: `staging`

3. **Configure Build Settings**
   - Project name: `noamba-static-staging`
   - Build command: `echo "Static site - no build required"`
   - Build output directory: `/src`
   - Root directory: `/` (leave empty)

4. **Environment Variables**
   - Add environment variable: `ENVIRONMENT=staging`

5. **Deploy**
   - Click "Save and Deploy"
   - Your staging site will be available at: `https://noamba-static-staging.pages.dev`

### Method 2: Wrangler CLI (Alternative)

1. **Authenticate**
   ```bash
   wrangler login
   # Complete OAuth in browser
   ```

2. **Deploy Staging**
   ```bash
   npm run deploy:staging
   ```

3. **Deploy Production**
   ```bash
   npm run deploy:production
   ```

## Environment Detection

The app automatically detects environments:

- **Staging**: Shows `[STAGING]` badge, logs "🔧 Running in STAGING environment"
- **Production**: Logs "🚀 Running in PRODUCTION environment"  
- **Local**: Logs "💻 Running in LOCAL/DEVELOPMENT environment"

## URLs

- **Staging**: `https://noamba-static-staging.pages.dev`
- **Production**: `https://noamba-static-prod.pages.dev`
- **Local with staging mode**: `http://localhost:8000/?staging=true`

## Testing Staging

1. Deploy to staging using Method 1 above
2. Visit the staging URL
3. Verify the `[STAGING]` orange badge appears in the header
4. Check browser console for environment logs
5. Test all functionality before promoting to production

## Production Deployment

Once staging is tested:

1. Create another project: `noamba-static-prod`
2. Use same settings but with `ENVIRONMENT=production`
3. Deploy from `master` branch for production releases
