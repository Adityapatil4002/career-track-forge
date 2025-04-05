
import { Job } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

const JobCard = ({ job, featured }: JobCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <Card className={cn("card-hover", featured && "border-primary/50")}>
      {featured && (
        <div className="absolute -top-3 left-4">
          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1 text-foreground">{job.title}</CardTitle>
            <CardDescription className="font-medium text-muted-foreground">
              {job.company}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
            <img
              src={job.companyLogo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
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
            <span>{formattedDate}</span>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Link to={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
