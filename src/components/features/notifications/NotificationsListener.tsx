
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { checkForNewNotifications, loadNotifications, saveNotifications, findUserById } from "@/data/localStore";
import NotificationToast from "./NotificationToast";

const NotificationsListener = () => {
  const { user } = useAuth();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  
  useEffect(() => {
    if (!user) return;
    
    // Check for new notifications
    const checkNotifications = () => {
      try {
        const newNotifications = checkForNewNotifications(user.id);
        
        // Show toast for each new notification
        newNotifications.forEach(notification => {
          const sender = findUserById(notification.sender_id);
          
          if (sender) {
            toast(
              <NotificationToast
                type={notification.type}
                title={`New notification from ${sender.username}`}
                message={notification.message}
              />
            );
            
            // Mark as read
            const allNotifications = loadNotifications();
            const notificationIndex = allNotifications.findIndex(n => n.id === notification.id);
            
            if (notificationIndex !== -1) {
              allNotifications[notificationIndex].read = true;
              saveNotifications(allNotifications);
            }
          }
        });
        
        setLastCheck(new Date());
      } catch (error) {
        console.error("Failed to check notifications", error);
      }
    };
    
    // Initial check
    checkNotifications();
    
    // Poll for notifications
    const intervalId = setInterval(checkNotifications, 5000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  return null; // This component doesn't render anything
};

export default NotificationsListener;
