#!/bin/bash

# MultiGender Hebrew Text Designer - Deployment Setup Script
# This script helps set up automatic deployment with Cloudflare Pages

echo "🚀 MultiGender Hebrew Text Designer - Deployment Setup"
echo "======================================================"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of a git repository"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: This doesn't appear to be the MultiGender Hebrew Text Designer project"
    echo "   Make sure you're in the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check for required files
echo "📋 Checking required files..."

required_files=(
    ".github/workflows/deploy.yml"
    ".github/workflows/deploy-wrangler.yml"
    "wrangler.staging.toml"
    "wrangler.production.toml"
    "DEPLOYMENT.md"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required files. Please ensure all deployment files are present."
    exit 1
fi

echo ""
echo "✅ All required files present"
echo ""

# Check for GitHub repository
echo "🔍 Checking GitHub repository..."

if git remote get-url origin 2>/dev/null | grep -q "github.com"; then
    echo "  ✅ GitHub repository detected"
    REPO_URL=$(git remote get-url origin)
    echo "  📍 Repository: $REPO_URL"
else
    echo "  ⚠️  Warning: No GitHub repository detected"
    echo "     Make sure you have a GitHub repository set up"
fi

echo ""

# Check for Cloudflare configuration
echo "🔧 Checking Cloudflare configuration..."

if [ -f "wrangler.staging.toml" ] && [ -f "wrangler.production.toml" ]; then
    echo "  ✅ Wrangler configuration files present"

    # Extract project names
    STAGING_PROJECT=$(grep "name = " wrangler.staging.toml | cut -d'"' -f2)
    PRODUCTION_PROJECT=$(grep "name = " wrangler.production.toml | cut -d'"' -f2)

    echo "  📍 Staging project: $STAGING_PROJECT"
    echo "  📍 Production project: $PRODUCTION_PROJECT"
else
    echo "  ❌ Wrangler configuration files missing"
fi

echo ""

# Check for GitHub Actions
echo "🤖 Checking GitHub Actions..."

if [ -d ".github/workflows" ]; then
    echo "  ✅ GitHub Actions directory present"

    workflow_count=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    echo "  📊 Workflow files: $workflow_count"

    for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
        if [ -f "$workflow" ]; then
            echo "    - $(basename "$workflow")"
        fi
    done
else
    echo "  ❌ GitHub Actions directory missing"
fi

echo ""

# Provide next steps
echo "🎯 Next Steps for Automatic Deployment:"
echo "======================================"
echo ""
echo "1. 🔑 Set up GitHub Secrets:"
echo "   - Go to your GitHub repository"
echo "   - Navigate to Settings > Secrets and variables > Actions"
echo "   - Add these secrets:"
echo "     • CLOUDFLARE_API_TOKEN (your Cloudflare API token)"
echo "     • CLOUDFLARE_ACCOUNT_ID (your Cloudflare account ID)"
echo ""
echo "2. 🌐 Create Cloudflare Pages projects:"
echo "   - Go to Cloudflare Dashboard > Pages"
echo "   - Create project: $STAGING_PROJECT"
echo "   - Create project: $PRODUCTION_PROJECT"
echo ""
echo "3. 🚀 Test the deployment:"
echo "   - Push to 'staging' branch → deploys to staging-amba.pages.dev"
echo "   - Push to 'master' branch → deploys to 3amba.pages.dev"
echo ""
echo "4. 📚 Read the documentation:"
echo "   - See DEPLOYMENT.md for detailed instructions"
echo "   - Check README.md for updated deployment info"
echo ""

# Check if we can run tests
echo "🧪 Testing setup..."

if command -v npm &> /dev/null; then
    echo "  ✅ npm is available"

    if [ -f "package-lock.json" ]; then
        echo "  ✅ Dependencies are installed"

        echo ""
        echo "🔬 Running tests to verify everything works..."
        if npm run test:e2e; then
            echo "  ✅ Tests passed! Your setup is ready for deployment."
        else
            echo "  ⚠️  Tests failed. Please check the issues before deploying."
        fi
    else
        echo "  ⚠️  Dependencies not installed. Run 'npm install' first."
    fi
else
    echo "  ❌ npm not found. Please install Node.js and npm."
fi

echo ""
echo "🎉 Setup complete! Your project is ready for automatic deployment."
echo ""
echo "📖 For more information, see DEPLOYMENT.md"
echo "🐛 For issues, check the GitHub Actions logs after pushing to a branch"
