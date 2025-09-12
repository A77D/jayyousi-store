import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Store, Phone, MapPin, Loader2, Shield, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    products,
    loading
  } = useProducts();
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: t('logout.success.title'),
      description: t('logout.success.description'),
    });
  };
  return <div className="min-h-screen bg-gradient-warm">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('welcome.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('welcome.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mb-8"></div>
          <div className="flex justify-center">
            {user ? (
              <Button size="lg" onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                {t('logout')}
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('login')} / {t('signup')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t('featured.products')}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>
          
          {loading ? <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>}
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
              <h4 className="text-xl font-semibold text-foreground">{t('diverse.and.many.products')}</h4>
              <p className="text-muted-foreground">{t('all.our.products.are.carefully.selected')}</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">{t('excellent.customer.service')}</h4>
              <p className="text-muted-foreground">{t('support.team.available.to.answer.inquiries')}</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-soft">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">{t('fast.delivery')}</h4>
              <p className="text-muted-foreground">{t('your.order.will.be.delivered.asap')}</p>
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
                <h5 className="text-xl font-bold">{t('store.name')}</h5>
              </div>
              <p className="text-background/80">
                {t('store.specializing.in.selling.diverse.and.modern.products')}
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">{t('contact.us')}</h6>
              <div className="space-y-2 text-background/80">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +970594321456
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('palestine')}
                </p>
              </div>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">{t('working.hours')}</h6>
              <div className="space-y-1 text-background/80">
                <p>{t('saturday.thursday')}</p>
                <p>{t('friday')}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <div className="flex items-center justify-center gap-4 mb-2">
              <p>{t('copyright')}</p>
              <Link to="/admin/login" className="flex items-center gap-1 text-xs opacity-50 hover:opacity-80 transition-opacity">
                <Shield className="h-3 w-3" />
                {t('administration')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
