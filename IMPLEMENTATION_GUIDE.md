# 🚀 AI Interior Canvas - Implementation Guide

## 🤖 1. AI Integration: Design Generation Services

### **Current Architecture Ready for AI:**
- `ai_designs` table stores AI-generated content
- `style_quiz_results` provides user preferences
- `room_photos` and `room_measurements` provide room context
- Processing status tracking built-in

### **Implementation Steps:**

#### **Step 1: Create AI Service Layer**
```typescript
// src/services/aiService.ts
import { createClient } from '@supabase/supabase-js';

export interface AIDesignRequest {
  projectId: string;
  roomPhotos: string[];
  roomMeasurements: RoomMeasurements;
  stylePreferences: StyleQuizResult;
  designPrompt?: string;
}

export interface AIDesignResponse {
  designId: string;
  generatedImages: string[];
  designElements: DesignElement[];
  processingTime: number;
}

class AIService {
  // OpenAI Integration
  async generateDesignWithOpenAI(request: AIDesignRequest): Promise<AIDesignResponse> {
    const prompt = this.buildDesignPrompt(request);
    
    // Call OpenAI DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 3, // Generate 3 design options
        size: "1024x1024",
        quality: "hd"
      })
    });
    
    return this.processAIResponse(response, request.projectId);
  }

  // Alternative: Midjourney API Integration
  async generateDesignWithMidjourney(request: AIDesignRequest): Promise<AIDesignResponse> {
    // Similar implementation for Midjourney
    // Use their API endpoints for design generation
  }

  private buildDesignPrompt(request: AIDesignRequest): string {
    const { roomMeasurements, stylePreferences } = request;
    
    return `
      Interior design for a ${roomMeasurements.room_type} room, 
      ${roomMeasurements.length}m x ${roomMeasurements.width}m x ${roomMeasurements.height}m.
      Style: ${stylePreferences.calculated_style}.
      Preferences: ${JSON.stringify(stylePreferences.style_scores)}.
      Include Adariz furniture and decor products.
      Modern, professional interior design, realistic lighting.
    `;
  }
}
```

