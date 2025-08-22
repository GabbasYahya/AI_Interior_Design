# Adariz - Plateforme de Design Intérieur IA

Une plateforme complète de design intérieur alimentée par l'IA qui révolutionne la façon dont les utilisateurs abordent la transformation d'espaces grâce à des recommandations intelligentes, une analyse de style et une intégration de produits.

## 🌟 Aperçu

Adariz est une application web moderne basée sur React qui combine l'intelligence artificielle avec l'expertise en design intérieur pour fournir des solutions de design personnalisées. La plateforme propose des quiz de style, des mesures de pièces, des recommandations de produits et une intégration transparente avec les catalogues de meubles.

## 🚀 Fonctionnalités Clés

### Fonctionnalités Principales
- **Analyse de Style IA** : Quiz de style intelligent qui détermine les préférences utilisateur
- **Outils de Mesure de Pièce** : Capture de mesures numériques et analyse de pièce
- **Intégration Catalogue Produits** : Intégration API meubles en temps réel avec filtrage avancé
- **Système d'Authentification** : Gestion sécurisée des utilisateurs avec Supabase
- **Design Responsive** : Approche mobile-first avec UI/UX moderne

### Expérience Utilisateur
- **Quiz de Style Interactif** : 16 styles de design avec sélections visuelles
- **Support Types de Pièce** : Salon, chambre, cuisine, salle de bain, et plus
- **Recommandations Intelligentes** : Suggestions de produits basées sur l'IA selon le style et l'espace
- **Tableau de Bord Utilisateur** : Gestion de projets personnalisée et suivi des progrès

## 🛠️ Stack Technologique

### Frontend
- **React 18.3.1** - React moderne avec Hooks et Context API
- **TypeScript** - Développement type-safe
- **Vite** - Outil de build rapide et serveur de développement
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Routage côté client

### Backend & Services
- **Supabase** - Authentification, base de données et fonctionnalités temps réel
- **API Meubles** - Intégration catalogue produits externe
- **Mises à jour temps réel** - Hot module replacement pour le développement

### Composants UI
- **Radix UI** - Primitives de composants accessibles
- **Lucide React** - Bibliothèque d'icônes moderne
- **Composants Personnalisés** - Éléments UI adaptés pour la cohérence du design

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ui/                 # Composants UI réutilisables
│   ├── layout/             # Composants de mise en page (Header, Footer)
│   └── ProductCatalog.tsx  # Composant d'affichage produits
├── pages/
│   ├── Home.tsx           # Page d'accueil
│   ├── StyleQuiz.tsx      # Évaluation de style
│   ├── Measurements.tsx   # Mesure de pièce
│   ├── Dashboard.tsx      # Tableau de bord utilisateur
│   ├── Products.tsx       # Catalogue produits
│   └── Profile.tsx        # Profil utilisateur
├── services/
│   ├── furnitureAPIService.ts     # Intégration API externe
│   └── productCatalogService.ts   # Gestion des produits
├── contexts/
│   └── AuthContext.tsx    # Gestion état d'authentification
└── integrations/
    └── supabase/          # Configuration base de données et auth
```

## 🔧 Installation & Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase (pour base de données et authentification)

### Configuration Environnement
1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
4. Mettre à jour `.env` avec vos identifiants Supabase :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

### Développement
```bash
npm run dev
```
Accéder à l'application sur `http://localhost:8080`

### Build de Production
```bash
npm run build
```

## 🗄️ Schéma de Base de Données

### Tables Principales
- **profiles** - Informations profil utilisateur
- **projects** - Projets de design utilisateur
- **style_quiz_results** - Résultats quiz et préférences
- **room_measurements** - Données spatiales et dimensions
- **products** - Catalogue produits (si stockage local)

## 🔌 Intégration API

### API Meubles
La plateforme s'intègre avec des APIs meubles externes pour données produits temps réel :
- **Recherche Produits** - Filtrage avancé par style, prix, catégorie
- **Recommandations** - Suggestions de produits basées sur l'IA
- **Inventaire Temps Réel** - Statut stock et disponibilité
- **Limitation Débit** - Gestion intelligente des requêtes

