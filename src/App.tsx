
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import CourseLists from "./pages/CourseLists";
import InstructorDetails from "./pages/InstructorDetails";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import TrackView from "./pages/TrackView";
import NotFound from "./pages/NotFound";
import { Button } from "./components/ui/button";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserCircle2, LogOut } from "lucide-react";
import { enableRealtimeForTables } from "./integrations/supabase/enableRealtime";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Navigation with auth controls
const Navigation = () => {
  const { user, signOut, isAdmin } = useAuth();
  
  return (
    <nav className="bg-slate-900 text-white p-4">
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-xl font-bold mb-4 sm:mb-0">Digital Arts and Design Academy</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="ghost" asChild>
            <Link to="/">Schedule</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/courses">Courses</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/instructors">Instructors</Link>
          </Button>
          
          {isAdmin() && (
            <Button variant="ghost" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm hidden md:inline-block">
                <UserCircle2 className="h-4 w-4 inline mr-1" />
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="text-white border-white hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild className="text-white border-white hover:text-white">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CourseLists /></ProtectedRoute>} />
      <Route path="/instructors" element={<ProtectedRoute><InstructorDetails /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      {/* Track view is now public - no ProtectedRoute wrapper */}
      <Route path="/track/:trackId" element={<TrackView />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    // Enable real-time updates for tables when the app initializes
    enableRealtimeForTables();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
