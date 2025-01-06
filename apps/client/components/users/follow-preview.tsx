import { User } from "@/types";
import { Button } from "../ui/button";

export function FollowPreview({
  title,
  users,
}: {
  title: string;
  users: User[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">{title}</h2>
      <div className="flex gap-2">
        {users &&
          users.map((user) => (
            <div key={user._id} className="flex-1 bg-gray-800 p-2 text-center">
              {user.username}
            </div>
          ))}
      </div>

      {users && <Button className="">See All</Button>}

      {!users && <p>none yet!</p>}
    </div>
  );
}
