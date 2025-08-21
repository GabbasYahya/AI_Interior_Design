# Deployment Guide - Adariz Platform

This guide provides step-by-step instructions for deploying the Adariz platform to production environments.

## 🚀 Production Deployment

### Prerequisites
- Supabase production account
- Domain name (optional)
- Hosting platform account (Vercel, Netlify, or AWS)

### Environment Configuration

1. **Create production environment file:**
   ```bash
   cp .env.example .env.production
   ```

2. **Configure production variables:**
   ```env
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_anon_key
   VITE_FURNITURE_API_URL=https://furniture-api.fly.dev
   VITE_APP_ENV=production
   ```

### Database Setup

1. **Create Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the URL and anon key

2. **Run database schema:**
   ```sql
   -- Execute the contents of database-schema.sql
   -- in your Supabase SQL editor
   ```

3. **Enable Row Level Security:**
   - All tables should have RLS enabled
   - Policies are included in the schema

### Deployment Options

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

#### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Option 3: Traditional Hosting

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to your hosting provider**

### Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify API integrations
- [ ] Check responsive design on mobile
- [ ] Test product catalog functionality
- [ ] Validate style quiz flow
- [ ] Monitor performance metrics

### Monitoring & Maintenance

#### Performance Monitoring
- Use Vercel Analytics or Google Analytics
- Monitor Core Web Vitals
- Track user engagement metrics

#### Error Tracking
- Implement Sentry or similar service
- Monitor API response times
- Track user journey drop-offs

#### Regular Updates
- Update dependencies monthly
- Monitor security vulnerabilities
- Backup database regularly

### Troubleshooting

#### Common Issues
1. **Environment variables not loading:**
   - Ensure variables are prefixed with `VITE_`
   - Restart development server after changes

2. **Supabase connection issues:**
   - Verify URL and keys are correct
   - Check network connectivity
   - Validate RLS policies

3. **Build failures:**
   - Check TypeScript errors
   - Verify all imports are correct
   - Ensure all dependencies are installed

#### Support Contacts
- Technical Lead: tech@adariz.com
- DevOps: devops@adariz.com
- Emergency: +33 1 23 45 67 89

---

**Last Updated:** August 2025  
**Version:** 1.0.0
