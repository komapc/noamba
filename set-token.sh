#!/bin/bash
# Secure script to set Cloudflare API token
# Usage: source set-token.sh
# 
# IMPORTANT: Replace YOUR_TOKEN_HERE with your actual API token
# Get your token from: https://dash.cloudflare.com/profile/api-tokens

export CLOUDFLARE_API_TOKEN="YOUR_TOKEN_HERE"
echo "✅ Cloudflare API token set successfully"
echo "🔒 Token stored in environment variable (not in shell history)"
echo "📋 Ready to deploy with: npm run deploy:staging"
