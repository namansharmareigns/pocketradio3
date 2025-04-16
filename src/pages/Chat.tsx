
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { UserProfile } from "@/data/localStore";
import { MessageCircle } from "lucide-react";
import ChatList from "@/components/features/chat/ChatList";
import ChatBox from "@/components/features/chat/ChatBox";

const Chat = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p>You need to be logged in to access chat</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MessageCircle className="h-8 w-8 text-baby-blue" />
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Chat</span>
          </h1>
        </div>
        
        <div className="glass rounded-xl border border-accent/20 min-h-[70vh] flex flex-col md:flex-row">
          {/* Connections sidebar */}
          <div className="w-full md:w-1/4 border-r border-white/10 p-4">
            <ChatList 
              userId={user.id}
              onSelectUser={setSelectedUser}
              selectedUserId={selectedUser?.id}
            />
          </div>
          
          {/* Chat area */}
          <div className="flex-1">
            <ChatBox 
              currentUser={user} 
              selectedUser={selectedUser} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
