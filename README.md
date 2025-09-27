# AI Interior Canvas# ADARIZ - AI Interior Design Platform# Adariz AI Interior Design Platform



A modern interior design platform powered by AI technology, built with React, TypeScript, and Supabase.



## 🌟 Features## DescriptionA production-ready AI-powered interior design platform that transforms your spaces using advanced ControlNet technology and provides personalized product recommendations from Adariz's curated collection.



- **User Authentication**: Secure login/register with email confirmationApplication web moderne de design d'intérieur assisté par intelligence artificielle utilisant ControlNet pour la préservation architecturale.

- **Style Quiz**: Personalized interior style recommendations

- **Room Measurements**: Professional measurement tools## 🚀 Features

- **AI Room Generation**: Advanced room design generation (Coming Soon)

- **Product Catalog**: Curated furniture and decor products## Technologies

- **Shopping Cart**: Complete e-commerce functionality

- **User Dashboard**: Project management and favorites- **Frontend**: React 18 + TypeScript + Vite### ✨ AI-Powered Room Generation

- **Admin Panel**: Content and user management

- **Responsive Design**: Mobile-first approach with Tailwind CSS- **UI**: Tailwind CSS + Radix UI- **Real AI Integration**: Uses Replicate ControlNet for structure-preserving room transformations



## 🛠️ Tech Stack- **Backend**: Supabase- **Multiple Style Options**: 6 predefined styles (Modern Minimalist, Scandinavian, Industrial, Bohemian, Luxury Classic, Mediterranean)



- **Frontend**: React 18 + TypeScript + Vite- **IA**: Replicate ControlNet- **Spatial Awareness**: Preserves room dimensions and layout while applying new design styles

- **Styling**: Tailwind CSS + shadcn/ui components

- **Backend**: Supabase (Authentication, Database, Storage)- **Paiements**: Stripe- **High-Quality Results**: Professional-grade image generation with fallback mechanisms

- **State Management**: React Context + Hooks

- **Routing**: React Router v6

- **Build Tool**: Vite

- **Package Manager**: npm/bun## Installation### 🛍️ Complete E-Commerce Platform



## 📁 Project Structure- **Shopping Cart**: Full cart management with quantity updates and product variations



```1. **Cloner le projet**- **Secure Checkout**: Integrated payment processing with Stripe

src/

├── components/          # Reusable UI components```bash- **Order Management**: Complete order tracking and history

│   ├── layout/         # Header, Footer components

│   └── ui/             # shadcn/ui component librarygit clone [URL_DU_REPO]- **Shipping Calculator**: Dynamic shipping costs with free shipping thresholds

├── contexts/           # React Context providers

├── hooks/              # Custom React hookscd ai-interior-canvas-main- **Wishlist**: Save favorite products for later

├── integrations/       # Third-party integrations

│   └── supabase/      # Supabase client & types```

├── lib/               # Utility libraries

├── pages/             # Page components (routes)### 🎨 Professional User Experience

└── services/          # API services & business logic

```2. **Installer les dépendances**- **Drag & Drop Upload**: Intuitive image upload with validation



## 🚀 Getting Started```bash- **Real-time Progress**: Visual feedback during AI generation



### Prerequisitesnpm install- **Responsive Design**: Optimized for all devices



- Node.js 18+ or Bun runtime```- **Error Handling**: Comprehensive error management and user feedback

- Supabase account

- Git- **Toast Notifications**: Real-time user notifications



### Installation3. **Configuration des variables d'environnement**



1. **Clone the repository**```bash### 📱 Modern Tech Stack

   ```bash

   git clone https://github.com/AYA8718/ADARIZ-AI.gitcp .env.example .env- **React 18** with TypeScript

   cd ai-interior-canvas-main

   ```# Remplir les variables dans .env- **Vite** for lightning-fast development



2. **Install dependencies**```- **Tailwind CSS** for utility-first styling

   ```bash

   npm install- **Radix UI** for accessible components

   # or

   bun install4. **Lancement en développement**- **Supabase** for backend services

   ```

```bash- **React Router** for navigation

3. **Environment Setup**

   - Copy `.env.example` to `.env`npm run dev- **Sonner** for notifications

   - Fill in your Supabase credentials:

   ```env```

   VITE_SUPABASE_URL=your_supabase_url

   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key## 🛠️ Installation & Setup

   ```

5. **Build de production**

4. **Database Setup**

   - Set up your Supabase project```bash### Prerequisites

   - Run the SQL scripts in the `supabase/` directory

   - Configure authentication settings in Supabase dashboardnpm run build- Node.js 18+ 



5. **Start Development Server**```- npm or yarn

   ```bash

   npm run dev- Git

   # or

   bun dev## Variables d'environnement requises

   ```

### 1. Clone the Repository

6. **Open your browser**

   Navigate to `http://localhost:5173````env```bash



## 🔧 Available Scripts# Supabase (Requis)git clone <repository-url>



```bashVITE_SUPABASE_URL=your_supabase_urlcd ai-interior-canvas-main

npm run dev          # Start development server

npm run build        # Build for productionVITE_SUPABASE_ANON_KEY=your_supabase_anon_key```

npm run preview      # Preview production build

npm run lint         # Run ESLint

npm run type-check   # Run TypeScript compiler check

```# Replicate IA (Optionnel - mode démo sans)### 2. Install Dependencies



## 🗄️ Database SchemaVITE_REPLICATE_API_TOKEN=your_replicate_token```bash



The application uses Supabase with the following main tables:npm install

- `users` - User profiles and authentication

- `products` - Product catalog# Stripe (Optionnel - simulation sans)```

