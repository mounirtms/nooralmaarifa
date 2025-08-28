#!/bin/bash

# Production Build & Deployment Script
# This script builds the application for production with optimizations

set -e  # Exit on any error

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Clean previous build
print_step "Cleaning previous build..."
npm run clean
print_success "Clean completed"

# Step 2: Run validation checks
print_step "Running validation checks..."
if npm run validate; then
    print_success "All validation checks passed"
else
    print_error "Validation checks failed"
    exit 1
fi

# Step 3: Type checking
print_step "Running TypeScript type checking..."
if npm run type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# Step 4: Build for production
print_step "Building for production..."
if NODE_ENV=production npm run build; then
    print_success "Production build completed"
else
    print_error "Production build failed"
    exit 1
fi

# Step 5: Validate build output
print_step "Validating build output..."
if npx tsx src/scripts/validate-build.ts; then
    print_success "Build validation passed"
else
    print_warning "Build validation found issues (check output above)"
fi

# Step 6: Calculate bundle sizes
print_step "Analyzing bundle sizes..."
if [ -d "dist" ]; then
    echo "📦 Build size analysis:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Total size
    total_size=$(du -sh dist | cut -f1)
    echo "📁 Total build size: $total_size"
    
    # JS files
    js_size=$(find dist -name "*.js" -exec du -ch {} + | tail -1 | cut -f1)
    echo "🟨 JavaScript: $js_size"
    
    # CSS files
    css_size=$(find dist -name "*.css" -exec du -ch {} + | tail -1 | cut -f1)
    echo "🟦 CSS: $css_size"
    
    # Assets
    asset_size=$(find dist -name "*.png" -o -name "*.jpg" -o -name "*.svg" -o -name "*.gif" | xargs du -ch 2>/dev/null | tail -1 | cut -f1)
    echo "🖼️  Assets: $asset_size"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

# Step 7: Generate bundle analysis (optional)
if command -v npx &> /dev/null; then
    print_step "Generating bundle analysis..."
    if npm run build:analyze > /dev/null 2>&1; then
        print_success "Bundle analysis generated (check dist/bundle-analysis.html)"
    else
        print_warning "Bundle analysis generation failed (optional step)"
    fi
fi

# Step 8: Security checks
print_step "Running security checks..."
echo "🔒 Checking for potential security issues..."

# Check for exposed secrets
if grep -r "API_KEY\|SECRET\|PASSWORD" dist/ --exclude="*.js.map" 2>/dev/null | grep -v "console.log" | head -5; then
    print_warning "Potential secrets found in build output"
else
    print_success "No obvious secrets found in build"
fi

# Check for development artifacts
if grep -r "console.log\|debugger\|TODO\|FIXME" dist/ --exclude="*.js.map" 2>/dev/null | head -5; then
    print_warning "Development artifacts found in production build"
else
    print_success "No development artifacts found"
fi

# Step 9: Performance hints
print_step "Performance optimization suggestions..."
echo "💡 Performance Tips:"
echo "   • Enable Gzip/Brotli compression on your server"
echo "   • Set proper cache headers for static assets"
echo "   • Consider using a CDN for asset delivery"
echo "   • Enable HTTP/2 on your server"
echo "   • Monitor Core Web Vitals with Google Analytics"

# Step 10: Deployment readiness check
print_step "Deployment readiness check..."

required_files=(
    "dist/index.html"
    "dist/assets"
    "dist/images"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        print_error "Required file/directory missing: $file"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    print_success "All required files present"
else
    print_error "Some required files are missing"
    exit 1
fi

# Step 11: Final summary
echo ""
echo "🎉 Production build completed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Build output: ./dist/"
echo "🌐 Ready for deployment to:"
echo "   • Firebase Hosting: npm run deploy"
echo "   • Static hosting: Copy ./dist/ contents"
echo "   • Preview locally: npm run preview"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the build: npm run preview"
echo "   2. Run performance audit: npm run performance:audit"
echo "   3. Deploy: npm run deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"