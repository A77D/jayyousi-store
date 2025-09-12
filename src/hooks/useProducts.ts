import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ProductMedia } from '@/types/product';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  short_description?: string;
  long_description?: string;
  media?: ProductMedia[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          media:product_media(
            id,
            product_id,
            media_url,
            media_type,
            display_order
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(product => ({
        ...product,
        media: (product.media || []).map(m => ({
          ...m,
          media_type: m.media_type as 'image' | 'video'
        }))
      }));
      
      setProducts(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'media'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' 
      };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' 
      };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // First, delete associated media from storage
      const { data: media, error: mediaError } = await supabase
        .from('product_media')
        .select('media_url')
        .eq('product_id', id);

      if (mediaError) throw mediaError;

      if (media && media.length > 0) {
        const filesToRemove = media.map(m => m.media_url.substring(m.media_url.lastIndexOf('/') + 1));
        await supabase.storage.from('product-images').remove(filesToRemove);
      }

      // Then, delete the product record, which will cascade delete media records
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchProducts(); // Refresh the product list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' 
      };
    }
  };

  const addProductMedia = async (productId: string, mediaUrl: string, mediaType: 'image' | 'video', displayOrder: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('product_media')
        .insert([{
          product_id: productId,
          media_url: mediaUrl,
          media_type: mediaType,
          display_order: displayOrder
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' 
      };
    }
  };

  const deleteProductMedia = async (mediaId: string) => {
    try {
      // First, get the media URL to delete from storage
      const { data: media, error: mediaError } = await supabase
        .from('product_media')
        .select('media_url')
        .eq('id', mediaId)
        .single();
      
      if (mediaError) throw mediaError;

      if (media) {
        const fileToRemove = media.media_url.substring(media.media_url.lastIndexOf('/') + 1);
        await supabase.storage.from('product-images').remove([fileToRemove]);
      }

      const { error } = await supabase
        .from('product_media')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' 
      };
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductMedia,
    deleteProductMedia
  };
}
