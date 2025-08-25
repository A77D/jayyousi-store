import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Store, Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground mb-8">
            عذراً، لم نتمكن من العثور على الصفحة المطلوبة. قد تكون الصفحة محذوفة أو غير متاحة.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/"}
            className="btn-primary w-full group"
          >
            <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-smooth" />
            العودة للصفحة الرئيسية
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="btn-secondary w-full group"
          >
            <ArrowRight className="mr-2 h-4 w-4 group-hover:scale-110 transition-smooth" />
            الرجوع للصفحة السابقة
          </Button>
        </div>
        
        <div className="mt-12 p-6 card-elegant">
          <h3 className="font-semibold text-foreground mb-2">هل تحتاج المساعدة؟</h3>
          <p className="text-muted-foreground text-sm mb-4">
            تواصل معنا إذا كنت تواجه مشكلة في الوصول لصفحة معينة
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <span className="text-sm font-medium">052-123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;