"use client";

// import { getRooms } from "@/apis/rooms.api";
// import RoomCard from "@/components/cards/roomcard";
// import SearchContainer from "@/components/containers/searchcontainer";
// import { Room } from "@/types";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function Page() {
  // const router = useRouter();

  // const [searchQuery, setSearchQuery] = useState("");
  // const [rooms, setRooms] = useState<Room[]>([]);
  // const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const total = 1;
  // const resPerPage = 15;

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     const fetchedRooms = await getRooms();
  //     setRooms(fetchedRooms);
  //     setFilteredRooms(fetchedRooms);
  //   };

  //   fetchRooms();
  // }, []);

  // useEffect(() => {
  //   setFilteredRooms(
  //     rooms.filter((room) =>
  //       room.title.toLowerCase().includes(searchQuery.toLowerCase()),
  //     ),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchQuery]);

  // const handleEnterRoom = (slug: string) => {
  //   router.push(`/central/rooms/${slug}`);
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setFilteredRooms(
  //     rooms.filter((room) =>
  //       room.title.toLowerCase().includes(searchQuery.toLowerCase()),
  //     ),
  //   );
  // };

  return (
    <div>
      <p>rooms</p>
    </div>
    // <SearchContainer
    //   title="Join a Chat Room"
    //   description="Meet new people who love the same artists that you love!"
    //   handleSubmit={handleSubmit}
    //   searchQuery={searchQuery}
    //   setSearchQuery={setSearchQuery}
    //   currentPage={currentPage}
    //   setCurrentPage={setCurrentPage}
    //   total={total}
    //   resPerPage={resPerPage}
    //   searchType="rooms"
    // >
    //   {filteredRooms.map((room) => (
    //     <RoomCard
    //       key={room.title}
    //       room={room}
    //       active={room.users.length > 0}
    //       handleOnClick={() => handleEnterRoom(room.slug)}
    //     />
    //   ))}
    // </SearchContainer>
  );
}
