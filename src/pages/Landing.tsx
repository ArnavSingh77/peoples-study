import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
          <h1 className="text-6xl font-bold text-primary mb-6">The Peoples</h1>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
            Join the community of learners. Track your study sessions, collaborate with friends,
            and achieve your goals together.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;