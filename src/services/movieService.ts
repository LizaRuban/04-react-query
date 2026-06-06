import type { Movie } from '../types/movie.ts';
const token = import.meta.env.VITE_TMDB_TOKEN;
import axios from 'axios';

interface SearchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function searchMovies(
  query: string,
  page: number
): Promise<SearchMoviesResponse> {
  const response = await axios.get<SearchMoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return response.data;
}
