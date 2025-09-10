-- Create product_media table to store multiple images and videos for each product
CREATE TABLE product_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Enable RLS on product_media
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_media
CREATE POLICY "Product media is viewable by everyone" 
ON product_media 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert product media" 
ON product_media 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product media" 
ON product_media 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product media" 
ON product_media 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage policies for video files
CREATE POLICY "Product videos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images' AND (storage.extension(name) = 'mp4' OR storage.extension(name) = 'webm' OR storage.extension(name) = 'mov'));

CREATE POLICY "Admins can upload product videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role) AND (storage.extension(name) = 'mp4' OR storage.extension(name) = 'webm' OR storage.extension(name) = 'mov'));

-- Create index for better performance
CREATE INDEX idx_product_media_product_id ON product_media(product_id);
CREATE INDEX idx_product_media_display_order ON product_media(product_id, display_order);