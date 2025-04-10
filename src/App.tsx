
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import CourseLists from "./pages/CourseLists";
import InstructorDetails from "./pages/InstructorDetails";
import NotFound from "./pages/NotFound";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-slate-900 text-white p-4">
          <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-xl font-bold mb-4 sm:mb-0">Digital Arts and Design Academy</h1>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/">Schedule</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/courses">Courses</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/instructors">Instructors</Link>
              </Button>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<CourseLists />} />
          <Route path="/instructors" element={<InstructorDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
