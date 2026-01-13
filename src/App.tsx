import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import Index from "./pages/Index";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import Rentals from "./pages/Rentals";
import RentalDetail from "./pages/RentalDetail";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminItems from "./pages/admin/AdminItems";
import AdminRentals from "./pages/admin/AdminRentals";
import AdminStatusTags from "./pages/admin/AdminStatusTags";
import AdminPaymentSettings from "./pages/admin/AdminPaymentSettings";
import AdminTerms from "./pages/admin/AdminTerms";
import AdminContactSettings from "./pages/admin/AdminContactSettings";
import AdminContactSubmissions from "./pages/admin/AdminContactSubmissions";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/rentals/:id" element={<RentalDetail />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="items" element={<AdminItems />} />
                <Route path="rentals" element={<AdminRentals />} />
                <Route path="status-tags" element={<AdminStatusTags />} />
                <Route path="payment-settings" element={<AdminPaymentSettings />} />
                <Route path="terms" element={<AdminTerms />} />
                <Route path="contact-settings" element={<AdminContactSettings />} />
                <Route path="contact-submissions" element={<AdminContactSubmissions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SiteSettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