#### **Step 2: Update Environment Variables**
```bash
# Add to .env
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_MIDJOURNEY_API_KEY=your-midjourney-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### **Step 3: Create AI Design Component**
```typescript
// src/components/AIDesignGenerator.tsx
export const AIDesignGenerator = ({ projectId }: { projectId: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [designs, setDesigns] = useState<AIDesign[]>([]);

  const generateDesign = async () => {
    setIsGenerating(true);
    
    try {
      // Get project data
      const project = await supabase
        .from('projects')
        .select(`
          *,
          room_measurements(*),
          room_photos(*),
          profiles!inner(style_quiz_results(*))
        `)
        .eq('id', projectId)
        .single();

      // Generate AI design
      const aiResponse = await aiService.generateDesignWithOpenAI({
        projectId,
        roomPhotos: project.room_photos.map(p => p.file_path),
        roomMeasurements: project.room_measurements,
        stylePreferences: project.profiles.style_quiz_results[0]
      });

      // Save to database
      await supabase.from('ai_designs').insert({
        project_id: projectId,
        design_prompt: aiResponse.prompt,
        generated_images: aiResponse.generatedImages,
        design_elements: aiResponse.designElements,
        processing_status: 'completed'
      });

      setDesigns(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-design-generator">
      <Button onClick={generateDesign} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate AI Design'}
      </Button>
      
      <div className="designs-grid">
        {designs.map(design => (
          <AIDesignCard key={design.id} design={design} />
        ))}
      </div>
    </div>
  );
};
```

---

## 🛍️ 2. Product Catalog: Adariz Product Integration

### **Implementation Strategy:**

#### **Step 1: Extend Database Schema**
```sql
-- Add product catalog tables
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES product_categories(id),
    adariz_category_id TEXT, -- External Adariz category ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    metadata JSONB, -- Additional Adariz-specific data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Step 2: Create Product Sync Service**
```typescript
// src/services/productCatalogService.ts
class ProductCatalogService {
  // Sync products from Adariz API
  async syncAdarizProducts(): Promise<void> {
    try {
      // Fetch from Adariz API
      const adarizProducts = await this.fetchAdarizCatalog();
      
      // Transform and insert into your database
      for (const product of adarizProducts) {
        await supabase.from('products').upsert({
          adariz_product_id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          dimensions: product.dimensions,
          style_tags: this.extractStyleTags(product),
          adariz_url: product.url
        });
      }
    } catch (error) {
      console.error('Product sync failed:', error);
    }
  }

  // Enhanced product recommendation
  async getRecommendationsForDesign(designElements: DesignElement[]): Promise<ProductRecommendation[]> {
    const recommendations = [];
    
    for (const element of designElements) {
      const matchingProducts = await supabase
        .from('products')
        .select('*')
        .contains('style_tags', [element.style])
        .eq('category_id', element.category)
        .range(0, 5);
        
      recommendations.push(...matchingProducts.data);
    }
    
    return recommendations;
  }

  private async fetchAdarizCatalog(): Promise<AdarizProduct[]> {
    // Implement Adariz API integration
    const response = await fetch('https://api.adariz.com/products', {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_ADARIZ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  }
}
```

#### **Step 3: Smart Recommendation Engine**
```typescript
// src/components/ProductRecommendations.tsx
export const ProductRecommendations = ({ aiDesign }: { aiDesign: AIDesign }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  useEffect(() => {
    const getRecommendations = async () => {
      // Use AI to analyze design elements and recommend products
      const recs = await productCatalogService.getRecommendationsForDesign(
        aiDesign.design_elements
      );
      setRecommendations(recs);
    };
    
    getRecommendations();
  }, [aiDesign]);

  return (
    <div className="product-recommendations">
      <h3>Recommended Adariz Products</h3>
      <div className="products-grid">
        {recommendations.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={() => addToCart(product)}
            onViewDetails={() => openAdarizProduct(product.adariz_url)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 🥽 3. AR/3D Features: Visualization System

### **Implementation Strategy:**

#### **Step 1: Choose 3D Framework**
```typescript
// Option 1: Three.js for Web-based 3D
// src/components/Room3DViewer.tsx
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

export const Room3DViewer = ({ measurements, furnitureItems }: RoomViewerProps) => {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Room walls based on measurements */}
      <RoomMesh measurements={measurements} />
      
      {/* Furniture placement */}
      {furnitureItems.map(item => (
        <FurnitureModel 
          key={item.id} 
          model={item.model_url}
          position={item.position}
          rotation={item.rotation}
        />
      ))}
      
      <OrbitControls />
    </Canvas>
  );
};

// Option 2: AR.js for Augmented Reality
// src/components/ARViewer.tsx
export const ARViewer = ({ productModel }: { productModel: string }) => {
  return (
    <div className="ar-viewer">
      <a-scene vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-entity
          gltf-model={productModel}
          scale="0.5 0.5 0.5"
          position="0 0.5 -3"
          rotation="0 45 0"
        />
        <a-camera-static />
      </a-scene>
    </div>
  );
};
```

#### **Step 2: Room Builder Component**
```typescript
// src/components/Room3DBuilder.tsx
export const Room3DBuilder = ({ measurements }: { measurements: RoomMeasurements }) => {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);

  const addFurniture = (product: Product, position: Vector3) => {
    const newItem: FurnitureItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      model_url: product.model_3d_url,
      position,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };
    
    setFurnitureItems(prev => [...prev, newItem]);
  };

  return (
    <div className="room-3d-builder">
      <div className="viewer-container">
        <Room3DViewer 
          measurements={measurements}
          furnitureItems={furnitureItems}
        />
      </div>
      
      <div className="furniture-palette">
        {/* Drag & drop furniture from recommendations */}
        <FurniturePalette onAddFurniture={addFurniture} />
      </div>
    </div>
  );
};
```

#### **Step 3: AR Product Preview**
```typescript
// src/components/ARProductPreview.tsx
export const ARProductPreview = ({ product }: { product: Product }) => {
  const [isARSupported, setIsARSupported] = useState(false);

  useEffect(() => {
    // Check if device supports AR
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then(setIsARSupported);
    }
  }, []);

  const launchAR = async () => {
    if (!isARSupported) return;
    
    // Launch AR session with product model
    const session = await navigator.xr?.requestSession('immersive-ar');
    // Implement AR placement logic
  };

  return (
    <div className="ar-preview">
      {isARSupported ? (
        <Button onClick={launchAR}>
          View in Your Space (AR)
        </Button>
      ) : (
        <Button onClick={() => open3DPreview(product)}>
          View in 3D
        </Button>
      )}
    </div>
  );
};
```

---

## 💳 4. E-commerce: Purchase Flow Integration

### **Implementation Strategy:**

#### **Step 1: Extend Database for E-commerce**
```sql
-- Shopping cart and orders
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
```

#### **Step 2: Shopping Cart Service**
```typescript
// src/services/ecommerceService.ts
class EcommerceService {
  async addToCart(userId: string, productId: string, options: ProductOptions): Promise<void> {
    // Get or create cart
    let cart = await supabase
      .from('shopping_carts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!cart.data) {
      cart = await supabase
        .from('shopping_carts')
        .insert({ user_id: userId })
        .select()
        .single();
    }

    // Add item to cart
    await supabase.from('cart_items').insert({
      cart_id: cart.data.id,
      product_id: productId,
      quantity: options.quantity,
      selected_color: options.color,
      selected_material: options.material
    });
  }

