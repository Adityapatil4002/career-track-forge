
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/api";
import { useState, useEffect } from "react";
import { BriefcaseBusiness, LogOut, Menu, Search, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update user state if authentication changes
    setCurrentUser(getCurrentUser());
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate("/");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BriefcaseBusiness size={24} />
            <span>JobTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/jobs" className="text-foreground hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            {currentUser?.role === "employer" && (
              <Link to="/employer/dashboard" className="text-foreground hover:text-primary transition-colors">
                Employer Dashboard
              </Link>
            )}
            {currentUser?.role === "job_seeker" && (
              <Link to="/seeker/dashboard" className="text-foreground hover:text-primary transition-colors">
                My Applications
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/search" className="hidden md:flex">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {!currentUser ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
          <div className="flex items-center justify-between p-4 border-b">
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
          <div className="mt-auto p-4 border-t">
            {!currentUser ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-2">
                  <User className="h-5 w-5" />
                  <span>{currentUser.name}</span>
                </div>
                <Button variant="outline" onClick={() => { handleLogout(); closeMenu(); }}>
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
