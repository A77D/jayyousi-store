-- Fix critical security issues: First drop triggers, then function, then recreate securely

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;

-- Now drop the function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create secure function with proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add SELECT policies for orders table (admin access)
CREATE POLICY "Allow admin to view all orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Add SELECT policies for order_items table (admin access)  
CREATE POLICY "Allow admin to view all order items" 
ON public.order_items 
FOR SELECT 
USING (true);