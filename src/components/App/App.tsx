import { useState, useEffect } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar.tsx';
import toast, { Toaster } from 'react-hot-toast';
import { searchMovies } from '../../services/movieService.ts';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import type { Movie } from '../../types/movie.ts';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      setMovies([]);
      setLoading(true);
      setError(false);

      try {
        const results = await searchMovies(query);

        if (results.length === 0) {
          toast.error('No movies found for your request.');
          return;
        }

        setMovies(results);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie); // відкриває модалку
  };

  const closeModal = () => {
    setSelectedMovie(null); // закриває модалку
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}
      {error && <ErrorMessage />}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
