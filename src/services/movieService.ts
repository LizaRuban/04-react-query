import type { Movie } from '../types/movie.ts';
const token = import.meta.env.VITE_TMDB_TOKEN;
import axios from 'axios';

export async function searchMovies(
  query: string,
  page: number
): Promise<Movie[]> {
  const response = await axios.get<{ results: Movie[] }>(
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

  return response.data.results;
}
