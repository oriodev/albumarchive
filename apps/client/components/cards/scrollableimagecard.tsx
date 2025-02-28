import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageLoader from "../general/imageloader";
import { ImageType } from "@/types";
import { truncateString } from "@/utils/global.utils";

interface Props {
  image?: string;
  imageType: ImageType;
  title: string;
  description?: string;
}

export default function ScrollableImageCard({
  image,
  imageType,
  title,
  description,
}: Props) {
  return (
    <Card className="w-[200px] inline-block flex flex-col gap-1 hover:cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader className="relative">
        <ImageLoader image={image} type={imageType} size={300} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-center">
        <CardTitle>{truncateString(title, 25)}</CardTitle>
        <CardDescription className="text-center">
          {truncateString(description, 25)}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
