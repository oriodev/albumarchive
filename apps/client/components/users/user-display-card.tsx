import { User } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function UserDisplayCard({ user }: { user: User }) {
  return (
    <Card className="flex flex-col gap-5 hover:cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader className=" m-2">
        {user.profileImg ? (
          <Image
            src={user.profileImg}
            width={500}
            height={500}
            alt="user fallback image"
          />
        ) : (
          <Image
            src="/userfallback.png"
            width={500}
            height={500}
            alt="user fallback image"
          />
        )}
      </CardHeader>
      <CardContent>
        <CardTitle>{user.username}</CardTitle>
      </CardContent>
    </Card>
  );
}
