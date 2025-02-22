import { SearchBar } from "../albums/search-bar";
import { FullPagination } from "../nav/full-pagination";

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
}

export default function SearchContainer({
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
}: Props) {
  return (
    <main className="flex flex-col gap-5">
      <header className="pl-3 flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{title}.</h1>
        <p className="text-gray-200">{description}</p>
      </header>

      <form onSubmit={handleSubmit}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType="lists"
        />
      </form>

      <div className="pl-3 grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        {children}
      </div>

      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={resPerPage}
      />
    </main>
  );
}
