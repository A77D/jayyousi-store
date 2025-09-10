import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    };
  }[];
}

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onOrderDeleted: (orderId: string) => void;
}

export function OrdersTable({ orders, loading, onRefresh, onOrderDeleted }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setDeletingOrder(orderId);
      
      // Delete the order (order_items will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      onOrderDeleted(orderId);
      toast({
        title: "تم حذف الطلب",
        description: "تم حذف الطلب وجميع تفاصيله بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الطلب",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeletingOrder(null);
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>الطلبات</CardTitle>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>اسم العميل</TableHead>
              <TableHead>رقم الهاتف</TableHead>
              <TableHead>المبلغ الكلي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.slice(-8)}
                </TableCell>
                <TableCell className="font-medium">{order.full_name}</TableCell>
                <TableCell>{order.phone_number}</TableCell>
                <TableCell>{parseFloat(order.total_price.toString()).toFixed(2)} ₪</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الطلب #{selectedOrder?.id.slice(-8)}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">معلومات العميل</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>الاسم:</strong> {selectedOrder.full_name}</p>
                                <p><strong>الهاتف:</strong> {selectedOrder.phone_number}</p>
                                <p><strong>العنوان:</strong> {selectedOrder.address}</p>
                                {selectedOrder.notes && (
                                  <p><strong>الملاحظات:</strong> {selectedOrder.notes}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">معلومات الطلب</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}</p>
                                <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                <p><strong>المبلغ الكلي:</strong> {parseFloat(selectedOrder.total_price.toString()).toFixed(2)} ₪</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">المنتجات المطلوبة</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>المنتج</TableHead>
                                  <TableHead>الكمية</TableHead>
                                  <TableHead>السعر</TableHead>
                                  <TableHead>المجموع</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedOrder.order_items?.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.products.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{parseFloat(item.price.toString()).toFixed(2)} ₪</TableCell>
                                    <TableCell>
                                      {(parseFloat(item.price.toString()) * item.quantity).toFixed(2)} ₪
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingOrder === order.id}
                        >
                          {deletingOrder === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف الطلب #{order.id.slice(-8)} نهائياً. لا يمكن التراجع عن هذا الإجراء.
                            سيتم حذف جميع تفاصيل الطلب والمنتجات المرتبطة به.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف الطلب
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {orders.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            لا توجد طلبات حتى الآن
          </div>
        )}
      </CardContent>
    </Card>
  );
}