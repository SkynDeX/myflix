import axios from 'axios';
import { API_ENDPOINTS, PAGINATION } from '../constants';

// TMDB API 인스턴스
const tmdbApi = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: 'ko-KR',
    region: 'KR'
  }
});

// Naver API 인스턴스
const naverApi = axios.create({
  baseURL: process.env.REACT_APP_NAVER_BASE_URL,
  headers: {
    'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
  }
});

// TMDB 이미지 URL 생성 함수
export const getTmdbImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// 영화 데이터 필터링 함수
const filterMovieData = (movie) => {
  // 한국어 지원, 포스터, 개요가 있는 영화만 필터링
  return (
    movie.overview && 
    movie.overview.trim() !== '' &&
    movie.poster_path &&
    movie.title &&
    movie.vote_average > 0 &&
    movie.adult === false && // 성인 영화 제외
    movie.original_language !== 'xx' // 언어가 명확하지 않은 영화 제외
  );
};

// 도서 데이터 필터링 함수  
const filterBookData = (book) => {
  return (
    book.description && 
    book.description.trim() !== '' &&
    book.image &&
    book.title &&
    book.author &&
    book.publisher
  );
};

// TMDB API 함수들
export const tmdbService = {
  // 인기 영화 가져오기
  getPopularMovies: async (page = PAGINATION.DEFAULT_PAGE) => {
    try {
      const response = await tmdbApi.get(API_ENDPOINTS.TMDB.POPULAR_MOVIES, {
        params: { page }
      });
      
      // 필터링된 영화만 반환
      const filteredMovies = response.data.results.filter(filterMovieData);
      
      return {
        ...response.data,
        results: filteredMovies
      };
    } catch (error) {
      console.error('인기 영화 가져오기 실패:', error);
      throw error;
    }
  },

  // 최고 평점 영화 가져오기
  getTopRatedMovies: async (page = PAGINATION.DEFAULT_PAGE) => {
    try {
      const response = await tmdbApi.get(API_ENDPOINTS.TMDB.TOP_RATED_MOVIES, {
        params: { page }
      });
      
      const filteredMovies = response.data.results.filter(filterMovieData);
      
      return {
        ...response.data,
        results: filteredMovies
      };
    } catch (error) {
      console.error('최고 평점 영화 가져오기 실패:', error);
      throw error;
    }
  },

  // 영화 상세 정보 가져오기
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${movieId}`, {
        params: {
          append_to_response: 'videos,credits,recommendations'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('영화 상세 정보 가져오기 실패:', error);
      throw error;
    }
  },

  // 영화 검색
  searchMovies: async (query, page = PAGINATION.DEFAULT_PAGE) => {
    try {
      const response = await tmdbApi.get(API_ENDPOINTS.TMDB.MOVIE_SEARCH, {
        params: { query, page }
      });
      
      const filteredMovies = response.data.results.filter(filterMovieData);
      
      return {
        ...response.data,
        results: filteredMovies
      };
    } catch (error) {
      console.error('영화 검색 실패:', error);
      throw error;
    }
  },

  // 영화 장르 가져오기
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get(API_ENDPOINTS.TMDB.MOVIE_GENRES);
      return response.data.genres;
    } catch (error) {
      console.error('영화 장르 가져오기 실패:', error);
      throw error;
    }
  }
};

// Naver Books API 함수들
export const naverBooksService = {
  // 도서 검색
  searchBooks: async (query, start = 1, display = 20) => {
    try {
      const response = await naverApi.get(API_ENDPOINTS.NAVER.BOOK_SEARCH, {
        params: {
          query,
          start,
          display
        }
      });
      
      // 필터링된 도서만 반환
      const filteredBooks = response.data.items.filter(filterBookData);
      
      return {
        ...response.data,
        items: filteredBooks
      };
    } catch (error) {
      console.error('도서 검색 실패:', error);
      throw error;
    }
  },

  // 인기 도서 (베스트셀러 키워드로 검색)
  getPopularBooks: async () => {
    try {
      const keywords = ['베스트셀러', '인기도서', '추천도서'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      return await naverBooksService.searchBooks(randomKeyword, 1, 20);
    } catch (error) {
      console.error('인기 도서 가져오기 실패:', error);
      throw error;
    }
  },

  // 장르별 도서 검색
  getBooksByGenre: async (genre, start = 1, display = 20) => {
    try {
      return await naverBooksService.searchBooks(genre, start, display);
    } catch (error) {
      console.error('장르별 도서 검색 실패:', error);
      throw error;
    }
  }
};

// 랜덤 추천 서비스
export const recommendationService = {
  // 랜덤 영화 추천 (인기 영화 500개 중에서)
  getRandomMovie: async () => {
    try {
      // 1-25 페이지 중 랜덤 선택 (500개 영화)
      const randomPage = Math.floor(Math.random() * 25) + 1;
      const movies = await tmdbService.getPopularMovies(randomPage);
      
      if (movies.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.results.length);
        const movieId = movies.results[randomIndex].id;
        
        // 상세 정보와 함께 반환
        return await tmdbService.getMovieDetails(movieId);
      }
      
      return null;
    } catch (error) {
      console.error('랜덤 영화 추천 실패:', error);
      throw error;
    }
  },

  // 랜덤 도서 추천
  getRandomBook: async () => {
    try {
      const genres = ['소설', '에세이', '자기계발', '역사', '과학', '경제', '철학'];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      
      const books = await naverBooksService.getBooksByGenre(randomGenre, 1, 100);
      
      if (books.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * books.items.length);
        return books.items[randomIndex];
      }
      
      return null;
    } catch (error) {
      console.error('랜덤 도서 추천 실패:', error);
      throw error;
    }
  }
};

const apiServices = {
  tmdbService,
  naverBooksService,
  recommendationService,
  getTmdbImageUrl
};

export default apiServices;