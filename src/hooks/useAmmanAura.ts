import { useEffect } from "react";

export const useAmmanAura = () => {
  useEffect(() => {
    const updateAura = () => {
      // Get current Amman time (GMT+3)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const ammanTime = new Date(utc + (3600000 * 3));
      const hours = ammanTime.getHours();

      let warmth = 0; // 0 to 1

      // Warmth peaks at sunset (around 6 PM / 18:00)
      // and is lowest at midday (around 12:00)
      if (hours >= 12 && hours <= 18) {
        warmth = (hours - 12) / 6;
      } else if (hours > 18 && hours <= 21) {
        warmth = 1 - ((hours - 18) / 3);
      } else if (hours < 12) {
        warmth = Math.max(0, (hours - 6) / 6);
      } else {
        warmth = 0;
      }

      // Update CSS variables for global background warmth
      document.documentElement.style.setProperty(
        "--aura-warmth",
        warmth.toString(),
      );

      // Calculate specific HSL adjustments for the Pearl Cream background
      // Base: HSL 25 47% 91%
      const saturate = 47 + (warmth * 15); // Up to 62%
      const lightness = 91 - (warmth * 5); // Down to 86%

      document.documentElement.style.setProperty(
        "--background-dynamic",
        `25 ${saturate}% ${lightness}%`,
      );
    };

    updateAura();
    const interval = setInterval(updateAura, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
};