  async checkout(cartId: string, shippingInfo: ShippingInfo): Promise<Order> {
    // Calculate total
    const cartItems = await this.getCartItems(cartId);
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Create order
    const order = await supabase.from('orders').insert({
      cart_id: cartId,
      total_amount: total,
      shipping_address: shippingInfo,
      status: 'pending'
    }).select().single();

    // Forward to Adariz API for fulfillment
    const adarizOrderId = await this.forwardToAdariz(order.data, cartItems);
    
    // Update order with Adariz ID
    await supabase.from('orders')
      .update({ adariz_order_id: adarizOrderId, status: 'confirmed' })
      .eq('id', order.data.id);

    return order.data;
  }

  private async forwardToAdariz(order: Order, items: CartItem[]): Promise<string> {
    // Send order to Adariz fulfillment system
    const response = await fetch('https://api.adariz.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_ADARIZ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items.map(item => ({
          product_id: item.product.adariz_product_id,
          quantity: item.quantity,
          options: {
            color: item.selected_color,
            material: item.selected_material
          }
        })),
        shipping_address: order.shipping_address,
        total_amount: order.total_amount
      })
    });

    const adarizOrder = await response.json();
    return adarizOrder.order_id;
  }
}
```

#### **Step 3: E-commerce Components**
```typescript
// src/components/ShoppingCart.tsx
export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const proceedToCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const order = await ecommerceService.checkout(cartId, shippingInfo);
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="shopping-cart">
      <div className="cart-items">
        {cartItems.map(item => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">Total: €{calculateTotal()}</div>
        <Button onClick={proceedToCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? 'Processing...' : 'Checkout with Adariz'}
        </Button>
      </div>
    </div>
  );
};

