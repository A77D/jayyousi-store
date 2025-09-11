import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Header
    'store.name': 'متجر الجيوسي',
    'store.tagline': 'منتجات متنوعة وأصيلة',
    'my.account': 'حسابي',
    'my.orders': 'طلباتي',
    'logout': 'تسجيل الخروج',
    'login': 'تسجيل الدخول',
    'signup': 'إنشاء حساب',
    
    // Home page
    'welcome.title': 'مرحباً بك في متجر الجيوسي',
    'welcome.subtitle': 'نقدم لك أجود المنتجات المتنوعة من الإلكترونيات والإكسسوارات والأدوات العصرية',
    'featured.products': 'منتجاتنا المميزة',
    'featured.subtitle': 'اكتشف مجموعتنا المتنوعة من المنتجات العصرية والعملية',
    
    // Product
    'view.more': 'عرض المزيد',
    'out.of.stock': 'غير متوفر',
    'available': 'متوفر',
    'pieces': 'قطعة',
    'add.to.cart': 'إضافة للسلة',
    'quantity': 'الكمية',
    'total': 'المجموع',
    
    // Cart
    'shopping.cart': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.empty.message': 'لم تقم بإضافة أي منتجات إلى السلة بعد',
    'shop.now': 'تسوق الآن',
    'continue.shopping': 'متابعة التسوق',
    'clear.cart': 'إفراغ السلة',
    'order.summary': 'ملخص الطلب',
    'grand.total': 'المجموع الكلي',
    'checkout': 'إتمام الطلب',
    
    // Common
    'back.to.home': 'العودة للرئيسية',
    'phone': 'الهاتف',
    'address': 'العنوان',
    'palestine': 'فلسطين',
  },
  en: {
    // Header
    'store.name': 'Jayyousi Store',
    'store.tagline': 'Diverse and Authentic Products',
    'my.account': 'My Account',
    'my.orders': 'My Orders',
    'logout': 'Logout',
    'login': 'Login',
    'signup': 'Sign Up',
    
    // Home page
    'welcome.title': 'Welcome to Jayyousi Store',
    'welcome.subtitle': 'We offer you the finest diverse products from electronics, accessories, and modern tools',
    'featured.products': 'Featured Products',
    'featured.subtitle': 'Discover our diverse collection of modern and practical products',
    
    // Product
    'view.more': 'View More',
    'out.of.stock': 'Out of Stock',
    'available': 'Available',
    'pieces': 'pieces',
    'add.to.cart': 'Add to Cart',
    'quantity': 'Quantity',
    'total': 'Total',
    
    // Cart
    'shopping.cart': 'Shopping Cart',
    'cart.empty': 'Cart is Empty',
    'cart.empty.message': 'You haven\'t added any products to your cart yet',
    'shop.now': 'Shop Now',
    'continue.shopping': 'Continue Shopping',
    'clear.cart': 'Clear Cart',
    'order.summary': 'Order Summary',
    'grand.total': 'Grand Total',
    'checkout': 'Checkout',
    
    // Common
    'back.to.home': 'Back to Home',
    'phone': 'Phone',
    'address': 'Address',
    'palestine': 'Palestine',
  },
  he: {
    // Header
    'store.name': 'חנות ג\'יוסי',
    'store.tagline': 'מוצרים מגוונים ואותנטיים',
    'my.account': 'החשבון שלי',
    'my.orders': 'ההזמנות שלי',
    'logout': 'התנתק',
    'login': 'התחבר',
    'signup': 'הרשמה',
    
    // Home page
    'welcome.title': 'ברוכים הבאים לחנות ג\'יוסי',
    'welcome.subtitle': 'אנו מציעים לכם את המוצרים המגוונים הטובים ביותר מאלקטרוניקה, אביזרים וכלים מודרניים',
    'featured.products': 'מוצרים מובחרים',
    'featured.subtitle': 'גלו את האוסף המגוון שלנו של מוצרים מודרניים ומעשיים',
    
    // Product
    'view.more': 'צפה עוד',
    'out.of.stock': 'אזל מהמלאי',
    'available': 'זמין',
    'pieces': 'יחידות',
    'add.to.cart': 'הוסף לעגלה',
    'quantity': 'כמות',
    'total': 'סה"כ',
    
    // Cart
    'shopping.cart': 'עגלת קניות',
    'cart.empty': 'העגלה ריקה',
    'cart.empty.message': 'עדיין לא הוספת מוצרים לעגלה שלך',
    'shop.now': 'קנה עכשיו',
    'continue.shopping': 'המשך קניות',
    'clear.cart': 'רוקן עגלה',
    'order.summary': 'סיכום הזמנה',
    'grand.total': 'סה"כ כללי',
    'checkout': 'לתשלום',
    
    // Common
    'back.to.home': 'חזור לעמוד הבית',
    'phone': 'טלפון',
    'address': 'כתובת',
    'palestine': 'פלסטין',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    return stored || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' || language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};