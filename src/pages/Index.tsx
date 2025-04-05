
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getJobs, Job } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import JobCard from "@/components/JobCard";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import JobFilters from "@/components/JobFilters";
import { BriefcaseBusiness, Briefcase, MapPin, ArrowRight, CircleDashed, Building, BadgeCheck, ChevronRight } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Index = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", location: "", jobType: "" });
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    hiringRate: 0
  });

  // Memoize the loadJobs function to prevent unnecessary re-renders
  const loadJobs = useCallback(async (filterParams?: { search: string; location: string; jobType: string }) => {
    try {
      setIsLoading(true);
      const jobs = await getJobs(filterParams);
      setFeaturedJobs(jobs.filter(job => job.featured).slice(0, 4));
      
      // Set mock stats
      setStats({
        totalJobs: jobs.length,
        totalCompanies: Math.floor(jobs.length / 2),
        hiringRate: 85
      });
      
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error loading jobs",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleFilter = async (newFilters: { search: string; location: string; jobType: string }) => {
    setFilters(newFilters);
    await loadJobs(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-5 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-slide-in">
                Find Your Dream Job & Build Your Career
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
                Search thousands of jobs, track your applications, and connect with employers all in one place.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
                <Link to="/jobs">
                  <Button size="lg" className="bg-job text-white hover:bg-job-hover w-full sm:w-auto">
                    Find Jobs
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-border">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end animate-fade-in opacity-0" style={{ animationDelay: "0.6s" }}>
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full flex items-center justify-center">
                  <BriefcaseBusiness className="text-primary w-32 h-32 md:w-40 md:h-40" />
                </div>
                <div className="absolute -top-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-primary" size={20} />
                    <span className="font-medium">10,000+ Jobs</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-primary" size={20} />
                    <span className="font-medium">Remote & On-site</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-10 px-4 container mx-auto max-w-6xl">
        <div className="-mt-20 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: "0.8s" }}>
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Find Your Next Opportunity</h2>
            <JobFilters onFilter={handleFilter} initialFilters={filters} />
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 px-4 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-job/20 rounded-full flex items-center justify-center mb-3">
                <Briefcase className="text-job h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalJobs}+</h3>
              <p className="text-muted-foreground">Active Jobs</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                <Building className="text-primary h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalCompanies}+</h3>
              <p className="text-muted-foreground">Companies</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <BadgeCheck className="text-green-500 h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.hiringRate}%</h3>
              <p className="text-muted-foreground">Hiring Success</p>
            </div>
          </div>
        </div>
      
        {/* Featured Jobs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Jobs</h2>
            <Link to="/jobs" className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <span>View all jobs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-card animate-pulse rounded-lg border border-border"></div>
              ))}
            </div>
          ) : (
            <>
              {featuredJobs.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border p-8">
                  <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
                  <Link to="/jobs">
                    <Button variant="outline" className="border-border">Browse All Jobs</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {featuredJobs.map((job) => (
                    <JobCard key={job.id} job={job} featured />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-4">How JobTrack Works</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10">A simple yet powerful platform for job seekers and employers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-2xl">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Create an Account</h3>
              <p className="text-muted-foreground">Sign up for free as a job seeker or employer and complete your profile.</p>
              <Link to="/register" className="mt-4 inline-flex items-center text-primary hover:underline">
                Get started <ChevronRight size={16} className="ml-1"/>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-2xl">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Search or Post Jobs</h3>
              <p className="text-muted-foreground">Browse thousands of job listings or post your job openings easily.</p>
              <Link to="/jobs" className="mt-4 inline-flex items-center text-primary hover:underline">
                Find jobs <ChevronRight size={16} className="ml-1"/>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-2xl">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Track Applications</h3>
              <p className="text-muted-foreground">Keep track of your application status or manage candidates efficiently.</p>
              <Link to="/seeker/dashboard" className="mt-4 inline-flex items-center text-primary hover:underline">
                Start tracking <ChevronRight size={16} className="ml-1"/>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-job/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of job seekers who have found their dream jobs through our platform.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-job text-white hover:bg-job-hover w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
