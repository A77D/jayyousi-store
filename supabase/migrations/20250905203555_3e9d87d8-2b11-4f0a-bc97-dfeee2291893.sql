-- Fix the security issue: Add RLS policy for user_roles table
-- Only allow users to see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert a default admin user - you'll need to replace this with your actual admin email
-- First, let's create a function to add admin role after user signup
CREATE OR REPLACE FUNCTION public.add_admin_role_for_email(email_address text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::public.app_role
  FROM auth.users
  WHERE email = email_address
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;