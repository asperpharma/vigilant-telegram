import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client.ts";
import { LuxuryProductCard } from "./LuxuryProductCard.tsx";
import { Skeleton } from "./ui/skeleton.tsx";
import { getProductImage } from "../lib/productImageUtils.ts";
import { useLanguage } from "../contexts/LanguageContext.tsx";

export const FeaturedCollection = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  const translations = {
    en: {
      eyebrow: "Selected For You",
      title: "The Iconic Edit",
    },
    ar: {
      eyebrow: "مختار لك",
      title: "التحرير الأيقوني",
    },
  };

  const t = translations[language];

  return (
    <section id="featured-collection" className="bg-cream py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div
          className={`mb-12 text-center md:mb-16 ${isRTL ? "font-arabic" : ""}`}
        >
          <span className="mb-3 inline-block font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-500">
            {t.eyebrow}
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-luxury-black md:text-5xl">
            {t.title}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold-300" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {isLoading
            ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/4] w-full bg-cream-dark" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-3 w-16 bg-cream-dark" />
                    <Skeleton className="mb-3 h-5 w-full bg-cream-dark" />
                    <Skeleton className="h-4 w-20 bg-cream-dark" />
                  </div>
                </div>
              ))
            )
            : (
              products?.map((product) => (
                <LuxuryProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    category: product.category,
                    brand: product.brand || undefined,
                    price: product.price,
                    original_price: product.original_price,
                    discount_percent: product.discount_percent,
                    image_url: getProductImage(
                      product.image_url,
                      product.category || "",
                      product.title,
                    ),
                    description: product.description || undefined,
                    volume_ml: product.volume_ml || undefined,
                    is_new: !product.is_on_sale &&
                      new Date(product.created_at) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    is_on_sale: product.is_on_sale || false,
                  }}
                />
              ))
            )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
