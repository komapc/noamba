#!/bin/bash

# Test Automatic Deployment Script
# This script helps test the auto-deployment setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Testing Automatic Deployment Setup${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Function to test staging deployment
test_staging() {
    echo -e "${YELLOW}🧪 Testing Staging Auto-Deploy${NC}"
    
    # Check if staging branch exists
    if ! git show-ref --verify --quiet refs/heads/staging; then
        echo -e "${RED}❌ Staging branch does not exist${NC}"
        echo -e "${YELLOW}💡 Create it with: git checkout -b staging${NC}"
        return 1
    fi
    
    # Switch to staging branch
    git checkout staging
    echo -e "${GREEN}✅ Switched to staging branch${NC}"
    
    # Add a test comment
    echo "<!-- Auto-deploy test $(date) -->" >> src/index.html
    git add src/index.html
    git commit -m "Test: staging auto-deploy $(date)"
    
    echo -e "${YELLOW}📤 Pushing to staging branch...${NC}"
    git push origin staging
    
    echo -e "${GREEN}✅ Staging deployment triggered!${NC}"
    echo -e "${BLUE}🔗 Check: https://staging-amba.komapc.workers.dev/ in 2-3 minutes${NC}"
    echo -e "${YELLOW}💡 Look for the orange [STAGING] badge in the header${NC}"
}

# Function to test production deployment
test_production() {
    echo -e "${YELLOW}🧪 Testing Production Auto-Deploy${NC}"
    
    # Check if master branch exists
    if ! git show-ref --verify --quiet refs/heads/master; then
        echo -e "${RED}❌ Master branch does not exist${NC}"
        return 1
    fi
    
    # Switch to master branch
    git checkout master
    echo -e "${GREEN}✅ Switched to master branch${NC}"
    
    # Add a test comment
    echo "<!-- Auto-deploy test $(date) -->" >> src/index.html
    git add src/index.html
    git commit -m "Test: production auto-deploy $(date)"
    
    echo -e "${YELLOW}📤 Pushing to master branch...${NC}"
    git push origin master
    
    echo -e "${GREEN}✅ Production deployment triggered!${NC}"
    echo -e "${BLUE}🔗 Check: https://noamba.komapc.workers.dev/ in 2-3 minutes${NC}"
    echo -e "${YELLOW}💡 Should NOT show staging badge${NC}"
}

# Function to check deployment status
check_status() {
    echo -e "${BLUE}🔍 Checking Deployment Status${NC}"
    
    echo -e "${YELLOW}Production URL:${NC}"
    curl -s -I https://noamba.komapc.workers.dev | head -1 || echo -e "${RED}❌ Production URL not accessible${NC}"
    
    echo -e "${YELLOW}Staging URL:${NC}"
    curl -s -I https://staging-amba.komapc.workers.dev | head -1 || echo -e "${RED}❌ Staging URL not accessible${NC}"
}

# Main menu
echo -e "${BLUE}Choose test option:${NC}"
echo "1) Test staging auto-deploy"
echo "2) Test production auto-deploy"
echo "3) Check deployment status"
echo "4) Exit"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        test_staging
        ;;
    2)
        test_production
        ;;
    3)
        check_status
        ;;
    4)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Test completed!${NC}"
