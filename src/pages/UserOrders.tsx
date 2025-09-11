import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  notes: string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image: string;
    };
  }[];
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchOrders();
  }, []);

  const checkAuthAndFetchOrders = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "يجب تسجيل الدخول",
          description: "يرجى تسجيل الدخول لعرض طلباتك",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      setUser(user);

      // Fetch user's orders
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (name, image)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      toast({
        title: "خطأ في تحميل الطلبات",
        description: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">جديد</Badge>;
      case 'processing':
        return <Badge variant="default">قيد المعالجة</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-700">مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">طلباتي</h1>
          <p className="text-muted-foreground">جميع طلباتك في مكان واحد</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground mb-6">
                لم تقم بإجراء أي طلبات بعد
              </p>
              <Button onClick={() => navigate('/')}>
                تصفح المنتجات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        طلب رقم #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-left">
                      {getStatusBadge(order.status)}
                      <p className="text-lg font-bold text-primary mt-2">
                        {parseFloat(order.total_price.toString()).toFixed(2)} ₪
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>الاسم:</strong> {order.full_name}
                      </div>
                      <div>
                        <strong>الهاتف:</strong> {order.phone_number}
                      </div>
                      <div className="md:col-span-2">
                        <strong>العنوان:</strong> {order.address}
                      </div>
                      {order.notes && (
                        <div className="md:col-span-2">
                          <strong>الملاحظات:</strong> {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">المنتجات المطلوبة:</h4>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <img
                              src={item.products.image}
                              alt={item.products.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.products.name}</p>
                              <p className="text-sm text-muted-foreground">
                                الكمية: {item.quantity} × {parseFloat(item.price.toString()).toFixed(2)} ₪
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold">
                                {(parseFloat(item.price.toString()) * item.quantity).toFixed(2)} ₪
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;