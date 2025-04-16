
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProps {
  username: string;
  email?: string;
  avatarUrl?: string;
  className?: string;
}

export function User({ username, email, avatarUrl, className = "" }: UserProps) {
  const initials = username
    ? username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Avatar>
        <AvatarImage src={avatarUrl || `https://avatar.vercel.sh/${username}.png`} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium leading-none">{username}</p>
        {email && <p className="text-xs text-muted-foreground">{email}</p>}
      </div>
    </div>
  );
}
