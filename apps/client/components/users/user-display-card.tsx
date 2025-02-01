import { User } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserImage from "./user-image";

export default function UserDisplayCard({ user }: { user: User }) {
  return (
    <Card className="flex flex-col gap-5 hover:cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader className=" m-2">
        <UserImage user={user} size={300} />
      </CardHeader>
      <CardContent>
        <CardTitle>{user.username}</CardTitle>
      </CardContent>
    </Card>
  );
}
