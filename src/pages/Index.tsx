import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { Store, Phone, MapPin, Loader2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { products, loading } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            مرحباً بك في متجر الجيوسي
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            نقدم لك أجود المنتجات المتنوعة من الإلكترونيات والإكسسوارات والأدوات العصرية
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">منتجاتنا المميزة</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              اكتشف مجموعتنا المتنوعة من المنتجات العصرية والعملية
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Store className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">منتجات أصيلة</h4>
              <p className="text-muted-foreground">جميع منتجاتنا مختارة بعناية من أجود المصادر</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">خدمة عملاء ممتازة</h4>
              <p className="text-muted-foreground">فريق دعم متاح للرد على استفساراتكم</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-soft">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">توصيل سريع</h4>
              <p className="text-muted-foreground">نوصل طلبكم في أسرع وقت ممكن</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <h5 className="text-xl font-bold">متجر الجيوسي</h5>
              </div>
              <p className="text-background/80">
                متجر متخصص في بيع المنتجات المتنوعة والعصرية
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">تواصل معنا</h6>
              <div className="space-y-2 text-background/80">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +970594321456
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  القدس، فلسطين
                </p>
              </div>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">ساعات العمل</h6>
              <div className="space-y-1 text-background/80">
                <p>السبت - الخميس: 9:00 ص - 10:00 م</p>
                <p>الجمعة: 2:00 م - 10:00 م</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <div className="flex items-center justify-center gap-4 mb-2">
              <p>&copy; 2024 متجر الجيوسي. جميع الحقوق محفوظة.</p>
              <Link 
                to="/admin/login" 
                className="flex items-center gap-1 text-xs opacity-50 hover:opacity-80 transition-opacity"
              >
                <Shield className="h-3 w-3" />
                إدارة
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;