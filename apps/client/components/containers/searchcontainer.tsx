import { SearchBar } from "../general/search-bar";
import PageHeader from "../general/header";
import { FullPagination } from "../general/full-pagination";

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
  searchType: string;
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
  searchType,
}: Props) {
  return (
    <main
      className="flex flex-col gap-5"
      role="main"
      aria-labelledby="page-header"
    >
      <PageHeader title={title} description={description} />

      <form onSubmit={handleSubmit} aria-label="Search Form">
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          aria-label="Search"
        />
      </form>

      <section aria-labelledby="list-section">
        <h2 id="list-section" className="sr-only">
          List of Items
        </h2>
        <div className="pl-3 grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
          {children}
        </div>
      </section>

      <FullPagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        total={total}
        resPerPage={resPerPage}
        aria-label="Pagination controls"
      />
    </main>
  );
}
