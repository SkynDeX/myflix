import { 
    addUser, 
    createPlaylist, 
    addToPlaylist,
    saveToStorage,
    getAllUsers,
    removeFromStorage,
    updatePlaylist
} from './localStorage';
import { STORAGE_KEYS } from '../constants/constants';
import { searchGoogleBooks } from '../services/googleBooksApi';

// 한국 이름 목록
const koreanNames = [
    '김민준', '이서연', '박지호', '정하은', '최도현',
    '윤서영', '장우진', '한소현', '임태준', '노아영'
];

// 영화 더미 데이터 (실제 TMDB ID 사용)
const dummyMovies = [
    { id: 533535, title: '데드풀 & 울버린', poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', type: 'movie' },
    { id: 519182, title: '분노의 질주: 더 맥시멈', poster_path: '/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', type: 'movie' },
    { id: 615656, title: '메갈로돈 2: 더 트렌치', poster_path: '/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg', type: 'movie' },
    { id: 298618, title: '플래시', poster_path: '/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', type: 'movie' },
    { id: 502356, title: '슈퍼 마리오 브라더스', poster_path: '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg', type: 'movie' },
    { id: 447365, title: '가디언즈 오브 갤럭시 VOL. 3', poster_path: '/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', type: 'movie' },
    { id: 653346, title: '존 윅 4', poster_path: '/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', type: 'movie' },
    { id: 640146, title: '앤트맨과 와스프: 퀀텀매니아', poster_path: '/sz6mTIDDQmR3DYgJudiTmoW2gR5.jpg', type: 'movie' },
    { id: 76600, title: '아바타: 물의 길', poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', type: 'movie' },
    { id: 438148, title: '미니언즈: 라이즈 오브 그루', poster_path: '/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', type: 'movie' },
    { id: 505642, title: '블랙 팬서: 와칸다 포에버', poster_path: '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', type: 'movie' },
    { id: 436270, title: '블랙 아담', poster_path: '/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg', type: 'movie' },
    { id: 609681, title: '더 배트맨', poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg', type: 'movie' },
    { id: 634649, title: '스파이더맨: 노 웨이 홈', poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', type: 'movie' },
    { id: 524434, title: '이터널스', poster_path: '/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg', type: 'movie' },
    { id: 566525, title: '샹치와 텐 링즈의 전설', poster_path: '/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', type: 'movie' },
    { id: 460465, title: '모탈 컴뱃', poster_path: '/nkayOAUBUu4mMvyNf9iHSUiPjF1.jpg', type: 'movie' },
    { id: 399566, title: '고질라 vs. 콩', poster_path: '/pgqgaUx1cJb5oZQQ5v0tNARCeBp.jpg', type: 'movie' }
];

// googleBooksApi에서 가져올 도서 검색 키워드
const bookSearchQueries = [
    '미드나잇 라이브러리',
    '아몬드 손원평',
    '달러구트 꿈 백화점',
    '불편한 편의점',
    '하리하라의 생물학 카페',
    '공정하다는 착각',
    '죽고 싶지만 떡볶이는 먹고 싶어',
    '트렌드 코리아 2024',
    '어떻게 살 것인가',
    '나는 나로 살기로 했다',
    '정의란 무엇인가',
    '코스모스 칼 세이건',
    '사피엔스',
    '원피스',
    '책읽기의 즐거움'
];

// 컨셉별 추천 리스트 템플릿
const moviePlaylistTemplates = [
    {
        title: '액션 블록버스터 모음집',
        description: '스릴 넘치는 액션 영화들을 모았습니다',
        concept: 'action',
        movieIds: [533535, 1160018, 519182, 298618, 447365, 640146]
    },
    {
        title: '마블 시네마틱 유니버스',
        description: 'MCU 최신작들로 구성된 추천 목록',
        concept: 'superhero',
        movieIds: [447365, 640146, 505642, 524434, 566525]
    },
    {
        title: '가족과 함께 보는 애니메이션',
        description: '온 가족이 즐길 수 있는 애니메이션 영화',
        concept: 'family',
        movieIds: [502356, 438148, 76600]
    },
    {
        title: '공포 스릴러 추천작',
        description: '긴장감 넘치는 공포 영화 모음',
        concept: 'horror',
        movieIds: [615656, 460465, 399566]
    },
    {
        title: '로맨틱 코미디 베스트',
        description: '달달한 로맨스와 유쾌한 코미디',
        concept: 'romance',
        movieIds: [634649, 298618, 502356]
    },
    {
        title: 'SF 판타지 대작',
        description: '상상력이 돋보이는 SF 판타지 영화',
        concept: 'sci-fi',
        movieIds: [76600, 298618, 447365, 640146]
    },
    {
        title: '범죄 스릴러 걸작',
        description: '긴장감 넘치는 범죄 영화들',
        concept: 'crime',
        movieIds: [298618, 609681, 783416]
    },
    {
        title: '여름 휴가철 추천작',
        description: '시원한 여름에 어울리는 영화들',
        concept: 'summer',
        movieIds: [615656, 76600, 438148, 447365]
    },
    {
        title: '겨울밤에 보기 좋은 영화',
        description: '따뜻한 실내에서 즐기는 겨울 영화',
        concept: 'winter',
        movieIds: [634649, 505642, 609681]
    },
    {
        title: '주말 극장가 인기작',
        description: '최근 극장가를 휩쓴 인기 영화들',
        concept: 'popular',
        movieIds: [533535, 502356, 447365, 615656, 298618]
    },
    {
        title: '연인과 함께 보기 좋은 영화',
        description: '데이트 무비로 완벽한 로맨틱 영화',
        concept: 'date',
        movieIds: [634649, 502356, 76600]
    },
    {
        title: '친구들과 보는 코미디',
        description: '친구들과 함께 웃으며 볼 수 있는 영화',
        concept: 'comedy',
        movieIds: [502356, 438148, 533535]
    },
    {
        title: '혼자 보기 좋은 진중한 영화',
        description: '혼자만의 시간에 감상하기 좋은 작품',
        concept: 'solo',
        movieIds: [609681, 505642, 783416]
    },
    {
        title: '스트레스 해소용 액션',
        description: '짜릿한 액션으로 스트레스를 날려버리세요',
        concept: 'stress-relief',
        movieIds: [533535, 298618, 1160018, 519182]
    },
    {
        title: '영화관에서 놓친 화제작',
        description: '극장에서 못 본 화제의 영화들',
        concept: 'missed',
        movieIds: [615656, 436270, 460465, 399566]
    },
    {
        title: '주말 밤 추천 영화',
        description: '주말 저녁 시간대에 어울리는 영화',
        concept: 'weekend',
        movieIds: [634649, 447365, 502356]
    },
    {
        title: '새벽에 보는 잔잔한 영화',
        description: '조용한 새벽 시간에 감상하기 좋은 작품',
        concept: 'dawn',
        movieIds: [76600, 505642, 609681]
    },
    {
        title: '연말연시 특별 추천작',
        description: '특별한 연말연시를 위한 영화 모음',
        concept: 'holiday',
        movieIds: [502356, 76600, 634649, 447365]
    }
];

const bookPlaylistTemplates = [
    {
        title: '힐링이 필요할 때 읽는 책',
        description: '마음을 치유해주는 따뜻한 책들',
        concept: 'healing',
        searchQueries: ['미드나잇 라이브러리', '달러구트 꿈 백화점', '죽고 싶지만 떡볶이는 먹고 싶어', '나는 나로 살기로 했다']
    },
    {
        title: '인문학 교양 필독서',
        description: '교양을 쌓을 수 있는 인문학 도서',
        concept: 'humanities',
        searchQueries: ['공정하다는 착각', '정의란 무엇인가', '사피엔스', '어떻게 살 것인가']
    },
    {
        title: '과학의 즐거움',
        description: '과학을 쉽고 재미있게 배울 수 있는 책',
        concept: 'science',
        searchQueries: ['하리하라의 생물학 카페', '코스모스 칼 세이건', '사피엔스']
    },
    {
        title: '현대 한국 소설 베스트',
        description: '최근 주목받는 한국 문학 작품들',
        concept: 'korean-novel',
        searchQueries: ['아몬드 손원평', '달러구트 꿈 백화점', '불편한 편의점', '죽고 싶지만 떡볶이는 먹고 싶어']
    },
    {
        title: '자기계발 필수 도서',
        description: '성장과 발전을 위한 자기계발서',
        concept: 'self-improvement',
        searchQueries: ['트렌드 코리아 2024', '어떻게 살 것인가', '책읽기의 즐거움', '나는 나로 살기로 했다']
    }
];

const mixedPlaylistTemplates = [
    {
        title: '완벽한 주말 엔터테인먼트',
        description: '주말을 알차게 보낼 수 있는 영화와 책',
        concept: 'weekend-mix',
        items: [
            { type: 'movie', id: 502356 },
            { type: 'book', query: '미드나잇 라이브러리' },
            { type: 'movie', id: 447365 },
            { type: 'book', query: '달러구트 꿈 백화점' },
            { type: 'movie', id: 76600 }
        ]
    },
    {
        title: '감성 충전 패키지',
        description: '감성을 자극하는 영화와 에세이',
        concept: 'emotional',
        items: [
            { type: 'book', query: '죽고 싶지만 떡볶이는 먹고 싶어' },
            { type: 'movie', id: 609681 },
            { type: 'book', query: '나는 나로 살기로 했다' },
            { type: 'movie', id: 505642 },
            { type: 'book', query: '미드나잇 라이브러리' }
        ]
    },
    {
        title: '지적 호기심 충족',
        description: '생각할 거리를 주는 영화와 책',
        concept: 'intellectual',
        items: [
            { type: 'book', query: '정의란 무엇인가' },
            { type: 'movie', id: 298618 },
            { type: 'book', query: '사피엔스' },
            { type: 'movie', id: 436270 },
            { type: 'book', query: '공정하다는 착각' }
        ]
    },
    {
        title: '가족과 함께하는 시간',
        description: '온 가족이 즐길 수 있는 콘텐츠',
        concept: 'family-mix',
        items: [
            { type: 'movie', id: 502356 },
            { type: 'movie', id: 438148 },
            { type: 'book', query: '달러구트 꿈 백화점' },
            { type: 'movie', id: 76600 },
            { type: 'book', query: '하리하라의 생물학 카페' }
        ]
    },
    {
        title: '트렌드 키워드로 보는 2024',
        description: '올해의 트렌드를 반영한 영화와 책',
        concept: 'trend-2024',
        items: [
            { type: 'book', query: '트렌드 코리아 2024' },
            { type: 'movie', id: 533535 },
            { type: 'book', query: '불편한 편의점' },
            { type: 'movie', id: 615656 },
            { type: 'book', query: '책읽기의 즐거움' }
        ]
    }
];

// 더미 유저 생성
export const generateDummyUsers = () => {
    const users = [];
    
    for (let i = 0; i < 10; i++) {
        const user = {
            email: `user${i}@gmail.com`,
            password: 'password123',
            name: koreanNames[i],
            profileImage: null,
            bio: `안녕하세요, ${koreanNames[i]}입니다. 영화와 책을 좋아합니다!`
        };
        
        const newUser = addUser(user);
        users.push(newUser);
    }
    
    return users;
};

// 랜덤 날짜 생성 (5년 이내)
const getRandomDate = () => {
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    const randomTime = fiveYearsAgo.getTime() + Math.random() * (now.getTime() - fiveYearsAgo.getTime());
    return new Date(randomTime).toISOString();
};

// 랜덤 좋아요 수 생성 (1-999)
const getRandomLikes = () => {
    return Math.floor(Math.random() * 999) + 1;
};

// 랜덤 유저 선택 (균등 분배)
let userRotationIndex = 0;
const getRandomUser = (users) => {
    const user = users[userRotationIndex % users.length];
    userRotationIndex++;
    return user;
};

// 더미 플레이리스트 생성
export const generateDummyPlaylists = async (users) => {
    const playlists = [];
    
    // 유저 로테이션 인덱스 초기화
    userRotationIndex = 0;
    
    // 영화 플레이리스트 생성 (20개)
    moviePlaylistTemplates.forEach((template, index) => {
        const randomUser = getRandomUser(users);
        
        // 기본 플레이리스트 생성
        const playlist = createPlaylist(randomUser.id, {
            title: template.title,
            description: template.description,
            isPublic: true
        });
        
        // 영화 아이템 추가
        template.movieIds.forEach(movieId => {
            const movie = dummyMovies.find(m => m.id === movieId);
            if (movie) {
                addToPlaylist(randomUser.id, playlist.id, movie);
            }
        });
        
        // 마지막에 메타데이터 업데이트
        updatePlaylist(randomUser.id, playlist.id, {
            createdAt: getRandomDate(),
            likes: getRandomLikes()
        });
        
        playlists.push(playlist);
    });
    
    // 도서 플레이리스트 생성 (5개) - googleBooksApi 사용
    for (const template of bookPlaylistTemplates) {
        try {
            const randomUser = getRandomUser(users);
            
            // 기본 플레이리스트 생성
            const playlist = createPlaylist(randomUser.id, {
                title: template.title,
                description: template.description,
                isPublic: true
            });
            
            // Google Books API로 실제 도서 검색 후 추가
            for (const query of template.searchQueries) {
                const books = await searchGoogleBooks(query, 1);
                if (books && books.length > 0) {
                    const book = { ...books[0], type: 'book' };
                    addToPlaylist(randomUser.id, playlist.id, book);
                }
            }
            
            // 마지막에 메타데이터 업데이트
            updatePlaylist(randomUser.id, playlist.id, {
                createdAt: getRandomDate(),
                likes: getRandomLikes()
            });
            
            playlists.push(playlist);
        } catch (error) {
            console.error(`도서 플레이리스트 생성 실패 (${template.title}):`, error);
        }
    }
    
    // 혼합 플레이리스트 생성 (5개) - googleBooksApi 사용
    for (const template of mixedPlaylistTemplates) {
        try {
            const randomUser = getRandomUser(users);
            
            // 기본 플레이리스트 생성
            const playlist = createPlaylist(randomUser.id, {
                title: template.title,
                description: template.description,
                isPublic: true
            });
            
            // 혼합 콘텐츠 아이템 추가
            for (const item of template.items) {
                if (item.type === 'movie') {
                    const movie = dummyMovies.find(m => m.id === item.id);
                    if (movie) {
                        addToPlaylist(randomUser.id, playlist.id, movie);
                    }
                } else if (item.type === 'book') {
                    const books = await searchGoogleBooks(item.query, 1);
                    if (books && books.length > 0) {
                        const book = { ...books[0], type: 'book' };
                        addToPlaylist(randomUser.id, playlist.id, book);
                    }
                }
            }
            
            // 마지막에 메타데이터 업데이트
            updatePlaylist(randomUser.id, playlist.id, {
                createdAt: getRandomDate(),
                likes: getRandomLikes()
            });
            
            playlists.push(playlist);
        } catch (error) {
            console.error(`혼합 플레이리스트 생성 실패 (${template.title}):`, error);
        }
    }
    
    return playlists;
};

// 전체 더미데이터 생성
export const generateDummyData = async () => {
    try {
        // 기존 더미데이터 확인 및 삭제
        const existingUsers = getAllUsers();
        const dummyUserEmails = Array.from({ length: 10 }, (_, i) => `user${i}@gmail.com`);
        const hasDummyData = existingUsers.some(user => dummyUserEmails.includes(user.email));
        
        if (hasDummyData) {
            clearAllDummyData();
        }
        
        // 새로운 더미데이터 생성
        console.log('더미 유저 생성 중...');
        const users = generateDummyUsers();
        
        console.log('더미 플레이리스트 생성 중...');
        const playlists = await generateDummyPlaylists(users);
        
        console.log(`생성 완료: 유저 ${users.length}명, 플레이리스트 ${playlists.length}개`);
        
        return {
            users,
            playlists
        };
    } catch (error) {
        console.error('더미데이터 생성 실패:', error);
        throw error;
    }
};

// 모든 더미데이터 삭제
export const clearAllDummyData = () => {
    try {
        // 더미 유저 식별 및 삭제
        const users = getAllUsers();
        const dummyUserEmails = Array.from({ length: 10 }, (_, i) => `user${i}@gmail.com`);
        const dummyUsers = users.filter(user => dummyUserEmails.includes(user.email));
        const dummyUserIds = dummyUsers.map(user => user.id);
        
        // 더미 유저가 아닌 유저들만 남기기
        const realUsers = users.filter(user => !dummyUserEmails.includes(user.email));
        saveToStorage(STORAGE_KEYS.USERS, realUsers);
        
        // 더미 유저와 관련된 데이터 정리
        const cleanStorageData = (storageKey) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
            const cleanedData = {};
            
            Object.keys(data).forEach(userId => {
                if (!dummyUserIds.includes(userId)) {
                    cleanedData[userId] = data[userId];
                }
            });
            
            saveToStorage(storageKey, cleanedData);
        };
        
        // 각 스토리지 데이터 정리
        cleanStorageData(STORAGE_KEYS.MY_PLAYLISTS);
        cleanStorageData(STORAGE_KEYS.LIKED_PLAYLISTS);
        cleanStorageData(STORAGE_KEYS.WISHLIST);
        cleanStorageData(STORAGE_KEYS.RECOMMENDED_CONTENT);
        cleanStorageData(STORAGE_KEYS.FRIENDS);
        cleanStorageData(STORAGE_KEYS.FRIEND_REQUESTS);
        
        // 현재 로그인된 유저가 더미 유저인 경우 로그아웃
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || 'null');
        if (currentUser && dummyUserEmails.includes(currentUser.email)) {
            removeFromStorage(STORAGE_KEYS.USER_INFO);
        }
        
        console.log('모든 더미데이터가 삭제되었습니다.');
        
    } catch (error) {
        console.error('더미데이터 삭제 실패:', error);
        throw error;
    }
};