import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MealBuddy</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors ${isActive('/explore') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Explore
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/matches" 
              className={`text-sm font-medium transition-colors ${isActive('/matches') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              My Matches
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="gradient-warm text-primary-foreground">
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                to="/explore" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Explore
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/matches" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                My Matches
              </Link>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gradient-warm text-primary-foreground">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
