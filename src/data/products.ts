import { Product } from '@/types/product';
import coffeeImage from '@/assets/coffee-product.jpg';
import datesImage from '@/assets/dates-product.jpg';
import sweetsImage from '@/assets/sweets-product.jpg';
import oliveOilImage from '@/assets/olive-oil-product.jpg';

export const products: Product[] = [
  {
    id: 1,
    name: 'ساعة ذكية فاخرة',
    price: 125.50,
    image: coffeeImage,
    quantity: 15,
    description: 'ساعة ذكية بمواصفات عالية ومقاومة للماء'
  },
  {
    id: 2,
    name: 'سماعات لاسلكية',
    price: 85.00,
    image: datesImage,
    quantity: 8,
    description: 'سماعات بلوتوث عالية الجودة مع خاصية إلغاء الضوضاء'
  },
  {
    id: 3,
    name: 'حقيبة يد أنيقة',
    price: 95.75,
    image: sweetsImage,
    quantity: 12,
    description: 'حقيبة يد جلدية فاخرة بتصميم عصري'
  },
  {
    id: 4,
    name: 'نظارات شمسية',
    price: 65.90,
    image: oliveOilImage,
    quantity: 20,
    description: 'نظارات شمسية عصرية بحماية UV400'
  }
];