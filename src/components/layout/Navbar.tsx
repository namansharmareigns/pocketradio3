
import { Menu, X, User, Users, Bell } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import SignOutButton from "../auth/SignOutButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Chat", href: "/chat" },
    { name: "About", href: "/about" },
  ];
  
  const authenticatedItems = [
    { name: "Profile", href: "/profile", icon: <User size={16} /> },
    { name: "Connect", href: "/connect", icon: <Users size={16} /> },
    { name: "Notifications", href: "/notifications", icon: <Bell size={16} /> },
  ];

  const handleAuthClick = () => {
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gradient">
              Pocket Radio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:text-baby-blue transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              
              {user && authenticatedItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:text-baby-blue transition-colors duration-300 flex items-center gap-1"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <SignOutButton />
              ) : (
                <button 
                  onClick={handleAuthClick} 
                  className="px-4 py-2 rounded-full bg-baby-blue hover:bg-accent transition-colors duration-300"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              
              {user && authenticatedItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-300"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-2">
                  <SignOutButton />
                </div>
              ) : (
                <button 
                  onClick={handleAuthClick} 
                  className="w-full mt-4 px-4 py-2 rounded-full bg-baby-blue hover:bg-accent transition-colors duration-300"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
