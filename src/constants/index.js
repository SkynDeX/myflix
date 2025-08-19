// API 관련 상수
export const API_ENDPOINTS = {
    TMDB: {
        POPULAR_MOVIES: '/movie/popular',
        TOP_RATED_MOVIES: '/movie/top_rated',
        MOVIE_DETAILS: '/movie',
        MOVIE_SEARCH: '/search/movie',
        MOVIE_GENRES: '/genre/movie/list',
        MOVIE_VIDEOS: '/movie/{id}/videos',
        MOVIE_RECOMMENDATIONS: '/movie/{id}/recommendations'
    },
    NAVER: {
        BOOK_SEARCH: '/search/book.json'
    }
};

// 이미지 크기 상수
export const IMAGE_SIZES = {
    POSTER: {
        SMALL: 'w342',
        MEDIUM: 'w500',
        LARGE: 'w780'
    },
    BACKDROP: {
        SMALL: 'w780',
        MEDIUM: 'w1280',
        LARGE: 'original'
    }
};

// 페이지네이션 상수
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    ITEMS_PER_PAGE: 20,
    MAX_PAGES: 500
};

// 저장소 키 상수
export const STORAGE_KEYS = {
    USER: 'myflix_user',
    WISH_LIST_MOVIES: 'myflix_wishlist_movies',
    WISH_LIST_BOOKS: 'myflix_wishlist_books',
    WATCHED_MOVIES: 'myflix_watched_movies',
    READ_BOOKS: 'myflix_read_books',
    MY_PLAYLISTS: 'myflix_my_playlists',
    RECOMMENDATIONS: 'myflix_recommendations',
    NOTIFICATIONS: 'myflix_notifications'
};

// 사용자 액션 타입
export const USER_ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER'
};

// 컨텐츠 타입
export const CONTENT_TYPES = {
    MOVIE: 'movie',
    BOOK: 'book'
};

// 영화 장르 (TMDB 기본 장르)
export const MOVIE_GENRES = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

// 평점 관련 상수
export const RATING = {
    MIN: 1,
    MAX: 10,
    DEFAULT: 5
};

// 알림 타입
export const NOTIFICATION_TYPES = {
    RECOMMENDATION: 'recommendation',
    SYSTEM: 'system'
};

// 플레이리스트 관련
export const PLAYLIST = {
    MAX_TITLE_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 200,
    MAX_ITEMS: 100
};

// 검색 관련
export const SEARCH = {
    MIN_QUERY_LENGTH: 2,
    DEBOUNCE_DELAY: 300
};

// 캐러셀 설정
export const CAROUSEL = {
    AUTO_PLAY_INTERVAL: 5000,
    ANIMATION_DURATION: 500
};

// 컬러 테마
export const COLORS = {
    PRIMARY: '#1e3a8a',        // 밝은 네이비
    PRIMARY_LIGHT: '#3b82f6',  // 연한 파랑
    PRIMARY_DARK: '#1e40af',   // 진한 네이비
    SECONDARY: '#64748b',      // 회색
    ACCENT: '#f59e0b',         // 주황/금색
    SUCCESS: '#10b981',        // 초록
    WARNING: '#f59e0b',        // 주황
    ERROR: '#ef4444',          // 빨강
    WHITE: '#ffffff',
    BLACK: '#000000',
    GRAY_100: '#f1f5f9',
    GRAY_200: '#e2e8f0',
    GRAY_300: '#cbd5e1',
    GRAY_400: '#94a3b8',
    GRAY_500: '#64748b',
    GRAY_600: '#475569',
    GRAY_700: '#334155',
    GRAY_800: '#1e293b',
    GRAY_900: '#0f172a'
};