
import { useState, useEffect } from "react";
import { getJobs, Job } from "@/lib/api";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, CircleDashed, MapPin, Search } from "lucide-react";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await getJobs();
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const filteredJobs = await getJobs({
        search,
        location,
        jobType,
      });
      setFilteredJobs(filteredJobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setFilteredJobs(jobs);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <div className="bg-secondary/30 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Find Your Dream Job</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Search thousands of jobs from top companies and find the perfect match for your skills and experience.
          </p>
          
          <div className="bg-card rounded-xl border border-border shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, company, or keywords"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-9"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Job Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-1">
                <Button
                  className="w-full bg-job text-white hover:bg-job-hover"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="link" className="h-auto p-0" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {search || location || jobType
              ? "Search Results"
              : "Browse All Jobs"}
          </h2>
          <p className="text-muted-foreground">
            Found {filteredJobs.length} jobs
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CircleDashed className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any jobs matching your search criteria. Try adjusting your
              filters or search for something else.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured={job.featured} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
