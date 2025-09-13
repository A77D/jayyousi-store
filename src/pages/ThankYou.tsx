import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Phone, MapPin, Truck, Home } from 'lucide-react';

interface OrderDetails {
  id: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  total_price: number;
  full_name: string;
  phone_number: string;
  address: string;
  notes?: string;
  status: string;
  created_at: string;
}

const ThankYou = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order');

  useEffect(() => {
    // In a real implementation, you would fetch order details from the backend
    // For now, we'll simulate order details
    const simulateOrderFetch = () => {
      setTimeout(() => {
        if (orderId) {
          // Simulate fetched order details
          const mockOrder: OrderDetails = {
            id: orderId,
            items: [
              {
                product: {
                  id: '1',
                  name: 'ساعة ذكية',
                  price: 299.99,
                  image: '/smart-watch.jpg'
                },
                quantity: 1
              }
            ],
            total_price: 319.99,
            full_name: 'أحمد محمد',
            phone_number: '+970-xxx-xxx-xxx',
            address: 'رام الله، فلسطين',
            notes: 'يرجى الاتصال قبل التوصيل',
            status: 'pending',
            created_at: new Date().toISOString()
          };
          setOrderDetails(mockOrder);
        }
        setLoading(false);
      }, 1000);
    };

    simulateOrderFetch();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('thank.you.order')}</h1>
            <p className="text-muted-foreground text-lg">{t('order.received')}</p>
          </div>

          {orderDetails && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {t('order.details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('order.number')}:</span>
                    <span className="font-mono font-semibold">#{orderDetails.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('order.date')}:</span>
                    <span>{formatDate(orderDetails.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('order.status')}:</span>
                    <Badge variant="secondary">
                      {orderDetails.status === 'pending' ? t('under.review') : orderDetails.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('ordered.products')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-16 h-16 overflow-hidden rounded-lg bg-muted">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-muted-foreground text-sm">
                            {item.product.price.toFixed(2)} ₪ × {item.quantity}
                          </p>
                          <p className="font-bold text-primary">
                            {(item.product.price * item.quantity).toFixed(2)} ₪
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold">{t('grand.total')}:</span>
                      <span className="text-2xl font-bold text-primary">
                        {orderDetails.total_price.toFixed(2)} ₪
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {t('delivery.information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{orderDetails.full_name}</p>
                      <p className="text-muted-foreground">{orderDetails.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-muted-foreground">{orderDetails.address}</p>
                  </div>
                  
                  {orderDetails.notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">{t('notes')}:</span> {orderDetails.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">{t('what.next')}</h3>
                    <div className="text-muted-foreground space-y-2">
                      <p>{t('order.review.process')}</p>
                      <p>{t('contact.within.24h')}</p>
                      <p>{t('prepare.deliver')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/')} 
                  className="flex-1 btn-primary"
                  size="lg"
                >
                  <Home className="ml-2 h-5 w-5" />
                  {t('continue.shopping')}
                </Button>
                <Button 
                  onClick={() => window.location.href = `tel:+970594321456`}
                  variant="outline"
                  size="lg"
                >
                  <Phone className="ml-2 h-5 w-5" />
                  {t('call.us')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThankYou;