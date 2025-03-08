import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Room } from "@/types";

interface Props {
  room: Room;
  active: boolean;
  handleOnClick: () => void;
}

/**
 * displays rooms in the list of rooms.
 */
export default function RoomCard({ room, active, handleOnClick }: Props) {
  return (
    <Card className={`${active && "border-emerald-900"}`} data-cy="roomCard">
      <CardHeader className="flex flex-row flex-wrap gap-3 justify-between">
        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-2">
            <CardTitle>{room.title}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
          </div>
        </div>
        <Button
          className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-300 pl-5 pr-5"
          onClick={handleOnClick}
          data-cy="enterRoomBtn"
        >
          Enter.
        </Button>
      </CardHeader>
    </Card>
  );
}
