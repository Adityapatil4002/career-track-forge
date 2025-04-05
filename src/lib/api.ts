
// Mock API functions for the Job Board application
// In a real application, these would connect to a backend server

import { toast } from "@/components/ui/use-toast";

// Types
export type UserRole = "employer" | "job_seeker";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  jobType: "full-time" | "part-time" | "contract" | "remote";
  employerId: string;
  postedAt: string;
  featured?: boolean;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  resumeUrl?: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
}

// Mock data
let users: User[] = [
  {
    id: "employer-1",
    email: "employer@example.com",
    name: "Tech Solutions Inc.",
    role: "employer",
    avatar: "/placeholder.svg",
  },
  {
    id: "job-seeker-1",
    email: "jobseeker@example.com",
    name: "Jane Smith",
    role: "job_seeker",
    avatar: "/placeholder.svg",
  },
];

let jobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    companyLogo: "/placeholder.svg",
    description:
      "We are looking for a skilled frontend developer with expertise in React to join our team. The ideal candidate should have a strong understanding of modern JavaScript and experience with responsive design.",
    requirements: [
      "5+ years of experience with JavaScript",
      "3+ years of experience with React",
      "Proficient in HTML, CSS, and responsive design",
      "Experience with state management (Redux, Context API)",
      "Knowledge of modern build tools (Webpack, Vite)",
    ],
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    jobType: "full-time",
    employerId: "employer-1",
    postedAt: "2025-03-15T10:00:00Z",
    featured: true,
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "Data Systems",
    companyLogo: "/placeholder.svg",
    description:
      "Join our backend team to develop scalable APIs and microservices. You'll work with cutting-edge technologies and help design database schemas for optimal performance.",
    requirements: [
      "3+ years experience with Node.js",
      "Familiar with Express.js or similar frameworks",
      "Database design experience (SQL and NoSQL)",
      "Understanding of RESTful API design principles",
      "Experience with cloud services (AWS, GCP, or Azure)",
    ],
    location: "New York, NY",
    salary: "$110,000 - $140,000",
    jobType: "full-time",
    employerId: "employer-1",
    postedAt: "2025-03-20T15:30:00Z",
    featured: true,
  },
  {
    id: "job-3",
    title: "UX/UI Designer",
    company: "Creative Digital",
    companyLogo: "/placeholder.svg",
    description:
      "We're seeking a talented UX/UI designer to create beautiful, intuitive interfaces for our web and mobile applications. The ideal candidate has a portfolio showing strong visual design skills and user-centered design thinking.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficient in Figma or similar design tools",
      "Experience with design systems",
      "Understanding of accessibility standards",
      "Ability to create wireframes, prototypes, and high-fidelity designs",
    ],
    location: "Remote",
    salary: "$90,000 - $120,000",
    jobType: "full-time",
    employerId: "employer-1",
    postedAt: "2025-03-25T09:45:00Z",
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "Cloud Services",
    companyLogo: "/placeholder.svg",
    description:
      "Looking for a DevOps engineer to help automate our infrastructure and deployment processes. You'll work on CI/CD pipelines, containerization, and cloud infrastructure.",
    requirements: [
      "3+ years of DevOps experience",
      "Experience with Docker and Kubernetes",
      "Knowledge of CI/CD tools (Jenkins, GitHub Actions)",
      "Familiar with infrastructure as code (Terraform, CloudFormation)",
      "Experience with one or more cloud providers",
    ],
    location: "Austin, TX (Hybrid)",
    salary: "$100,000 - $135,000",
    jobType: "full-time",
    employerId: "employer-1",
    postedAt: "2025-04-01T14:15:00Z",
  },
  {
    id: "job-5",
    title: "Part-time Web Developer",
    company: "Startup Ventures",
    companyLogo: "/placeholder.svg",
    description:
      "We need a skilled web developer to work on our company website and internal tools on a part-time basis. The ideal candidate should be proficient in modern web technologies.",
    requirements: [
      "2+ years of web development experience",
      "HTML, CSS, JavaScript proficiency",
      "Experience with at least one modern framework (React, Vue, etc.)",
      "Basic understanding of backend concepts",
      "Ability to work independently",
    ],
    location: "Remote",
    salary: "$40-60 per hour",
    jobType: "part-time",
    employerId: "employer-1",
    postedAt: "2025-04-02T11:30:00Z",
  },
];

let applications: Application[] = [
  {
    id: "app-1",
    userId: "job-seeker-1",
    jobId: "job-1",
    resumeUrl: "/placeholder.svg",
    coverLetter: "I am excited to apply for this position...",
    status: "pending",
    appliedAt: "2025-04-03T09:00:00Z",
  },
  {
    id: "app-2",
    userId: "job-seeker-1",
    jobId: "job-3",
    resumeUrl: "/placeholder.svg",
    coverLetter: "I believe my skills align well with...",
    status: "reviewed",
    appliedAt: "2025-04-01T10:15:00Z",
  },
];

// API functions

