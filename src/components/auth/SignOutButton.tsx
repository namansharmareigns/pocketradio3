
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error("An error occurred during sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
