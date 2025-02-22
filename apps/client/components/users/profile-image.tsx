// COMPONENTS.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TYPES.
import { User } from "@/types";

// UTILS.
import { getUsernameInitial } from "@/utils/user.utils";

export default function ProfileImage({
  user,
  size,
}: {
  user: User;
  size: number;
}) {
  const initial = getUsernameInitial(user);

  return (
    <div>
      <Avatar className={`w-${size} h-${size} text-3xl`}>
        <AvatarImage src={user?.profileImg} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}
