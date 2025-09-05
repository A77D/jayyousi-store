-- 1) Create roles enum and user_roles table, RLS, and helper function
-- Use robust create-if-not-exists patterns

-- Create enum app_role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 2) Update policies for orders and order_items to allow only admins to read
-- Drop restrictive placeholder policies if present
DROP POLICY IF EXISTS "Restrict all order access until auth implemented" ON public.orders;
DROP POLICY IF EXISTS "Restrict all order items access until auth implemented" ON public.order_items;

-- Ensure insert remains possible for checkout (public/unauth inserts)
DROP POLICY IF EXISTS "Enable insert for order creation" ON public.orders;
CREATE POLICY "Enable insert for order creation"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for order items creation" ON public.order_items;
CREATE POLICY "Enable insert for order items creation"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);

-- Allow ONLY admins (authenticated + has_role('admin')) to read orders and order_items
DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
CREATE POLICY "Admins can read orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can read order items" ON public.order_items;
CREATE POLICY "Admins can read order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3) Products CRUD: allow admins to manage products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
TO public
USING (true);

-- Admin-only write policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE public.orders IS 'Contains customer PII. Read access is restricted to admins via RLS.';
COMMENT ON TABLE public.order_items IS 'Order line items. Read access is restricted to admins via RLS.';
COMMENT ON TABLE public.user_roles IS 'Maps auth.users to application roles (admin/moderator/user).';