import { Product } from '@/types/product';
import coffeeImage from '@/assets/coffee-product.jpg';
import datesImage from '@/assets/dates-product.jpg';
import sweetsImage from '@/assets/sweets-product.jpg';
import oliveOilImage from '@/assets/olive-oil-product.jpg';

export const products: Product[] = [
  {
    id: 1,
    name: 'قهوة عربية فاخرة',
    price: 25.50,
    image: coffeeImage,
    quantity: 15,
    description: 'قهوة عربية أصيلة محمصة بعناية فائقة'
  },
  {
    id: 2,
    name: 'تمر مجدول ممتاز',
    price: 35.00,
    image: datesImage,
    quantity: 8,
    description: 'تمر مجدول طازج ولذيذ من أجود الأنواع'
  },
  {
    id: 3,
    name: 'حلويات شرقية مشكلة',
    price: 42.75,
    image: sweetsImage,
    quantity: 12,
    description: 'مجموعة متنوعة من الحلويات الشرقية التقليدية'
  },
  {
    id: 4,
    name: 'زيت زيتون بكر ممتاز',
    price: 28.90,
    image: oliveOilImage,
    quantity: 20,
    description: 'زيت زيتون طبيعي 100% عصرة أولى باردة'
  }
];