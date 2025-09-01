# Design Document

## Overview

This design implements a comprehensive admin dashboard enhancement system that addresses authentication issues, adds theme switching capabilities, and provides powerful content management features. The solution includes a theme management system, enhanced admin authentication, social media management, content customization tools, and a modern responsive interface.

## Architecture

### Theme Management System
```
ThemeProvider (Context)
├── ThemeToggle (Component)
├── CSS Custom Properties (Variables)
├── LocalStorage Persistence
└── System Preference Detection
```

### Enhanced Admin System
```
AuthContext (Enhanced)
├── Simplified Admin Check
├── Role-based Access Control
├── Session Management
└── Error Handling

AdminDashboard (Enhanced)
├── Content Management Panel
├── Social Links Manager
├── Theme Customization
├── Website Settings
└── Analytics Dashboard
```

### Content Management Architecture
```
ContentProvider (Context)
├── Company Information
├── Social Media Links
├── Website Settings
├── Custom Styling
└── Real-time Updates

Firebase Integration
├── Firestore (Data Storage)
├── Storage (Media Files)
├── Authentication (Admin Access)
└── Real-time Listeners
```

## Components and Interfaces

### 1. Theme Management Components

#### ThemeProvider Context
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}
```

#### ThemeToggle Component
- Animated toggle button with sun/moon icons
- Smooth transitions between states
- Accessible keyboard navigation
- Tooltip support for better UX

#### CSS Variables System
```css
:root {
  /* Light theme variables */
  --color-primary: #1e40af;
  --color-secondary: #64748b;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #0f172a;
  --color-border: #e2e8f0;
}

[data-theme="dark"] {
  /* Dark theme variables */
  --color-primary: #3b82f6;
  --color-secondary: #94a3b8;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-border: #334155;
}
```

### 2. Enhanced Authentication System

#### Updated AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}
```

#### Simplified Admin Check Logic
- Remove complex privilege checking
- Use email-based admin verification
- Fallback to Firestore admin flag
- Immediate access upon successful authentication

### 3. Content Management Components

#### SocialLinksManager
```typescript
interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp';
  url: string;
  enabled: boolean;
  displayOrder: number;
}

interface SocialLinksManagerProps {
  links: SocialLink[];
  onUpdate: (links: SocialLink[]) => void;
}
```

#### CompanyInfoEditor
```typescript
interface CompanyInfo {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  workingHours: string;
  workingHoursAr: string;
}
```

#### ThemeCustomizer
```typescript
interface CustomTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: number;
  spacing: number;
}
```

### 4. Admin Dashboard Layout

#### Enhanced Dashboard Structure
```
AdminDashboard
├── Header (User info, theme toggle, logout)
├── Navigation Sidebar
│   ├── Dashboard Overview
│   ├── Content Management
│   ├── Social Media
│   ├── Theme Customization
│   ├── Website Settings
│   └── Analytics
├── Main Content Area
│   ├── Quick Stats Cards
│   ├── Recent Activity Feed
│   ├── Management Panels
│   └── Live Preview
└── Footer (System status, last update)
```

## Data Models

### 1. Theme Configuration
```typescript
interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}
```

### 2. Website Settings
```typescript
interface WebsiteSettings {
  id: string;
  companyInfo: CompanyInfo;
  socialLinks: SocialLink[];
  themeConfig: ThemeConfig;
  seoSettings: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    keywords: string[];
  };
  contactSettings: {
    showWhatsApp: boolean;
    showPhone: boolean;
    showEmail: boolean;
    autoReply: boolean;
    autoReplyMessage: string;
    autoReplyMessageAr: string;
  };
  updatedAt: string;
  updatedBy: string;
}
```

### 3. User Permissions
```typescript
interface UserPermissions {
  canEditContent: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canCustomizeTheme: boolean;
  canManageSocial: boolean;
  canExportData: boolean;
}
```

## Error Handling

### 1. Authentication Error Handling
```typescript
const handleAuthError = (error: FirebaseError) => {
  const errorMessages = {
    'auth/user-not-found': 'Admin account not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email format',
    'auth/too-many-requests': 'Too many attempts, try later',
    'auth/network-request-failed': 'Network error, check connection'
  };
  
  return errorMessages[error.code] || 'Authentication failed';
};
```

### 2. Data Validation
```typescript
const validateSocialLink = (link: SocialLink): ValidationResult => {
  const urlPattern = /^https?:\/\/.+/;
  
  if (!urlPattern.test(link.url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  return { valid: true };
};
```

### 3. Error Boundaries
- Wrap admin components in error boundaries
- Provide fallback UI for component failures
- Log errors for debugging
- Show user-friendly error messages

## Testing Strategy

### 1. Unit Tests
- Theme switching functionality
- Authentication logic
- Data validation functions
- Component rendering

### 2. Integration Tests
- Admin dashboard navigation
- Content management workflows
- Theme persistence
- Social links management

### 3. E2E Tests
- Complete admin login flow
- Content editing and publishing
- Theme switching across pages
- Mobile responsiveness

### 4. Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management

## Performance Considerations

### 1. Theme Switching Optimization
- Use CSS custom properties for instant theme changes
- Preload theme assets
- Minimize layout shifts during transitions
- Cache theme preferences

### 2. Admin Dashboard Performance
- Lazy load admin components
- Implement virtual scrolling for large lists
- Optimize image loading
- Use React.memo for expensive components

### 3. Data Management
- Implement optimistic updates
- Use Firestore real-time listeners efficiently
- Cache frequently accessed data
- Batch write operations

## Security Considerations

### 1. Admin Access Control
- Validate admin status on server-side
- Implement session timeout
- Use secure authentication tokens
- Log admin activities

### 2. Data Protection
- Sanitize user inputs
- Validate file uploads
- Implement rate limiting
- Use HTTPS for all communications

### 3. Content Security
- Validate HTML content
- Prevent XSS attacks
- Sanitize URLs
- Implement CSRF protection

## Implementation Phases

### Phase 1: Theme System Foundation
1. Create ThemeProvider context
2. Implement CSS custom properties
3. Add theme toggle component
4. Test theme persistence

### Phase 2: Authentication Enhancement
1. Simplify admin check logic
2. Remove privilege barriers
3. Enhance error handling
4. Test authentication flow

### Phase 3: Content Management
1. Build social links manager
2. Create company info editor
3. Implement theme customizer
4. Add real-time updates

### Phase 4: Dashboard Enhancement
1. Redesign admin interface
2. Add management panels
3. Implement live preview
4. Optimize performance

### Phase 5: Testing and Polish
1. Comprehensive testing
2. Accessibility improvements
3. Performance optimization
4. Documentation updates