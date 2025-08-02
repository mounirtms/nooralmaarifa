# Noor Al Maarifa Trading L.L.C Website

## نور المعرفة للتجارة ذ.م.م

A professional bilingual website for Noor Al Maarifa Trading L.L.C, specializing in premium stationery and office supplies across Dubai and the UAE.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (for preview and build tools)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

### Installation
```bash
# Install dependencies
npm install

# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools
```

## 📋 Available Commands

### Preview (Local Development)
```bash
# Using npm
npm run preview
# or npm start

# Using PowerShell script
.\preview.ps1
```
This will start a local server at `http://localhost:3000` and automatically open your browser.

### Build (Production)
```bash
# Using npm
npm run build

# Using PowerShell script
.\build.ps1
```
This will:
- Create a `build` directory
- Minify CSS files
- Optimize assets
- Prepare files for deployment

### Deploy to Firebase
```bash
# Using npm (builds automatically)
npm run deploy

# Using PowerShell script (includes build)
.\deploy.ps1

# Direct Firebase deploy (manual build required)
firebase deploy
```

### Firebase Setup (First Time Only)
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Serve locally using Firebase
firebase serve
```

## 🌍 Website Features

- **Bilingual Support**: English and Arabic content throughout
- **Google Sign-In**: OAuth authentication using Google accounts
- **Image Gallery**: Dynamic gallery with admin upload capabilities
- **Contact Management**: Admin panel for managing contact form submissions
- **Admin Role System**: Role-based access control for administrative features
- **Firebase Integration**: Real-time database and cloud storage
- **Responsive Design**: Mobile-friendly user interface
- **Professional Layout**: Modern and clean design
- **Google Maps Integration**: Easy location finding
- **SEO Optimized**: Better search engine visibility

## 🏢 Business Information

- **Company**: Noor Al Maarifa Trading L.L.C | نور المعرفة للتجارة ذ.م.م
- **Location**: Al Ras, Deira, Dubai, U.A.E
- **P.O. Box**: 3388
- **Phone**: +971 555 505 618
- **Email**: nooralmaarifa22@gmail.com

## 📁 Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── logo.svg           # Company logo
├── image.jpeg         # Hero image
├── firebase.json      # Firebase configuration
├── package.json       # Node.js dependencies
├── build.ps1          # Build script
├── preview.ps1        # Preview script
├── deploy.ps1         # Deploy script
└── README.md          # This file
```

## 🛠️ Development Workflow

1. **Local Development**:
   ```bash
   npm run preview
   ```

2. **Make Changes**: Edit HTML, CSS, or JS files

3. **Test Changes**: Refresh browser to see updates

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Deploy**:
   ```bash
   npm run deploy
   ```

## 👨‍💼 Admin Role Assignment

### Setting Up Admin Accounts

Admin privileges are controlled through email addresses defined in the Firebase configuration. Follow these steps to assign admin roles:

### 1. Update Admin Email List

Edit the `firebase-config.js` file and modify the `ADMIN_EMAILS` array:

```javascript
// Admin emails (you can modify this list)
const ADMIN_EMAILS = [
 'mounir.webdev.tms@gmail.com',
 'nooralmaarifa22@gmail.com',
 
  'your-admin-email@gmail.com'
  // Add more admin emails as needed
];
```

### 2. Admin Privileges

Users with admin email addresses will have access to:

- **Image Management**: Upload, view, and delete gallery images
- **Contact Messages**: View and manage contact form submissions
- **Message Status**: Mark messages as "replied" or "new"
- **Statistics Dashboard**: View message counts and analytics

### 3. Security Considerations

⚠️ **Important Security Notes:**

- Admin emails are defined client-side for demonstration purposes
- For production environments, implement server-side role verification
- Consider using Firebase Security Rules for enhanced security
- Regularly review and update admin email lists

### 4. Firebase Security Rules (Recommended)

For production deployment, implement these Firestore security rules:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Gallery collection - read for all, write for admins only
    match /gallery/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in [
          'nooralmaarifa22@gmail.com',
          'admin@noor-al-maarifa.com'
        ];
    }
    
    // Contact messages - read/write for admins only
    match /contact-messages/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in [
          'nooralmaarifa22@gmail.com',
          'admin@noor-al-maarifa.com'
        ];
    }
  }
}
```

### 5. Firebase Storage Rules

```javascript
// Storage Security Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in [
          'nooralmaarifa22@gmail.com',
          'admin@noor-al-maarifa.com'
        ];
    }
  }
}
```

### 6. Usage Instructions

#### For Regular Users
- Browse the gallery to view company images
- Use the contact form to send inquiries
- Sign in with Google to see personalized content

#### For Administrators
1. **Sign In**: Use Google Sign-In with an admin email address
2. **Access Admin Panel**: Admin controls will appear automatically
3. **Manage Images**: Switch to "Image Management" tab to upload/delete images
4. **Handle Messages**: Switch to "Contact Messages" tab to view and manage inquiries
5. **Update Status**: Mark messages as replied when handled

### 7. Limitations and Considerations

- **File Size**: Maximum 5MB per image, 5 images per upload
- **Image Formats**: Supports common image formats (JPG, PNG, GIF, etc.)
- **Message Storage**: All contact messages are stored in Firestore
- **Authentication**: Requires Google account for admin access

## 🔧 Customization

### Adding New Content
- Edit `index.html` for structure changes
- Update `styles.css` for styling
- Modify `script.js` for functionality

### Updating Images
- Replace `image.jpeg` with your hero image
- Update `logo.svg` with your logo

### Firebase Configuration
- Update `firebase.json` for hosting settings
- Configure project settings in Firebase Console

## 📞 Support

For technical support or questions about the website, please contact:
- **Email**: nooralmaarifa22@gmail.com
- **Phone**: +971 555 505 618

## 📄 License

© 2024 Noor Al Maarifa Trading L.L.C. All rights reserved.
