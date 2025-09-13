import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductMedia {
  id?: string;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
}

interface ProductForm {
  name: string;
  price: string;
  image: string;
  quantity: string;
  short_description: string;
  long_description: string;
  media: ProductMedia[];
}

export function ProductManagement() {
  const { products, loading, addProduct, updateProduct, deleteProduct, addProductMedia, deleteProductMedia, fetchProducts } = useProducts();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    price: '',
    image: '',
    quantity: '',
    short_description: '',
    long_description: '',
    media: []
  });
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      quantity: '',
      short_description: '',
      long_description: '',
      media: []
    });
    setNewMediaUrl('');
    setNewMediaType('image');
    setRemovedMediaIds([]);
    setEditingProduct(null);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newMedia: ProductMedia[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Determine media type based on file extension
        const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(fileExt || '');
        const mediaType = isVideo ? 'video' : 'image';

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newMedia.push({
          media_url: data.publicUrl,
          media_type: mediaType,
          display_order: formData.media.length + i
        });
      }

      setFormData({ 
        ...formData, 
        media: [...formData.media, ...newMedia],
        // Set the first uploaded image as main image if no image is set
        image: formData.image || (newMedia.find(m => m.media_type === 'image')?.media_url || formData.image)
      });

      toast({
        title: "تم رفع الملفات بنجاح",
        description: `تم رفع ${files.length} ملف وإضافتها للمنتج`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في رفع الملفات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    const toRemove = formData.media[index];
    if (toRemove?.id) {
      setRemovedMediaIds((prev) => [...prev, toRemove.id as string]);
    }
    const updatedMedia = formData.media.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      media: updatedMedia,
      image: updatedMedia.find(m => m.media_type === 'image')?.media_url || formData.image
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      quantity: parseInt(formData.quantity),
      short_description: formData.short_description,
      long_description: formData.long_description
    };

    const result = editingProduct
      ? await updateProduct(editingProduct, productData)
      : await addProduct(productData);

    if (result.success) {
      const targetProductId = editingProduct ? editingProduct : result.data?.id;

      // Handle deletions when editing
      if (editingProduct && removedMediaIds.length > 0) {
        await Promise.all(removedMediaIds.map((id) => deleteProductMedia(id)));
      }

      // Add new media (both for create and edit)
      if (targetProductId) {
        const toAdd = formData.media.filter((m) => !m.id);
        if (toAdd.length > 0) {
          await Promise.all(toAdd.map((m) => addProductMedia(targetProductId, m.media_url, m.media_type, m.display_order)));
        }
      }

      toast({
        title: editingProduct ? "تم تحديث المنتج" : "تم إضافة المنتج",
        description: "تم حفظ البيانات بنجاح"
      });
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } else {
      toast({
        title: "خطأ",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      quantity: product.quantity.toString(),
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      media: product.media || []
    });
    setRemovedMediaIds([]);
    setEditingProduct(product.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast({
          title: "تم حذف المنتج",
          description: "تم حذف المنتج بنجاح"
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error,
          variant: "destructive"
        });
      }
    }
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
          <CardTitle>إدارة المنتجات</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="ml-2 h-4 w-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المنتج</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (₪)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية المتوفرة</Label>
                  <Input
                    id="quantity"
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الصور والفيديوهات</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-1"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <Upload className="ml-2 h-4 w-4" />
                            رفع ملفات (صور/فيديوهات)
                          </>
                        )}
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>
                    
                    {/* Display uploaded media */}
                    {formData.media.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        {formData.media.map((media, index) => (
                          <div key={index} className="relative group">
                            <div className="w-full h-32 overflow-hidden rounded-lg bg-muted relative">
                              {media.media_type === 'image' ? (
                                <img 
                                  src={media.media_url} 
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                  <Play className="h-8 w-8 text-white" />
                                  <video 
                                    src={media.media_url}
                                    className="w-full h-full object-cover absolute inset-0"
                                    muted
                                  />
                                </div>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMedia(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-1 left-1">
                                {media.media_type === 'image' ? (
                                  <ImageIcon className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                ) : (
                                  <Play className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">أو</div>
                    <Input
                      placeholder="رابط الصورة الرئيسية"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                    {formData.image && (
                      <div className="w-full h-32 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={formData.image}
                          alt="معاينة المنتج"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}

                    {/* Add media via URL (second, third, ...)
                        Allows adding image or video links dynamically */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label>نوع الرابط</Label>
                        <Select value={newMediaType} onValueChange={(v) => setNewMediaType(v as 'image' | 'video')}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">صورة</SelectItem>
                            <SelectItem value="video">فيديو</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>رابط الصورة/الفيديو</Label>
                        <Input
                          placeholder="أدخل رابط الصورة أو الفيديو"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (!newMediaUrl.trim()) return;
                          const item = {
                            media_url: newMediaUrl.trim(),
                            media_type: newMediaType,
                            display_order: formData.media.length,
                          } as ProductMedia;
                          setFormData({
                            ...formData,
                            media: [...formData.media, item],
                            image: formData.image || (newMediaType === 'image' ? newMediaUrl.trim() : formData.image)
                          });
                          setNewMediaUrl('');
                        }}
                      >
                        إضافة الرابط
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="short_description">الوصف المختصر (يظهر في الصفحة الرئيسية)</Label>
                  <Textarea
                    id="short_description"
                    placeholder="وصف قصير يلخص المنتج في سطر أو سطرين"
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="long_description">الوصف التفصيلي (يظهر في صفحة المنتج)</Label>
                  <Textarea
                    id="long_description"
                    placeholder="وصف مفصل عن المنتج، مميزاته، واستخداماته"
                    value={formData.long_description}
                    onChange={(e) => setFormData({...formData, long_description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? 'تحديث' : 'إضافة'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الملفات</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price.toFixed(2)} ₪</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {product.media?.length || 0} ملف
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
