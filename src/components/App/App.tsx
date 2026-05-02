import { useState } from "react";
import {
  Toaster,
  toast,
} from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import styles from "./App.module.css";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error";

export default function App() {
  const [movies, setMovies] = useState<
    Movie[]
  >([]);
  const [status, setStatus] =
    useState<Status>("idle");
  const [
    selectedMovie,
    setSelectedMovie,
  ] = useState<Movie | null>(null);

  async function handleSearch(
    query: string,
  ) {
    setMovies([]);
    setStatus("loading");

    try {
      const results =
        await fetchMovies(query);

      if (results.length === 0) {
        toast.error(
          "No movies found for your request.",
        );
      }

      setMovies(results);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleSelectMovie(
    movie: Movie,
  ) {
    setSelectedMovie(movie);
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

  return (
    <div className={styles.app}>
      <SearchBar
        onSubmit={handleSearch}
      />

      <main className={styles.main}>
        {status === "loading" && (
          <Loader />
        )}
        {status === "error" && (
          <ErrorMessage />
        )}
        {status === "success" &&
          movies.length > 0 && (
            <MovieGrid
              movies={movies}
              onSelect={
                handleSelectMovie
              }
            />
          )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e2a",
            color: "#e8e8f0",
            border:
              "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
          },
        }}
      />
    </div>
  );
}
