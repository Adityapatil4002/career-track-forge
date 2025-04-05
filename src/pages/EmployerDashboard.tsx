
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  getCurrentUser,
  getEmployerJobs,
  getEmployerAnalytics,
  Job,
  deleteJob,
} from "@/lib/api";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArchiveX,
  CircleDashed,
  Edit,
  Info,
  Plus,
  Trash2,
  User,
  Users,
  CircleCheck,
  CircleX,
} from "lucide-react";

const statusColors = {
  pending: "#f59e0b",
  reviewed: "#3b82f6",
  accepted: "#10b981",
  rejected: "#ef4444",
};

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    totalApplications: 0,
    applicationsByStatus: {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
    },
  });
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [employerJobs, employerAnalytics] = await Promise.all([
          getEmployerJobs(),
          getEmployerAnalytics(),
        ]);
        setJobs(employerJobs);
        setAnalytics(employerAnalytics);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.role === "employer") {
      loadDashboard();
    }
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    try {
      const success = await deleteJob(jobId);
      if (success) {
        setJobs(jobs.filter((job) => job.id !== jobId));
        toast({
          title: "Job Deleted",
          description: "The job posting has been successfully deleted.",
        });
      }
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete the job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshJobs = async () => {
    try {
      setIsLoading(true);
      const employerJobs = await getEmployerJobs();
      setJobs(employerJobs);
    } catch (error) {
      console.error("Error refreshing jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login?redirectTo=/employer/dashboard" replace />;
  }

  if (currentUser.role !== "employer") {
    return <Navigate to="/" replace />;
  }

  const statusData = Object.entries(analytics.applicationsByStatus).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <div className="flex-1">
        <div className="bg-secondary/30 py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your job listings and applicants
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Tabs 
              defaultValue="overview" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="jobs">Job Listings</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>
                
                <CreateJobDialog onJobCreated={refreshJobs} />
              </div>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tabs className="h-5 w-5 text-primary" />
                        Active Job Listings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.totalJobs}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Total Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.totalApplications}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CircleCheck className="h-5 w-5 text-green-500" />
                        Accepted Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {analytics.applicationsByStatus.accepted}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle className="text-xl">Application Status</CardTitle>
                      <CardDescription>
                        Distribution of applications by status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                          <CircleDashed className="animate-spin h-6 w-6 text-primary" />
                        </div>
                      ) : analytics.totalApplications === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <Info className="h-8 w-8 mb-2 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-1">No application data</h3>
                          <p className="text-muted-foreground text-sm max-w-xs">
                            You haven't received any applications yet. Post more jobs to attract candidates.
                          </p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {statusData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={statusColors[entry.name.toLowerCase() as keyof typeof statusColors]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle className="text-xl">Recent Jobs</CardTitle>
                      <CardDescription>
                        Your most recently posted job listings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                          <CircleDashed className="animate-spin h-6 w-6 text-primary" />
                        </div>
                      ) : jobs.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                          <ArchiveX className="h-8 w-8 mb-2 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-1">No jobs posted</h3>
                          <p className="text-muted-foreground text-sm max-w-xs mb-4">
                            You haven't posted any jobs yet. Create your first job listing.
                          </p>
                          <CreateJobDialog onJobCreated={refreshJobs} />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {jobs.slice(0, 3).map((job) => (
                            <div
                              key={job.id}
                              className="flex justify-between items-center p-3 bg-muted/40 rounded-md"
                            >
                              <div>
                                <h4 className="font-medium">{job.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                                </p>
                              </div>
                              <Link to="#applications">
                                <Button size="sm" variant="outline">
                                  <User className="h-4 w-4 mr-1" />
                                  Applicants
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("jobs")}
                      >
                        View All Job Listings
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Job Listings</CardTitle>
                    <CardDescription>
                      Manage your posted job listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <CircleDashed className="animate-spin h-6 w-6 text-primary" />
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center">
                        <ArchiveX className="h-8 w-8 mb-2 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-1">No jobs posted</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mb-4">
                          You haven't posted any jobs yet. Create your first job listing.
                        </p>
                        <CreateJobDialog onJobCreated={refreshJobs} />
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Posted</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {jobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.title}</TableCell>
                                <TableCell>{job.location}</TableCell>
                                <TableCell>
                                  <div className="capitalize">{job.jobType.replace("-", " ")}</div>
                                </TableCell>
                                <TableCell>
                                  {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setActiveTab("applications")}
                                    >
                                      <User className="h-3.5 w-3.5 mr-1" />
                                      Applicants
                                    </Button>
                                    <Link to={`/jobs/${job.id}`} target="_blank">
                                      <Button size="sm" variant="outline">
                                        <Info className="h-3.5 w-3.5" />
                                      </Button>
                                    </Link>
                                    <EditJobDialog job={job} onJobUpdated={refreshJobs} />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="text-destructive">
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this job listing? This action
                                            cannot be undone and will remove all associated applications.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => handleDeleteJob(job.id)}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Job Applications</CardTitle>
                    <CardDescription>
                      Review and manage applications for your job listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <h3 className="text-xl font-medium mb-2">Applications Management</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Select a job posting from the "Job Listings" tab to view and manage its applications.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("jobs")}>
                        Go to Job Listings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

interface CreateJobDialogProps {
  onJobCreated: () => Promise<void>;
}

const CreateJobDialog = ({ onJobCreated }: CreateJobDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: ["", "", ""],
    location: "",
    salary: "",
    jobType: "full-time" as "full-time" | "part-time" | "contract" | "remote",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      // In a real app, this would be an API call
      const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "");
      
      await import("@/lib/api").then(({ createJob }) => {
        return createJob({
          ...formData,
          company: currentUser.name,
          companyLogo: currentUser.avatar,
          requirements: filteredRequirements.length ? filteredRequirements : ["No specific requirements"],
        });
      });
      
      toast({
        title: "Job Created",
        description: "Your job has been posted successfully.",
      });
      
      setIsOpen(false);
      setFormData({
        title: "",
        company: "",
        description: "",
        requirements: ["", "", ""],
        location: "",
        salary: "",
        jobType: "full-time",
      });
      
      await onJobCreated();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job listing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Senior Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., San Francisco, CA (Remote)"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g., $80,000 - $100,000"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  jobType: value as "full-time" | "part-time" | "contract" | "remote",
                }))
              }
              required
            >
              <SelectTrigger id="jobType">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, and ideal candidate..."
              className="min-h-[120px]"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Requirements</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addRequirement}
              >
                Add Requirement
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Requirement ${index + 1}`}
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditJobDialogProps {
  job: Job;
  onJobUpdated: () => Promise<void>;
}

const EditJobDialog = ({ job, onJobUpdated }: EditJobDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    requirements: [...job.requirements],
    location: job.location,
    salary: job.salary,
    jobType: job.jobType,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "");
      
      await import("@/lib/api").then(({ updateJob }) => {
        return updateJob(job.id, {
          ...formData,
          requirements: filteredRequirements.length ? filteredRequirements : ["No specific requirements"],
        });
      });
      
      toast({
        title: "Job Updated",
        description: "Your job listing has been updated successfully.",
      });
      
      setIsOpen(false);
      await onJobUpdated();
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Job Listing</DialogTitle>
          <DialogDescription>
            Update the details of your job listing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  jobType: value as "full-time" | "part-time" | "contract" | "remote",
                }))
              }
              required
            >
              <SelectTrigger id="jobType">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-[120px]"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Requirements</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addRequirement}
              >
                Add Requirement
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerDashboard;
