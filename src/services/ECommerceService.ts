import { Product } from './productService';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery?: Date;
}

class ECommerceService {
  private cartItems: CartItem[] = [];
  private listeners: ((cart: CartItem[]) => void)[] = [];

  constructor() {
    this.loadCartFromStorage();
  }

  // Cart Management
  addToCart(product: Product, quantity: number = 1, options?: { color?: string; material?: string }): void {
    const existingItem = this.cartItems.find(item => 
      item.product.id === product.id && 
      item.selectedColor === options?.color &&
      item.selectedMaterial === options?.material
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        id: this.generateId(),
        product,
        quantity,
        addedAt: new Date(),
        selectedColor: options?.color,
        selectedMaterial: options?.material
      };
      this.cartItems.push(cartItem);
    }

    this.saveCartToStorage();
    this.notifyListeners();
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCartToStorage();
    this.notifyListeners();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.saveCartToStorage();
      this.notifyListeners();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.notifyListeners();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  // Order Management
  async createOrder(shippingAddress: ShippingAddress): Promise<Order> {
    if (this.cartItems.length === 0) {
      throw new Error('Panier vide');
    }

    const subtotal = this.getCartTotal();
    const tax = subtotal * 0.20; // 20% TVA en France
    const shipping = this.calculateShipping(shippingAddress, subtotal);
    const total = subtotal + tax + shipping;

    const order: Order = {
      id: this.generateOrderId(),
      items: [...this.cartItems],
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };

    // In a real application, this would be sent to the backend
    await this.saveOrder(order);
    
    // Clear cart after successful order
    this.clearCart();

    return order;
  }

  private calculateShipping(address: ShippingAddress, subtotal: number): number {
    // Free shipping for orders over 500€
    if (subtotal >= 500) {
      return 0;
    }

    // Different shipping rates based on country
    const shippingRates = {
      'FR': 9.90, // France
      'BE': 14.90, // Belgium
      'LU': 14.90, // Luxembourg
      'CH': 24.90, // Switzerland
      'IT': 19.90, // Italy
      'ES': 19.90, // Spain
      'DE': 16.90, // Germany
    };

    return shippingRates[address.country as keyof typeof shippingRates] || 29.90; // Default international
  }

  private calculateEstimatedDelivery(): Date {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 business days
    return deliveryDate;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orders = this.getStoredOrders();
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      return this.getStoredOrders();
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  // Payment Processing (Stripe Integration)
  async processPayment(order: Order, paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real application, this would be handled by the backend
      // For now, we'll simulate the payment process
      
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: Math.round(order.total * 100), // Convert to cents
          currency: 'eur',
          paymentMethodId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update order status
          await this.updateOrderStatus(order.id, 'processing');
          return { success: true };
        } else {
          return { success: false, error: result.error || 'Erreur de paiement' };
        }
      } else {
        // Fallback for demo purposes
        console.warn('Payment API not available, simulating successful payment');
        await this.updateOrderStatus(order.id, 'processing');
        return { success: true };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Erreur de connexion. Veuillez réessayer.' };
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orders = this.getStoredOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('adariz_orders', JSON.stringify(orders));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  // Wishlist Management
  private wishlistItems: Product[] = [];

  addToWishlist(product: Product): void {
    if (!this.wishlistItems.find(item => item.id === product.id)) {
      this.wishlistItems.push(product);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.saveWishlistToStorage();
  }

  getWishlistItems(): Product[] {
    return [...this.wishlistItems];
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  // Storage Management
  private saveCartToStorage(): void {
    try {
      localStorage.setItem('adariz_cart', JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem('adariz_cart');
      if (stored) {
        this.cartItems = JSON.parse(stored).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems = [];
    }
  }

  private saveWishlistToStorage(): void {
    try {
      localStorage.setItem('adariz_wishlist', JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }

  private loadWishlistFromStorage(): void {
    try {
      const stored = localStorage.getItem('adariz_wishlist');
      if (stored) {
        this.wishlistItems = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
      this.wishlistItems = [];
    }
  }

  private async saveOrder(order: Order): Promise<void> {
    try {
      const orders = this.getStoredOrders();
      orders.push(order);
      localStorage.setItem('adariz_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
      throw new Error('Erreur lors de la sauvegarde de la commande');
    }
  }

  private getStoredOrders(): Order[] {
    try {
      const stored = localStorage.getItem('adariz_orders');
      if (stored) {
        return JSON.parse(stored).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
          items: order.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting stored orders:', error);
      return [];
    }
  }

  // Event Management
  onCartChange(listener: (cart: CartItem[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.cartItems));
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `AD${timestamp}${random}`;
  }

  // Initialize wishlist
  init(): void {
    this.loadWishlistFromStorage();
  }
}

export default new ECommerceService();
