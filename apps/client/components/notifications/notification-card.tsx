// TYPES.
import { NotificationType } from "@/types";

// API CALLS.

// COMPONENTS.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import NotificationImageLoader from "./notification-image-loader";
import { Button } from "../ui/button";
import Link from "next/link";

export default function NotificationCard({
  image,
  type,
  title,
  description,
  link,
  handleAcceptNotification,
  handleDeclineNotification,
}: {
  image: string | undefined;
  type: NotificationType;
  title: string;
  description: string;
  link: string;
  handleAcceptNotification: () => void;
  handleDeclineNotification: () => Promise<void>;
}) {
  return (
    <Card className="flex gap-5">
      <div className="mr-4 relative w-[200px] h-full">
        <Link href={link}>
          <NotificationImageLoader image={image} type={type} />
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {type === NotificationType.RESPONSE ? (
              <Button onClick={handleDeclineNotification}>Remove</Button>
            ) : (
              <>
                <Button onClick={handleAcceptNotification}>Accept</Button>
                <Button onClick={handleDeclineNotification}>Decline</Button>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
