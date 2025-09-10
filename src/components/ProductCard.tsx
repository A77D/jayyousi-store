import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

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
        {product.short_description && (
          <p className="text-muted-foreground text-sm">{product.short_description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} ₪</p>
            <p className="text-sm text-muted-foreground">متوفر: {product.quantity} قطعة</p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate(`/product/${product.id}`)}
          disabled={product.quantity === 0}
          className="w-full btn-primary group"
        >
          <Eye className="ml-2 h-4 w-4 group-hover:scale-110 transition-smooth" />
          {product.quantity > 0 ? 'عرض المزيد' : 'غير متوفر'}
        </Button>
      </div>
    </div>
  );
}