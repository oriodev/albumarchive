import { List } from "@/types";
import { ListCard } from "./list-card";

export function ListScrollDisplay({ lists }: { lists: List[] }) {
  return (
    <div className="p-3 overflow-x-auto overflow-y-hidden scrollbar-hidden">
      <div className="flex space-x-4">
        {lists.map((list: List) => (
          <div
            className="flex-shrink-0 w-1/5"
            key={`${list.name}+${list.user}`}
          >
            <ListCard list={list} />
          </div>
        ))}
      </div>
    </div>
  );
}
