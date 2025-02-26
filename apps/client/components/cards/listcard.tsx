import { ImageType } from "@/types";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { truncateString } from "@/utils/global.utils";
import ImageLoader from "../general/imageloader";

interface Props {
  image?: string;
  imageType: ImageType;
  title: string;
  description: string;
}

export function ListCard({ image, imageType, title, description }: Props) {
  return (
    <Card className="flex flex-col sm:flex-row items-center md:justify-start hover:cursor-pointer transition-transform transform hover:scale-98 p-1 overflow-hidden">
      <div className="flex-shrink-0">
        <ImageLoader image={image} type={imageType} size={145} />
      </div>
      <CardContent className="flex flex-col pt-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-center sm:text-left">
            {truncateString(title, 100)}
          </CardTitle>
          <p className="text-center sm:text-left">
            {truncateString(description, 100)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
