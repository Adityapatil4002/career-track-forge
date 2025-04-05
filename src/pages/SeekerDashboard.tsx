
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { getCurrentUser, getUserApplications, Application } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleDashed, Eye, Info, Upload } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  reviewed: { label: "Reviewed", color: "bg-blue-500" },
  accepted: { label: "Accepted", color: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
};

const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
  const { label, color } = statusConfig[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
};

const SeekerDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const userApplications = await getUserApplications();
        setApplications(userApplications);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.role === "job_seeker") {
      loadApplications();
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/login?redirectTo=/seeker/dashboard" replace />;
  }

  if (currentUser.role !== "job_seeker") {
    return <Navigate to="/" replace />;
  }

  // Group applications by status
  const applicationsByStatus = applications.reduce(
    (acc, app) => {
      if (!acc[app.status]) {
        acc[app.status] = [];
      }
      acc[app.status].push(app);
      return acc;
    },
    {} as Record<string, Application[]>
  );

  // Calculate counts
  const counts = {
    all: applications.length,
    pending: applicationsByStatus.pending?.length || 0,
    reviewed: applicationsByStatus.reviewed?.length || 0,
    accepted: applicationsByStatus.accepted?.length || 0,
    rejected: applicationsByStatus.rejected?.length || 0,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <div className="flex-1">
        <div className="bg-secondary/30 py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">
              Track and manage your job applications
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{counts.all}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-yellow-500">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{counts.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-500">Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{counts.reviewed}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-500">Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{counts.accepted}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Profile Overview</CardTitle>
              <CardDescription>
                Complete your profile to increase your chances of getting hired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Upload your resume</h3>
                    <p className="text-sm text-muted-foreground">
                      Add your resume to apply faster and get noticed by employers
                    </p>
                  </div>
                </div>
                <Button className="whitespace-nowrap">Upload Resume</Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Applications ({counts.all})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="reviewed">Under Review ({counts.reviewed})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({counts.accepted})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
              </TabsList>
            </div>
            
            <Card>
              <TabsContent value="all" className="mt-0">
                <ApplicationTable applications={applications} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <ApplicationTable
                  applications={applicationsByStatus.pending || []}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="reviewed" className="mt-0">
                <ApplicationTable
                  applications={applicationsByStatus.reviewed || []}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-0">
                <ApplicationTable
                  applications={applicationsByStatus.accepted || []}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-0">
                <ApplicationTable
                  applications={applicationsByStatus.rejected || []}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

interface ApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
}

const ApplicationTable = ({ applications, isLoading }: ApplicationTableProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <CircleDashed className="animate-spin h-6 w-6 mx-auto mb-2 text-primary" />
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No applications found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't applied to any jobs in this category yet.
        </p>
        <Link to="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-44">Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {application.job?.title || "Unknown Job"}
              </TableCell>
              <TableCell>{application.job?.company || "Unknown Company"}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <StatusBadge status={application.status as keyof typeof statusConfig} />
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/jobs/${application.jobId}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SeekerDashboard;
