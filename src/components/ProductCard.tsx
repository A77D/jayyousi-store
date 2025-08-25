import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onOrder }: ProductCardProps) {
  return (
    <div className="card-elegant p-6 group hover:scale-105 transition-bounce">
      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
        {product.description && (
          <p className="text-muted-foreground text-sm">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} ₪</p>
            <p className="text-sm text-muted-foreground">متوفر: {product.quantity} قطعة</p>
          </div>
        </div>
        
        <Button 
          onClick={() => onOrder(product)}
          disabled={product.quantity === 0}
          className="w-full btn-primary group"
        >
          <ShoppingCart className="ml-2 h-4 w-4 group-hover:scale-110 transition-smooth" />
          {product.quantity > 0 ? 'طلب المنتج' : 'غير متوفر'}
        </Button>
      </div>
    </div>
  );
}