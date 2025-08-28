import { it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { HomePage } from '../pages/HomePage';
import { 
  testUtils, 
  testDataFactories
} from '../utils/testing';

// Mock the contexts
vi.mock('../contexts/ContentContext', () => ({
  useContent: () => ({
    services: [
      testDataFactories.createMockService({
        title: 'Writing Instruments',
        titleAr: 'أدوات الكتابة'
      }),
      testDataFactories.createMockService({
        title: 'Paper Products', 
        titleAr: 'منتجات ورقية'
      })
    ],
    aboutFeatures: [
      testDataFactories.createMockService({
        title: 'Premium Quality',
        titleAr: 'جودة عالية'
      })
    ],
    companyInfo: {
      name: 'Noor Al Maarifa Trading L.L.C',
      description: 'Leading stationery provider in Dubai',
      descriptionAr: 'مزود قرطاسية رائد في دبي'
    }
  })
}));

// Mock utils
vi.mock('../utils', () => ({
  downloadCatalog: vi.fn(),
  trackPageView: vi.fn(),
  trackCatalogDownload: vi.fn(),
}));

// Mock SEO utils  
vi.mock('../utils/seo', () => ({
  updatePageSEO: vi.fn(),
}));

// Mock hooks
vi.mock('../hooks', () => ({
  useScrollAnimation: () => ({
    ref: { current: null },
    inView: true
  })
}));

runTestSuite('HomePage Component', () => {
  it('renders homepage with all sections', async () => {
    testUtils.renderWithProviders(<HomePage />);
    
    // Check hero section
    expect(screen.getByText('Noor Al Maarifa')).toBeInTheDocument();
    expect(screen.getByText(/Premium Stationery & Office Supplies/)).toBeInTheDocument();
    
    // Check Arabic text
    expect(screen.getByText('شركة نور المعرفة للتجارة')).toBeInTheDocument();
    
    // Check CTA buttons
    expect(screen.getByRole('link', { name: /Get In Touch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Catalog/i })).toBeInTheDocument();
  });
  
  it('displays services from context', () => {
    testUtils.renderWithProviders(<HomePage />);
    
    expect(screen.getByText('Writing Instruments')).toBeInTheDocument();
    expect(screen.getByText('أدوات الكتابة')).toBeInTheDocument();
    expect(screen.getByText('Paper Products')).toBeInTheDocument();
  });
  
  it('displays about features', () => {
    testUtils.renderWithProviders(<HomePage />);
    
    expect(screen.getByText('Premium Quality')).toBeInTheDocument();
    expect(screen.getByText('جودة عالية')).toBeInTheDocument();
  });
  
  it('handles catalog download click', async () => {
    const { trackCatalogDownload } = await import('../utils');
    
    testUtils.renderWithProviders(<HomePage />);
    
    const catalogButton = screen.getByRole('button', { name: /Download Catalog/i });
    await testUtils.userEvent.click(catalogButton);
    
    expect(trackCatalogDownload).toHaveBeenCalled();
  });
  
  it('meets accessibility standards', async () => {
    const { container } = testUtils.renderWithProviders(<HomePage />);
    await testUtils.checkAccessibility(container);
  });
  
  it('renders within performance budget', async () => {
    const renderTime = await performanceValidation.measureRenderTime(async () => {
      testUtils.renderWithProviders(<HomePage />);
      await testUtils.waitForLoadingToFinish();
    });
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
  
  it('has proper SEO elements', () => {
    testUtils.renderWithProviders(<HomePage />);
    
    // This would need to be tested in a more integrated way
    // For now, just check that SEO function was called
    const { updatePageSEO } = require('../utils/seo');
    expect(updatePageSEO).toHaveBeenCalled();
  });
  
  /*
  it('is responsive on different screen sizes', async () => {
    await integrationTestHelpers.testResponsive(<HomePage />, [320, 768, 1024, 1440]);
  });
  */
  
  it('supports bilingual content', () => {
    testUtils.renderWithProviders(<HomePage />);
    
    // Check both English and Arabic content exists
    expect(screen.getByText(/Premium Stationery/)).toBeInTheDocument();
    expect(screen.getByText(/لوازم قرطاسية/)).toBeInTheDocument();
  });
});