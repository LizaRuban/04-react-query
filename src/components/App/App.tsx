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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => searchMovies(query, currentPage),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && !isLoading && totalPages === 0) {
      toast.error('No movies found for your request.');
    }
  }, [query, isLoading, totalPages]);

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

      {!isLoading && !isError && totalPages > 0 && (
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
