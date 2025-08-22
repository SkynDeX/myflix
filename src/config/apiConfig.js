// API 설정 파일
// 실제 배포시에는 .env 파일로 관리해야 합니다

const API_CONFIG = {
    TMDB: {
        API_KEY: process.env.REACT_APP_TMDB_API_KEY,
        BASE_URL: process.env.REACT_APP_TMDB_BASE_URL,
        IMAGE_BASE_URL: process.env.REACT_APP_TMDB_IMAGE_BASE_URL,
        LANGUAGE: 'ko-KR',
        REGION: 'KR'
    }
};

export default API_CONFIG;
