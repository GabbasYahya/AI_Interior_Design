# 🛠️ Step-by-Step Implementation Guide for AI Interior Canvas

## 📋 **Overview**

This guide shows you how to implement the 4 major features using your existing architecture. I'll provide practical, working code that you can implement immediately.

## 🗄️ **First Step: Database Schema Extensions**

Your current database has 8 tables, but we need to add the products table for e-commerce features. Here's the SQL to add the missing tables:

```sql
-- =============================================
-- PRODUCT CATALOG TABLES
-- =============================================

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES product_categories(id),
    adariz_category_id TEXT, -- External Adariz category ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table (extends your existing architecture)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    adariz_product_id TEXT UNIQUE NOT NULL, -- External Adariz product ID
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES product_categories(id),
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    images JSONB, -- Array of image URLs
    dimensions JSONB, -- {"width": 120, "height": 80, "depth": 45}
    materials JSONB, -- ["wood", "metal", "fabric"]
    colors JSONB, -- ["beige", "brown", "black"]
    style_tags JSONB, -- ["modern", "minimalist", "scandinavian"]
    availability_status TEXT DEFAULT 'available',
    adariz_url TEXT, -- Direct link to Adariz product page
    model_3d_url TEXT, -- 3D model for AR/VR
    metadata JSONB, -- Additional Adariz-specific data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E-commerce Tables
CREATE TABLE IF NOT EXISTS shopping_carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    selected_color TEXT,
    selected_material TEXT,
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    cart_id UUID REFERENCES shopping_carts(id),
    total_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending', -- pending, confirmed, shipped, delivered
    shipping_address JSONB,
    billing_address JSONB,
    payment_method JSONB,
    adariz_order_id TEXT, -- External order ID from Adariz
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view product categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Users can manage own cart" ON shopping_carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
    EXISTS (SELECT 1 FROM shopping_carts WHERE shopping_carts.id = cart_items.cart_id AND shopping_carts.user_id = auth.uid())
);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_products_adariz_id ON products(adariz_product_id);
CREATE INDEX idx_products_style_tags ON products USING GIN(style_tags);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## 🤖 **Feature 1: AI Integration - Practical Implementation**

### **Environment Setup**
First, update your `.env.example`:

```bash
# Existing Supabase config
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Add AI API keys
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
```

### **Step 1: Simple AI Service (Working with Current Schema)**

```typescript
// src/services/simpleAIService.ts
import { supabase } from '../integrations/supabase/client';

export interface SimpleAIRequest {
  projectId: string;
  prompt?: string;
}

