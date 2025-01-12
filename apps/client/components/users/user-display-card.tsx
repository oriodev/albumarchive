import { User } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDisplayCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="relative h-64 m-2"></CardHeader>
      <CardContent>
        <CardTitle>{user.username}</CardTitle>
      </CardContent>
    </Card>
  );
}
