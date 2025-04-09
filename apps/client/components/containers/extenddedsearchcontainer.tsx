import { SearchBar } from "../general/search-bar";
import { FullPagination } from "../general/full-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import React from "react";

interface Props {
  title: string;
  description: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  children: React.ReactNode;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  total: number;
  resPerPage: number;
  handleSetSearchType: (value: string) => void;
}

export default function ExtendedSearchContainer({
  title,
  description,
  handleSubmit,
  searchQuery,
  setSearchQuery,
  children,
  currentPage,
  setCurrentPage,
  total,
  resPerPage,
  handleSetSearchType,
}: Props) {
  return (
    <main className="flex flex-col gap-5">
      <header className="pl-3 flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{title}.</h1>
        <p className="text-gray-200">{description}</p>
      </header>

      <div className="flex gap-2 w-full items-center flex-wrap lg:flex-nowrap">
        <form onSubmit={handleSubmit} className="w-full">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType="albums"
          />
        </form>
        <div className="pl-3 flex gap-5">
          <Button
            onClick={handleSubmit}
            className="md:w-[250px] sm:w-[150px] h-full p-2"
            data-cy="submitBtn"
          >
            Search
          </Button>

          <Select defaultValue="local" onValueChange={handleSetSearchType}>
            <SelectTrigger
              className="md:w-[250px] sm:w-[150px] h-full p-2"
              data-cy="searchType"
            >
              <SelectValue placeholder="Search Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local" data-cy="searchType-local">
                Local (Recommended)
              </SelectItem>
              <SelectItem value="wider" data-cy="searchType-wider">
                Wider
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {React.Children.count(children) > 0 ? (
        <div className="pl-3 grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
          {children}
        </div>
      ) : (
        <div className="flex flex-col gap-1 justify-center items-center border border-gray-400 p-5 ml-3">
          <p>
            Can&apos;t find an album? Check your spelling or switch from Local
            Search to Wider Search!
          </p>

          <p>It&apos;s just next to the search button :)</p>
        </div>
      )}

      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={resPerPage}
      />
    </main>
  );
}