## 🎨 Système de Design

### Directives de Style
- **Esthétique Moderne** - Interface propre et minimaliste
- **Palette de Couleurs** - Dégradés émeraude et bleu avec gris neutres
- **Typographie** - Polices système avec hiérarchie claire
- **Design Responsive** - Mobile-first avec optimisation desktop

### Bibliothèque de Composants
- Style cohérent dans tous les composants
- Motifs de design accessibles
- Architecture de composants réutilisables
- Système de style thématique

## 🚦 Guide de Démarrage (Manager)

### Phase 1 : Configuration Initiale (Semaine 1)
1. Configurer l'environnement de développement
2. Configurer la base de données Supabase
3. Tester le flux d'authentification
4. Vérifier les intégrations API

### Phase 2 : Fonctionnalités Principales (Semaines 2-3)
1. Fonctionnalité quiz de style
2. Outils de mesure de pièce
3. Intégration catalogue produits
4. Implémentation tableau de bord utilisateur

### Phase 3 : Améliorations (Semaine 4)
1. Filtrage avancé
2. Optimisation expérience utilisateur
3. Améliorations performance
4. Tests et déploiement

## 🔮 Feuille de Route Développement Futur

### Améliorations Immédiates
- **Reconnaissance Image IA** - Upload photos de pièce pour analyse
- **Visualisation 3D** - Rendu de pièce avec produits sélectionnés
- **Fonctionnalités Sociales** - Partager designs et recevoir feedback
- **Analytics Avancées** - Suivi comportement utilisateur et préférences

### Fonctionnalités Long Terme
- **Intégration AR** - Placement produits en réalité augmentée
- **Services Professionnels** - Connexion avec designers d'intérieur
- **Intégration E-commerce** - Achat direct de produits
- **Application Mobile** - Apps natives iOS/Android

## 📊 Performance & Évolutivité

### Métriques Actuelles
- **Temps de Build** : ~560ms (Vite)
- **Taille Bundle** : Optimisée pour performance web
- **Limites API** : 500 requêtes/jour (développement)
- **Base de Données** : Scaling serverless avec Supabase

### Stratégies d'Optimisation
- Code splitting et lazy loading
- Optimisation images et usage CDN
- Stratégies de cache pour réponses API
- Capacités progressive web app

## 🔒 Sécurité & Confidentialité

### Authentification
- Authentification sécurisée basée JWT
- Hachage et chiffrement de mots de passe
- Workflow de vérification email
- Gestion de session

### Protection des Données
- Considérations conformité RGPD
- Points de terminaison API sécurisés
- Chiffrement des données en transit et au repos
- Gestion du consentement utilisateur

## 📈 Valeur Business

### Bénéfices Utilisateur
- **Gain de Temps** - Prise de décision design rapide
- **Efficacité Coût** - Éviter erreurs de design coûteuses
- **Personnalisation** - Recommandations sur mesure
- **Commodité** - Plateforme de design tout-en-un

### Métriques Business
- **Engagement Utilisateur** - Taux de complétion quiz de style
- **Conversion** - Création et complétion de projets
- **Fidélisation** - Analytics utilisateurs récurrents
- **Revenus** - Commissions affiliées produits

## 🤝 Contribution

### Workflow de Développement
1. Créer branches de fonctionnalités depuis `main`
2. Suivre conventions TypeScript et ESLint
3. Écrire tests complets
4. Soumettre pull requests avec descriptions détaillées

### Standards de Code
- Mode strict TypeScript
- Configuration ESLint
- Formatage de code Prettier
- Documentation des composants

## 📞 Support & Contact

Pour questions techniques ou demandes business :
- **Email** : contact@adariz.com
- **Téléphone** : +33 1 23 45 67 89
- **Localisation** : Paris, France

---

**Adariz** - Transformer les espaces avec l'intelligence artificielle. © 2025 Tous droits réservés.
