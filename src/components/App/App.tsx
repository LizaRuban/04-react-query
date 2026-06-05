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
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination.tsx';

function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => searchMovies(query, currentPage),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const totalPages = movies.length ?? 0;

  useEffect(() => {
    if (query && !isLoading && movies.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [query, isLoading, movies.length]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie); // відкриває модалку
  };

  const closeModal = () => {
    setSelectedMovie(null); // закриває модалку
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          setPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
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
