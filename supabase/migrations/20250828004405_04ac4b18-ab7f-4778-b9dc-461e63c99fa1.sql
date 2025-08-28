-- Fix critical security vulnerability: Customer personal information exposure
-- Remove the overly permissive RLS policies and implement proper access control

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow admin to view all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin to view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Create secure policies that protect customer data
-- Only allow creating orders (for checkout functionality)
CREATE POLICY "Enable insert for order creation" ON public.orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for order items creation" ON public.order_items
FOR INSERT WITH CHECK (true);

-- Completely restrict reading of orders and order items until proper authentication is implemented
-- This prevents any unauthorized access to customer personal information
CREATE POLICY "Restrict all order access until auth implemented" ON public.orders
FOR SELECT USING (false);

CREATE POLICY "Restrict all order items access until auth implemented" ON public.order_items
FOR SELECT USING (false);

-- Add a comment to remind about implementing proper authentication
COMMENT ON TABLE public.orders IS 'SECURITY: Access restricted until proper admin authentication is implemented. Customer personal data must be protected.';