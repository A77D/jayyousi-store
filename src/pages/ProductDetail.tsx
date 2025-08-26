import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { products, loading } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">المنتج غير موجود</h2>
            <p className="text-muted-foreground">هذا المنتج غير متوفر أو تم حذفه</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "تمت إضافة المنتج للسلة",
      description: `تم إضافة ${quantity} من ${product.name} إلى سلة التسوق`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للرئيسية
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-background">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional Images Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img 
                    src={product.image} 
                    alt={`${product.name} - صورة ${i}`}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
              ))}
            </div>
            
            {/* Video Placeholder */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-0 h-0 border-l-[8px] border-l-primary border-y-[6px] border-y-transparent mr-1"></div>
                </div>
                <p className="text-muted-foreground text-sm">فيديو المنتج</p>
              </div>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{product.price.toFixed(2)} ₪</span>
              <Badge 
                variant={product.quantity > 10 ? "default" : product.quantity > 0 ? "secondary" : "destructive"}
              >
                {product.quantity > 0 ? `متوفر: ${product.quantity} قطعة` : 'غير متوفر'}
              </Badge>
            </div>
            
            {/* Features */}
            <div className="card-elegant p-4">
              <h3 className="font-semibold mb-3">مميزات المنتج:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• جودة عالية ومواد ممتازة</li>
                <li>• ضمان لمدة سنة كاملة</li>
                <li>• شحن مجاني داخل المدينة</li>
                <li>• إمكانية الإرجاع خلال 14 يوم</li>
              </ul>
            </div>
            
            {/* Quantity Selection */}
            {product.quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">الكمية:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary"
                    size="lg"
                  >
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    إضافة للسلة
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/cart')}
                    size="lg"
                  >
                    عرض السلة
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground">
                  <p>المجموع: <span className="font-bold text-primary">{(product.price * quantity).toFixed(2)} ₪</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;