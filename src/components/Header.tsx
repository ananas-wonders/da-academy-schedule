
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
              Scheduler
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Schedule
              </Link>
              <Link to="/instructors" className="text-gray-600 hover:text-primary transition-colors">
                Instructors
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
                Courses
              </Link>
              <Link to="/tracks" className="text-gray-600 hover:text-primary transition-colors">
                Tracks
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3">
                  <Link to="/" className="px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Schedule
                  </Link>
                  <Link to="/instructors" className="px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Instructors
                  </Link>
                  <Link to="/courses" className="px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Courses
                  </Link>
                  <Link to="/tracks" className="px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Tracks
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            
            {auth?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm hidden md:inline">{auth.user.email}</span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => auth.signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
