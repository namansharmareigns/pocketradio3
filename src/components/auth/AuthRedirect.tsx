
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface AuthRedirectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthRedirect = ({
  children,
  requireAuth = false,
  redirectTo = "/auth",
}: AuthRedirectProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        navigate(redirectTo);
      } else if (!requireAuth && user) {
        navigate("/");
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baby-blue"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRedirect;
