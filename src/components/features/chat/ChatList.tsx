
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAcceptedConnectionsForUser, findUserById, UserProfile } from "@/data/localStore";

interface ChatListProps {
  userId: string;
  onSelectUser: (user: UserProfile) => void;
  selectedUserId?: string;
}

interface UserConnectionItem {
  id: string;
  profile: UserProfile;
}

const ChatList = ({ userId, onSelectUser, selectedUserId }: ChatListProps) => {
  const [connections, setConnections] = useState<UserConnectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadConnections = () => {
      try {
        const acceptedConnections = getAcceptedConnectionsForUser(userId);
        
        const connectionItems: UserConnectionItem[] = acceptedConnections
          .map(connection => {
            // Get the connected user's ID (not the current user)
            const connectedUserId = connection.user_id === userId 
              ? connection.connected_user_id 
              : connection.user_id;
            
            // Find user profile
            const userProfile = findUserById(connectedUserId);
            
            if (!userProfile) return null;
            
            return {
              id: connection.id,
              profile: userProfile
            };
          })
          .filter((item): item is UserConnectionItem => item !== null);
        
        setConnections(connectionItems);
      } catch (error) {
        console.error("Failed to load connections", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConnections();
    
    // Poll for connection updates
    const intervalId = setInterval(loadConnections, 5000);
    
    return () => clearInterval(intervalId);
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-baby-blue"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-4">My Connections</h3>
      
      {connections.length === 0 ? (
        <div className="text-center py-4 text-white/70">
          <p>No connections yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {connections.map((connection) => (
            <div 
              key={connection.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedUserId === connection.profile.id 
                  ? "bg-baby-blue/30 border border-baby-blue"
                  : "hover:bg-white/10"
              }`}
              onClick={() => onSelectUser(connection.profile)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://avatar.vercel.sh/${connection.profile.username}.png`} />
                  <AvatarFallback>{connection.profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{connection.profile.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
