import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Membership from "@/pages/Membership";
import AllDietPlan from "@/pages/AllDietPlan";
import Diet from "@/pages/Diet";
import AllWorkout from "@/pages/AllWorkout";
import NotFound from "./pages/NotFound";
import NewCustomer from "@/pages/NewCustomer";
import AdminQR from "@/pages/AdminQR";
import AdminCustomers from "@/pages/AdminCustomers";
import Auth from "@/pages/Auth";
import BrandingSettings from "@/pages/BrandingSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrandingProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/new-customer" element={<NewCustomer />} />

              {/* Protected admin routes */}
              <Route
                element={
                  <ProtectedRoute requireAdmin>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/all-diet-plan" element={<AllDietPlan />} />
                <Route path="/diet" element={<Diet />} />
                <Route path="/all-workout" element={<AllWorkout />} />
                <Route path="/admin/qr" element={<AdminQR />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/settings/branding" element={<BrandingSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BrandingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
