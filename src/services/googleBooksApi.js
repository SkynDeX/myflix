// Google Books API 연동 모듈
import axios from 'axios';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

// Google Books API를 통한 도서 검색
export const searchGoogleBooks = async (query, maxResults = 20, startIndex = 0) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: query,
        maxResults,
        startIndex,
        langRestrict: 'ko', // 한국어 도서 우선
        printType: 'books'
      }
    });

    if (response.data.items) {
      return response.data.items.map(item => formatGoogleBookData(item));
    }
    return [];
  } catch (error) {
    console.error('Google Books API 검색 실패:', error);
    return [];
  }
};

// Google Books API 데이터를 앱 형식에 맞게 변환
const formatGoogleBookData = (item) => {
  const volumeInfo = item.volumeInfo;
  const saleInfo = item.saleInfo;
  
  return {
    title: volumeInfo.title || '',
    link: volumeInfo.infoLink || '',
    image: getHighQualityImage(volumeInfo.imageLinks),
    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : '',
    price: saleInfo.listPrice ? saleInfo.listPrice.amount : Math.floor(Math.random() * 20000) + 10000,
    discount: saleInfo.retailPrice ? saleInfo.retailPrice.amount : Math.floor(Math.random() * 18000) + 9000,
    publisher: volumeInfo.publisher || '',
    pubdate: volumeInfo.publishedDate || '',
    isbn: getISBN(volumeInfo.industryIdentifiers),
    description: volumeInfo.description || volumeInfo.subtitle || '',
    category: volumeInfo.categories ? volumeInfo.categories[0] : '',
    pageCount: volumeInfo.pageCount || 0,
    language: volumeInfo.language || 'ko',
    rating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0
  };
};

// 고화질 이미지 URL 선택
const getHighQualityImage = (imageLinks) => {
  if (!imageLinks) return null;
  
  // 사용 가능한 이미지 중 가장 고화질 선택
  return imageLinks.large || 
         imageLinks.medium || 
         imageLinks.small || 
         imageLinks.thumbnail || 
         imageLinks.smallThumbnail || 
         null;
};

// ISBN 추출
const getISBN = (industryIdentifiers) => {
  if (!industryIdentifiers) return '';
  
  // ISBN_13 우선, 없으면 ISBN_10
  const isbn13 = industryIdentifiers.find(id => id.type === 'ISBN_13');
  const isbn10 = industryIdentifiers.find(id => id.type === 'ISBN_10');
  
  return isbn13?.identifier || isbn10?.identifier || '';
};

// 카테고리별 도서 검색
export const getGoogleBooksByCategory = async (category, maxResults = 20) => {
  const categoryQueries = {
    'fiction': 'subject:fiction',
    'non-fiction': 'subject:non-fiction',
    'poetry': 'subject:poetry',
    'philosophy': 'subject:philosophy',
    'self-help': 'subject:self-help',
    'business': 'subject:business',
    'science': 'subject:science',
    'history': 'subject:history',
    'biography': 'subject:biography',
    'romance': 'subject:romance'
  };
  
  const query = categoryQueries[category] || category;
  return searchGoogleBooks(query, maxResults);
};

// 저자별 도서 검색
export const getGoogleBooksByAuthor = async (author, maxResults = 20) => {
  return searchGoogleBooks(`inauthor:${author}`, maxResults);
};

// 출판사별 도서 검색
export const getGoogleBooksByPublisher = async (publisher, maxResults = 20) => {
  return searchGoogleBooks(`inpublisher:${publisher}`, maxResults);
};

// 베스트셀러 근사치 (인기 도서)
export const getGoogleBestsellers = async (maxResults = 20) => {
  // Google Books에서는 베스트셀러 목록을 제공하지 않으므로
  // 평점이 높고 리뷰가 많은 도서들을 검색
  const queries = [
    '인기 소설',
    '베스트셀러',
    '추천 도서',
    '스테디셀러'
  ];
  
  const allBooks = [];
  for (const query of queries) {
    const books = await searchGoogleBooks(query, 10);
    allBooks.push(...books);
  }
  
  // 중복 제거 및 평점 순 정렬
  const uniqueBooks = allBooks.filter((book, index, self) => 
    index === self.findIndex(b => b.isbn === book.isbn && book.isbn !== '')
  );
  
  return uniqueBooks
    .sort((a, b) => (b.rating * b.ratingsCount) - (a.rating * a.ratingsCount))
    .slice(0, maxResults);
};

// 도서 상세 정보 조회
export const getGoogleBookDetails = async (bookId) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes/${bookId}`);
    return formatGoogleBookData(response.data);
  } catch (error) {
    console.error('Google Books 상세 정보 불러오기 실패:', error);
    return null;
  }
};

// ISBN으로 도서 검색
export const getGoogleBookByISBN = async (isbn) => {
  try {
    const books = await searchGoogleBooks(`isbn:${isbn}`, 1);
    return books[0] || null;
  } catch (error) {
    console.error('ISBN으로 도서 검색 실패:', error);
    return null;
  }
};