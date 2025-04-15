
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Calendar, Users, BookOpen, BookText, PanelLeft, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out."
      });
    }
  };

  const navItems = [
    { path: '/', label: 'Schedule', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { path: '/instructors', label: 'Instructors', icon: <Users className="mr-2 h-4 w-4" /> },
    { path: '/courses', label: 'Courses', icon: <BookOpen className="mr-2 h-4 w-4" /> },
    { path: '/tracks', label: 'Tracks', icon: <BookText className="mr-2 h-4 w-4" /> },
    { path: '/admin', label: 'Admin', icon: <PanelLeft className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Calendar className="mr-2 h-6 w-6" />
              <span>Scholastic</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex md:space-x-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={pathname === item.path ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 py-3 sm:px-3">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-700 hover:text-white dark:text-gray-300'
                }`}
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
            <button 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-700 hover:text-white dark:text-gray-300"
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
            >
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
