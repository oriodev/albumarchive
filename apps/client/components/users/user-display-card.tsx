import { User } from "@/types";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDisplayCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="relative h-64 m-2">
        <Image
          alt={user.username || "profile pic"}
          src="/avatars/shadcn.jpg"
          width={500}
          height={500}
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{user.username}</CardTitle>
      </CardContent>
    </Card>
  );
}
