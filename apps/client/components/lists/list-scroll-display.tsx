import { List } from "@/types";
import { ListCard } from "./list-card";

export function ListScrollDisplay({ lists }: { lists: List[] }) {
  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hidden">
      <div className="flex space-x-4 p-3">
        {lists.map((list: List) => (
          <div
            className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={`${list.name}+${list.user}`}
          >
            <ListCard list={list} />
          </div>
        ))}
      </div>
    </div>
  );
}
