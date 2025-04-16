
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { 
  connections, 
  findUserById, 
  generateId, 
  getCurrentTimestamp, 
  UserProfile, 
  users,
  saveConnections
} from "@/data/localStore";

const Connect = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Filter users by username or email that aren't the current user
      const results = users.filter(u => 
        (u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
         u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        u.id !== user?.id
      );

      setSearchResults(results);
      
      // Get pending connection requests
      if (user) {
        const pendingIds = connections
          .filter(c => c.user_id === user.id && c.status === "pending")
          .map(c => c.connected_user_id);
        
        setPendingConnections(pendingIds);
      }
      
    } catch (error: any) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = (profileId: string) => {
    if (!user) {
      toast.error("You must be logged in to connect with users");
      return;
    }

    try {
      // Check if connection already exists
      const existingConnection = connections.find(
        c => c.user_id === user.id && c.connected_user_id === profileId
      );

      if (existingConnection) {
        toast.error("Connection request already sent");
        return;
      }

      // Create new connection
      const newConnection = {
        id: generateId(),
        user_id: user.id,
        connected_user_id: profileId,
        status: "pending" as const,
        created_at: getCurrentTimestamp()
      };
      
      connections.push(newConnection);
      saveConnections(connections); // Save to localStorage
      
      toast.success("Connection request sent");
      setPendingConnections([...pendingConnections, profileId]);
      
    } catch (error: any) {
      console.error("Error connecting with user:", error);
      toast.error("Failed to send connection request");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="glass p-8 rounded-xl border border-accent/20">
          <h1 className="text-3xl font-bold mb-6">
            <span className="text-gradient">Connect with Users</span>
          </h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input 
                placeholder="Search by username or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </form>
          
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((profile) => (
                <div key={profile.id} className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://avatar.vercel.sh/${profile.username || "user"}.png`} />
                      <AvatarFallback>{profile.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.username}</p>
                      <p className="text-sm text-white/70">{profile.email}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    disabled={pendingConnections.includes(profile.id)}
                    className={pendingConnections.includes(profile.id) ? "bg-gray-600" : "bg-baby-blue hover:bg-accent"}
                    onClick={() => handleConnect(profile.id)}
                  >
                    {pendingConnections.includes(profile.id) ? "Request Sent" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              {searchQuery && !isSearching ? (
                <p>No users found matching "{searchQuery}"</p>
              ) : (
                <p>Search for users to connect with</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;
