import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  name: string;
  avatar: string;
}

export default function UserAvatar({ name, avatar }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>{name.split("").slice(0, 2).join()}</AvatarFallback>
    </Avatar>
  );
}
