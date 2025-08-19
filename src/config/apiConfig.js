// API 설정 파일
// 실제 배포시에는 .env 파일로 관리해야 합니다

const API_CONFIG = {
    TMDB: {
        API_KEY: '10a5e25315ab48e8dabb83995d5b7e11',
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
        LANGUAGE: 'ko-KR',
        REGION: 'KR'
    },
    NAVER: {
        CLIENT_ID: 'x6PkPd_EEQgzdFRcxKxl',
        CLIENT_SECRET: 'gflwNj4Ze0',
        BASE_URL: '/v1/search' // 프록시를 통해 연결
    }
};

export default API_CONFIG;
