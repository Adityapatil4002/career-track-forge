
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, Job, applyForJob, getCurrentUser } from "@/lib/api";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, DollarSign, Clock, ChevronLeft, Share2, BookmarkPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData);
      } catch (error) {
        console.error("Error loading job:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleApply = async () => {
    if (!job || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      await applyForJob(job.id, { coverLetter });
      setIsApplyDialogOpen(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title || "Job Posting",
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Job link copied to clipboard",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <div className="container mx-auto max-w-5xl px-4 py-12 flex-1">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
            <div className="h-64 bg-muted rounded mt-6"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <div className="container mx-auto max-w-5xl px-4 py-12 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <main className="container mx-auto max-w-5xl px-4 py-8 flex-1">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <span className="font-medium">{job.company}</span>
                    {job.featured && (
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm mt-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="capitalize">{job.jobType.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Posted {formattedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded overflow-hidden">
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 sm:hidden mt-4">
                <Button
                  className="flex-1 bg-job text-white hover:bg-job-hover"
                  onClick={() => {
                    if (!currentUser) {
                      navigate("/login");
                      return;
                    }
                    if (currentUser.role !== "job_seeker") {
                      toast({
                        title: "Employer Account",
                        description: "You cannot apply for jobs with an employer account.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setIsApplyDialogOpen(true);
                  }}
                >
                  Apply Now
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <Card className="mb-6">
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Apply for this position</h2>
                  <p className="text-sm text-muted-foreground">
                    Submit your application now for the {job.title} position at {job.company}.
                  </p>
                  <Button
                    className="w-full bg-job text-white hover:bg-job-hover"
                    onClick={() => {
                      if (!currentUser) {
                        navigate("/login");
                        return;
                      }
                      if (currentUser.role !== "job_seeker") {
                        toast({
                          title: "Employer Account",
                          description: "You cannot apply for jobs with an employer account.",
                          variant: "destructive",
                        });
                        return;
                      }
                      setIsApplyDialogOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">About {job.company}</h2>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden mr-3">
                      <img
                        src={job.companyLogo || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{job.company}</h3>
                      <p className="text-sm text-muted-foreground">Technology Company</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.company} is a leading company in the technology sector, focused on
                    innovation and growth.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application for the {job.title} position at {job.company}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="cover-letter" className="text-sm font-medium mb-2 block">
                Cover Letter (Optional)
              </label>
              <Textarea
                id="cover-letter"
                placeholder="Write a brief introduction about yourself and why you're a good fit for this role."
                className="min-h-[150px]"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Your profile and resume will be shared with the employer.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting}
              className="bg-job text-white hover:bg-job-hover"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetailPage;
