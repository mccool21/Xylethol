# Xylethol - Smart Alert Management & Feature Toggle Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

Xylethol is a comprehensive, open-source platform for managing user alerts and feature toggles. It combines a powerful admin dashboard with a lightweight client widget system, enabling sophisticated user targeting and real-time feature management.

## 🚀 Features

### Alert Management
- ✅ **Smart Alert Delivery** - Target alerts based on user attributes, location, account type, and page context
- ✅ **Flexible Scheduling** - Set precise activation windows with timezone support
- ✅ **Multiple Themes** - Choose from default, minimal, or modern alert designs
- ✅ **Real-time Updates** - Auto-refresh capabilities and instant alert delivery
- ✅ **Analytics Integration** - Track alert engagement and user interactions

### Feature Toggle System
- ✅ **Advanced User Targeting** - Segment users by type, location, plan tier, activity level, and more
- ✅ **Percentage Rollouts** - Gradually roll out features to user subsets
- ✅ **Performance Optimized** - Built-in caching and preloading capabilities
- ✅ **React Integration** - Dedicated React hooks for seamless feature flag usage
- ✅ **SPA Support** - Page change detection for single-page applications

### Admin Dashboard
- ✅ **Intuitive Interface** - Modern, responsive admin panel built with Next.js
- ✅ **Real-time Status** - Visual indicators for active, scheduled, and disabled alerts
- ✅ **Bulk Operations** - Manage multiple alerts and features efficiently
- ✅ **Database Management** - Built-in Prisma Studio integration

### Client Widget
- ✅ **Unified Library** - Single JavaScript file for both alerts and feature toggles
- ✅ **Lightweight** - Minimal footprint with no external dependencies
- ✅ **Framework Agnostic** - Works with any website or web application
- ✅ **Auto-initialization** - Simple script tag setup with configuration

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/xylethol.git
cd xylethol
npm install
```

### 2. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to access the admin dashboard.

### 4. Integrate the Widget

Add the Xylethol widget to any website:

```html
<!-- Simple Auto-initialization -->
<script src="https://your-domain.com/xylethol-widget.js" 
        data-xylethol-config='{
          "alerts": {
            "apiUrl": "https://your-domain.com/api/alerts/widget"
          },
          "features": {
            "apiUrl": "https://your-domain.com/api/features/check",
            "userId": "user123"
          }
        }'>
</script>
```

## 🛠 Widget Usage Examples

### Basic Alert Integration

```javascript
// Initialize with custom configuration
Xylethol.init({
  alerts: {
    apiUrl: 'https://your-domain.com/api/alerts/widget',
    position: 'fixed-top',
    theme: 'modern',
    autoRefresh: true
  },
  userAttributes: {
    userType: 'premium',
    location: 'US',
    planTier: 'pro'
  }
});
```

### Feature Toggle Usage

```javascript
// Check individual features
const newDashboardEnabled = await Xylethol.checkFeature('new_dashboard');
if (newDashboardEnabled) {
  // Show new dashboard
}

// Check multiple features
const features = await Xylethol.checkFeatures([
  'beta_checkout',
  'premium_analytics',
  'mobile_app'
]);

// Preload for better performance
await Xylethol.preloadFeatures(['critical_feature_1', 'critical_feature_2']);
```

### React Integration

```jsx
import { useXylethol } from 'path/to/xylethol-widget';

function FeatureComponent() {
  const { isEnabled, loading, error } = useXylethol('new_feature');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return isEnabled ? <NewFeature /> : <OldFeature />;
}
```

## 📊 User Targeting

Xylethol supports sophisticated user targeting based on multiple attributes:

```javascript
Xylethol.setUserAttributes({
  userType: 'premium',      // 'free', 'trial', 'premium', 'enterprise'
  location: 'US',           // 'US', 'CA', 'UK', 'EU', 'APAC', 'OTHER'
  accountAge: 'established', // 'new', 'established', 'veteran'
  activityLevel: 'high',    // 'high', 'medium', 'low'
  planTier: 'pro',          // 'basic', 'pro', 'enterprise', 'custom'
  currentPage: '/dashboard' // Automatic page detection available
});
```

## 🔧 API Endpoints

### Alert Management
- `GET /api/alerts` - Fetch all alerts
- `POST /api/alerts` - Create new alert
- `GET /api/alerts/:id` - Fetch specific alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert
- `POST /api/alerts/widget` - Widget alert delivery endpoint

### Feature Toggle Management
- `GET /api/features` - Fetch all features
- `POST /api/features` - Create new feature
- `GET /api/features/:id` - Fetch specific feature
- `PUT /api/features/:id` - Update feature
- `DELETE /api/features/:id` - Delete feature
- `POST /api/features/check` - Widget feature check endpoint

### Analytics (Optional)
- `POST /api/analytics/events` - Track user interactions and feature usage

## 📁 Project Structure

```
├── pages/
│   ├── api/
│   │   ├── alerts/              # Alert management API
│   │   ├── features/            # Feature toggle API
│   │   └── analytics/           # Analytics tracking API
│   ├── _app.tsx                 # Next.js app component
│   └── index.tsx                # Admin dashboard
├── components/
│   ├── AlertForm.tsx            # Alert creation/editing
│   ├── AlertList.tsx            # Alert management interface
│   ├── FeatureForm.tsx          # Feature toggle creation/editing
│   └── FeatureList.tsx          # Feature management interface
├── widget-code/
│   ├── xylethol-widget.js       # Client-side widget library
│   ├── alert-usage-examples.html        # Alert integration examples
│   ├── feature-toggle-examples.html     # Feature toggle examples
│   └── analytics-integration-examples.html # Analytics examples
├── lib/
│   └── prisma.ts                # Database client
├── prisma/
│   └── schema.prisma            # Database schema
└── styles/
    └── globals.css              # Global styles
```

## 🎨 Widget Themes

Xylethol includes three built-in themes:

- **Default**: Classic alert styling with clean borders and subtle shadows
- **Minimal**: Lightweight design with reduced visual elements
- **Modern**: Contemporary design with gradients and smooth animations

Custom themes can be created by extending the CSS classes or providing custom stylesheets.

## 🔍 Analytics & Monitoring

Track user engagement and feature adoption:

```javascript
Xylethol.init({
  alerts: {
    onAlertShow: (alert) => analytics.track('Alert Shown', alert),
    onAlertHide: (alertId) => analytics.track('Alert Dismissed', { alertId })
  },
  features: {
    onFeatureChange: (features) => analytics.track('Features Checked', features)
  }
});
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Migration
```bash
npx prisma migrate deploy
```

For production deployments, consider:
- Switching to PostgreSQL for better scalability
- Setting up proper environment variables
- Configuring CDN for widget delivery
- Implementing proper authentication and authorization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🗄️ Database Schema

### Alert Model
```sql
Alert {
  id          String   @id @default(cuid())
  title       String
  body        String
  isEnabled   Boolean  @default(true)
  isActiveFrom DateTime
  isActiveTo   DateTime
  targetRules Json?    // User targeting rules
  theme       String?  @default("default")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Feature Model
```sql
Feature {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  isEnabled   Boolean  @default(true)
  rolloutPercentage Int @default(0)
  targetRules Json?    // User targeting rules
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Prisma](https://prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by modern feature flag and alert management platforms

## 📞 Support

- 📚 [Documentation](https://github.com/yourusername/xylethol/wiki)
- 🐛 [Bug Reports](https://github.com/yourusername/xylethol/issues)
- 💬 [Discussions](https://github.com/yourusername/xylethol/discussions)

---

⭐ **Star us on GitHub** if you find Xylethol useful!