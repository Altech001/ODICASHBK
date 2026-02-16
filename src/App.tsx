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
import AuthLoayout from "./components/auth/AuthLoayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLoayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/cashbooks" replace />} />
            <Route path="/cashbooks" element={<CashbooksPage />} />
            <Route path="/cashbooks/:bookId" element={<BookDetailPage />} />
            <Route path="/cashbooks/:bookId/settings" element={<BookSettingsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/settings" element={<BusinessSettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
