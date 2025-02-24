import { ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ListLayoutSwitch({
  layoutType,
  setLayoutType,
}: {
  layoutType: string;
  setLayoutType: (layoutType: string) => void;
}) {
  const handleToggle = () => {
    if (layoutType === "Grid") setLayoutType("List");
    else if (layoutType === "List") setLayoutType("Grid");
  };

  return (
    <Badge
      onClick={handleToggle}
      className={`flex flex-wrap gap-2 items-center bg-rose-800 text-white hover:bg-rose-900 hover:cursor-pointer`}
    >
      {layoutType === "Grid" ? (
        <ToggleLeft size={22} />
      ) : (
        <ToggleRight size={22} />
      )}
      <p className="text-xl">{layoutType}</p>
    </Badge>
  );
}
