
import { useState, useEffect } from "react";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Building, MapPin, Briefcase, CircleDashed, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock company data
const COMPANIES = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logo: "https://via.placeholder.com/80",
    description: "Leading provider of innovative tech solutions for businesses of all sizes.",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "1000-5000",
    rating: 4.7,
    openJobs: 12,
    website: "#"
  },
  {
    id: 2,
    name: "Global Finance Group",
    logo: "https://via.placeholder.com/80",
    description: "International financial services company specializing in investment management.",
    location: "New York, NY",
    industry: "Finance",
    size: "5000-10000",
    rating: 4.2,
    openJobs: 8,
    website: "#"
  },
  {
    id: 3,
    name: "HealthPlus Medical",
    logo: "https://via.placeholder.com/80",
    description: "Leading healthcare provider committed to exceptional patient care and innovation.",
    location: "Boston, MA",
    industry: "Healthcare",
    size: "500-1000",
    rating: 4.5,
    openJobs: 15,
    website: "#"
  },
  {
    id: 4,
    name: "Green Energy Solutions",
    logo: "https://via.placeholder.com/80",
    description: "Renewable energy company focused on sustainable solutions for a greener future.",
    location: "Portland, OR",
    industry: "Energy",
    size: "100-500",
    rating: 4.8,
    openJobs: 6,
    website: "#"
  },
  {
    id: 5,
    name: "EdTech Innovations",
    logo: "https://via.placeholder.com/80",
    description: "Educational technology company transforming how people learn and develop skills.",
    location: "Austin, TX",
    industry: "Education",
    size: "100-500",
    rating: 4.4,
    openJobs: 9,
    website: "#"
  },
  {
    id: 6,
    name: "Creative Design Studio",
    logo: "https://via.placeholder.com/80",
    description: "Full-service design agency specializing in brand identity and digital experiences.",
    location: "Los Angeles, CA",
    industry: "Design",
    size: "50-100",
    rating: 4.6,
    openJobs: 4,
    website: "#"
  },
];

const CompaniesPage = () => {
  const [companies, setCompanies] = useState(COMPANIES);
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle search and filter
  useEffect(() => {
    let results = companies;
    
    if (searchTerm) {
      results = results.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedIndustry) {
      results = results.filter(company => 
        company.industry === selectedIndustry
      );
    }
    
    setFilteredCompanies(results);
  }, [searchTerm, selectedIndustry, companies]);

  const industries = [...new Set(companies.map(company => company.industry))];

  // Company Card Component
  const CompanyCard = ({ company }: { company: typeof COMPANIES[0] }) => (
    <Card className="hover:shadow-md transition-shadow border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
              <Building className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <div className="flex-grow space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-medium">{company.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{company.rating}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground line-clamp-2">{company.description}</p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                <span>{company.industry}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{company.openJobs} open positions</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border p-4 bg-muted/30 flex justify-between items-center">
          <Link to={`/jobs?company=${company.id}`}>
            <Button variant="outline" size="sm" className="border-border">
              View Jobs
            </Button>
          </Link>
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm">
            <span>Visit website</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <div className="bg-secondary/30 py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold mb-2">Top Companies</h1>
          <p className="text-muted-foreground mb-6">
            Discover leading companies and explore their job opportunities
          </p>
          
          <div className="bg-card rounded-xl border border-border shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies by name, description or location..."
                    className="pl-9 bg-background border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <select
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CircleDashed className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border p-8">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any companies matching your search criteria.
            </p>
            <Button onClick={() => { setSearchTerm(""); setSelectedIndustry(""); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CompaniesPage;
