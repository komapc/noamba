# Staging Environment Setup Guide

## Domain-Based Staging Configuration

This project now uses **domain-based environment detection** instead of URL parameters.

### Environment Detection

**Production Environment:**
- **Domain**: `noamba.komapc.workers.dev`
- **Detection**: `window.location.hostname.includes('noamba.komapc.workers.dev')`
- **Visual**: No staging badge

**Staging Environment:**
- **Domain**: `staging-amba.komapc.workers.dev` (current)
- **Alternative**: `preview.noamba.komapc.workers.dev`
- **Detection**: `window.location.hostname.includes('staging-amba')` or `window.location.hostname.includes('preview.')`
- **Visual**: Orange `[STAGING]` badge in header

## Setup Steps

### 1. Create Staging Subdomain

In Cloudflare Dashboard:

1. **Go to**: DNS Settings for `komapc.workers.dev`
2. **Add CNAME Record**:
   - **Name**: `staging-amba`
   - **Target**: `noamba.komapc.workers.dev`
   - **Proxy**: ✅ Enabled (orange cloud)

### 2. Deploy to Both Environments

**Production Deployment:**
- Deploy to `noamba.komapc.workers.dev`
- Environment: Production
- No staging badge

**Staging Deployment:**
- Deploy to `staging-amba.komapc.workers.dev`
- Environment: Staging
- Orange `[STAGING]` badge visible

### 3. Test Both Environments

**Production Test:**
```bash
curl -I https://noamba.komapc.workers.dev
# Should return 200 OK
# No staging badge in header
```

**Staging Test:**
```bash
curl -I https://staging-amba.komapc.workers.dev
# Should return 200 OK
# Orange [STAGING] badge in header
```

## Environment Variables (Optional)

You can also set environment variables in Cloudflare Pages:

**Production:**
- `ENVIRONMENT=production`

**Staging:**
- `ENVIRONMENT=staging`

## Console Logging

Both environments will log their status:

**Production Console:**
```
🚀 Running in PRODUCTION environment
Environment details: {
  hostname: "noamba.komapc.workers.dev",
  isStaging: false,
  isProduction: true,
  version: "1.15.8"
}
```

**Staging Console:**
```
🔧 Running in STAGING environment
Environment details: {
  hostname: "staging-amba.komapc.workers.dev",
  isStaging: true,
  isProduction: false,
  version: "2.0.0"
}
```

## Deployment Commands

```bash
# Deploy to production
npm run deploy:production

# Deploy to staging
npm run deploy:staging

# Or use the deployment package
# Upload noamba-static-deployment.tar.gz to respective Pages project
```

## Benefits of Domain-Based Staging

1. **Clear Separation**: Different domains for different environments
2. **No URL Parameters**: Clean URLs without query strings
3. **Easy Testing**: Simple to test both environments
4. **Professional**: Industry-standard staging setup
5. **SSL Certificates**: Automatic HTTPS for both domains

## Troubleshooting

**If staging domain doesn't work:**
1. Check DNS propagation (can take up to 24 hours)
2. Verify CNAME record points to correct target
3. Ensure Cloudflare proxy is enabled (orange cloud)
4. Check SSL/TLS settings

**If environment detection fails:**
1. Open browser console and check logs
2. Verify hostname detection logic
3. Test with `window.location.hostname` in console
