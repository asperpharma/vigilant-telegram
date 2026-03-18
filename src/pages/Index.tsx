import { useEffect, useState } from "react";
import { GlobalHeader } from "../components/GlobalHeader.tsx";
import { LuxuryHero } from "../components/LuxuryHero.tsx";
import { BrandMarquee } from "../components/BrandMarquee.tsx";
import { LuxuryCategories } from "../components/LuxuryCategories.tsx";
import { DealOfTheDay } from "../components/DealOfTheDay.tsx";
import { LuxuryPromoBanner } from "../components/LuxuryPromoBanner.tsx";
import { FeaturedCollection } from "../components/FeaturedCollection.tsx";
import { BestSellersSection } from "../components/BestSellersSection.tsx";
import { Newsletter } from "../components/Newsletter.tsx";
import { Footer } from "../components/Footer.tsx";
import { BeautyAssistant } from "../components/BeautyAssistant.tsx";
import { ScrollToTop } from "../components/ScrollToTop.tsx";
import { FloatingSocials } from "../components/FloatingSocials.tsx";
import { PageLoadingSkeleton } from "../components/PageLoadingSkeleton.tsx";
import { MobileNav } from "../components/MobileNav.tsx";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    globalThis.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener("load", handleLoad);
    };
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <GlobalHeader />
      <main>
        {/* 1. EMOTIONAL LAYER: The Cinematic Hero */}
        <LuxuryHero />

        {/* 2. TRUST LAYER: Brand Logos (Global Standards) */}
        <BrandMarquee />

        {/* 3. NAVIGATION LAYER: Luxury Category Bubbles */}
        <LuxuryCategories />

        {/* 4. URGENCY LAYER: iHerb-style "Deal of the Day" */}
        <DealOfTheDay />

        {/* 5. ADVERTISEMENT LAYER: The "High-End" Promo - Image Left */}
        <LuxuryPromoBanner variant="primary" position="left" />

        {/* 6. DISCOVERY LAYER: Featured Collection */}
        <FeaturedCollection />

        {/* 7. BEST SELLERS LAYER: Global Favorites */}
        <BestSellersSection />

        {/* 8. ADVERTISEMENT LAYER 2: Secondary Promo - Image Right */}
        <LuxuryPromoBanner variant="secondary" position="right" />

        {/* 9. NEWSLETTER LAYER: Email Capture */}
        <Newsletter />
      </main>
      <Footer />
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
      <MobileNav />
      {/* Add bottom padding on mobile for the fixed nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
};

export default Index;
