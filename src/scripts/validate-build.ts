#!/usr/bin/env node

/**
 * Production Build Validation Script
 * Runs comprehensive checks on the built application
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface BuildValidationResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
  stats: {
    totalFiles: number;
    totalSize: number;
    jsFiles: number;
    cssFiles: number;
    imageFiles: number;
    chunkSizes: Record<string, number>;
  };
}

class BuildValidator {
  private distPath: string;
  private result: BuildValidationResult;

  constructor(distPath = './dist') {
    this.distPath = path.resolve(distPath);
    this.result = {
      passed: true,
      issues: [],
      warnings: [],
      stats: {
        totalFiles: 0,
        totalSize: 0,
        jsFiles: 0,
        cssFiles: 0,
        imageFiles: 0,
        chunkSizes: {}
      }
    };
  }

  async validate(): Promise<BuildValidationResult> {
    console.log('🔍 Starting production build validation...\n');

    try {
      await this.checkDistExists();
      await this.validateFiles();
      await this.checkBundleSizes();
      await this.validateHTML();
      await this.checkAssets();
      await this.validateSecurity();
      await this.checkPerformance();
      
      this.printResults();
      return this.result;
    } catch (error) {
      this.addIssue(`Validation failed: ${error}`);
      this.result.passed = false;
      return this.result;
    }
  }

  private async checkDistExists(): Promise<void> {
    if (!fs.existsSync(this.distPath)) {
      this.addIssue('Build directory does not exist. Run "npm run build" first.');
      throw new Error('No build found');
    }
    console.log('✅ Build directory exists');
  }

  private async validateFiles(): Promise<void> {
    const files = await glob('**/*', { cwd: this.distPath, nodir: true });
    
    this.result.stats.totalFiles = files.length;
    
    if (files.length === 0) {
      this.addIssue('No files found in build directory');
      return;
    }

    // Calculate total size and categorize files
    for (const file of files) {
      const filePath = path.join(this.distPath, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      
      this.result.stats.totalSize += stats.size;
      
      if (ext === '.js') this.result.stats.jsFiles++;
      else if (ext === '.css') this.result.stats.cssFiles++;
      else if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext)) {
        this.result.stats.imageFiles++;
      }
      
      // Track chunk sizes
      if (ext === '.js' || ext === '.css') {
        this.result.stats.chunkSizes[file] = Math.round(stats.size / 1024); // KB
      }
    }

    console.log(`✅ Found ${files.length} files (${this.formatSize(this.result.stats.totalSize)})`);
  }

  private async checkBundleSizes(): Promise<void> {
    const maxJSChunkSize = 500; // KB
    const maxCSSChunkSize = 100; // KB
    const maxTotalSize = 2000; // KB

    // Check individual chunk sizes
    for (const [file, size] of Object.entries(this.result.stats.chunkSizes)) {
      const ext = path.extname(file);
      const maxSize = ext === '.js' ? maxJSChunkSize : maxCSSChunkSize;
      
      if (size > maxSize) {
        this.addWarning(`Large ${ext} chunk: ${file} (${size}KB > ${maxSize}KB)`);
      }
    }

    // Check total bundle size
    const totalJSSize = Object.entries(this.result.stats.chunkSizes)
      .filter(([file]) => path.extname(file) === '.js')
      .reduce((sum, [, size]) => sum + size, 0);

    if (totalJSSize > maxTotalSize) {
      this.addWarning(`Total JS bundle size is large: ${totalJSSize}KB > ${maxTotalSize}KB`);
    }

    console.log(`✅ Bundle size validation complete (Total JS: ${totalJSSize}KB)`);
  }

  private async validateHTML(): Promise<void> {
    const indexPath = path.join(this.distPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      this.addIssue('index.html not found');
      return;
    }

    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Check for essential meta tags
    const requiredTags = [
      '<title>',
      'name="description"',
      'name="viewport"',
      'charset="utf-8"',
      'property="og:title"',
      'property="og:description"'
    ];

    for (const tag of requiredTags) {
      if (!htmlContent.includes(tag)) {
        this.addIssue(`Missing essential meta tag: ${tag}`);
      }
    }

    // Check for minification
    if (htmlContent.includes('  ') || htmlContent.includes('\n    ')) {
      this.addWarning('HTML appears not to be minified');
    }

    // Check for security headers
    if (!htmlContent.includes('Content-Security-Policy')) {
      this.addWarning('Consider adding Content-Security-Policy meta tag');
    }

    console.log('✅ HTML validation complete');
  }

  private async checkAssets(): Promise<void> {
    // Check for required assets
    const requiredAssets = [
      'images/LOGOICON.png',
      'images/LOGONOOR.png'
    ];

    for (const asset of requiredAssets) {
      const assetPath = path.join(this.distPath, asset);
      if (!fs.existsSync(assetPath)) {
        this.addIssue(`Required asset missing: ${asset}`);
      }
    }

    // Check for favicon
    const faviconExists = fs.existsSync(path.join(this.distPath, 'favicon.ico')) ||
                         fs.existsSync(path.join(this.distPath, 'favicon.png'));
    
    if (!faviconExists) {
      this.addWarning('Favicon not found');
    }

    // Check for manifest
    if (!fs.existsSync(path.join(this.distPath, 'manifest.json'))) {
      this.addWarning('Web app manifest not found');
    }

    console.log('✅ Asset validation complete');
  }

  private async validateSecurity(): Promise<void> {
    const indexPath = path.join(this.distPath, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');

    // Check for inline scripts (potential security risk)
    if (htmlContent.includes('<script>') && !htmlContent.includes('application/ld+json')) {
      this.addWarning('Inline scripts detected (potential security risk)');
    }

    // Check for external resources without integrity
    const externalScripts = htmlContent.match(/<script[^>]+src=["']https?:\/\/[^"']+/g);
    if (externalScripts) {
      for (const script of externalScripts) {
        if (!script.includes('integrity=')) {
          this.addWarning('External script without integrity hash detected');
        }
      }
    }

    console.log('✅ Security validation complete');
  }

  private async checkPerformance(): Promise<void> {
    // Check for preload/prefetch hints
    const indexPath = path.join(this.distPath, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');

    if (!htmlContent.includes('rel="preconnect"')) {
      this.addWarning('Consider adding preconnect hints for external domains');
    }

    // Check for critical CSS inlining
    if (!htmlContent.includes('<style>')) {
      this.addWarning('Consider inlining critical CSS for better performance');
    }

    // Check for lazy loading images
    const images = htmlContent.match(/<img[^>]+>/g);
    if (images && !images.some(img => img.includes('loading="lazy"'))) {
      this.addWarning('Consider adding lazy loading to images');
    }

    console.log('✅ Performance validation complete');
  }

  private addIssue(message: string): void {
    this.result.issues.push(message);
    this.result.passed = false;
  }

  private addWarning(message: string): void {
    this.result.warnings.push(message);
  }

  private formatSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }

  private printResults(): void {
    console.log('\n📊 Build Validation Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Stats
    console.log(`📁 Total files: ${this.result.stats.totalFiles}`);
    console.log(`📦 Total size: ${this.formatSize(this.result.stats.totalSize)}`);
    console.log(`🟨 JS files: ${this.result.stats.jsFiles}`);
    console.log(`🟦 CSS files: ${this.result.stats.cssFiles}`);
    console.log(`🖼️  Images: ${this.result.stats.imageFiles}`);
    
    // Top 5 largest chunks
    const sortedChunks = Object.entries(this.result.stats.chunkSizes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    if (sortedChunks.length > 0) {
      console.log('\n📈 Largest chunks:');
      sortedChunks.forEach(([file, size]) => {
        console.log(`   ${file}: ${size}KB`);
      });
    }

    // Issues
    if (this.result.issues.length > 0) {
      console.log('\n❌ Issues:');
      this.result.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    // Warnings
    if (this.result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.result.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    // Final result
    console.log('\n' + '━'.repeat(30));
    if (this.result.passed) {
      console.log('🎉 Build validation PASSED!');
    } else {
      console.log('❌ Build validation FAILED!');
      console.log(`Found ${this.result.issues.length} issue(s) that need to be fixed.`);
    }
    
    if (this.result.warnings.length > 0) {
      console.log(`💡 ${this.result.warnings.length} optimization suggestion(s) available.`);
    }
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new BuildValidator();
  validator.validate().then(result => {
    process.exit(result.passed ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export default BuildValidator;