import { useState } from 'react';
import { Product, OrderData } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus, Minus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderForm({ product, isOpen, onClose }: OrderFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    notes: '',
  });
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!product) return null;

  const totalPrice = product.price * orderQuantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = orderQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setOrderQuantity(newQuantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.address || !formData.phoneNumber) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const orderData: OrderData = {
      ...formData,
      product,
      orderQuantity,
      totalPrice,
    };

    console.log('Order Data:', orderData);
    setIsSubmitted(true);
    
    toast({
      title: "تم إرسال الطلب بنجاح",
      description: `شكراً لك ${formData.fullName}، سيتم التواصل معك قريباً`,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      address: '',
      phoneNumber: '',
      notes: '',
    });
    setOrderQuantity(1);
    setIsSubmitted(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={resetForm}>
        <DialogContent className="max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">تم إرسال الطلب!</h2>
            <p className="text-muted-foreground mb-6">
              شكراً لك، سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب
            </p>
            <Button onClick={resetForm} className="btn-primary">
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            طلب منتج: {product.name}
          </DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute left-4 top-4 p-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Summary */}
          <div className="card-elegant p-4">
            <div className="flex gap-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-primary font-bold">{product.price.toFixed(2)} ₪</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
              <Input
                required
                placeholder="أدخل اسمك الكامل"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">العنوان / الموقع *</label>
              <Input
                required
                placeholder="أدخل عنوانك بالتفصيل"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
              <Input
                required
                type="tel"
                placeholder="052-xxx-xxxx"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="input-elegant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات (اختياري)</label>
              <Textarea
                placeholder="أي ملاحظات أو طلبات خاصة"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="input-elegant min-h-[80px]"
              />
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="card-elegant p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">الكمية</label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={orderQuantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg min-w-[3rem] text-center">
                  {orderQuantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={orderQuantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">المجموع:</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toFixed(2)} ₪
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary text-lg py-6">
            إرسال الطلب
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}