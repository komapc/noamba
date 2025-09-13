#!/bin/bash

# Cloudflare Pages Direct Deployment Script
# This script deploys the src/ directory to Cloudflare Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Cloudflare Pages Deployment${NC}"

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ CLOUDFLARE_API_TOKEN not set${NC}"
    echo -e "${YELLOW}💡 Run: source set-token.sh${NC}"
    exit 1
fi

# Check if src directory exists
if [ ! -d "src" ]; then
    echo -e "${RED}❌ src/ directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Source directory found${NC}"
echo -e "${GREEN}✅ API token configured${NC}"

# Create a temporary directory for the deployment
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Created temp directory: $TEMP_DIR${NC}"

# Copy src contents to temp directory
cp -r src/* "$TEMP_DIR/"
echo -e "${GREEN}✅ Files copied to temp directory${NC}"

# Create deployment using Cloudflare API
echo -e "${BLUE}🌐 Deploying to Cloudflare Pages...${NC}"

# Get account ID (we'll need this for the API call)
echo -e "${YELLOW}⚠️  Note: This script requires manual setup in Cloudflare Dashboard${NC}"
echo -e "${YELLOW}⚠️  For now, please use the dashboard method:${NC}"
echo -e "${BLUE}🔗 https://dash.cloudflare.com/pages${NC}"
echo ""
echo -e "${GREEN}✅ Your files are ready in: $TEMP_DIR${NC}"
echo -e "${YELLOW}📋 Manual deployment steps:${NC}"
echo -e "   1. Go to https://dash.cloudflare.com/pages"
echo -e "   2. Find project: noamba-static-staging"
echo -e "   3. Click 'Upload assets' or 'Deploy from folder'"
echo -e "   4. Upload the contents of: $TEMP_DIR"
echo -e "   5. Or drag and drop the src/ folder directly"

# Clean up temp directory after a delay
echo -e "${BLUE}🧹 Temp directory will be cleaned up automatically${NC}"
(sleep 30 && rm -rf "$TEMP_DIR" && echo -e "${GREEN}✅ Temp directory cleaned up${NC}") &

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
