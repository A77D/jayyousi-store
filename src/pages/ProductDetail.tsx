import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Minus, Plus, ShoppingCart, Loader2, Play, Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const { products, loading } = useProducts();
  const { t } = useLanguage();
  
  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on('select', () => {
      setSelectedMediaIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);
  
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
            <p className="text-muted-foreground">This product is not available or has been deleted</p>
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
      title: t('add.to.cart.success.title'),
      description: t('add.to.cart.success.description', { quantity, name: product.name }),
    });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedMediaIndex(index);
    carouselApi?.scrollTo(index);
  };

  const handleNextMedia = () => {
    if (selectedMediaIndex < allMedia.length - 1) {
      const nextIndex = selectedMediaIndex + 1;
      setSelectedMediaIndex(nextIndex);
      carouselApi?.scrollTo(nextIndex);
    }
  };

  const handlePrevMedia = () => {
    if (selectedMediaIndex > 0) {
      const prevIndex = selectedMediaIndex - 1;
      setSelectedMediaIndex(prevIndex);
      carouselApi?.scrollTo(prevIndex);
    }
  };
  
  // Combine main image with other media for the carousel
  const allMedia = [ 
    { id: 'main', media_url: product.image, media_type: 'image' as const, display_order: 0 }, 
    ...(product.media || []) 
  ].sort((a, b) => a.display_order - b.display_order);

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
            {/* Main Media Gallery */}
            <div className="relative group">
              <Carousel className="w-full" setApi={setCarouselApi}>
                <CarouselContent>
                  {allMedia.map((media, index) => (
                    <CarouselItem key={media.id || index}>
                      <div className="aspect-square overflow-hidden rounded-xl bg-muted relative group/item">
                        {media.media_type === 'image' ? (
                          <>
                            <img 
                              src={media.media_url} 
                              alt={`${product.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"
                              onClick={() => setIsLightboxOpen(true)}
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="relative w-full h-full">
                            <video 
                              src={media.media_url}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            />
                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                              <Play className="h-4 w-4 text-white" />
                              <span className="text-white text-sm font-medium">فيديو</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Media Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                          {index + 1} / {allMedia.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
            
            {/* Interactive Thumbnail Grid */}
            <div className="grid grid-cols-5 gap-3">
              {allMedia.map((media, index) => (
                <button
                  key={media.id || index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`aspect-square overflow-hidden rounded-lg bg-muted relative cursor-pointer transition-all duration-300 ${
                    selectedMediaIndex === index 
                      ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-lg' 
                      : 'hover:ring-2 hover:ring-primary/50 hover:scale-105'
                  }`}
                >
                  {media.media_type === 'image' ? (
                    <img 
                      src={media.media_url} 
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video 
                        src={media.media_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </>
                  )}
                  
                  {/* Selection Indicator */}
                  {selectedMediaIndex === index && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg" />
                  )}
                </button>
              ))}
            </div>
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
            <div className="card-elegant p-6 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                مميزات المنتج
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>جودة عالية وخامات ممتازة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>ضمان سنة كاملة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>شحن مجاني داخل المدينة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>إمكانية الإرجاع خلال 14 يوم</span>
                </li>
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
                    View Cart
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground">
                  <p>{t('total')}: <span className="font-bold text-primary">{(product.price * quantity).toFixed(2)} ₪</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lightbox Modal for Full-Screen Image View */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors">
                <X className="h-6 w-6 text-white" />
              </DialogClose>

              {/* Navigation Buttons */}
              {selectedMediaIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  onClick={handlePrevMedia}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
              
              {selectedMediaIndex < allMedia.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  onClick={handleNextMedia}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Main Media Display */}
              <div className="w-full h-full flex items-center justify-center p-8">
                {allMedia[selectedMediaIndex]?.media_type === 'image' ? (
                  <img
                    src={allMedia[selectedMediaIndex].media_url}
                    alt={`${product.name} - Full Size`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={allMedia[selectedMediaIndex]?.media_url}
                    className="max-w-full max-h-full"
                    controls
                    autoPlay
                  />
                )}
              </div>

              {/* Media Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedMediaIndex + 1} من {allMedia.length}
                </p>
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-md px-4">
                {allMedia.map((media, index) => (
                  <button
                    key={media.id || index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      selectedMediaIndex === index
                        ? 'ring-2 ring-primary scale-110'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {media.media_type === 'image' ? (
                      <img
                        src={media.media_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductDetail;