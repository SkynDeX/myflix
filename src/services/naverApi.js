// Naver 도서 API 연동 모듈 + Google Books API 통합

import axios from 'axios';
import API_CONFIG from '../config/apiConfig';
import { 
  searchGoogleBooks, 
  getGoogleBooksByCategory, 
  getGoogleBestsellers,
  getGoogleBookByISBN 
} from './googleBooksApi';

const { CLIENT_ID, CLIENT_SECRET } = API_CONFIG.NAVER;

// 네이버 API는 CORS 문제로 직접 호출이 어려우므로
// 개발 환경에서는 프록시 서버를 사용하거나 백엔드 서버를 통해 호출해야 합니다.
// 여기서는 임시로 더미 데이터를 사용합니다.

// 실제 도서 이미지와 정보를 사용한 더미 데이터 (CORS 호환 이미지 사용)
const bookDatabase = [
  {
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    image: 'https://picsum.photos/300/400?random=1',
    fallbackImage: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=아몬드',
    description: '감정을 느끼지 못하는 소년 윤재의 특별한 성장 이야기. 타인의 감정에 무감각해진 이 시대에 큰 울림을 주는 작품입니다.'
  },
  {
    title: '나미야 잡화점의 기적',
    author: '히가시노 게이고',
    publisher: '현대문학',
    image: 'https://picsum.photos/300/400?random=2',
    fallbackImage: 'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=나미야잡화점',
    description: '시간을 초월한 편지를 통해 과거와 현재를 잇는 따뜻한 이야기. 인생의 고민에 대한 진심 어린 답변이 감동을 선사합니다.'
  },
  {
    title: '미드나잇 라이브러리',
    author: '매트 헤이그',
    publisher: '인플루엔셜',
    image: 'https://picsum.photos/300/400?random=3',
    fallbackImage: 'https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=미드나잇',
    description: '삶과 죽음 사이에 존재하는 미드나잇 라이브러리. 다른 삶을 살아볼 수 있는 기회를 통해 진정한 행복의 의미를 찾아가는 이야기.'
  },
  {
    title: '불편한 편의점',
    author: '김호연',
    publisher: '나무옆의자',
    image: 'https://picsum.photos/300/400?random=4',
    fallbackImage: 'https://via.placeholder.com/300x400/FFEAA7/FFFFFF?text=불편한편의점',
    description: '서울역 노숙인과 편의점 알바생들이 만들어가는 따뜻한 이야기. 불편하지만 정이 넘치는 편의점에서 펼쳐지는 감동 드라마.'
  },
  {
    title: '어린 왕자',
    author: '생텍쥐페리',
    publisher: '열린책들',
    image: 'https://picsum.photos/300/400?random=5',
    fallbackImage: 'https://via.placeholder.com/300x400/DDA0DD/FFFFFF?text=어린왕자',
    description: '어른이 되어서도 잊지 말아야 할 순수함과 사랑에 대한 이야기. 시대를 초월한 감동을 선사하는 영원한 고전.'
  },
  {
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    image: 'https://picsum.photos/300/400?random=6',
    fallbackImage: 'https://via.placeholder.com/300x400/98D8C8/FFFFFF?text=데미안',
    description: '한 소년이 진정한 자아를 찾아가는 성장 이야기. "새는 알에서 나오려고 투쟁한다"라는 명언으로 유명한 작품.'
  },
  {
    title: '역행자',
    author: '자청',
    publisher: '웅진지식하우스',
    image: 'https://picsum.photos/300/400?random=7',
    fallbackImage: 'https://via.placeholder.com/300x400/F7DC6F/FFFFFF?text=역행자',
    description: '평범한 사람이 부자가 되는 7단계 인생 공략법. 돈, 시간, 정신의 자유를 얻고 싶은 사람들을 위한 실용적인 지침서.'
  },
  {
    title: '원씽',
    author: '게리 켈러',
    publisher: '비즈니스북스',
    image: 'https://picsum.photos/300/400?random=8',
    fallbackImage: 'https://via.placeholder.com/300x400/FF6B6B/FFFFFF?text=원씽',
    description: '복잡한 세상을 이기는 단순함의 힘. 가장 중요한 한 가지에 집중하여 놀라운 결과를 만들어내는 방법.'
  },
  {
    title: '지적 대화를 위한 넓고 얕은 지식',
    author: '채사장',
    publisher: '웨일북',
    image: 'https://picsum.photos/300/400?random=9',
    fallbackImage: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=지적대화',
    description: '역사, 경제, 정치, 사회, 윤리 전 분야를 아우르는 지식 입문서. 세상을 보는 눈을 넓히고 싶은 사람들을 위한 교양서.'
  },
  {
    title: '사피엔스',
    author: '유발 하라리',
    publisher: '김영사',
    image: 'https://picsum.photos/300/400?random=10',
    fallbackImage: 'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=사피엔스',
    description: '인류의 역사를 새롭게 해석한 대작. 7만 년 전 호모 사피엔스가 어떻게 지구의 지배자가 되었는지 탐구하는 책.'
  },
  {
    title: '코스모스',
    author: '칼 세이건',
    publisher: '사이언스북스',
    image: 'https://picsum.photos/300/400?random=11',
    fallbackImage: 'https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=코스모스',
    description: '우주와 인간의 관계를 탐구하는 과학 교양서의 고전. 광대한 우주 속 우리의 위치와 의미를 생각하게 하는 책.'
  },
  {
    title: '총, 균, 쇠',
    author: '재레드 다이아몬드',
    publisher: '문학사상',
    image: 'https://picsum.photos/300/400?random=12',
    fallbackImage: 'https://via.placeholder.com/300x400/FFEAA7/FFFFFF?text=총균쇠',
    description: '인류 문명의 불균형한 발전을 지리학적 관점에서 분석한 역작. 퓰리처상 수상작.'
  },
  {
    title: '호밀밭의 파수꾼',
    author: 'J.D. 샐린저',
    publisher: '민음사',
    image: 'https://picsum.photos/300/400?random=13',
    fallbackImage: 'https://via.placeholder.com/300x400/DDA0DD/FFFFFF?text=호밀밭',
    description: '10대 소년 홀든 콜필드의 방황과 성장을 그린 미국 문학의 고전. 청춘의 불안과 고민을 생생하게 담아낸 작품.'
  },
  {
    title: '1984',
    author: '조지 오웰',
    publisher: '민음사',
    image: 'https://picsum.photos/300/400?random=14',
    fallbackImage: 'https://via.placeholder.com/300x400/98D8C8/FFFFFF?text=1984',
    description: '전체주의 사회의 공포를 그린 디스토피아 소설의 대표작. 빅 브라더가 지배하는 감시 사회의 모습을 섬뜩하게 그려냄.'
  },
  {
    title: '죽은 시인의 사회',
    author: 'N.H. 클라인바움',
    publisher: '서교출판사',
    image: 'https://picsum.photos/300/400?random=15',
    fallbackImage: 'https://via.placeholder.com/300x400/F7DC6F/FFFFFF?text=죽은시인',
    description: '자유로운 영혼을 가진 교사와 학생들의 이야기. "카르페 디엠(Carpe Diem)" 현재를 즐기라는 메시지를 전한다.'
  }
];

// 더미 도서 데이터 생성
const generateDummyBooks = (query, count = 20) => {
  const dummyBooks = [];
  const usedIndexes = new Set();
  
  // 랜덤하게 도서 선택
  while (dummyBooks.length < count && dummyBooks.length < bookDatabase.length) {
    const randomIndex = Math.floor(Math.random() * bookDatabase.length);
    
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      const book = bookDatabase[randomIndex];
      
      dummyBooks.push({
        title: book.title,
        link: `https://search.naver.com/book/${randomIndex}`,
        image: book.image,
        fallbackImage: book.fallbackImage,
        author: book.author,
        price: Math.floor(Math.random() * 20000) + 10000,
        discount: Math.floor(Math.random() * 18000) + 9000,
        publisher: book.publisher,
        pubdate: `20${20 + Math.floor(Math.random() * 5)}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}01`,
        isbn: `97889${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        description: book.description
      });
    }
  }
  
  // 부족한 수만큼 중복 허용하여 채우기
  while (dummyBooks.length < count) {
    const randomIndex = Math.floor(Math.random() * bookDatabase.length);
    const book = bookDatabase[randomIndex];
    
    dummyBooks.push({
      title: `${book.title} (${query || '추천'})`,
      link: `https://search.naver.com/book/${dummyBooks.length}`,
      image: book.image,
      fallbackImage: book.fallbackImage,
      author: book.author,
      price: Math.floor(Math.random() * 20000) + 10000,
      discount: Math.floor(Math.random() * 18000) + 9000,
      publisher: book.publisher,
      pubdate: `20${20 + Math.floor(Math.random() * 5)}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}01`,
      isbn: `97889${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      description: book.description
    });
  }
  
  return dummyBooks;
};

// 도서 검색 (Google Books API + 더미 데이터 조합)
export const searchBooks = async (query, display = 20, start = 1) => {
  try {
    // Google Books API로 실제 도서 검색
    const googleBooks = await searchGoogleBooks(query, Math.min(display, 10));
    
    // 더미 데이터도 함께 사용 (검색 결과 보강)
    const dummyBooks = generateDummyBooks(query, Math.max(display - googleBooks.length, 5));
    
    // 두 데이터 소스 결합
    const combinedBooks = [...googleBooks, ...dummyBooks].slice(0, display);
    
    return filterValidBooks(combinedBooks);
  } catch (error) {
    console.error('도서 검색 실패:', error);
    // 에러 시에는 더미 데이터만 반환
    const books = generateDummyBooks(query, display);
    return filterValidBooks(books);
  }
};

// 베스트셀러 도서 목록 (Google Books API + 더미 데이터)
export const getBestsellerBooks = async (categoryId = 100) => {
  try {
    // 카테고리별 베스트셀러 더미 데이터
    const categoryNames = {
      100: '종합',
      101: '소설',
      102: '시/에세이',
      103: '인문',
      104: '자기계발',
      105: '경제/경영'
    };
    
    const categoryName = categoryNames[categoryId] || '베스트셀러';
    
    // Google Books API에서 베스트셀러 근사치 가져오기
    const googleBooks = await getGoogleBestsellers(10);
    
    // 더미 데이터로 보강
    const dummyBooks = generateDummyBooks(categoryName, Math.max(20 - googleBooks.length, 10));
    
    // 결합
    const combinedBooks = [...googleBooks, ...dummyBooks].slice(0, 20);
    
    return filterValidBooks(combinedBooks);
  } catch (error) {
    console.error('베스트셀러 도서 불러오기 실패:', error);
    return generateDummyBooks('베스트셀러', 20);
  }
};

// 신간 도서 목록
export const getNewBooks = async (categoryId = 100) => {
  try {
    const books = generateDummyBooks('신간', 20);
    return filterValidBooks(books);
  } catch (error) {
    console.error('신간 도서 불러오기 실패:', error);
    return generateDummyBooks('신간', 20);
  }
};

// 추천용 인기 도서 TOP 200 가져오기
export const getTop200Books = async () => {
  try {
    const books = [];
    const categories = [100, 101, 102, 103, 104, 105];
    
    // 각 카테고리별로 베스트셀러 가져오기
    for (const categoryId of categories) {
      const categoryBooks = await getBestsellerBooks(categoryId);
      books.push(...categoryBooks.slice(0, 35)); // 각 카테고리당 35권씩
    }
    
    return books.slice(0, 200);
  } catch (error) {
    console.error('TOP 200 도서 불러오기 실패:', error);
    return generateDummyBooks('인기', 200);
  }
};

// 도서 상세 정보 (더미 데이터)
export const getBookDetails = async (isbn) => {
  try {
    const books = generateDummyBooks('상세', 1);
    const book = books[0];
    
    // 상세 정보 추가
    book.isbn = isbn;
    book.toc = `제1장 시작하기\n제2장 기초 다지기\n제3장 심화 학습\n제4장 실전 응용\n제5장 마무리`;
    book.authorInfo = '저자는 해당 분야의 전문가로 20년 이상의 경력을 보유하고 있습니다.';
    book.bookInfo = '이 책은 독자들에게 새로운 관점과 깊이 있는 통찰을 제공합니다.';
    
    return book;
  } catch (error) {
    console.error('도서 상세 정보 불러오기 실패:', error);
    return null;
  }
};

// 유효한 도서 필터링
const isValidBook = (book) => {
  return (
    book &&
    book.title && // 제목이 있음
    book.description && // 설명이 있음
    book.image && // 이미지가 있음
    book.author // 저자가 있음
    // book.adult 조건 제거하여 더 많은 도서 포함
  );
};

// 도서 목록 필터링
const filterValidBooks = (books) => {
  return books.filter(isValidBook);
};

// 카테고리별 도서 검색
export const getBooksByCategory = async (categoryId, page = 1) => {
  try {
    const start = (page - 1) * 20 + 1;
    const books = generateDummyBooks(`카테고리${categoryId}`, 20);
    return filterValidBooks(books);
  } catch (error) {
    console.error('카테고리별 도서 검색 실패:', error);
    return [];
  }
};

// 저자별 도서 검색
export const getBooksByAuthor = async (author, page = 1) => {
  try {
    return searchBooks(author, 20, (page - 1) * 20 + 1);
  } catch (error) {
    console.error('저자별 도서 검색 실패:', error);
    return [];
  }
};

// 출판사별 도서 검색
export const getBooksByPublisher = async (publisher, page = 1) => {
  try {
    return searchBooks(publisher, 20, (page - 1) * 20 + 1);
  } catch (error) {
    console.error('출판사별 도서 검색 실패:', error);
    return [];
  }
};
