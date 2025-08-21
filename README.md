# Adariz - AI Interior Design Platform

A comprehensive AI-powered interior design platform that revolutionizes how users approach space transformation through intelligent recommendations, style analysis, and product integration.

## 🌟 Overview

Adariz is a modern React-based web application that combines artificial intelligence with interior design expertise to provide personalized design solutions. The platform offers style quizzes, room measurements, product recommendations, and seamless integration with furniture catalogs.

## 🚀 Key Features

### Core Functionality
- **AI-Powered Style Analysis**: Intelligent style quiz that determines user preferences
- **Room Measurement Tools**: Digital measurement capture and room analysis
- **Product Catalog Integration**: Real-time furniture API integration with advanced filtering
- **Authentication System**: Secure user management with Supabase
- **Responsive Design**: Mobile-first approach with modern UI/UX

### User Experience
- **Interactive Style Quiz**: 16 design styles with visual selections
- **Room Type Support**: Living room, bedroom, kitchen, bathroom, and more
- **Smart Recommendations**: AI-driven product suggestions based on style and space
- **User Dashboard**: Personalized project management and progress tracking

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with Hooks and Context API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend & Services
- **Supabase** - Authentication, database, and real-time features
- **Furniture API** - External product catalog integration
- **Real-time Updates** - Hot module replacement for development

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **Custom Components** - Tailored UI elements for design consistency

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components (Header, Footer)
│   └── ProductCatalog.tsx  # Product display component
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── StyleQuiz.tsx      # Style assessment
│   ├── Measurements.tsx   # Room measurement
│   ├── Dashboard.tsx      # User dashboard
│   ├── Products.tsx       # Product catalog
│   └── Profile.tsx        # User profile
├── services/
│   ├── furnitureAPIService.ts     # External API integration
│   └── productCatalogService.ts   # Product management
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
└── integrations/
    └── supabase/          # Database and auth configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and authentication)

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development
```bash
npm run dev
```
Access the application at `http://localhost:8080`

### Production Build
```bash
npm run build
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profile information
- **projects** - User design projects
- **style_quiz_results** - Quiz outcomes and preferences
- **room_measurements** - Spatial data and dimensions
- **products** - Product catalog (if using local storage)

## 🔌 API Integration

### Furniture API
The platform integrates with external furniture APIs for real-time product data:
- **Product Search** - Advanced filtering by style, price, category
- **Recommendations** - AI-driven product suggestions
- **Real-time Inventory** - Stock status and availability
- **Rate Limiting** - Intelligent request management

## 🎨 Design System

### Style Guidelines
- **Modern Aesthetic** - Clean, minimalist interface
- **Color Palette** - Emerald and blue gradients with neutral grays
- **Typography** - System fonts with clear hierarchy
- **Responsive Design** - Mobile-first with desktop optimization

### Component Library
- Consistent styling across all components
- Accessible design patterns
- Reusable component architecture
- Theme-aware styling system

## 🚦 Getting Started (Manager Guide)

### Phase 1: Initial Setup (Week 1)
1. Set up development environment
2. Configure Supabase database
3. Test authentication flow
4. Verify API integrations

### Phase 2: Core Features (Weeks 2-3)
1. Style quiz functionality
2. Room measurement tools
3. Product catalog integration
4. User dashboard implementation

### Phase 3: Enhancement (Week 4)
1. Advanced filtering
2. User experience optimization
3. Performance improvements
4. Testing and deployment

## 🔮 Future Development Roadmap

### Immediate Enhancements
- **AI Image Recognition** - Upload room photos for analysis
- **3D Visualization** - Room rendering with selected products
- **Social Features** - Share designs and get feedback
- **Advanced Analytics** - User behavior and preference tracking

### Long-term Features
- **AR Integration** - Augmented reality product placement
- **Professional Services** - Connect with interior designers
- **E-commerce Integration** - Direct product purchasing
- **Mobile Application** - Native iOS/Android apps

## 📊 Performance & Scalability

### Current Metrics
- **Build Time**: ~560ms (Vite)
- **Bundle Size**: Optimized for web performance
- **API Rate Limits**: 500 requests/day (development)
- **Database**: Serverless scaling with Supabase

### Optimization Strategies
- Code splitting and lazy loading
- Image optimization and CDN usage
- Caching strategies for API responses
- Progressive web app capabilities

## 🔒 Security & Privacy

### Authentication
- Secure JWT-based authentication
- Password hashing and encryption
- Email verification workflow
- Session management

### Data Protection
- GDPR compliance considerations
- Secure API endpoints
- Data encryption in transit and at rest
- User consent management

## 📈 Business Value

### User Benefits
- **Time Savings** - Rapid design decision-making
- **Cost Efficiency** - Avoid expensive design mistakes
- **Personalization** - Tailored recommendations
- **Convenience** - All-in-one design platform

### Business Metrics
- **User Engagement** - Style quiz completion rates
- **Conversion** - Project creation and completion
- **Retention** - Return user analytics
- **Revenue** - Product affiliate commissions

## 🤝 Contributing

### Development Workflow
1. Create feature branches from `main`
2. Follow TypeScript and ESLint conventions
3. Write comprehensive tests
4. Submit pull requests with detailed descriptions

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Component documentation

## 📞 Support & Contact

For technical questions or business inquiries:
- **Email**: contact@adariz.com
- **Phone**: +33 1 23 45 67 89
- **Location**: Paris, France

---

**Adariz** - Transforming spaces with artificial intelligence. © 2025 All rights reserved.
