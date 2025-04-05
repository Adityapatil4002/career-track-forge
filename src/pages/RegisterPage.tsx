
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { register, UserRole } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { BriefcaseBusiness, Briefcase, User } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = formData;
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const user = await register(email, password, name, role);
      
      if (user) {
        toast({
          title: "Registration Successful",
          description: `Your account has been created successfully. Welcome, ${user.name}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Registration Failed",
          description: "Failed to create an account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-secondary/10 to-background">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <BriefcaseBusiness className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Join JobTrack to find your dream job or perfect candidate</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Create your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="job_seeker" className="mb-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger
                    value="job_seeker"
                    onClick={() => setRole("job_seeker")}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Job Seeker</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="employer"
                    onClick={() => setRole("employer")}
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Employer</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="job_seeker">
                  <div className="text-sm text-muted-foreground mb-6">
                    Create an account to search for jobs, submit applications, and track your job applications in one place.
                  </div>
                </TabsContent>
                <TabsContent value="employer">
                  <div className="text-sm text-muted-foreground mb-6">
                    Create an account to post job openings, review applications, and find the perfect candidates for your company.
                  </div>
                </TabsContent>
              </Tabs>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {role === "employer" ? "Company Name" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={role === "employer" ? "Acme Inc." : "John Doe"}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/90 transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
