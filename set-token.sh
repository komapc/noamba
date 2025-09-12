#!/bin/bash
# Secure script to set Cloudflare API token
# Usage: source set-token.sh

export CLOUDFLARE_API_TOKEN="xtimH1DXYAgsCB2x2kAkJHiR-pjSm9LcILoxrDXX"
echo "✅ Cloudflare API token set successfully"
echo "🔒 Token stored in environment variable (not in shell history)"
echo "📋 Ready to deploy with: npm run deploy:staging"
