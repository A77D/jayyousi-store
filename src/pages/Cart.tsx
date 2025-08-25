import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { ArrowRight, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">السلة فارغة</h2>
            <p className="text-muted-foreground mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
            <Button onClick={() => navigate('/')} className="btn-primary">
              <ArrowRight className="ml-2 h-4 w-4" />
              تسوق الآن
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            متابعة التسوق
          </Button>
          <Button 
            onClick={clearCart} 
            variant="outline"
          >
            <Trash2 className="ml-2 h-4 w-4" />
            إفراغ السلة
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">سلة التسوق</h2>
            
            {items.map((item) => (
              <div key={item.product.id} className="card-elegant p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 overflow-hidden rounded-lg bg-muted">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-muted-foreground text-sm">{item.product.description}</p>
                    <p className="text-primary font-bold">{item.product.price.toFixed(2)} ₪</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={item.product.quantity}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="font-bold text-primary">
                      {(item.product.price * item.quantity).toFixed(2)} ₪
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card-elegant p-6 sticky top-4">
              <h3 className="text-xl font-bold text-foreground mb-4">ملخص الطلب</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>{(item.product.price * item.quantity).toFixed(2)} ₪</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">المجموع الكلي:</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPrice.toFixed(2)} ₪
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary"
                size="lg"
              >
                إتمام الطلب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;