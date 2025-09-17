# Deployment Guide

## Overview

This project uses **Cloudflare Pages** for hosting with automatic deployment via GitHub Actions.

### Environments

- **Staging**: `staging.3amba.pages.dev` (deploys from `staging` branch)
- **Production**: `3amba.pages.dev` (deploys from `master` branch)

## Automatic Deployment

### GitHub Actions Workflows

Two deployment workflows are available:

1. **`deploy.yml`** - Uses Cloudflare Pages Action (recommended)
2. **`deploy-wrangler.yml`** - Uses Wrangler CLI (alternative)

### Setup Requirements

#### 1. Cloudflare API Token

Create a Cloudflare API token with the following permissions:
- **Account**: `Cloudflare Pages:Edit`
- **Zone**: `Zone:Read` (if using custom domains)

#### 2. GitHub Secrets

Add these secrets to your GitHub repository:

```
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

#### 3. Account ID

Find your Cloudflare Account ID:
1. Go to Cloudflare Dashboard
2. Select your account
3. Copy the Account ID from the right sidebar

### Deployment Triggers

| Branch | Environment | URL | Trigger |
|--------|-------------|-----|---------|
| `staging` | Staging | `staging.3amba.pages.dev` | Push to staging |
| `master` | Production | `3amba.pages.dev` | Push to master |
| Any PR | Preview | `staging.3amba.pages.dev` | Pull Request |

## Manual Deployment

### Using NPM Scripts

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Check deployment status
npm run deploy:status

# Check configuration
npm run deploy:check
```

### Using Wrangler Directly

```bash
# Install Wrangler globally
npm install -g wrangler

# Deploy to staging
wrangler pages deploy src --project-name staging-amba --config wrangler.staging.toml

# Deploy to production
wrangler pages deploy src --project-name noamba --config wrangler.production.toml
```

## Configuration Files

### Wrangler Configuration

- `wrangler.toml` - Default configuration
- `wrangler.staging.toml` - Staging environment
- `wrangler.production.toml` - Production environment

### Key Settings

```toml
name = "project-name"
compatibility_date = "2025-01-15"
pages_build_output_dir = "src"
```

## Deployment Process

### Automatic Process

1. **Code Push**: Developer pushes to `staging` or `master` branch
2. **GitHub Actions**: Workflow triggers automatically
3. **Tests**: Cypress E2E tests run
4. **Deploy**: Code deploys to appropriate environment
5. **Notification**: GitHub shows deployment status

### Manual Process

1. **Local Testing**: Run `npm run test:e2e` locally
2. **Deploy**: Run appropriate deploy command
3. **Verify**: Check deployment at target URL

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```
Error: Authentication required
```
**Solution**: Ensure `CLOUDFLARE_API_TOKEN` is set correctly in GitHub Secrets

#### 2. Project Not Found
```
Error: Project 'staging-amba' not found
```
**Solution**:
- Verify project names in `wrangler.*.toml` files
- Check Cloudflare Pages dashboard for correct project names
- Ensure `CLOUDFLARE_ACCOUNT_ID` is correct

#### 3. Build Failures
```
Error: Build failed
```
**Solution**:
- Check that `src` directory contains all required files
- Verify `pages_build_output_dir = "src"` in wrangler config
- Ensure no build process is needed (static files only)

#### 4. Tests Failing
```
Error: Cypress tests failed
```
**Solution**:
- Run tests locally: `npm run test:e2e`
- Check for flaky tests or environment issues
- Review test logs in GitHub Actions

### Debug Commands

```bash
# Check Wrangler authentication
wrangler whoami

# List all projects
wrangler pages project list

# Check deployment history
wrangler pages deployment list --project-name staging-amba

# View deployment details
wrangler pages deployment tail --project-name staging-amba
```

## Environment Variables

### Required for CI/CD

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `GITHUB_TOKEN` - Automatically provided by GitHub

### Optional

- `NODE_VERSION` - Node.js version (default: 18)
- `CACHE_NPM` - Enable npm caching (default: true)

## Monitoring

### GitHub Actions

- View workflow runs in GitHub Actions tab
- Check logs for deployment status
- Monitor test results

### Cloudflare Pages

- View deployment history in Cloudflare dashboard
- Monitor performance and analytics
- Check for any deployment errors

## Best Practices

1. **Always test locally** before pushing
2. **Use staging branch** for testing changes
3. **Merge to master** only after staging verification
4. **Monitor deployment logs** for any issues
5. **Keep secrets secure** and rotate regularly
6. **Use semantic versioning** for releases

## Rollback

### Automatic Rollback

Cloudflare Pages automatically keeps previous deployments. To rollback:

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "Rollback" on desired deployment

### Manual Rollback

```bash
# Deploy specific commit
git checkout <commit-hash>
npm run deploy:production
```

## Support

For deployment issues:

1. Check GitHub Actions logs
2. Review Cloudflare Pages dashboard
3. Verify configuration files
4. Test locally with Wrangler CLI
5. Check this documentation

---

**Last Updated**: September 2025
**Version**: 1.0.1
