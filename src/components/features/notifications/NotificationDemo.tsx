
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationToast from "./NotificationToast";
import NotificationControls from "./NotificationControls";
import { AudioConfig } from "@/lib/audio";
import { useToast } from "@/hooks/use-toast";

const NotificationDemo = () => {
  const [audioConfig, setAudioConfig] = useState<Partial<AudioConfig>>({
    volume: 0.8,
    voiceType: "en-US",
  });
  
  const { toast } = useToast();

  const handleConfigChange = (newConfig: Partial<AudioConfig>) => {
    setAudioConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const showNotification = (type: "emergency" | "fun" | "reminder") => {
    const messages = {
      emergency: {
        title: "Emergency Alert",
        message: "This is an urgent notification that requires immediate attention!",
      },
      fun: {
        title: "Fun Update",
        message: "Hey! Something exciting just happened in your network!",
      },
      reminder: {
        title: "Friendly Reminder",
        message: "Don't forget about your scheduled task today.",
      },
    };

    const { title, message } = messages[type];

    toast({
      title,
      description: (
        <NotificationToast
          type={type}
          title={title}
          message={message}
        />
      ),
    });
  };

  return (
    <div className="space-y-8">
      <NotificationControls onConfigChange={handleConfigChange} />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Button
          variant="outline"
          className="border-red-500 hover:bg-red-500/20"
          onClick={() => showNotification("emergency")}
        >
          Try Emergency Alert
        </Button>
        
        <Button
          variant="outline"
          className="border-yellow-500 hover:bg-yellow-500/20"
          onClick={() => showNotification("fun")}
        >
          Try Fun Alert
        </Button>
        
        <Button
          variant="outline"
          className="border-baby-blue hover:bg-baby-blue/20"
          onClick={() => showNotification("reminder")}
        >
          Try Reminder
        </Button>
      </div>
    </div>
  );
};

export default NotificationDemo;
