# Cloudflare Pages Configuration Fix

## Problem
The deployment was failing because Cloudflare Pages was using a Workers deploy command instead of Pages deployment.

## Solution
Updated configuration to use proper Pages deployment settings.

## Build Settings (Update in Cloudflare Dashboard)

### For staging-noamba project:
```
Build command: npm run build
Deploy command: (empty - leave blank)
Root directory: /
```

### For production noamba project:
```
Build command: npm run build  
Deploy command: (empty - leave blank)
Root directory: /
```

## Files Added/Updated

### wrangler.toml
```toml
name = "staging-noamba"
compatibility_date = "2025-01-15"

[pages]
build_output_dir = "src"
```

### package.json
Updated deployment scripts:
```json
"deploy:staging": "wrangler pages deploy src --project-name staging-noamba",
"deploy:production": "wrangler pages deploy src --project-name noamba",
"deploy:preview": "wrangler pages deploy src --project-name noamba-preview"
```

## Manual Fix Steps

1. Go to Cloudflare Pages dashboard
2. Find your staging-noamba project
3. Go to Settings → Builds & deployments
4. Remove the custom deploy command (make it empty)
5. Keep build command as: `npm run build`
6. Keep root directory as: `/`
7. Save settings
8. Trigger new deployment

## Expected Result
- Build should complete successfully
- No more "wrangler versions upload" errors
- Proper Pages deployment
- Staging environment working with v2.0.2

## Version
Updated to v2.0.2 with proper Cloudflare Pages configuration.
