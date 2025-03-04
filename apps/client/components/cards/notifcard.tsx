// COMPONENTS.
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import ImageLoader from "../general/imageloader";

// TYPES.
import { ImageType, NotificationType } from "@/types";

interface Props {
  image: string | undefined;
  type: NotificationType;
  imageType: ImageType;
  title: string;
  description: string;
  link: string;
  handleAcceptNotification: () => void;
  handleDeclineNotification: () => Promise<void>;
}

/**
 * for notifications.
 * @param param0
 * @returns
 */
export default function NotifCard({
  image,
  type,
  imageType,
  title,
  description,
  link,
  handleAcceptNotification,
  handleDeclineNotification,
}: Props) {
  const borderColour =
    type === NotificationType.ALBUMREC ||
    type === NotificationType.FRIENDREQUEST
      ? "border-emerald-900"
      : "border-cyan-900";

  return (
    <Card className={borderColour}>
      <CardHeader className="flex flex-row gap-5 justify-between">
        <div className="flex flex-row gap-5">
          <Link href={link}>
            <ImageLoader image={image} type={imageType} size={100} />
          </Link>
          <div className="flex flex-col gap-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          {type === NotificationType.RESPONSE ? (
            <Button onClick={handleDeclineNotification}>Remove</Button>
          ) : (
            <>
              <Button variant={"dark"} onClick={handleAcceptNotification}>
                Accept
              </Button>
              <Button variant={"dark"} onClick={handleDeclineNotification}>
                Decline
              </Button>
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
