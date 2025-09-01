
# نور المعرفة - موقع شركة تكنولوجيا المعلومات

موقع إلكتروني حديث لشركة "نور المعرفة" المختصة في تكنولوجيا المعلومات، مبني بتقنيات React و TypeScript الحديثة.

## 🌟 المميزات

- **تصميم متجاوب**: يعمل بشكل مثالي على جميع الأجهزة
- **نظام الثيمات المتقدم**: دعم الوضع الليلي/النهاري مع انتقالات سلسة
- **الأداء العالي**: تحسينات للسرعة والأداء
- **نظام إدارة محتوى**: لوحة تحكم للإدارة
- **أمان متقدم**: نظام مصادقة Firebase
- **SEO محسن**: تحسين محركات البحث
- **تجربة مستخدم ممتازة**: تصميم حديث وسهل الاستخدام

## 🚀 التقنيات المستخدمة

- **Frontend**: React 18, TypeScript, Vite
- **التوجيه**: React Router v6
- **الأيقونات**: Lucide React
- **التصميم**: CSS Modules مع نظام متغيرات CSS متقدم
- **المصادقة**: Firebase Authentication
- **قاعدة البيانات**: Firebase Firestore
- **الاستضافة**: Firebase Hosting
- **الاختبارات**: Vitest, React Testing Library

## 📁 هيكل المشروع

```
src/
├── components/          # مكونات React
│   ├── admin/          # مكونات لوحة الإدارة
│   ├── common/         # مكونات مشتركة
│   └── layout/         # مكونات التخطيط
├── contexts/           # React Contexts
├── pages/              # صفحات التطبيق
├── styles/             # ملفات التصميم
├── utils/              # دوال مساعدة
├── types/              # تعريفات TypeScript
└── config/             # إعدادات التطبيق
```

## 🛠️ التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المستودع**
```bash
git clone <repository-url>
cd noor-al-maarifa-website
```

2. **تثبيت المتطلبات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.local.example .env.local
```

4. **تحديث ملف `.env.local` بإعدادات Firebase الخاصة بك:**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **تشغيل التطبيق في وضع التطوير**
```bash
npm run dev
```

6. **الوصول للتطبيق**
افتح المتصفح على: `http://localhost:3000`

## 🔐 نظام المصادقة

### إعداد Firebase Authentication

1. **إنشاء مشروع Firebase**
   - اذهب إلى [Firebase Console](https://console.firebase.google.com/)
   - أنشئ مشروع جديد أو استخدم مشروع موجود

2. **تفعيل Authentication**
   - اذهب إلى Authentication > Sign-in method
   - فعل "Email/Password"

3. **إضافة مستخدم إداري**
   ```bash
   # في Firebase Console > Authentication > Users
   # انقر على "Add user" وأدخل:
   Email: admin@noor-almaarifa.com
   Password: [كلمة مرور قوية]
   ```

4. **إعداد Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // السماح للمصادقين فقط
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### إعداد المستخدم الإداري

**خطوات إنشاء حساب إداري في Firebase:**

1. **الدخول إلى Firebase Console**
   ```bash
   # افتح https://console.firebase.google.com/
   # اختر مشروعك > Authentication > Users
   ```

2. **إضافة مستخدم جديد**
   - انقر على "Add user"
   - أدخل البيانات التالية:
   ```
   البريد الإلكتروني: admin@noor-almaarifa.com
   كلمة المرور: [كلمة مرور قوية - مثال: NoorAdmin2024!]
   ```

3. **بيانات تسجيل الدخول**
   ```
   البريد الإلكتروني: admin@noor-almaarifa.com
   كلمة المرور: NoorAdmin2024!
   ```

4. **إضافة مستخدمين إضافيين (اختياري)**
   ```
   البريد الإلكتروني: manager@noor-almaarifa.com
   كلمة المرور: NoorManager2024!
   
   البريد الإلكتروني: editor@noor-almaarifa.com
   كلمة المرور: NoorEditor2024!
   ```

**⚠️ ملاحظات أمنية مهمة:**
- غير كلمات المرور الافتراضية فوراً في الإنتاج
- استخدم كلمات مرور قوية (12 حرف على الأقل)
- فعل المصادقة الثنائية للحسابات الإدارية
- راجع قواعد الحماية في Firestore بانتظام

## 🎨 نظام الثيمات

التطبيق يدعم ثلاثة أوضاع للثيمات:

- **الوضع الفاتح (Light)**: الثيم الافتراضي
- **الوضع الداكن (Dark)**: ثيم داكن لراحة العيون
- **وضع النظام (System)**: يتبع إعدادات النظام تلقائياً

### استخدام الثيمات في المكونات

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div className={`component ${effectiveTheme === 'dark' ? 'dark' : 'light'}`}>
      <button onClick={toggleTheme}>تبديل الثيم</button>
    </div>
  );
};
```

## 📱 الاستجابة والتوافق

- **متوافق مع جميع المتصفحات الحديثة**
- **تصميم متجاوب**: من الهواتف المحمولة إلى الشاشات الكبيرة
- **دعم الـ PWA**: يمكن تثبيته كتطبيق
- **أداء محسن**: تحميل سريع وتفاعل سلس

## 🔧 الأوامر المتاحة

```bash
# تشغيل التطوير
npm run dev

# البناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# تشغيل الاختبارات
npm run test

# فحص الكود
npm run lint

# إصلاح مشاكل الكود
npm run lint:fix

# فحص الأنواع
npm run type-check
```

## 🚀 النشر

### النشر على Firebase Hosting

1. **تثبيت Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **تسجيل الدخول إلى Firebase**
```bash
firebase login
```

3. **بناء التطبيق**
```bash
npm run build
```

4. **النشر**
```bash
firebase deploy
```

### النشر على منصات أخرى

التطبيق يدعم النشر على جميع منصات الاستضافة الثابتة مثل:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 🛡️ الأمان

- **مصادقة Firebase**: نظام مصادقة آمن ومتقدم
- **حماية المسارات**: منع الوصول غير المصرح به
- **التحقق من الصحة**: التحقق من البيانات في الواجهة والخادم
- **HTTPS إجباري**: جميع الاتصالات مشفرة

## 🧪 الاختبارات

```bash
# تشغيل جميع الاختبارات
npm run test

# تشغيل الاختبارات مع المراقبة
npm run test:watch

# تقرير التغطية
npm run test:coverage
```

## 📝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📞 التواصل

- **الموقع الإلكتروني**: [noor-almaarifa.com](https://noor-almaarifa.com)
- **البريد الإلكتروني**: info@noor-almaarifa.com
- **الهاتف**: +966 XX XXX XXXX

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر وتقدير

- فريق React لتطوير مكتبة رائعة
- فريق Firebase لخدمات الباك إند
- مجتمع المطورين العرب للدعم والإلهام

---

**نور المعرفة** - إضاءة طريق التكنولوجيا 🌟
