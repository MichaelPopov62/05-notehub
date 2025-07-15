import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Movie } from "../types/movie";

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface FetchMoviesParams {
  query: string;
  page?: number;
}

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const BASE_URL = "https://api.themoviedb.org/3";
// Функція штучної затримки:сам додав
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMovies({
  query,
  page = 1,
}: FetchMoviesParams): Promise<FetchMoviesResponse> {
  try {
    await delay(2000); //Сам додав: затримка 2 секунди для тестування лоадера

    const response: AxiosResponse<FetchMoviesResponse> = await axios.get(
      `${BASE_URL}/search/movie`,
      {
        params: {
          query,
          page,
        },
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    const {
      results,
      page: currentPage,
      total_pages,
      total_results,
    } = response.data;
    if (!Array.isArray(results)) {
      throw new Error("Невірна відповідь від сервера: відсутні результати.");
    }
    // Фільтрація, щоб уникнути некоректних записів( null,відсутні(id/title),порожній title (" "," " ))
    const filteredResults = results.filter(
      (movie) => movie && movie.id && movie.title
    );
    console.log(
      ` Запит до TMDB виконано: query="${query}", page=${page}, отримано фільмів: ${filteredResults.length}`
    );

    return {
      page: currentPage,
      total_pages,
      total_results,
      results: filteredResults,
    };
  } catch (error) {
    console.error(" Помилка під час запиту fetchMovies:", error);
    throw error;
  }
}
