
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  connections, 
  findUserById, 
  generateId, 
  getCurrentTimestamp, 
  UserProfile,
  loadConnections,
  saveConnections
} from "@/data/localStore";

interface EnhancedConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  connectedProfile: UserProfile;
}

const Profile = () => {
  const { user } = useAuth();
  const [enhancedConnections, setEnhancedConnections] = useState<EnhancedConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<EnhancedConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch connections
  useEffect(() => {
    if (!user) return;
    
    try {
      // Load fresh connections from localStorage
      const freshConnections = loadConnections();
      
      // Get accepted connections
      const acceptedConnections = freshConnections.filter(c => 
        (c.user_id === user.id || c.connected_user_id === user.id) && 
        c.status === "accepted"
      );
      
      // Enhance with user profiles
      const enhanced = acceptedConnections.map(connection => {
        // Determine which user ID to fetch (not the current user)
        const otherUserId = connection.user_id === user.id 
          ? connection.connected_user_id 
          : connection.user_id;
          
        // Find the profile for this connection
        const otherUserProfile = findUserById(otherUserId);
        
        if (!otherUserProfile) {
          throw new Error(`Could not find user profile for ID: ${otherUserId}`);
        }
        
        return {
          ...connection,
          connectedProfile: otherUserProfile
        };
      });
      
      setEnhancedConnections(enhanced);
      
      // Get pending requests
      const pending = freshConnections.filter(c => 
        c.connected_user_id === user.id && c.status === "pending"
      );
      
      // Enhance pending requests with profile data
      const enhancedPending = pending.map(request => {
        const requestingUserProfile = findUserById(request.user_id);
        
        if (!requestingUserProfile) {
          throw new Error(`Could not find user profile for ID: ${request.user_id}`);
        }
        
        return {
          ...request,
          connectedProfile: requestingUserProfile
        };
      });
      
      setPendingRequests(enhancedPending);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Handle connection request actions
  const handleConnectionAction = (connectionId: string, action: "accept" | "reject") => {
    try {
      // Load fresh connections to prevent data loss
      const freshConnections = loadConnections();
      const connectionIndex = freshConnections.findIndex(c => c.id === connectionId);
      
      if (connectionIndex === -1) {
        throw new Error("Connection not found");
      }
      
      if (action === "accept") {
        freshConnections[connectionIndex].status = "accepted";
        toast.success("Connection request accepted");
      } else {
        // Remove the connection
        freshConnections.splice(connectionIndex, 1);
        toast.success("Connection request rejected");
      }
      
      // Save updated connections back to localStorage
      saveConnections(freshConnections);
      
      // Update UI
      setPendingRequests(pendingRequests.filter(req => req.id !== connectionId));
      
      // If accepted, refresh connections list to show the new connection
      if (action === "accept") {
        // Re-trigger the effect that loads connections
        setIsLoading(true);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing connection:`, error);
      toast.error(`Failed to ${action} connection request`);
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
        <div className="glass p-8 rounded-xl border border-accent/20">
          <h1 className="text-3xl font-bold mb-6">
            <span className="text-gradient">My Profile</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24 border-2 border-baby-blue">
              <AvatarImage src={`https://avatar.vercel.sh/${user?.username || "user"}.png`} alt={user?.username || "User"} />
              <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{user?.username || "User"}</h2>
              <p className="text-white/70">{user?.email}</p>
              <p className="text-white/70">User ID: {user?.id}</p>
            </div>
          </div>
        </div>

        {/* Pending Connection Requests */}
        {pendingRequests.length > 0 && (
          <div className="glass p-8 rounded-xl border border-accent/20">
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              Connection Requests
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://avatar.vercel.sh/${request.connectedProfile?.username || "user"}.png`} />
                      <AvatarFallback>{request.connectedProfile?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.connectedProfile?.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-baby-blue hover:bg-accent flex-1 sm:flex-none"
                      onClick={() => handleConnectionAction(request.id, "accept")}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleConnectionAction(request.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connections */}
        <div className="glass p-8 rounded-xl border border-accent/20">
          <h2 className="text-2xl font-bold mb-4 text-gradient">
            My Connections
          </h2>
          
          {enhancedConnections.length > 0 ? (
            <div className="space-y-4">
              {enhancedConnections.map((connection) => (
                <div key={connection.id} className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://avatar.vercel.sh/${connection.connectedProfile?.username || "user"}.png`} />
                      <AvatarFallback>{connection.connectedProfile?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.connectedProfile?.username}</p>
                      <p className="text-sm text-white/70">{connection.connectedProfile?.email}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast.info("Chat functionality coming soon");
                    }}
                  >
                    Send Notification
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              <p>No connections yet.</p>
              <p className="mt-2">Find users in the Connect tab to build your network.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
