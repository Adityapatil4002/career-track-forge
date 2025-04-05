
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Briefcase, Search as SearchIcon, X, Filter } from "lucide-react";

interface JobFiltersProps {
  onFilter: (filters: { search: string; location: string; jobType: string }) => void;
  initialFilters?: { search: string; location: string; jobType: string };
}

const JobFilters = ({ onFilter, initialFilters = { search: "", location: "", jobType: "" } }: JobFiltersProps) => {
  const [search, setSearch] = useState(initialFilters.search);
  const [location, setLocation] = useState(initialFilters.location);
  const [jobType, setJobType] = useState(initialFilters.jobType);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Preserve filters on component mount
    if (initialFilters.search || initialFilters.location || initialFilters.jobType) {
      setSearch(initialFilters.search);
      setLocation(initialFilters.location);
      setJobType(initialFilters.jobType);
    }
  }, [initialFilters]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter({ search, location, jobType });
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    onFilter({ search: "", location: "", jobType: "" });
  };

  return (
    <Card className="mb-6 border-border shadow-lg transition-all duration-300 hover:shadow-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="font-medium">Search Filters</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={16} />
            <span>{isExpanded ? "Hide Filters" : "Show Filters"}</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Job title, company, or keywords"
                  className="pl-9 bg-background border-border focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:col-span-3">
              <Label htmlFor="location" className="sr-only">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Location"
                  className="pl-9 bg-background border-border focus-visible:ring-primary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="jobType" className="sr-only">
                Job Type
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="pl-9 w-full bg-background border-border focus:ring-primary" id="jobType">
                    <SelectValue placeholder="Job Type" />
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
            </div>
            
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="flex-1 bg-job hover:bg-job-hover">
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={clearFilters} 
                title="Clear filters"
                className="border-border hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
