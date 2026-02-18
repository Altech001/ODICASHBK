import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CashbooksPage from "./components/CashbooksPage";
import BookDetailPage from "./components/BookDetailPage";
import BookSettingsPage from "./components/BookSettingsPage";
import TeamPage from "./components/TeamPage";
import BusinessSettingsPage from "./components/BusinessSettingsPage";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/cashbooks" replace />} />
              <Route path="/cashbooks" element={<CashbooksPage />} />
              <Route path="/cashbooks/:bookId" element={<BookDetailPage />} />
              <Route path="/cashbooks/:bookId/settings" element={<BookSettingsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/settings" element={<BusinessSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
