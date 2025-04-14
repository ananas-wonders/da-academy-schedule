
import { Link } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Calendar, BarChart2, Users, BookOpen, Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-[1600px] mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-700 flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          <span>Digital Arts Academy Schedule</span>
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(navigationMenuTriggerStyle(), "flex items-center")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule</span>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/instructors" className={cn(navigationMenuTriggerStyle(), "flex items-center")}>
                <Users className="mr-2 h-4 w-4" />
                <span>Instructors</span>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/courses" className={cn(navigationMenuTriggerStyle(), "flex items-center")}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Courses</span>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/tracks" className={cn(navigationMenuTriggerStyle(), "flex items-center")}>
                <Layers className="mr-2 h-4 w-4" />
                <span>Tracks</span>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/admin" className={cn(navigationMenuTriggerStyle(), "flex items-center")}>
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/" className="flex items-center p-2 hover:bg-slate-100 rounded">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Schedule</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/instructors" className="flex items-center p-2 hover:bg-slate-100 rounded">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Instructors</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/courses" className="flex items-center p-2 hover:bg-slate-100 rounded">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Courses</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/tracks" className="flex items-center p-2 hover:bg-slate-100 rounded">
                          <Layers className="mr-2 h-4 w-4" />
                          <span>Tracks</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/admin" className="flex items-center p-2 hover:bg-slate-100 rounded">
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
