import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  X, 
  CreditCard, 
  Truck,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import ECommerceService, { CartItem, ShippingAddress, Order } from '../services/ECommerceService';
import { toast } from 'sonner';

const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'FR'
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load cart items
    setCartItems(ECommerceService.getCartItems());

    // Subscribe to cart changes
    const unsubscribe = ECommerceService.onCartChange((items) => {
      setCartItems(items);
    });

    return unsubscribe;
  }, []);

  const updateQuantity = (itemId: string, quantity: number) => {
    ECommerceService.updateQuantity(itemId, quantity);
  };

  const removeItem = (itemId: string) => {
    ECommerceService.removeFromCart(itemId);
    toast.success('Produit retiré du panier');
  };

  const clearCart = () => {
    ECommerceService.clearCart();
    toast.success('Panier vidé');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.20; // 20% TVA
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal >= 500 ? 0 : 9.90; // Free shipping over 500€
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    if (!shippingAddress.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Adresse requise';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Ville requise';
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Code postal requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsCheckingOut(true);

    try {
      const newOrder = await ECommerceService.createOrder(shippingAddress);
      
      // Simulate payment processing
      const paymentResult = await ECommerceService.processPayment(newOrder, 'demo_payment_method');
      
      if (paymentResult.success) {
        setOrder(newOrder);
        toast.success('Commande confirmée !', {
          description: `Numéro de commande: ${newOrder.id}`
        });
      } else {
        throw new Error(paymentResult.error || 'Erreur de paiement');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erreur lors de la commande', {
        description: error instanceof Error ? error.message : 'Veuillez réessayer'
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                Commande Confirmée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-2">
                  Merci {order.shippingAddress.firstName} pour votre commande !
                </p>
                <p className="text-gray-600">
                  Numéro de commande: <strong>{order.id}</strong>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Résumé de la commande</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{order.subtotal.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span>{order.tax.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>{order.shipping > 0 ? `${order.shipping.toFixed(2)} EUR` : 'Gratuite'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{order.total.toFixed(2)} EUR</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Livraison
                </h3>
                <p className="text-sm text-gray-600">
                  Livraison prévue le{' '}
                  <strong>
                    {order.estimatedDelivery?.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Adresse: {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/room-generation')}
                  className="flex-1"
                >
                  Continuer le Shopping
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Voir Mes Commandes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos produits pour décorer votre intérieur
              </p>
              <Button onClick={() => navigate('/room-generation')}>
                Commencer le Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Panier ({cartItems.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.description}
                      </p>
                      
                      {(item.selectedColor || item.selectedMaterial) && (
                        <div className="flex gap-2 mb-2">
                          {item.selectedColor && (
                            <Badge variant="outline">
                              Couleur: {item.selectedColor}
                            </Badge>
                          )}
                          {item.selectedMaterial && (
                            <Badge variant="outline">
                              Matériau: {item.selectedMaterial}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {(item.product.price * item.quantity).toFixed(2)} EUR
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>
                Vider le panier
              </Button>
              <Button onClick={() => navigate('/room-generation')}>
                Continuer le shopping
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{subtotal.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span>{tax.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>{shipping > 0 ? `${shipping.toFixed(2)} EUR` : 'Gratuite'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} EUR</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <Alert>
                    <Truck className="h-4 w-4" />
                    <AlertDescription>
                      Livraison gratuite à partir de 500€
                      (encore {(500 - subtotal).toFixed(2)}€)
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full"
                  onClick={() => setShowCheckout(!showCheckout)}
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Procéder au paiement
                </Button>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            {showCheckout && (
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          city: e.target.value
                        }))}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          postalCode: e.target.value
                        }))}
                        className={errors.postalCode ? 'border-red-500' : ''}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full"
                    size="lg"
                  >
                    {isCheckingOut ? 'Traitement...' : `Confirmer la commande - ${total.toFixed(2)} EUR`}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
