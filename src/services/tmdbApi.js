// TMDB API 연동 모듈

import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

const { API_KEY, BASE_URL, IMAGE_BASE_URL, LANGUAGE, REGION } = API_CONFIG.TMDB;

// Axios 인스턴스 생성
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: LANGUAGE,
    region: REGION
  }
});

// 이미지 URL 생성 헬퍼
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// 인기 영화 목록
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('인기 영화 불러오기 실패:', error);
    return [];
  }
};

// 현재 상영중인 영화
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('현재 상영 영화 불러오기 실패:', error);
    return [];
  }
};

// 최고 평점 영화
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('최고 평점 영화 불러오기 실패:', error);
    return [];
  }
};

// 영화 상세 정보
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits'
      }
    });
    
    const movie = response.data;
    
    // 유효한 영화인지 확인
    if (!isValidMovie(movie)) {
      return null;
    }
    
    // 예고편/티저 필터링
    if (movie.videos && movie.videos.results) {
      movie.videos.results = movie.videos.results.filter(
        video => video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser')
      );
    }
    
    return movie;
  } catch (error) {
    console.error('영화 상세 정보 불러오기 실패:', error);
    return null;
  }
};

// 영화 검색
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false // 성인 콘텐츠 제외
      }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('영화 검색 실패:', error);
    return [];
  }
};

// 장르별 영화 검색
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        include_adult: false,
        'vote_count.gte': 10 // 최소 투표 수
      }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('장르별 영화 검색 실패:', error);
    return [];
  }
};

// 년도별 영화 검색
export const getMoviesByYear = async (year, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        primary_release_year: year,
        page,
        include_adult: false,
        'vote_count.gte': 10
      }
    });
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('년도별 영화 검색 실패:', error);
    return [];
  }
};

// 추천용 인기 영화 TOP 200 가져오기
export const getTop200Movies = async () => {
  try {
    const movies = [];
    const pagesToFetch = 10; // 각 페이지당 20개씩, 10페이지 = 200개
    
    for (let page = 1; page <= pagesToFetch; page++) {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page }
      });
      
      const validMovies = response.data.results.filter(movie => {
        // 필터링 완화: 기본적인 유효성만 확인
        return isValidMovie(movie);
      });
      
      movies.push(...validMovies);
    }
    
    // 상세 정보 확인 없이 바로 반환 (API 호출 횟수 감소)
    return movies.slice(0, 200);
  } catch (error) {
    console.error('TOP 200 영화 불러오기 실패:', error);
    return [];
  }
};

// 유효한 영화 필터링
const isValidMovie = (movie) => {
  return (
    movie &&
    movie.title && // 한글 제목이 있음
    movie.overview && // 설명이 있음
    movie.poster_path && // 포스터가 있음
    movie.backdrop_path && // 배경 이미지가 있음
    movie.adult === false && // 성인 영화 제외
    movie.original_language !== 'ja' // 일본 성인물 제외
  );
};

// 영화 목록 필터링
const filterValidMovies = (movies) => {
  return movies.filter(isValidMovie);
};

// 비슷한 영화 추천
export const getSimilarMovies = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`);
    return filterValidMovies(response.data.results);
  } catch (error) {
    console.error('비슷한 영화 불러오기 실패:', error);
    return [];
  }
};

// 장르 목록 가져오기
export const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('장르 목록 불러오기 실패:', error);
    return [];
  }
};