- `user_projects` - User design projects

- `user_favorites` - User favorite productsVITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

- `cart_items` - Shopping cart functionality

```### 3. Environment Configuration

## 🎨 UI Components

Copy the example environment file and configure your API keys:

Built with **shadcn/ui** component library:

- Modern, accessible components## Fonctionnalités

- Customizable with Tailwind CSS

- Consistent design system```bash

- Dark/light mode ready

- ✅ Quiz de style interactifcp .env.example .env

## 🔐 Authentication

- ✅ Génération IA avec ControlNet```

- Email/password authentication via Supabase

- Email confirmation required- ✅ E-commerce intégré

- Protected routes with auth guards

- User profile management- ✅ Authentification utilisateurUpdate `.env` with your credentials:



## 🛒 E-commerce Features- ✅ Interface responsive



- Product browsing and search- ✅ Système de fallback robuste```env

- Shopping cart functionality

- User favorites system# AI Service Configuration

- Order management (coming soon)

- Payment integration (coming soon)## DéploiementVITE_REPLICATE_API_TOKEN=your_replicate_api_token_here



## 🚧 Upcoming FeaturesVITE_OPENAI_API_KEY=your_openai_api_key_here



- **AI Room Generation**: Complete AI-powered room designLe projet est optimisé pour Vercel :VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

- **3D Room Visualization**: Interactive 3D room previews

- **Advanced Measurements**: AR-powered measurement tools```bash

- **Payment Processing**: Stripe integration

- **Mobile App**: React Native companion appnpx vercel --prod# Supabase Configuration



## 🤝 Contributing```VITE_SUPABASE_URL=your_supabase_url_here



1. Fork the repositoryVITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add amazing feature'`)## License

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull RequestMIT# Stripe Configuration (for payments)

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

## 📄 License

# API Configuration

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.VITE_API_BASE_URL=http://localhost:3001



## 🆘 Support# Instagram Integration (optional)

VITE_INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

For support and questions:VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here

- Create an issue on GitHub```

- Contact: [Your Email]

- Documentation: [Your Docs URL]### 4. Start Development Server

```bash

## 🏗️ Architecture Notesnpm run dev

```

- **Services Layer**: Clean separation of business logic

- **Component Library**: Reusable UI components with consistent stylingThe application will be available at `http://localhost:5173`

- **Type Safety**: Full TypeScript implementation

- **Real-time Updates**: Supabase real-time subscriptions## 🔧 Production Deployment

- **Performance**: Optimized with React best practices

- **Scalability**: Modular architecture for easy expansion### Build for Production

```bash

---npm run build

```

**Made with ❤️ by the ADARIZ Development Team**
### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the deployment prompts

### Deploy to Netlify
1. Build: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🎯 API Keys Setup

### Replicate API (Primary AI Service)
1. Sign up at [replicate.com](https://replicate.com)
2. Generate an API token
3. Add to `VITE_REPLICATE_API_TOKEN`

### OpenAI API (Fallback)
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `VITE_OPENAI_API_KEY`

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Get URL and anon key from Settings > API
3. Add to environment variables

### Stripe Setup (For Payments)
1. Create account at [stripe.com](https://stripe.com)
2. Get publishable key from developers section
3. Add to `VITE_STRIPE_PUBLISHABLE_KEY`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Footer
│   └── ui/             # Radix UI components
├── pages/              # Route components
│   ├── RoomGeneration.tsx
│   ├── ShoppingCart.tsx
│   └── ...
├── services/           # Business logic
│   ├── AIRoomGenerationService.ts
│   ├── ECommerceService.ts
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utilities
└── integrations/       # External service integrations
```

## 🔄 Usage Workflow

1. **Upload Room Photo**: Users drag and drop or select an image of their room
2. **Select Style**: Choose from 6 predefined interior design styles
3. **Set Dimensions**: Input room measurements for accurate scaling
4. **AI Generation**: Advanced ControlNet processes the image preserving structure
5. **View Results**: Side-by-side comparison of original vs. generated design
6. **Product Recommendations**: AI-matched Adariz products displayed
7. **Shopping Experience**: Add products to cart and complete purchase

## 🛡️ Error Handling

The application includes comprehensive error handling:
- **Network Failures**: Automatic fallback to alternative AI services
- **Invalid Uploads**: File type and size validation
- **API Errors**: User-friendly error messages
- **Payment Issues**: Secure error handling for transactions

## 🎨 Customization

### Adding New Styles
Edit `src/services/AIRoomGenerationService.ts`:

```typescript
const roomStyles: RoomStyle[] = [
  {
    id: 'new-style',
    name: 'New Style',
    description: 'Your style description',
    tags: ['tag1', 'tag2', 'tag3']
  },
  // ... existing styles
];
```

### Modifying Products
Update the product catalog in `getCuratedProducts()` method or integrate with your product API.

## 📊 Performance

- **Image Generation**: 15-30 seconds average processing time
- **Fallback Systems**: Multiple AI providers ensure 99%+ uptime
- **Optimized Assets**: Image compression and lazy loading
- **CDN Ready**: Static assets optimized for CDN deployment

## 🔐 Security

- **API Key Protection**: Environment variables for sensitive data
- **Input Validation**: File upload restrictions and sanitization
- **Secure Payments**: Stripe integration with PCI compliance
- **HTTPS Enforcement**: SSL/TLS encryption for all communications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🎉 Acknowledgments

- **ControlNet Technology** for advanced AI image generation
- **Adariz** for product catalog and design inspiration
- **Open Source Community** for the excellent libraries and tools

---

**Built with ❤️ for the future of interior design**
