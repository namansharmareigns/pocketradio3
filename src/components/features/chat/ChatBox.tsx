
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import NotificationToast from "@/components/features/notifications/NotificationToast";
import { playNotificationSound } from "@/lib/audio";
import { 
  UserProfile, 
  ChatMessage,
  getChatHistoryBetweenUsers, 
  addChatMessage,
  generateId,
  getCurrentTimestamp
} from "@/data/localStore";

interface ChatBoxProps {
  currentUser: UserProfile;
  selectedUser: UserProfile | null;
}

const ChatBox = ({ currentUser, selectedUser }: ChatBoxProps) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"emergency" | "fun" | "reminder">("fun");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    
    // Load chat history
    const loadChatHistory = () => {
      const history = getChatHistoryBetweenUsers(currentUser.id, selectedUser.id);
      setChatHistory(history);
    };
    
    loadChatHistory();
    
    // Poll for new messages
    const intervalId = setInterval(loadChatHistory, 3000);
    
    return () => clearInterval(intervalId);
  }, [currentUser, selectedUser]);
  
  useEffect(() => {
    // Scroll to bottom when chat history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleSendMessage = () => {
    if (!currentUser || !selectedUser || !message.trim()) return;
    
    try {
      // Create new message
      const newMessage: ChatMessage = {
        id: generateId(),
        sender_id: currentUser.id,
        recipient_id: selectedUser.id,
        message: message,
        audio_url: null,
        type: messageType,
        created_at: getCurrentTimestamp()
      };
      
      // Add to chat history
      addChatMessage(newMessage);
      
      // Update UI
      setChatHistory([...chatHistory, newMessage]);
      
      // Play notification sound
      playNotificationSound(messageType);
      
      // Show toast notification
      toast((
        <NotificationToast
          type={messageType}
          title={`Message sent to ${selectedUser.username}`}
          message={message}
        />
      ));
      
      // Clear input
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };
  
  const startRecording = async () => {
    if (!currentUser || !selectedUser) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioUrl = URL.createObjectURL(blob);
        
        // Create new message
        const newMessage: ChatMessage = {
          id: generateId(),
          sender_id: currentUser.id,
          recipient_id: selectedUser.id,
          message: "Voice Message",
          audio_url: audioUrl,
          type: messageType,
          created_at: getCurrentTimestamp()
        };
        
        // Add to chat history
        addChatMessage(newMessage);
        
        // Update UI
        setChatHistory([...chatHistory, newMessage]);
        
        // Play notification sound
        playNotificationSound(messageType);
        
        // Show toast notification
        toast((
          <NotificationToast
            type={messageType}
            title={`Voice message sent to ${selectedUser.username}`}
            message="Voice message"
          />
        ));
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
      toast.error("Could not access microphone");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };
  
  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white/50">
          <p className="mb-2">Select a connection to start chatting</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.username}.png`} />
          <AvatarFallback>{selectedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedUser.username}</h3>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            <p>Start a conversation with {selectedUser.username}</p>
          </div>
        ) : (
          chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 rounded-lg ${
                chat.sender_id === currentUser.id
                  ? "bg-baby-blue/20 ml-auto"
                  : "bg-accent/20 mr-auto"
              } max-w-[80%] transition-all`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  {chat.sender_id === currentUser.id ? "You" : selectedUser.username}
                </span>
                <span className="text-xs opacity-70">
                  {new Date(chat.created_at).toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-white/80 whitespace-pre-wrap">{chat.message}</p>
              
              {chat.audio_url && (
                <audio
                  controls
                  src={chat.audio_url}
                  className="mt-2 w-full"
                />
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex flex-col space-y-3">
          <Select value={messageType} onValueChange={(value: "emergency" | "fun" | "reminder") => setMessageType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="fun">Fun</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${selectedUser.username}...`}
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-3 bg-baby-blue hover:bg-accent"
            >
              <Send className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              variant={isRecording ? "destructive" : "secondary"}
            >
              {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
