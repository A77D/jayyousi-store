import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Minus, Plus, ShoppingCart, Loader2, Play, Image as ImageIcon } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { products, loading } = useProducts();
  const { t } = useLanguage();
  
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
            {t('back.to.home')}
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t('product.not.found')}</h2>
            <p className="text-muted-foreground">{t('product.unavailable')}</p>
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
          {t('back.to.home')}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images and Videos */}
          <div className="space-y-4">
            {/* Media Gallery */}
            {product.media && product.media.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Main product image first */}
                  <CarouselItem>
                    <div className="aspect-square overflow-hidden rounded-lg bg-background">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                  
                  {/* Additional media */}
                  {product.media
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((media, index) => (
                      <CarouselItem key={media.id || index}>
                        <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                          {media.media_type === 'image' ? (
                            <img 
                              src={media.media_url} 
                              alt={`${product.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <video 
                                src={media.media_url}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              />
                              <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded p-1">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              /* Fallback to main image only */
              <div className="aspect-square overflow-hidden rounded-lg bg-background">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Thumbnail grid for additional media */}
            {product.media && product.media.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted border-2 border-primary">
                  <img 
                    src={product.image} 
                    alt={`${product.name} - Main`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.media
                  .sort((a, b) => a.display_order - b.display_order)
                  .slice(0, 2)
                  .map((media, index) => (
                    <div key={media.id || index} className="aspect-square overflow-hidden rounded-lg bg-muted relative cursor-pointer hover:opacity-80 transition-opacity">
                      {media.media_type === 'image' ? (
                        <>
                          <img 
                            src={media.media_url} 
                            alt={`${product.name} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 rounded p-1">
                            <ImageIcon className="h-3 w-3 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <video 
                            src={media.media_url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 rounded p-1">
                            <Play className="h-3 w-3 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                {product.media.length > 2 && (
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    +{product.media.length - 2} more
                  </div>
                )}
              </div>
            )}
            
            {/* Fallback grid when no additional media */}
            {(!product.media || product.media.length === 0) && (
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`aspect-square overflow-hidden rounded-lg bg-muted ${i === 0 ? 'border-2 border-primary' : ''}`}>
                    <img 
                      src={product.image} 
                      alt={`${product.name} - Image ${i + 1}`}
                      className={`w-full h-full object-cover ${i === 0 ? '' : 'opacity-70'}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.long_description || product.short_description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{product.price.toFixed(2)} ₪</span>
              <Badge 
                variant={product.quantity > 10 ? "default" : product.quantity > 0 ? "secondary" : "destructive"}
              >
                {product.quantity > 0 ? `${t('available')}: ${product.quantity} ${t('pieces')}` : t('out.of.stock')}
              </Badge>
            </div>
            
            {/* Features */}
            <div className="card-elegant p-4">
              <h3 className="font-semibold mb-3">{t('product.features')}:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('high.quality')}</li>
                <li>{t('full.warranty')}</li>
                <li>{t('free.shipping')}</li>
                <li>{t('return.policy')}</li>
              </ul>
            </div>
            
            {/* Quantity Selection */}
            {product.quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">{t('quantity')}:</label>
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
                    {t('add.to.cart')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/cart')}
                    size="lg"
                  >
                    {t('view.cart')}
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground">
                  <p>{t('total')}: <span className="font-bold text-primary">{(product.price * quantity).toFixed(2)} ₪</span></p>
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