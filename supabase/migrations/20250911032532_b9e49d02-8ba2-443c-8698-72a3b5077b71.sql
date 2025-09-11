-- Remove the conflicting INSERT policy for orders
DROP POLICY IF EXISTS "Enable insert for order creation" ON public.orders;

-- Ensure the correct policy exists for both guest and authenticated users
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

-- Create a single, clear INSERT policy that allows both guest and authenticated orders
CREATE POLICY "Allow order creation for all users" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Allow guest orders (user_id IS NULL) or authenticated user orders (auth.uid() = user_id)
  (user_id IS NULL) OR (auth.uid() = user_id)
);