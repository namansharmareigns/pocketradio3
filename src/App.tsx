
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthRedirect from "./components/auth/AuthRedirect";
import Profile from "./pages/Profile";
import Connect from "./pages/Connect";
import Notifications from "./pages/Notifications";
import NotificationsListener from "./components/features/notifications/NotificationsListener";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationsListener />
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route 
                path="/chat" 
                element={
                  <AuthRedirect requireAuth>
                    <Chat />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <AuthRedirect requireAuth={false}>
                    <Auth />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <AuthRedirect requireAuth>
                    <Profile />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/connect" 
                element={
                  <AuthRedirect requireAuth>
                    <Connect />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <AuthRedirect requireAuth>
                    <Notifications />
                  </AuthRedirect>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
