
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";
import { notify } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  type: "emergency" | "fun" | "reminder";
  title: string;
  message: string;
  onDismiss?: () => void;
}

const NotificationToast = ({
  type,
  title,
  message,
  onDismiss
}: NotificationToastProps) => {
  useEffect(() => {
    notify(type, message);
  }, [type, message]);

  const getTypeStyles = () => {
    switch (type) {
      case "emergency":
        return "border-red-500 bg-red-500/10";
      case "fun":
        return "border-yellow-500 bg-yellow-500/10";
      case "reminder":
        return "border-baby-blue bg-baby-blue/10";
      default:
        return "";
    }
  };

  return (
    <Alert 
      className={cn(
        "animate-fade-in glass", 
        getTypeStyles()
      )}
    >
      <AlertTitle className="text-gradient">{title}</AlertTitle>
      <AlertDescription className="text-white/80">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default NotificationToast;
