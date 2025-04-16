
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BellRing, Check, Send } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/audio";
import {
  connections,
  findUserById,
  generateId,
  getCurrentTimestamp,
  notifications,
  UserProfile,
  loadConnections,
  loadNotifications,
  saveNotifications
} from "@/data/localStore";

interface EnhancedNotification {
  id: string;
  sender_id: string;
  recipient_id: string;
  type: "emergency" | "fun" | "reminder";
  message: string;
  audio_url: string | null;
  read: boolean;
  created_at: string;
  senderProfile: UserProfile;
}

interface Connection {
  id: string;
  userId: string;
  username: string;
  email: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const [selectedConnection, setSelectedConnection] = useState<string>("");
  const [notificationType, setNotificationType] = useState<"emergency" | "fun" | "reminder">("fun");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [userConnections, setUserConnections] = useState<Connection[]>([]);
  const [userNotifications, setUserNotifications] = useState<EnhancedNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    
    try {
      // Load fresh data from localStorage
      const freshNotifications = loadNotifications();
      const freshConnections = loadConnections();
      
      // Get user's notifications
      const userNotifs = freshNotifications.filter(n => n.recipient_id === user.id);
      
      // Enhance notifications with sender profile data
      const enhanced = userNotifs.map(notification => {
        const senderProfile = findUserById(notification.sender_id);
        
        if (!senderProfile) {
          throw new Error(`Could not find user profile for ID: ${notification.sender_id}`);
        }
        
        return {
          ...notification,
          senderProfile
        };
      });
      
      setUserNotifications(enhanced);
      
      // Get connections for the select dropdown
      const userConns = freshConnections.filter(c => 
        (c.user_id === user.id || c.connected_user_id === user.id) && 
        c.status === "accepted"
      );
      
      // Enhance connections with profile data
      const enhancedConns = userConns.map(connection => {
        // Get the other user's ID
        const otherUserId = connection.user_id === user.id 
          ? connection.connected_user_id 
          : connection.user_id;
          
        const otherUser = findUserById(otherUserId);
        
        if (!otherUser) {
          throw new Error(`Could not find user profile for ID: ${otherUserId}`);
        }
        
        return {
          id: connection.id,
          userId: otherUserId,
          username: otherUser.username,
          email: otherUser.email
        };
      });
      
      setUserConnections(enhancedConns);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleSendNotification = () => {
    if (!user?.id || !selectedConnection || !notificationMessage.trim()) return;
    
    try {
      // Load fresh notifications
      const freshNotifications = loadNotifications();
      
      // Create new notification
      const newNotification = {
        id: generateId(),
        sender_id: user.id,
        recipient_id: selectedConnection,
        type: notificationType,
        message: notificationMessage,
        audio_url: null,
        read: false,
        created_at: getCurrentTimestamp()
      };
      
      // Add to notifications array and save to localStorage
      freshNotifications.push(newNotification);
      saveNotifications(freshNotifications);
      
      toast.success("Notification sent successfully");
      setNotificationMessage("");
      
      // Play notification sound for demo purposes
      notify(notificationType, notificationMessage);
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    try {
      // Load fresh notifications
      const freshNotifications = loadNotifications();
      
      // Find notification
      const notificationIndex = freshNotifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex === -1) {
        throw new Error("Notification not found");
      }
      
      // Mark as read
      freshNotifications[notificationIndex].read = true;
      
      // Save changes
      saveNotifications(freshNotifications);
      
      // Update UI
      setUserNotifications(
        userNotifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const getNotificationStyles = (type: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baby-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Send Notification */}
        <div className="glass p-8 rounded-xl border border-accent/20">
          <h1 className="text-3xl font-bold mb-6">
            <span className="text-gradient">Send Notification</span>
          </h1>
          
          {userConnections.length > 0 ? (
            <div className="space-y-4">
              <Select value={selectedConnection} onValueChange={setSelectedConnection}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select a connection" />
                </SelectTrigger>
                <SelectContent>
                  {userConnections.map((connection) => (
                    <SelectItem key={connection.userId} value={connection.userId}>
                      {connection.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={notificationType} 
                onValueChange={(value: "emergency" | "fun" | "reminder") => setNotificationType(value)}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="fun">Fun</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Type your notification message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="glass resize-none"
              />
              
              <Button 
                onClick={handleSendNotification} 
                disabled={!selectedConnection || !notificationMessage.trim()}
                className="w-full bg-baby-blue hover:bg-accent"
              >
                <Send className="mr-2 h-4 w-4" /> Send Notification
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              <p>Connect with users first to send notifications</p>
              <Button 
                variant="link" 
                onClick={() => window.location.href = "/connect"}
                className="text-baby-blue"
              >
                Go to Connect page
              </Button>
            </div>
          )}
        </div>
        
        {/* My Notifications */}
        <div className="glass p-8 rounded-xl border border-accent/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gradient">
              My Notifications
            </h2>
            <BellRing className="text-baby-blue h-6 w-6" />
          </div>
          
          {userNotifications.length > 0 ? (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${getNotificationStyles(notification.type)} ${notification.read ? 'opacity-70' : ''} flex justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${notification.senderProfile?.username || "user"}.png`} />
                        <AvatarFallback>{notification.senderProfile?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{notification.senderProfile?.username || "Unknown User"}</p>
                        <p className="text-xs text-white/70">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/90">{notification.message}</p>
                  </div>
                  
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
