
import { useState, useEffect } from "react";
import { getJobs, Job } from "@/lib/api";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const jobsPerPage = 6;

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

  const handleFilter = async (filters: { search: string; location: string; jobType: string }) => {
    try {
      setIsLoading(true);
      const filteredJobs = await getJobs({
        search: filters.search,
        location: filters.location,
        jobType: filters.jobType,
      });
      setFilteredJobs(filteredJobs);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      {/* Page header */}
      <div className="bg-secondary/30 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold mb-2">Browse All Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity from our extensive job listings</p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-6xl px-4 py-8 flex-1">
        {/* Filters */}
        <JobFilters onFilter={handleFilter} />
        
        {/* Results count and view toggles */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{Math.min(filteredJobs.length, indexOfFirstJob + 1)}-{Math.min(indexOfLastJob, filteredJobs.length)}</span> of <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(isGridView && "bg-muted")}
              onClick={() => setIsGridView(true)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(!isGridView && "bg-muted")}
              onClick={() => setIsGridView(false)}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Jobs list */}
        {isLoading ? (
          <div className={`grid ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-card animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                <Button onClick={() => handleFilter({ search: "", location: "", jobType: "" })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {currentJobs.map((job) => (
                  <JobCard key={job.id} job={job} featured={job.featured} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current page
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                      
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsisBefore && (
                            <span className="px-3 py-2 text-muted-foreground">...</span>
                          )}
                          
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => paginate(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                          
                          {showEllipsisAfter && (
                            <span className="px-3 py-2 text-muted-foreground">...</span>
                          )}
                        </div>
                      );
                    })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default JobsPage;
