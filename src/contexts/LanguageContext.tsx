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
    
    // Checkout & Forms
    'delivery.info': 'معلومات التوصيل',
    'full.name': 'الاسم الكامل',
    'enter.full.name': 'أدخل اسمك الكامل',
    'phone.number': 'رقم الهاتف',
    'delivery.zone': 'منطقة التوصيل',
    'choose.delivery.zone': 'اختر منطقة التوصيل',
    'detailed.address': 'عنوان التوصيل التفصيلي',
    'enter.full.address': 'أدخل العنوان الكامل مع تفاصيل الموقع',
    'additional.notes': 'ملاحظات إضافية (اختياري)',
    'special.requests': 'أي ملاحظات أو طلبات خاصة',
    'confirm.order': 'تأكيد الطلب',
    'subtotal': 'المجموع الفرعي',
    'delivery.fees': 'رسوم التوصيل',
    'choose.area': 'اختر المنطقة',
    
    // Thank You Page
    'thank.you.order': 'شكراً لك على طلبك!',
    'order.received': 'تم استلام طلبك بنجاح وسيتم التواصل معك قريباً',
    'order.details': 'تفاصيل الطلب',
    'order.number': 'رقم الطلب',
    'order.date': 'تاريخ الطلب',
    'order.status': 'حالة الطلب',
    'under.review': 'قيد المراجعة',
    'ordered.products': 'المنتجات المطلوبة',
    'delivery.information': 'معلومات التوصيل',
    'notes': 'ملاحظات',
    'what.next': 'ماذا بعد؟',
    'order.review.process': '• سيتم مراجعة طلبك والتأكد من توفر المنتجات',
    'contact.within.24h': '• سنتواصل معك خلال 24 ساعة لتأكيد الطلب',
    'prepare.deliver': '• بعد التأكيد، سيتم تحضير الطلب وتوصيله إليك',
    'continue.shopping': 'متابعة التسوق',
    'call.us': 'اتصل بنا',
    
    // User Auth
    'user.account': 'حساب العضوية',
    'login.tab': 'تسجيل الدخول',
    'signup.tab': 'إنشاء حساب',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'enter.password': 'أدخل كلمة المرور',
    'confirm.password': 'تأكيد كلمة المرور',
    'reenter.password': 'أعد إدخال كلمة المرور',
    'logging.in': 'جاري تسجيل الدخول...',
    'creating.account': 'جاري إنشاء الحساب...',
    'back.to.home': 'العودة للرئيسية',
    
    // User Orders
    'my.orders.title': 'طلباتي',
    'all.orders.here': 'جميع طلباتك في مكان واحد',
    'no.orders': 'لا توجد طلبات',
    'no.orders.yet': 'لم تقم بإجراء أي طلبات بعد',
    'browse.products': 'تصفح المنتجات',
    'order.number.short': 'طلب رقم',
    'customer.info': 'معلومات العميل',
    'name': 'الاسم',
    'phone': 'الهاتف',
    'address': 'العنوان',
    'order.info': 'معلومات الطلب',
    'date': 'التاريخ',
    'status': 'الحالة',
    'total.amount': 'المبلغ الكلي',
    'new': 'جديد',
    'processing': 'قيد المعالجة',
    'completed': 'مكتمل',
    'cancelled': 'ملغي',
    
    // Product Details
    'product.features': 'مميزات المنتج',
    'high.quality': '• جودة عالية ومواد ممتازة',
    'full.warranty': '• ضمان كامل لمدة سنة',
    'free.shipping': '• شحن مجاني داخل المدينة',
    'return.policy': '• إمكانية الإرجاع خلال 14 يوم',
    'view.cart': 'عرض السلة',
    'product.not.found': 'المنتج غير موجود',
    'product.unavailable': 'هذا المنتج غير متوفر أو تم حذفه',
    
    // Footer & Contact
    'diverse.products': 'منتجات متنوعة',
    'carefully.selected': 'جميع منتجاتنا مختارة بعناية من أفضل المصادر',
    'excellent.service': 'خدمة عملاء ممتازة',
    'support.team': 'فريق دعم متاح للإجابة على استفساراتك',
    'fast.delivery': 'توصيل سريع',
    'quick.delivery': 'نوصل طلبك بأسرع وقت ممكن',
    'contact.us': 'تواصل معنا',
    'working.hours': 'ساعات العمل',
    'sat.thu': 'السبت - الخميس: 9:00 ص - 10:00 م',
    'friday': 'الجمعة: 2:00 م - 10:00 م',
    'all.rights': 'جميع الحقوق محفوظة',
    'palestine': 'فلسطين',
    
    // Common
    'admin': 'المدير',
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'success': 'نجح',
    'cancel': 'إلغاء',
    'save': 'حفظ',
    'delete': 'حذف',
    'edit': 'تعديل',
    'add': 'إضافة',
    'update': 'تحديث',
    'close': 'إغلاق',
    'confirm': 'تأكيد',
    'yes': 'نعم',
    'no': 'لا',
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
    
    // Checkout & Forms
    'delivery.info': 'Delivery Information',
    'full.name': 'Full Name',
    'enter.full.name': 'Enter your full name',
    'phone.number': 'Phone Number',
    'delivery.zone': 'Delivery Zone',
    'choose.delivery.zone': 'Choose delivery zone',
    'detailed.address': 'Detailed Delivery Address',
    'enter.full.address': 'Enter complete address with location details',
    'additional.notes': 'Additional Notes (Optional)',
    'special.requests': 'Any notes or special requests',
    'confirm.order': 'Confirm Order',
    'subtotal': 'Subtotal',
    'delivery.fees': 'Delivery Fees',
    'choose.area': 'Choose Area',
    
    // Thank You Page
    'thank.you.order': 'Thank You for Your Order!',
    'order.received': 'Your order has been received successfully and we will contact you soon',
    'order.details': 'Order Details',
    'order.number': 'Order Number',
    'order.date': 'Order Date',
    'order.status': 'Order Status',
    'under.review': 'Under Review',
    'ordered.products': 'Ordered Products',
    'delivery.information': 'Delivery Information',
    'notes': 'Notes',
    'what.next': 'What\'s Next?',
    'order.review.process': '• Your order will be reviewed and product availability confirmed',
    'contact.within.24h': '• We will contact you within 24 hours to confirm the order',
    'prepare.deliver': '• After confirmation, your order will be prepared and delivered',
    'continue.shopping': 'Continue Shopping',
    'call.us': 'Call Us',
    
    // User Auth
    'user.account': 'User Account',
    'login.tab': 'Login',
    'signup.tab': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'enter.password': 'Enter password',
    'confirm.password': 'Confirm Password',
    'reenter.password': 'Re-enter password',
    'logging.in': 'Logging in...',
    'creating.account': 'Creating account...',
    'back.to.home': 'Back to Home',
    
    // User Orders
    'my.orders.title': 'My Orders',
    'all.orders.here': 'All your orders in one place',
    'no.orders': 'No Orders',
    'no.orders.yet': 'You haven\'t placed any orders yet',
    'browse.products': 'Browse Products',
    'order.number.short': 'Order #',
    'customer.info': 'Customer Information',
    'name': 'Name',
    'phone': 'Phone',
    'address': 'Address',
    'order.info': 'Order Information',
    'date': 'Date',
    'status': 'Status',
    'total.amount': 'Total Amount',
    'new': 'New',
    'processing': 'Processing',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    
    // Product Details
    'product.features': 'Product Features',
    'high.quality': '• High quality and excellent materials',
    'full.warranty': '• Full year warranty',
    'free.shipping': '• Free shipping within the city',
    'return.policy': '• Return option within 14 days',
    'view.cart': 'View Cart',
    'product.not.found': 'Product Not Found',
    'product.unavailable': 'This product is not available or has been deleted',
    
    // Footer & Contact
    'diverse.products': 'Diverse Products',
    'carefully.selected': 'All our products are carefully selected from the finest sources',
    'excellent.service': 'Excellent Customer Service',
    'support.team': 'Support team available to answer your inquiries',
    'fast.delivery': 'Fast Delivery',
    'quick.delivery': 'We deliver your order as quickly as possible',
    'contact.us': 'Contact Us',
    'working.hours': 'Working Hours',
    'sat.thu': 'Saturday - Thursday: 9:00 AM - 10:00 PM',
    'friday': 'Friday: 2:00 PM - 10:00 PM',
    'all.rights': 'All rights reserved',
    'palestine': 'Palestine',
    
    // Common
    'admin': 'Admin',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'update': 'Update',
    'close': 'Close',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
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
    
    // Checkout & Forms
    'delivery.info': 'פרטי משלוח',
    'full.name': 'שם מלא',
    'enter.full.name': 'הכנס את שמך המלא',
    'phone.number': 'מספר טלפון',
    'delivery.zone': 'אזור משלוח',
    'choose.delivery.zone': 'בחר אזור משלוח',
    'detailed.address': 'כתובת משלוח מפורטת',
    'enter.full.address': 'הכנס כתובת מלאה עם פרטי מיקום',
    'additional.notes': 'הערות נוספות (אופציונלי)',
    'special.requests': 'הערות או בקשות מיוחדות',
    'confirm.order': 'אשר הזמנה',
    'subtotal': 'סכום ביניים',
    'delivery.fees': 'דמי משלוח',
    'choose.area': 'בחר אזור',
    
    // Thank You Page
    'thank.you.order': 'תודה על ההזמנה!',
    'order.received': 'ההזמנה התקבלה בהצלחה ונצור איתך קשר בקרוב',
    'order.details': 'פרטי הזמנה',
    'order.number': 'מספר הזמנה',
    'order.date': 'תאריך הזמנה',
    'order.status': 'סטטוס הזמנה',
    'under.review': 'בבדיקה',
    'ordered.products': 'מוצרים שהוזמנו',
    'delivery.information': 'פרטי משלוח',
    'notes': 'הערות',
    'what.next': 'מה הלאה?',
    'order.review.process': '• ההזמנה תיבדק וזמינות המוצרים תאושר',
    'contact.within.24h': '• נצור איתך קשר תוך 24 שעות לאישור ההזמנה',
    'prepare.deliver': '• לאחר האישור, ההזמנה תוכן ותישלח אליך',
    'continue.shopping': 'המשך קניות',
    'call.us': 'התקשר אלינו',
    
    // User Auth
    'user.account': 'חשבון משתמש',
    'login.tab': 'התחברות',
    'signup.tab': 'הרשמה',
    'email': 'אימייל',
    'password': 'סיסמה',
    'enter.password': 'הכנס סיסמה',
    'confirm.password': 'אשר סיסמה',
    'reenter.password': 'הכנס שוב את הסיסמה',
    'logging.in': 'מתחבר...',
    'creating.account': 'יוצר חשבון...',
    'back.to.home': 'חזור לעמוד הבית',
    
    // User Orders
    'my.orders.title': 'ההזמנות שלי',
    'all.orders.here': 'כל ההזמנות שלך במקום אחד',
    'no.orders': 'אין הזמנות',
    'no.orders.yet': 'עדיין לא ביצעת הזמנות',
    'browse.products': 'עיין במוצרים',
    'order.number.short': 'הזמנה #',
    'customer.info': 'פרטי לקוח',
    'name': 'שם',
    'phone': 'טלפון',
    'address': 'כתובת',
    'order.info': 'פרטי הזמנה',
    'date': 'תאריך',
    'status': 'סטטוס',
    'total.amount': 'סכום כולל',
    'new': 'חדש',
    'processing': 'בעיבוד',
    'completed': 'הושלם',
    'cancelled': 'בוטל',
    
    // Product Details
    'product.features': 'מאפייני המוצר',
    'high.quality': '• איכות גבוהה וחומרים מעולים',
    'full.warranty': '• אחריות מלאה לשנה',
    'free.shipping': '• משלוח חינם בעיר',
    'return.policy': '• אפשרות החזרה תוך 14 יום',
    'view.cart': 'צפה בעגלה',
    'product.not.found': 'המוצר לא נמצא',
    'product.unavailable': 'המוצר הזה לא זמין או נמחק',
    
    // Footer & Contact
    'diverse.products': 'מוצרים מגוונים',
    'carefully.selected': 'כל המוצרים שלנו נבחרו בקפידה ממקורות מעולים',
    'excellent.service': 'שירות לקוחות מעולה',
    'support.team': 'צוות תמיכה זמין לענות על שאלותיך',
    'fast.delivery': 'משלוח מהיר',
    'quick.delivery': 'אנו מספקים את ההזמנה שלך במהירות האפשרית',
    'contact.us': 'צור קשר',
    'working.hours': 'שעות פעילות',
    'sat.thu': 'שבת - חמישי: 9:00 - 22:00',
    'friday': 'שישי: 14:00 - 22:00',
    'all.rights': 'כל הזכויות שמורות',
    'palestine': 'פלסטין',
    
    // Common
    'admin': 'מנהל',
    'loading': 'טוען...',
    'error': 'שגיאה',
    'success': 'הצלחה',
    'cancel': 'ביטול',
    'save': 'שמור',
    'delete': 'מחק',
    'edit': 'ערוך',
    'add': 'הוסף',
    'update': 'עדכן',
    'close': 'סגור',
    'confirm': 'אשר',
    'yes': 'כן',
    'no': 'לא',
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