import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, MapPin, Phone, User, MessageCircle } from 'lucide-react';

interface CheckoutForm {
  fullName: string;
  phoneNumber: string;
  address: string;
  notes: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, submitOrder } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: '',
  });
  
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
      navigate('/');
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
            <h2 className="text-2xl font-bold text-foreground">معلومات التوصيل</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  الاسم الكامل
                </Label>
                <Input
                  id="fullName"
                  required
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
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
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  عنوان التوصيل
                </Label>
                <Textarea
                  id="address"
                  required
                  placeholder="أدخل العنوان الكامل مع تفاصيل الموقع"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-elegant min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  ملاحظات إضافية (اختياري)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="أي ملاحظات أو طلبات خاصة"
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
                تأكيد الطلب
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card-elegant p-6 sticky top-4">
              <h3 className="text-xl font-bold text-foreground mb-4">ملخص الطلب</h3>
              
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
                  <span>المجموع الفرعي:</span>
                  <span>{totalPrice.toFixed(2)} ₪</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>رسوم التوصيل:</span>
                  <span className="text-green-600">مجاني</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">المجموع الكلي:</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toFixed(2)} ₪
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