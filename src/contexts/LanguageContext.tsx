import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: object) => string;
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
    'add.to.cart.success.title': 'تمت إضافة المنتج للسلة',
    'add.to.cart.success.description': 'تم إضافة {quantity} من {name} إلى سلة التسوق',
    
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

    // Checkout
    'back.to.cart': 'العودة للسلة',
    'delivery.information': 'معلومات التوصيل',
    'full.name': 'الاسم الكامل',
    'enter.full.name': 'أدخل اسمك الكامل',
    'phone.number': 'رقم الهاتف',
    'phone.number.placeholder': '+970-xxx-xxx-xxx',
    'delivery.zone': 'منطقة التوصيل',
    'choose.delivery.zone': 'اختر منطقة التوصيل',
    'detailed.delivery.address': 'عنوان التوصيل التفصيلي',
    'enter.detailed.address': 'أدخل العنوان الكامل مع تفاصيل الموقع',
    'additional.notes.optional': 'ملاحظات إضافية (اختياري)',
    'any.special.notes': 'أي ملاحظات أو طلبات خاصة',
    'confirm.order': 'تأكيد الطلب',
    'subtotal': 'المجموع الفرعي',
    'delivery.fee': 'رسوم التوصيل',
    'select.zone': 'اختر المنطقة',
    'west.bank': 'الضفة الغربية',
    'jerusalem': 'القدس',
    'occupied.interior': 'الداخل المحتل',
    'order.success.title': 'تم إرسال الطلب بنجاح',
    'order.success.description': 'سيتم التواصل معك قريباً لتأكيد الطلب',
    'order.error.title': 'خطأ في إرسال الطلب',
    'order.error.description': 'حدث خطأ غير متوقع',
    
    // Common
    'back.to.home': 'العودة للرئيسية',
    'phone': 'الهاتف',
    'address': 'العنوان',
    'palestine': 'فلسطين',

    // Footer from image
    'diverse.and.many.products': 'منتجات متنوعة و كثيرة',
    'all.our.products.are.carefully.selected': 'جميع منتجاتنا مختارة بعناية من أجود المصادر',
    'excellent.customer.service': 'خدمة عملاء ممتازة',
    'support.team.available.to.answer.inquiries': 'فريق دعم متاح للرد على استفساراتكم',
    'fast.delivery': 'توصيل سريع',
    'your.order.will.be.delivered.asap': 'توصل طلبكم في أسرع وقت ممكن',
    'store.specializing.in.selling.diverse.and.modern.products': 'متجر متخصص في بيع المنتجات المتنوعة والعصرية',
    'contact.us': 'تواصل معنا',
    'working.hours': 'ساعات العمل',
    'saturday.thursday': 'السبت - الخميس : 9:00 ص - 10:00 م',
    'friday': 'الجمعة: 2:00 م - 10:00 م',
    'copyright': '© 2024 متجر الجيوسي. جميع الحقوق محفوظة',
    'administration': 'إدارة',
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
    'add.to.cart.success.title': 'Product added to cart',
    'add.to.cart.success.description': '{quantity} of {name} have been added to your cart',

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
    
    // Checkout
    'back.to.cart': 'Back to Cart',
    'delivery.information': 'Delivery Information',
    'full.name': 'Full Name',
    'enter.full.name': 'Enter your full name',
    'phone.number': 'Phone Number',
    'phone.number.placeholder': '+970-xxx-xxx-xxx',
    'delivery.zone': 'Delivery Zone',
    'choose.delivery.zone': 'Choose delivery zone',
    'detailed.delivery.address': 'Detailed Delivery Address',
    'enter.detailed.address': 'Enter the full address with location details',
    'additional.notes.optional': 'Additional Notes (Optional)',
    'any.special.notes': 'Any special notes or requests',
    'confirm.order': 'Confirm Order',
    'subtotal': 'Subtotal',
    'delivery.fee': 'Delivery Fee',
    'select.zone': 'Select zone',
    'west.bank': 'West Bank',
    'jerusalem': 'Jerusalem',
    'occupied.interior': 'Occupied Interior',
    'order.success.title': 'Order submitted successfully',
    'order.success.description': 'We will contact you shortly to confirm your order',
    'order.error.title': 'Error submitting order',
    'order.error.description': 'An unexpected error occurred',

    // Common
    'back.to.home': 'Back to Home',
    'phone': 'Phone',
    'address': 'Address',
    'palestine': 'Palestine',

    // Footer from image
    'diverse.and.many.products': 'Diverse and many products',
    'all.our.products.are.carefully.selected': 'All our products are carefully selected from the best sources',
    'excellent.customer.service': 'Excellent customer service',
    'support.team.available.to.answer.inquiries': 'A support team is available to answer your inquiries',
    'fast.delivery': 'Fast delivery',
    'your.order.will.be.delivered.asap': 'Your order will be delivered as soon as possible',
    'store.specializing.in.selling.diverse.and.modern.products': 'A store specializing in selling diverse and modern products',
    'contact.us': 'Contact us',
    'working.hours': 'Working hours',
    'saturday.thursday': 'Saturday - Thursday: 9:00 AM - 10:00 PM',
    'friday': 'Friday: 2:00 PM - 10:00 PM',
    'copyright': '© 2024 Jayyousi Store. All rights reserved',
    'administration': 'Administration',
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
    'add.to.cart.success.title': 'המוצר נוסף לעגלה',
    'add.to.cart.success.description': '{quantity} מ-{name} נוספו לעגלת הקניות שלך',
    
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

    // Checkout
    'back.to.cart': 'חזור לעגלה',
    'delivery.information': 'פרטי משלוח',
    'full.name': 'שם מלא',
    'enter.full.name': 'הכנס את שמך המלא',
    'phone.number': 'מספר טלפון',
    'phone.number.placeholder': '+970-xxx-xxx-xxx',
    'delivery.zone': 'אזור משלוח',
    'choose.delivery.zone': 'בחר אזור משלוח',
    'detailed.delivery.address': 'כתובת למשלוח מפורטת',
    'enter.detailed.address': 'הזן את הכתובת המלאה עם פרטי מיקום',
    'additional.notes.optional': 'הערות נוספות (אופציונלי)',
    'any.special.notes': 'הערות או בקשות מיוחדות',
    'confirm.order': 'אשר הזמנה',
    'subtotal': 'סכום ביניים',
    'delivery.fee': 'דמי משלוח',
    'select.zone': 'בחר אזור',
    'west.bank': 'הגדה המערבית',
    'jerusalem': 'ירושלים',
    'occupied.interior': 'הפנים הכבוש',
    'order.success.title': 'ההזמנה נשלחה בהצלחה',
    'order.success.description': 'ניצור עמך קשר בהקדם לאישור ההזמנה',
    'order.error.title': 'שגיאה בשליחת ההזמנה',
    'order.error.description': 'אירעה שגיאה בלתי צפויה',
    
    // Common
    'back.to.home': 'חזור לעמוד הבית',
    'phone': 'טלפון',
    'address': 'כתובת',
    'palestine': 'פלסטין',

    // Footer from image
    'diverse.and.many.products': 'מוצרים מגוונים ורבים',
    'all.our.products.are.carefully.selected': 'כל המוצרים שלנו נבחרים בקפידה מהמקורות הטובים ביותר',
    'excellent.customer.service': 'שירות לקוחות מעולה',
    'support.team.available.to.answer.inquiries': 'צוות תמיכה זמין לענות לפניותיכם',
    'fast.delivery': 'משלוח מהיר',
    'your.order.will.be.delivered.asap': 'ההזמנה שלך תסופק בהקדם האפשרי',
    'store.specializing.in.selling.diverse.and.modern.products': 'חנות המתמחה במכירת מוצרים מגוונים ומודרניים',
    'contact.us': 'צור קשר',
    'working.hours': 'שעות עבודה',
    'saturday.thursday': 'שבת - חמישי: 9:00 - 22:00',
    'friday': 'שישי: 14:00 - 22:00',
    'copyright': '© 2024 חנות ג\'יוסי. כל הזכויות שמורות',
    'administration': 'הנהלה',
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

  const t = (key: string, params?: object): string => {
    let translation = translations[language][key] || key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      }
    }
    return translation;
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
