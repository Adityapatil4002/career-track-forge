
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/api";
import { useState, useEffect } from "react";
import { BriefcaseBusiness, LogOut, Menu, Search, User, X, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";
import { toast } from "@/components/ui/use-toast";

const MainNav = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update user state if authentication changes
    setCurrentUser(getCurrentUser());
    
    // Set random notification count for demo
    if (getCurrentUser()) {
      setNotifications(Math.floor(Math.random() * 5));
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    toast({
      title: "Successfully logged out",
      description: "Come back soon!",
    });
    navigate("/");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background backdrop-blur-sm bg-opacity-80 border-b border-border">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BriefcaseBusiness size={24} />
            <span>JobTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={cn(
              "text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
              location.pathname === "/" && "text-primary after:scale-x-100"
            )}>
              Home
            </Link>
            <Link to="/jobs" className={cn(
              "text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
              location.pathname === "/jobs" && "text-primary after:scale-x-100"
            )}>
              Browse Jobs
            </Link>
            <Link to="/companies" className={cn(
              "text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
              location.pathname === "/companies" && "text-primary after:scale-x-100"
            )}>
              Companies
            </Link>
            {currentUser?.role === "employer" && (
              <Link to="/employer/dashboard" className={cn(
                "text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                location.pathname === "/employer/dashboard" && "text-primary after:scale-x-100"
              )}>
                Employer Dashboard
              </Link>
            )}
            {currentUser?.role === "job_seeker" && (
              <Link to="/seeker/dashboard" className={cn(
                "text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                location.pathname === "/seeker/dashboard" && "text-primary after:scale-x-100"
              )}>
                My Applications
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          <Link to="/search" className="hidden md:flex">
            <Button variant="outline" size="icon" className="border-border">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {currentUser && (
            <Button variant="ghost" size="icon" className="relative hidden md:flex">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-job text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </Button>
          )}

          {!currentUser ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="border-border">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-job hover:bg-job-hover">Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-border">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background md:hidden transform transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={closeMenu}>
              <BriefcaseBusiness size={24} />
              <span>JobTrack</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col p-4 gap-4">
            <Link to="/" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/jobs" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
              Browse Jobs
            </Link>
            <Link to="/companies" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
              Companies
            </Link>
            <Link to="/search" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
              Search
            </Link>
            {currentUser?.role === "employer" && (
              <Link to="/employer/dashboard" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
                Employer Dashboard
              </Link>
            )}
            {currentUser?.role === "job_seeker" && (
              <Link to="/seeker/dashboard" className="py-2 text-foreground hover:text-primary" onClick={closeMenu}>
                My Applications
              </Link>
            )}
          </nav>
          <div className="mt-auto p-4 border-t border-border">
            {!currentUser ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full border-border">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full bg-job hover:bg-job-hover">Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-2">
                  <User className="h-5 w-5" />
                  <span>{currentUser.name}</span>
                  {notifications > 0 && (
                    <div className="ml-auto bg-job text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {notifications}
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => { handleLogout(); closeMenu(); }} className="border-border">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
