import { User } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function UserDisplayCard({ user }: { user: User }) {
  return (
    <Card className="hover:cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader className="relative h-64 m-2">
        <Image
          src="/userfallback.png"
          width={500}
          height={500}
          alt="user fallback image"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{user.username}</CardTitle>
      </CardContent>
    </Card>
  );
}
