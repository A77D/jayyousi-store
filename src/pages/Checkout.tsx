import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, MapPin, Phone, User, MessageCircle, Truck } from 'lucide-react';

interface CheckoutForm {
  fullName: string;
  phoneNumber: string;
  address: string;
  notes: string;
  deliveryZone: string;
}

const deliveryZones = [
  { id: 'west-bank', name: 'الضفة الغربية', price: 20 },
  { id: 'jerusalem', name: 'القدس', price: 50 },
  { id: 'interior', name: 'الداخل المحتل', price: 70 }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, submitOrder } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: '',
    deliveryZone: '',
  });
  
  const selectedDeliveryZone = deliveryZones.find(zone => zone.id === formData.deliveryZone);
  const deliveryPrice = selectedDeliveryZone?.price || 0;
  const finalTotal = totalPrice + deliveryPrice;
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitOrder(formData);
    
    if (result.success) {
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب",
      });
      clearCart();
      navigate(`/thank-you?order=${result.orderId || Math.random().toString(36).substr(2, 9)}`);
    } else {
      toast({
        title: "خطأ في إرسال الطلب",
        description: result.error || "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/cart')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للسلة
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{t('delivery.info')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('full.name')}
                </Label>
                <Input
                  id="fullName"
                  required
                  placeholder={t('enter.full.name')}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('phone.number')}
                </Label>
                <Input
                  id="phoneNumber"
                  required
                  type="tel"
                  placeholder="+970-xxx-xxx-xxx"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryZone" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {t('delivery.zone')}
                </Label>
                <Select 
                  value={formData.deliveryZone}
                  onValueChange={(value) => setFormData({...formData, deliveryZone: value})}
                  required
                >
                  <SelectTrigger className="input-elegant">
                    <SelectValue placeholder={t('choose.delivery.zone')} />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} - {zone.price} ₪
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('detailed.address')}
                </Label>
                <Textarea
                  id="address"
                  required
                  placeholder={t('enter.full.address')}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-elegant min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {t('additional.notes')}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={t('special.requests')}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-elegant"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-primary" 
                size="lg"
              >
                {t('confirm.order')}
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card-elegant p-6 sticky top-4">
              <h3 className="text-xl font-bold text-foreground mb-4">{t('order.summary')}</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 overflow-hidden rounded-lg bg-muted">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.product.name}</h4>
                      <p className="text-muted-foreground text-xs">
                        {item.product.price.toFixed(2)} ₪ × {item.quantity}
                      </p>
                      <p className="font-bold text-primary text-sm">
                        {(item.product.price * item.quantity).toFixed(2)} ₪
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>{t('subtotal')}:</span>
                  <span>{totalPrice.toFixed(2)} ₪</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>{t('delivery.fees')}:</span>
                  <span className={deliveryPrice > 0 ? "text-primary font-medium" : "text-green-600"}>
                    {deliveryPrice > 0 ? `${deliveryPrice.toFixed(2)} ₪` : t('choose.area')}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{t('grand.total')}:</span>
                    <span className="text-2xl font-bold text-primary">
                      {finalTotal.toFixed(2)} ₪
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;