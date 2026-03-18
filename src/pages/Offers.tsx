import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { ProductGrid } from "../components/ProductGrid.tsx";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import lifestyleBanner from "@/assets/campaign/lifestyle.jpg";

export default function Offers() {
  const {
    language,
  } = useLanguage();
  const isAr = language === "ar";
  const isRtl = isAr;
  return (
    <div
      className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          {/* Editorial Banner */}
          <div className="relative mb-16 overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 hover:scale-105"
              style={{
                backgroundImage: `url(${lifestyleBanner})`,
              }}
            />
            <div className="absolute inset-0 bg-luxury-black/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="relative py-16 px-6 md:px-12 text-center">
              <div className="flex justify-center mb-6 text-rose-900">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                  <span className="text-gold text-xl">✦</span>
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide text-rose-50">
                {isAr
                  ? (
                    <>
                      عروض <span className="text-gold">خاصة</span>
                    </>
                  )
                  : (
                    <>
                      Special <span className="text-gold">Offers</span>
                    </>
                  )}
              </h1>

              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

              <p className="font-display text-lg md:text-xl text-gold italic mb-6 max-w-2xl mx-auto">
                {isAr
                  ? '"الفخامة في متناول يدك"'
                  : '"Luxury within your reach"'}
              </p>

              <p className="font-body max-w-3xl mx-auto leading-relaxed text-rose-50">
                {isAr
                  ? "عروض حصرية على منتجات التجميل الفاخرة. لفترة محدودة فقط."
                  : "Exclusive deals on premium beauty products. Limited time only."}
              </p>
            </div>
          </div>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