// src/components/OrderConfirmation.tsx
export const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState<Order | null>(null);

  return (
    <div className="order-confirmation">
      <h1>Order Confirmed!</h1>
      <p>Your order has been sent to Adariz for fulfillment.</p>
      <p>Order ID: {order?.adariz_order_id}</p>
      <p>Total: €{order?.total_amount}</p>
      
      <Button onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
};
```

---

## 🚀 **Implementation Priority & Timeline**

### **Phase 1 (Weeks 1-2): AI Integration**
1. Set up OpenAI API integration
2. Create AI service layer
3. Implement basic design generation
4. Test with your existing room data

### **Phase 2 (Weeks 3-4): Product Catalog**
1. Design Adariz API integration
2. Create product sync service
3. Enhance recommendation engine
4. Build product browsing interface

### **Phase 3 (Weeks 5-6): E-commerce Flow**
1. Implement shopping cart
2. Create checkout process
3. Integrate with Adariz fulfillment
4. Add order tracking

### **Phase 4 (Weeks 7-8): AR/3D Features**
1. Implement 3D room viewer
2. Add furniture placement
3. Create AR product preview
4. Optimize for mobile devices

---

## 🔗 **RECOMMENDED: Furniture API Integration**

### **Perfect API Found: https://furniture-api.fly.dev**

This API is ideal for your project because it provides:

✅ **Real Product Data** - Actual furniture catalog
✅ **AI-Generated Content** - Matches your AI theme
✅ **Advanced Filtering** - By style, wood type, price, category
✅ **Stock Management** - Real-time availability
✅ **Category Alignment** - Sofa, chair, table, etc.
✅ **Professional Images** - High-quality product photos
✅ **Discount System** - For pricing strategies

#### **Quick Integration Example:**

```typescript
// src/services/furnitureAPIService.ts
export class FurnitureAPIService {
  private baseURL = 'https://furniture-api.fly.dev';
  
  async getProductRecommendations(style: string, budget?: number) {
    const params = new URLSearchParams({
      limit: '20',
      sort: 'newest',
      ...(budget && { max_price: budget.toString() })
    });
    
    // Map your styles to their categories/wood types
    const styleMapping = {
      'modern': { finish: 'light' },
      'traditional': { wood_type: 'oak', finish: 'dark' },
      'scandinavian': { wood_type: 'pine', finish: 'natural' }
    };
    
    if (styleMapping[style]) {
      Object.entries(styleMapping[style]).forEach(([key, value]) => {
        params.append(key, value);
      });
    }
    
    const response = await fetch(`${this.baseURL}/v1/products?${params}`);
    return response.json();
  }
  
  async searchProducts(roomType: string, maxPrice?: number) {
    const categoryMapping = {
      'living_room': ['sofa', 'chair', 'table', 'tv table'],
      'bedroom': ['chair', 'wardrove', 'mirror'],
      'kitchen': ['kitchen', 'stool', 'table'],
      'office': ['desk', 'chair']
    };
    
    const categories = categoryMapping[roomType] || ['chair', 'table'];
    const results = [];
    
    for (const category of categories.slice(0, 2)) { // Limit API calls
      const params = new URLSearchParams({
        category,
        limit: '5',
        ...(maxPrice && { max_price: maxPrice.toString() })
      });
      
      const response = await fetch(`${this.baseURL}/v1/products?${params}`);
      const data = await response.json();
      results.push(...data.data);
    }
    
    return results;
  }
}
```

#### **Integration with Your Existing Components:**

```typescript
// Update your ProductRecommendations component:
const furnitureAPI = new FurnitureAPIService();

// In your component:
const recommendations = await furnitureAPI.getProductRecommendations(
  project.style_preference, 
  project.budget_range
);
```

#### **Benefits for Your Project:**

1. **No Database Setup Needed** - Use their API directly
2. **Real Product Catalog** - Professional furniture data
3. **AI-Generated Images** - Matches your AI theme perfectly
4. **Advanced Filtering** - Style, price, category matching
5. **Rate Limits** - 500 requests/day (perfect for development)
6. **Professional API** - Proper error handling and documentation

This API eliminates the need to build your own product catalog and gives you a professional furniture database immediately! 🚀

Your existing architecture provides the perfect foundation for all these features! 🏆
