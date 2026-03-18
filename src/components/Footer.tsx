import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import asperLogo from "@/assets/asper-logo.jpg";

// TikTok icon component
const TikTokIcon = ({
  className,
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
export const Footer = () => {
  const [email, setEmail] = useState("");
  const {
    language,
  } = useLanguage();
  const isArabic = language === "ar";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };
  const conciergLinks = [{
    name: isArabic ? "تتبع الطلب" : "Track Order",
    href: "/tracking",
  }, {
    name: isArabic ? "سياسة الشحن" : "Shipping Policy",
    href: "/shipping",
  }, {
    name: isArabic ? "الإرجاع والاستبدال" : "Returns & Exchanges",
    href: "/returns",
  }, {
    name: isArabic ? "استشارة البشرة" : "Skin Consultation",
    href: "/consultation",
  }];

  const aboutLinks = [{
    name: isArabic ? "فلسفتنا" : "Our Philosophy",
    href: "/philosophy",
  }, {
    name: isArabic ? "اتصل بنا" : "Contact Us",
    href: "/contact",
  }];
  return (
    <footer
      className="bg-burgundy"
      style={{
        borderTop: "1px solid hsl(var(--gold))",
      }}
    >
      {/* Main Footer Content */}
      <div className="luxury-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Brand Identity */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src={asperLogo}
                alt="Asper Beauty Shop"
                className="h-16 rounded"
              />
            </Link>
            <p className="font-body text-cream mb-6">
              {isArabic
                ? "إعادة تعريف الجمال في الأردن."
                : "Redefining Beauty in Jordan."}
            </p>

            {/* Social Icons - Gold Outlines */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/asper.beauty.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/asper.beauty.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/962790656666"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.tiktok.com/@asper.beauty.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-burgundy transition-all duration-400"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Concierge */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "خدمة العملاء" : "Concierge"}
            </h3>
            <ul className="space-y-3">
              {conciergLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-body text-sm text-cream hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - About */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "عن آسبر" : "About Asper"}
            </h3>
            <ul className="space-y-3 mb-8">
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-body text-sm text-cream hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-sm text-gold mb-3">
              {isArabic ? "المقر الرئيسي" : "The Atelier"}
            </h4>
            <div className="space-y-2">
              <p className="font-body text-sm text-cream">
                {isArabic
                  ? "شارع الدلال، عمّان، الأردن"
                  : "The Boulevard, Amman, Jordan"}
              </p>
              <a
                href="tel:+962790656666"
                className="font-body text-sm text-cream hover:text-gold transition-colors duration-400 block"
              >
                +962 79 065 6666
              </a>
              <a
                href="mailto:concierge@asperbeautyshop.com"
                className="font-body text-sm text-cream hover:text-gold transition-colors duration-400 block"
              >
                concierge@asperbeautyshop.com
              </a>
            </div>
          </div>

          {/* Column 4 - VIP Club */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "نادي كبار الشخصيات" : "The VIP Registry"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isArabic
                  ? "عنوان بريدك الموقر"
                  : "Your distinguished email"}
                className="w-full px-4 py-3 bg-transparent border border-white text-white font-body text-sm placeholder:text-white/50 focus:outline-none focus:border-gold transition-colors duration-400 rounded"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gold text-burgundy font-display text-sm tracking-wider hover:bg-gold-light transition-colors duration-400 rounded"
              >
                {isArabic ? "انضم لآسبر" : "Join Asper"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gold/30">
        <div className="luxury-container py-6">
          <p className="font-body text-[10px] text-cream/70 text-center mb-2 tracking-widest uppercase">
            {isArabic
              ? "ضمان الأصالة: كل منتج في آسبر منسق بعناية ومضمون 100%"
              : "Authenticity Guaranteed: Every item at Asper is meticulously curated and 100% genuine."}
          </p>
          <p className="font-body text-xs text-cream/50 text-center">
            © 2026 Asper Beauty Shop. {isArabic
              ? "الجمال يكمن في التفاصيل."
              : "Beauty resides in the details."}
          </p>
        </div>
      </div>
    </footer>
  );
};
