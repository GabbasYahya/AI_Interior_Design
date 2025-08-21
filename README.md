# 🏠 AI Interior Canvas

> *Transforming interior design through artificial intelligence - making beautiful, personalized living spaces accessible to everyone.*

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-blue.svg)](https://tailwindcss.com/)

## ✨ Features

- 🔐 **Secure Authentication** - Multi-tab sign-in/up with profile management
- 🏗️ **Project Management** - Create and manage multiple interior design projects
- 📐 **3D Room Measurements** - Precise spatial data with doors, windows, and obstacles
- 📸 **Photo Upload System** - Drag & drop with gallery and cloud storage
- 🎨 **Style Analysis** - AI-powered quiz to determine design preferences
- 🤖 **AI Design Generation** - Coming soon: Style-based design creation
- 🛍️ **Product Recommendations** - Smart suggestions with pricing and links
- ❤️ **Favorites System** - Save and organize your favorite designs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interior-canvas.git
   cd ai-interior-canvas
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Copy and run the SQL from `database-schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Consistent iconography

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File storage and CDN
- **Row Level Security** - Database-level security policies

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── AuthComponent.tsx
│   ├── UserProfileComponent.tsx
│   └── RoomPhotoUpload.tsx
├── hooks/              # Custom React hooks
│   ├── useSupabaseAuth.ts
│   └── use-toast.ts
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Measurements.tsx
│   └── StyleQuiz.tsx
└── App.tsx             # Main application component
```

## 🗄️ Database Schema

The application uses 8 core tables:

- **`profiles`** - User accounts and preferences
- **`projects`** - Interior design projects
- **`room_measurements`** - 3D spatial data
- **`room_photos`** - Image metadata and storage
- **`ai_designs`** - AI-generated design results
- **`style_quiz_results`** - User style preferences
- **`favorites`** - User favorites system
- **`product_recommendations`** - Shopping suggestions

See `database-schema.sql` for the complete schema with relationships and security policies.

## 🎨 Usage Examples

### Authentication
```tsx
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function MyComponent() {
  const { user, profile, signOut } = useSupabaseAuth();
  
  if (!user) return <AuthComponent />;
  
  return <div>Welcome {profile?.full_name}!</div>;
}
```

### Photo Upload
```tsx
import { RoomPhotoUpload } from '@/components/RoomPhotoUpload';

function ProjectPage() {
  return (
    <RoomPhotoUpload 
      projectId="project-uuid"
      onPhotoUploaded={(photo) => console.log('Uploaded:', photo)}
    />
  );
}
```

## 📖 Documentation

- **[Project Description](PROJECT_DESCRIPTION.md)** - Complete feature overview
- **[Executive Summary](EXECUTIVE_SUMMARY.md)** - Business and technical summary
- **[Architecture](ARCHITECTURE.md)** - Detailed system architecture
- **[Class Diagrams](CLASS_DIAGRAM_DOCS.md)** - UML diagrams and relationships
- **[Setup Guide](SETUP_COMPLETE.md)** - Implementation completion status

---

## Project Development Info

**Lovable Project URL**: https://lovable.dev/projects/ec94d9fc-46eb-47cf-80fb-c8fff236ffd4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ec94d9fc-46eb-47cf-80fb-c8fff236ffd4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ec94d9fc-46eb-47cf-80fb-c8fff236ffd4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
