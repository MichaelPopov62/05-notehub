import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { toast } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import type { MovieResponse } from "../../services/movieService";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isFetching, isError, error, isSuccess } = useQuery<
    MovieResponse,
    Error
  >({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies({ query: searchQuery, page }),
    enabled: searchQuery.trim() !== "",
    retry: false,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, //5 хвилин кешування я можу спокійно гуляти по іншим сторінкам і при повернення новий запит не виконується автоматично
  });

  const totalPages = data?.total_pages ?? 0;

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("Please enter your search query.");
      return;
    }
    setSearchQuery(trimmed);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  useEffect(() => {
    const movies = data?.results ?? [];
    if (isSuccess && movies.length === 0) {
      toast("No films found. Try a different request.", {
        style: {
          background: "#FFF",
          color: "#d32f2f",
          borderRadius: "8px",
          padding: "12px 16px",
          fontWeight: "bold",
          textAlign: "center",
        },
      });
    }
  }, [isSuccess, data?.results]);

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />
      {/*для помилок з сервера різного роду */}
      {searchQuery && isError && !isFetching && (
        <ErrorMessage
          message={
            error?.message || "Something went wrong. Please try again later."
          }
        />
      )}

      {isFetching && <Loader message="Fascination of films..." />}

      {isSuccess && data.results.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              previousLabel="←"
              nextLabel="→"
              onPageChange={({ selected }) => setPage(selected + 1)}
              pageRangeDisplayed={5}
              pageCount={totalPages}
              forcePage={page - 1}
              marginPagesDisplayed={1}
              containerClassName={css.pagination}
              activeClassName={css.active}
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}

      <Toaster
        position="top-center"
        toastOptions={{ style: { margin: "0 auto" } }}
      />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
