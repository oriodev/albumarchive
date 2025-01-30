import { Badge } from "../ui/badge";

export function VibesDisplay({
  setVibes,
  handleSetVibes,
}: {
  setVibes: string[];
  handleSetVibes?: (setVibes: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {setVibes.map((vibe, index) => (
        <Badge
          key={vibe}
          className={`text-md text-white hover:cursor-pointer ${(index === 0 && "bg-purple-600 hover:bg-purple-700") || (index === 1 && "bg-sky-600 hover:bg-sky-700") || (index === 2 && "bg-pink-600 hover:bg-pink-700")}`}
          onClick={handleSetVibes ? () => handleSetVibes(vibe) : () => {}}
        >
          {vibe}
        </Badge>
      ))}
    </div>
  );
}