export class SimpleAIService {
  async generateDesign(request: SimpleAIRequest): Promise<{
    success: boolean;
    designId?: string;
    images?: string[];
    error?: string;
  }> {
    try {
      // Get project data
      const { data: project } = await supabase
        .from('projects')
        .select(`
          *,
          room_measurements(*),
          room_photos(*)
        `)
        .eq('id', request.projectId)
        .single();

      if (!project) {
        throw new Error('Project not found');
      }

      // Build AI prompt
      const prompt = this.buildPrompt(project, request.prompt);

      // Call OpenAI (replace with your preferred AI service)
      const aiResponse = await this.callOpenAI(prompt);

      // Save to existing ai_designs table
      const { data: savedDesign, error } = await supabase
        .from('ai_designs')
        .insert({
          project_id: request.projectId,
          design_prompt: prompt,
          ai_model_used: 'gpt-4',
          generated_images: aiResponse.images,
          design_elements: aiResponse.elements,
          processing_status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        designId: savedDesign.id,
        images: aiResponse.images
      };

    } catch (error) {
      console.error('AI generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildPrompt(project: any, userPrompt?: string): string {
    const roomType = project.room_type || 'living room';
    const style = project.style_preference || 'modern';
    
    return `
      Create an interior design for a ${roomType} in ${style} style.
      ${userPrompt ? `User request: ${userPrompt}` : ''}
      Focus on furniture arrangement, color scheme, and decor.
      Make it practical and beautiful.
    `.trim();
  }

  private async callOpenAI(prompt: string) {
    // Simple text-based AI response for now
    // You can replace this with actual OpenAI API calls
    return {
      images: ['https://via.placeholder.com/800x600/4A90E2/ffffff?text=AI+Generated+Design'],
      elements: [
        { type: 'furniture', name: 'Modern Sofa', color: 'gray' },
        { type: 'furniture', name: 'Coffee Table', color: 'wood' },
        { type: 'lighting', name: 'Floor Lamp', color: 'black' }
      ]
    };
  }
}
```

### **Step 2: AI Design Component**

```tsx
// src/components/AIDesignGenerator.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { SimpleAIService } from '../services/simpleAIService';

interface AIDesignGeneratorProps {
  projectId: string;
}

export const AIDesignGenerator: React.FC<AIDesignGeneratorProps> = ({ projectId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const aiService = new SimpleAIService();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const result = await aiService.generateDesign({ projectId });
      
      if (result.success) {
        setResult(result);
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          AI Design Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Design...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate AI Design
            </>
          )}
        </Button>

        {error && (
          <div className="text-red-600 p-3 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <h3 className="font-semibold text-green-600">✅ Design Generated!</h3>
            {result.images && (
              <div>
                <img 
                  src={result.images[0]} 
                  alt="AI Generated Design" 
                  className="w-full rounded-md"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## 🛍️ **Feature 2: Product Catalog - Simple Implementation**

### **Step 1: Mock Product Service (Until Database is Extended)**

```typescript
// src/services/mockProductService.ts
export interface MockProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  style: string;
  adarizUrl: string;
}

export class MockProductService {
  private mockProducts: MockProduct[] = [
    {
      id: '1',
      name: 'Modern Sectional Sofa',
      price: 1299,
      image: 'https://via.placeholder.com/400x300/8B4513/ffffff?text=Modern+Sofa',
      category: 'furniture',
      style: 'modern',
      adarizUrl: 'https://adariz.com/sofa-1'
    },
    {
      id: '2',
      name: 'Scandinavian Coffee Table',
      price: 399,
      image: 'https://via.placeholder.com/400x300/DEB887/ffffff?text=Coffee+Table',
      category: 'furniture',
      style: 'scandinavian',
      adarizUrl: 'https://adariz.com/table-1'
    },
    {
      id: '3',
      name: 'Industrial Floor Lamp',
      price: 189,
      image: 'https://via.placeholder.com/400x300/2F4F4F/ffffff?text=Floor+Lamp',
      category: 'lighting',
      style: 'industrial',
      adarizUrl: 'https://adariz.com/lamp-1'
    }
  ];

  async getRecommendations(style: string): Promise<MockProduct[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockProducts.filter(product => 
      product.style === style || product.category === 'furniture'
    );
  }

  async searchProducts(query: string): Promise<MockProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProductById(id: string): Promise<MockProduct | null> {
    return this.mockProducts.find(p => p.id === id) || null;
  }
}
```

### **Step 2: Product Recommendations Component**

```tsx
// src/components/ProductRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { MockProductService, MockProduct } from '../services/mockProductService';

interface ProductRecommendationsProps {
  style?: string;
  projectId?: string;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  style = 'modern' 
}) => {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const productService = new MockProductService();

  useEffect(() => {
    loadRecommendations();
  }, [style]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await productService.getRecommendations(style);
      setProducts(recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAdarizProduct = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Adariz Products</CardTitle>
        <p className="text-sm text-gray-600">
          Perfect furniture and decor for your {style} style
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-xl font-bold text-blue-600">€{product.price}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-xs rounded">
                  {product.style}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openAdarizProduct(product.adarizUrl)}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View on Adariz
                </Button>
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🥽 **Feature 3: 3D/AR Visualization - Basic Implementation**

### **Step 1: Install 3D Dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
```

### **Step 2: Simple 3D Room Viewer**

```tsx
// src/components/Room3DViewer.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Room3DViewerProps {
  measurements?: {
    length: number;
    width: number;
    height: number;
  };
}

const Room3D: React.FC<{ measurements: any }> = ({ measurements }) => {
  const { length = 4, width = 3, height = 2.5 } = measurements || {};

  return (
    <>
      {/* Floor */}
      <Plane 
        args={[length, width]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Walls */}
      <Plane 
        args={[length, height]} 
        position={[0, height/2, -width/2]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>
      
      <Plane 
        args={[width, height]} 
        rotation={[0, Math.PI/2, 0]} 
        position={[-length/2, height/2, 0]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      {/* Sample furniture */}
      <Box 
        args={[2, 0.8, 1]} 
        position={[0, 0.4, 0]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 2]} intensity={1} />
    </>
  );
};

export const Room3DViewer: React.FC<Room3DViewerProps> = ({ measurements }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3D Room Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Room3D measurements={measurements} />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Use mouse to rotate, zoom, and pan around your room
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 💳 **Feature 4: E-commerce Flow - Simple Implementation**

### **Step 1: Shopping Cart Context**

```tsx
// src/contexts/ShoppingCartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MockProduct } from '../services/mockProductService';

interface CartItem extends MockProduct {
  quantity: number;
  selectedOptions?: {
    color?: string;
    material?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: MockProduct, options?: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: MockProduct, options?: any) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...product, quantity: 1, selectedOptions: options }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prev => 
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getItemCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

### **Step 2: Shopping Cart Component**

```tsx
// src/components/ShoppingCart.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/ShoppingCartContext';

export const ShoppingCart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert(`Order placed! Total: €${getTotalPrice().toFixed(2)}\nThis would normally redirect to Adariz payment.`);
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Shopping Cart
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">€{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">€{getTotalPrice().toFixed(2)}</span>
          </div>
          
          <Button 
            onClick={handleCheckout} 
            disabled={isCheckingOut}
            className="w-full"
            size="lg"
          >
            {isCheckingOut ? 'Processing...' : 'Checkout with Adariz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🚀 **Integration with Your Existing Pages**

### **Update your Dashboard to include these features:**

```tsx
// Add to src/pages/Dashboard.tsx
import { AIDesignGenerator } from '../components/AIDesignGenerator';
import { ProductRecommendations } from '../components/ProductRecommendations';
import { Room3DViewer } from '../components/Room3DViewer';
import { ShoppingCart } from '../components/ShoppingCart';

// Add these components to your existing Dashboard layout:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <AIDesignGenerator projectId={selectedProject?.id} />
  <ProductRecommendations style={selectedProject?.style_preference} />
</div>

<div className="mt-6">
  <Room3DViewer measurements={roomMeasurements} />
</div>

<div className="mt-6">
  <ShoppingCart />
</div>
```

### **Update your App.tsx to include CartProvider:**

```tsx
// Add to src/App.tsx
import { CartProvider } from './contexts/ShoppingCartContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider> {/* Add this wrapper */}
          <AuthLoadingWrapper>
            <Routes>
              {/* Your existing routes */}
            </Routes>
          </AuthLoadingWrapper>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 📝 **Implementation Timeline**

### **Week 1: Basic AI Integration**
1. Add AI service with mock responses
2. Create AI design generator component
3. Test with existing project data

### **Week 2: Product Recommendations**
1. Implement mock product service
2. Create product recommendation component
3. Add basic cart functionality

### **Week 3: 3D Visualization**
1. Install Three.js dependencies
2. Create basic 3D room viewer
3. Add furniture placement

### **Week 4: E-commerce Flow**
1. Add shopping cart context
2. Create checkout process
3. Integrate with Adariz API (when available)

This implementation uses your existing architecture and database schema, providing immediate functionality while being easily extensible for real AI services and Adariz integration! 🎉
