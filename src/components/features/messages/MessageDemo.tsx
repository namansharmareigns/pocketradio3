
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import NotificationToast from "../notifications/NotificationToast";

const MessageDemo = () => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim() || !recipient.trim()) return;

    // Show notification for the sent message
    toast({
      title: "New Message",
      description: (
        <NotificationToast
          type="fun"
          title={`Message from ${recipient}`}
          message={message}
        />
      ),
    });

    // Reset form
    setMessage("");
    setRecipient("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Recipient name"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="glass"
        />
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="glass"
        />
      </div>
      <Button
        onClick={handleSendMessage}
        className="w-full bg-baby-blue hover:bg-accent"
        disabled={!message.trim() || !recipient.trim()}
      >
        Send Message
      </Button>
    </div>
  );
};

export default MessageDemo;
