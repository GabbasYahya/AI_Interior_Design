# 🏗️ AI Interior Canvas - Detailed Class Diagram & Architecture

## 📋 Overview

This document provides a comprehensive class diagram and architectural overview of the AI Interior Canvas application, showing the relationships between database entities, React components, and services.

## 🎯 Core Architecture Layers

### 1. **Data Layer (Database Entities)**
- **User Management**: `User`, `Profile` with plan types and credits
- **Project Management**: `Project` with room types, styles, and status
- **Spatial Data**: `RoomMeasurements` with doors, windows, obstacles
- **Media Management**: `RoomPhoto` with different photo types
- **AI Processing**: `AIDesign` with generated content and processing status
- **User Interaction**: `StyleQuizResult`, `Favorite`, `ProductRecommendation`

### 2. **Service Layer**
- **Authentication Service**: `useSupabaseAuth` hook
- **Database Service**: `SupabaseClient` with type safety
- **Storage Service**: File upload/download for images and avatars
- **AI Service**: Design generation and analysis (future implementation)

### 3. **Presentation Layer (React Components)**
- **Authentication**: `AuthComponent` with tabs and validation
- **Profile Management**: `UserProfileComponent` with editing capabilities
- **File Upload**: `RoomPhotoUpload` with drag & drop
- **Dashboard**: Project overview and management

## 🔄 Key Relationships & Workflows

### User Registration & Profile Flow:
```
User Registration → Profile Creation → Plan Assignment → Credit Allocation
```

### Project Creation Flow:
```
User → Create Project → Add Measurements → Upload Photos → Generate AI Design → Get Recommendations
```

### AI Design Generation Flow:
```
Project + Photos + Style Preferences → AI Processing → Generated Images + Design Elements → Product Recommendations
```

## 📊 Database Schema Highlights

### Core Tables:
1. **profiles** - User information and preferences
2. **projects** - Interior design projects
3. **room_measurements** - 3D spatial data
4. **room_photos** - Image storage metadata
5. **ai_designs** - AI-generated content
6. **style_quiz_results** - User style analysis
7. **favorites** - User favorites system
8. **product_recommendations** - Shopping suggestions

### Key Features:
- **Row Level Security (RLS)** on all tables
- **UUID primary keys** for scalability
- **JSON columns** for flexible data storage
- **Proper foreign key relationships**
- **Automatic timestamps** with triggers

## 🎨 Component Architecture

### Authentication System:
- **Multi-tab interface**: Sign In, Sign Up, Password Reset
- **Form validation** with real-time feedback
- **Toast notifications** for user feedback
- **Password visibility toggle**

### Profile Management:
- **Avatar upload** with drag & drop
- **Editable profile fields**
- **Plan type badges** (Free, Premium, Pro)
- **Credit tracking** and statistics

### File Upload System:
- **Multiple file support** (up to 10 photos)
- **File validation** (size, type)
- **Progress tracking** during upload
- **Photo gallery** with delete functionality
- **Supabase Storage integration**

## 🔐 Security & Permissions

### Row Level Security Policies:
```sql
-- Users can only access their own data
CREATE POLICY "Users can manage own projects" 
    ON projects FOR ALL 
    USING (auth.uid() = user_id);

-- Nested security for related data
CREATE POLICY "Users can manage photos for own projects" 
    ON room_photos FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = room_photos.project_id 
            AND projects.user_id = auth.uid()
        )
    );
```

### File Storage Security:
- **User-specific folders** in storage buckets
- **File type validation** on upload
- **Size limits** to prevent abuse
- **Secure URL generation** for image access

## 📱 Responsive Design Features

### Mobile-First Components:
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly interfaces** for mobile devices
- **Optimized image loading** for different screen densities
- **Accessible navigation** patterns

### UI/UX Highlights:
- **shadcn/ui components** for consistent design
- **Loading states** for better user experience
- **Error handling** with helpful messages
- **Success feedback** with animations

## 🚀 Future Extensibility

### Planned AI Integration Points:
1. **Style Analysis AI** - Analyze user preferences from quiz
2. **Room Recognition AI** - Identify furniture and layout from photos
3. **Design Generation AI** - Create design suggestions
4. **Product Matching AI** - Suggest real products from catalogs

### Scalability Considerations:
- **Microservice-ready architecture**
- **API-first design** for mobile app integration
- **Caching strategies** for frequently accessed data
- **Background job processing** for AI operations

## 📈 Performance Optimizations

### Database Optimizations:
```sql
-- Performance indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_room_photos_project_id ON room_photos(project_id);
CREATE INDEX idx_ai_designs_project_id ON ai_designs(project_id);
```

### Frontend Optimizations:
- **Lazy loading** for components and images
- **Optimistic updates** for better UX
- **Debounced search** to reduce API calls
- **Image compression** before upload

## 🧪 Testing Strategy

### Component Testing:
- **Unit tests** for hooks and utilities
- **Integration tests** for component interactions
- **E2E tests** for critical user flows
- **Visual regression tests** for UI consistency

### Database Testing:
- **RLS policy verification**
- **Data integrity constraints**
- **Performance benchmarking**
- **Security penetration testing**

This architecture provides a solid foundation for building a comprehensive AI-powered interior design application with room for growth and feature expansion! 🎨✨