// Auth
export const login = async (email: string, password: string): Promise<User | null> => {
  // In a real app, this would validate against a backend
  const user = users.find((u) => u.email === email);
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (user) {
    // In a real app, we'd store JWT or session token
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const register = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<User | null> => {
  // In a real app, this would create a new user in the backend
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newUser: User = {
    id: `user-${users.length + 1}`,
    email,
    name,
    role,
    avatar: "/placeholder.svg",
  };
  
  users.push(newUser);
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

export const logout = async (): Promise<void> => {
  // In a real app, this would invalidate tokens
  localStorage.removeItem('currentUser');
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Jobs
export const getJobs = async (filters?: {
  search?: string;
  location?: string;
  jobType?: string;
}): Promise<Job[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filteredJobs = [...jobs];
  
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(locationLower)
      );
    }
    
    if (filters.jobType) {
      filteredJobs = filteredJobs.filter((job) => job.jobType === filters.jobType);
    }
  }
  
  return filteredJobs;
};

export const getJobById = async (id: string): Promise<Job | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const job = jobs.find((j) => j.id === id);
  return job || null;
};

export const createJob = async (jobData: Omit<Job, "id" | "postedAt" | "employerId">): Promise<Job> => {
  // In a real app, this would create a job in the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can create jobs");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newJob: Job = {
    ...jobData,
    id: `job-${jobs.length + 1}`,
    employerId: currentUser.id,
    postedAt: new Date().toISOString(),
  };
  
  jobs = [newJob, ...jobs];
  
  return newJob;
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job | null> => {
  // In a real app, this would update a job in the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can update jobs");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const jobIndex = jobs.findIndex((j) => j.id === id);
  
  if (jobIndex === -1) {
    return null;
  }
  
  const job = jobs[jobIndex];
  
  if (job.employerId !== currentUser.id) {
    throw new Error("You can only update your own jobs");
  }
  
  const updatedJob = { ...job, ...jobData };
  jobs[jobIndex] = updatedJob;
  
  return updatedJob;
};

export const deleteJob = async (id: string): Promise<boolean> => {
  // In a real app, this would delete a job from the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can delete jobs");
  }
  
  const jobIndex = jobs.findIndex((j) => j.id === id);
  
  if (jobIndex === -1) {
    return false;
  }
  
  const job = jobs[jobIndex];
  
  if (job.employerId !== currentUser.id) {
    throw new Error("You can only delete your own jobs");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  jobs = jobs.filter((j) => j.id !== id);
  
  return true;
};

// Applications
export const applyForJob = async (
  jobId: string,
  applicationData: { resumeUrl?: string; coverLetter?: string }
): Promise<Application> => {
  // In a real app, this would create an application in the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "job_seeker") {
    throw new Error("Only job seekers can apply for jobs");
  }
  
  // Check if job exists
  const job = await getJobById(jobId);
  
  if (!job) {
    throw new Error("Job not found");
  }
  
  // Check if already applied
  const existingApplication = applications.find(
    (a) => a.jobId === jobId && a.userId === currentUser.id
  );
  
  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newApplication: Application = {
    id: `app-${applications.length + 1}`,
    userId: currentUser.id,
    jobId,
    ...applicationData,
    status: "pending",
    appliedAt: new Date().toISOString(),
  };
  
  applications = [...applications, newApplication];
  
  toast({
    title: "Application Submitted",
    description: "Your application has been successfully submitted.",
  });
  
  return newApplication;
};

export const getUserApplications = async (): Promise<Application[]> => {
  // In a real app, this would fetch applications from the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  let userApplications = applications.filter((a) => a.userId === currentUser.id);
  
  // Attach job data to each application
  for (let app of userApplications) {
    const job = jobs.find((j) => j.id === app.jobId);
    if (job) {
      app.job = job;
    }
  }
  
  return userApplications;
};

export const getJobApplications = async (jobId: string): Promise<Application[]> => {
  // In a real app, this would fetch applications for a job from the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can view job applications");
  }
  
  const job = jobs.find((j) => j.id === jobId);
  
  if (!job || job.employerId !== currentUser.id) {
    throw new Error("You can only view applications for your own jobs");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  return applications.filter((a) => a.jobId === jobId);
};

export const updateApplicationStatus = async (
  applicationId: string,
  newStatus: "pending" | "reviewed" | "accepted" | "rejected"
): Promise<Application | null> => {
  // In a real app, this would update an application status in the backend
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can update application statuses");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const applicationIndex = applications.findIndex((a) => a.id === applicationId);
  
  if (applicationIndex === -1) {
    return null;
  }
  
  const application = applications[applicationIndex];
  const job = jobs.find((j) => j.id === application.jobId);
  
  if (!job || job.employerId !== currentUser.id) {
    throw new Error("You can only update applications for your own jobs");
  }
  
  const updatedApplication = { ...application, status: newStatus };
  applications[applicationIndex] = updatedApplication;
  
  return updatedApplication;
};

// Employee functions
export const getEmployerJobs = async (): Promise<Job[]> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can access their posted jobs");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return jobs.filter((job) => job.employerId === currentUser.id);
};

// Analytics
export const getEmployerAnalytics = async (): Promise<{
  totalJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
}> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "employer") {
    throw new Error("Only employers can access analytics");
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  
  const employerJobs = jobs.filter((job) => job.employerId === currentUser.id);
  const jobIds = employerJobs.map((job) => job.id);
  const jobApplications = applications.filter((app) => jobIds.includes(app.jobId));
  
  const applicationsByStatus: Record<string, number> = {
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };
  
  jobApplications.forEach((app) => {
    applicationsByStatus[app.status]++;
  });
  
  return {
    totalJobs: employerJobs.length,
    totalApplications: jobApplications.length,
    applicationsByStatus,
  };
};
