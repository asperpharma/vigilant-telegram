import { Toaster } from "./components/ui/toaster.tsx";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import { useCartSync } from "./hooks/useCartSync.ts";
import { useAmmanAura } from "./hooks/useAmmanAura.ts";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Critical pages - load immediately
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";

// Secondary pages - lazy load for better performance
const Collections = lazy(() => import("./pages/Collections.tsx"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail.tsx"));
const Brands = lazy(() => import("./pages/Brands.tsx"));
const BrandVichy = lazy(() => import("./pages/BrandVichy.tsx"));
const BestSellers = lazy(() => import("./pages/BestSellers.tsx"));
const Offers = lazy(() => import("./pages/Offers.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const SkinConcerns = lazy(() => import("./pages/SkinConcerns.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Philosophy = lazy(() => import("./pages/Philosophy.tsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.tsx"));

// Admin pages
const BulkUpload = lazy(() => import("./pages/BulkUpload.tsx"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.tsx"));
const ManageProducts = lazy(() => import("./pages/ManageProducts.tsx"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard.tsx"));
const AdminAuditLogs = lazy(() => import("./pages/AdminAuditLogs.tsx"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-gold animate-spin" />
  </div>
);

const queryClient = new QueryClient();

// App content that uses hooks
const AppContent = () => {
  useCartSync();
  useAmmanAura();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/vichy" element={<BrandVichy />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skin-concerns" element={<SkinConcerns />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/admin/bulk-upload" element={<BulkUpload />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
