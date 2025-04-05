
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <BriefcaseBusiness size={24} />
              <span>JobTrack</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Finding your dream job or ideal candidate has never been easier.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Job Search
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/employer/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Applications Management
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Hiring Solutions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
