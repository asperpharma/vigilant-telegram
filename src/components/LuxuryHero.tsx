import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { cn } from "../lib/utils.ts";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.tsx";

export const LuxuryHero = () => {
  const [bgImageError, setBgImageError] = useState(false);
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const scrollToCollection = () => {
    const element = document.getElementById("featured-collection");
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = "/luxury-beauty-background.jpg";
    img.onerror = () => setBgImageError(true);
  }, []);

  const backgroundImage = bgImageError
    ? "linear-gradient(135deg, #800020 0%, #4a0e19 100%)"
    : `url('/luxury-beauty-background.jpg')`;

  const translations = {
    en: {
      eyebrow: "The New Collection",
      title: "Redefining",
      titleItalic: "Eternal Beauty",
      subtitle:
        "Experience the fusion of nature's finest ingredients and scientific innovation. A ritual designed for those who demand perfection.",
      shopNow: "Shop Now",
      viewLookbook: "View Lookbook",
      scroll: "Scroll",
    },
    ar: {
      eyebrow: "المجموعة الجديدة",
      title: "إعادة تعريف",
      titleItalic: "الجمال الأبدي",
      subtitle:
        "اختبر اندماج أفضل مكونات الطبيعة والابتكار العلمي. طقوس مصممة لأولئك الذين يطالبون بالكمال.",
      shopNow: "تسوق الآن",
      viewLookbook: "عرض الكتالوج",
      scroll: "مرر",
    },
  };

  const t = translations[language];
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-luxury-black">
      {/* 1. Background Image with "Ken Burns" Slow Zoom Effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent" />
      </div>

      {/* 2. Hero Content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-rose-50 ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {/* Gold Pre-heading (The "Eyebrow") */}
        <span className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-300 animate-fade-in-up opacity-0 [animation-delay:0.2s] text-soft-ivory">
          {t.eyebrow}
        </span>

        {/* Main Headline - Playfair Display */}
        <h1 className="font-serif text-5xl font-light leading-tight tracking-tight text-soft-ivory md:text-7xl lg:text-8xl animate-fade-in-up opacity-0 [animation-delay:0.4s]">
          {t.title}{" "}
          <span className="block italic text-gold-300">
            {t.titleItalic}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-lg font-sans text-base font-light leading-relaxed text-soft-ivory/70 md:text-lg animate-fade-in-up opacity-0 [animation-delay:0.6s]">
          {t.subtitle}
        </p>

        {/* Buttons */}
        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up opacity-0 [animation-delay:0.8s] ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
        >
          {/* Primary CTA - Gold */}
          <Button
            asChild
            className="group bg-gold-300 px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest text-luxury-black transition-all duration-300 hover:bg-gold-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <Link to="/shop" className="flex items-center gap-2">
              {t.shopNow}
              <ArrowIcon
                className={`h-4 w-4 transition-transform duration-300 ${
                  isRTL
                    ? "group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                }`}
              />
            </Link>
          </Button>

          {/* Secondary CTA - Glass/Outline */}
          <Button
            variant="outline"
            className="border-soft-ivory/30 bg-soft-ivory/5 px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest text-soft-ivory backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:bg-soft-ivory/10 hover:text-gold-300"
          >
            {t.viewLookbook}
          </Button>
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <button
        onClick={scrollToCollection}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-soft-ivory/50 transition-colors duration-300 hover:text-gold-300 animate-fade-in-up opacity-0 [animation-delay:1s]"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-widest">
            {t.scroll}
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </button>
    </div>
  );
};
export default LuxuryHero;
