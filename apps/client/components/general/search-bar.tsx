import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  searchType: string;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  searchType,
}: SearchBarProps) {
  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder={`Search ${searchType}...`}
          className="pl-8 pt-5 pb-5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          data-cy="searchbar"
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
