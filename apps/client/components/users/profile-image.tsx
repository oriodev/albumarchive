// COMPONENTS.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TYPES.
import { User } from "@/types";

// UTILS.
import { getUsernameInitial } from "@/utils/user.utils";

export default function ProfileImage({ user }: { user: User }) {
  const initial = getUsernameInitial(user);

  return (
    <div>
      <Avatar className="w-16 h-16 text-3xl">
        <AvatarImage src={user?.profileImg} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}
