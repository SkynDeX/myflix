// import React, { useState, useEffect } from 'react';
// import { tmdbService } from '../../services/api';
// import { mockBooks } from '../../services/mockBooks';
// import MovieCarousel from '../../components/movie/MovieCarousel';
// import MovieCard from '../../components/movie/MovieCard';
// import BookList from '../../components/book/BookList';
// import './Home.css';

// const Home = () => {
//     const [activeTab, setActiveTab] = useState('movies');
//     const [carouselMovies, setCarouselMovies] = useState([]);
//     const [popularMovies, setPopularMovies] = useState([]);
//     const [topRatedMovies, setTopRatedMovies] = useState([]);
//     const [popularBooks, setPopularBooks] = useState([]);
//     const [loading, setLoading] = useState({
//         carousel: true,
//         popularMovies: true,
//         topRated: true,
//         books: true
//     });
//     const [error, setError] = useState({});

//     // 영화 데이터 로드
//     const loadMovieData = async () => {
//         try {
//             // 캐러셀용 인기 영화 (상위 10개)
//             const carouselData = await tmdbService.getPopularMovies(1);
//             setCarouselMovies(carouselData.results.slice(0, 10));
//             setLoading(prev => ({ ...prev, carousel: false }));

//             // 인기 영화 목록 (11번째부터 20개)
//             const popularData = await tmdbService.getPopularMovies(1);
//             setPopularMovies(popularData.results.slice(10, 30));
//             setLoading(prev => ({ ...prev, popularMovies: false }));

//             // 최고 평점 영화
//             const topRatedData = await tmdbService.getTopRatedMovies(1);
//             setTopRatedMovies(topRatedData.results.slice(0, 20));
//             setLoading(prev => ({ ...prev, topRated: false }));

//         } catch (err) {
//             console.error('영화 데이터 로드 실패:', err);
//             setError(prev => ({ ...prev, movies: '영화 데이터를 불러올 수 없습니다.' }));
//             setLoading(prev => ({
//                 ...prev,
//                 carousel: false,
//                 popularMovies: false,
//                 topRated: false
//             }));
//         }
//     };

//     // 도서 데이터 로드 (임시로 모킹 데이터 사용)
//     const loadBookData = async () => {
//         try {
//             // 실제 API 대신 모킹 데이터 사용
//             setTimeout(() => {
//                 setPopularBooks(mockBooks.slice(0, 16));
//                 setLoading(prev => ({ ...prev, books: false }));
//             }, 1000); // 로딩 상태 시뮬레이션
//         } catch (err) {
//             console.error('도서 데이터 로드 실패:', err);
//             setError(prev => ({ ...prev, books: '도서 데이터를 불러올 수 없습니다.' }));
//             setLoading(prev => ({ ...prev, books: false }));
//         }
//     };

//     useEffect(() => {
//         loadMovieData();
//     }, []);

//     useEffect(() => {
//         if (activeTab === 'books' && popularBooks.length === 0) {
//             loadBookData();
//         }
//     }, [activeTab, popularBooks.length]);

//     return (
//         <div className="home">
//             <div className="home-hero">
//                 <div className="container">
//                     <div className="hero-content">
//                         <h1>당신만의 특별한 컨텐츠를 찾아보세요</h1>
//                         <p>최신 영화부터 베스트셀러 도서까지, MyFlix에서 모든 것을 발견하세요</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="home-content">
//                 <div className="container">
//                     {/* 탭 네비게이션 */}
//                     <div className="content-tabs">
//                         <button
//                             className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('movies')}
//                         >
//                             🎬 영화
//                         </button>
//                         <button
//                             className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('books')}
//                         >
//                             📚 도서
//                         </button>
//                     </div>

//                     {/* 탭 컨텐츠 */}
//                     <div className="tab-content">
//                         {activeTab === 'movies' ? (
//                             <div className="movies-section">
//                                 {/* 영화 캐러셀 */}
//                                 <div className="carousel-section">
//                                     {loading.carousel ? (
//                                         <div className="carousel-loading">
//                                             <p>인기 영화를 불러오는 중...</p>
//                                         </div>
//                                     ) : error.movies ? (
//                                         <div className="carousel-error">
//                                             <p>{error.movies}</p>
//                                             <button onClick={loadMovieData} className="retry-btn">
//                                                 다시 시도
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <MovieCarousel movies={carouselMovies} />
//                                     )}
//                                 </div>

//                                 {/* 인기 영화 목록 */}
//                                 <div className="movie-section">
//                                     <h2 className="section-title">지금 인기있는 영화</h2>
//                                     {loading.popularMovies ? (
//                                         <div className="movie-grid loading">
//                                             {[...Array(8)].map((_, index) => (
//                                                 <div key={index} className="movie-skeleton">
//                                                     <div className="skeleton-poster"></div>
//                                                     <div className="skeleton-info">
//                                                         <div className="skeleton-title"></div>
//                                                         <div className="skeleton-year"></div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="movie-grid">
//                                             {popularMovies.map((movie) => (
//                                                 <MovieCard key={movie.id} movie={movie} />
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* 최고 평점 영화 */}
//                                 <div className="movie-section">
//                                     <h2 className="section-title">최고 평점 영화</h2>
//                                     {loading.topRated ? (
//                                         <div className="movie-grid loading">
//                                             {[...Array(8)].map((_, index) => (
//                                                 <div key={index} className="movie-skeleton">
//                                                     <div className="skeleton-poster"></div>
//                                                     <div className="skeleton-info">
//                                                         <div className="skeleton-title"></div>
//                                                         <div className="skeleton-year"></div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="movie-grid">
//                                             {topRatedMovies.map((movie) => (
//                                                 <MovieCard key={movie.id} movie={movie} />
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="books-section">
//                                 {error.books ? (
//                                     <div className="error-state">
//                                         <p>{error.books}</p>
//                                         <button onClick={loadBookData} className="retry-btn">
//                                             다시 시도
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <BookList
//                                         books={popularBooks}
//                                         title="인기 도서"
//                                         loading={loading.books}
//                                     />
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;