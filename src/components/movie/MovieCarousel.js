// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getTmdbImageUrl } from '../../services/api';
// import './MovieCarousel.css';

// const MovieCarousel = ({ movies }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(true);

//     useEffect(() => {
//         if (!isPlaying || !movies.length) return;

//         const interval = setInterval(() => {
//             setCurrentIndex((prevIndex) =>
//                 prevIndex === movies.length - 1 ? 0 : prevIndex + 1
//             );
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [currentIndex, isPlaying, movies.length]);

//     const goToSlide = (index) => {
//         setCurrentIndex(index);
//     };

//     const goToPrev = () => {
//         setCurrentIndex(currentIndex === 0 ? movies.length - 1 : currentIndex - 1);
//     };

//     const goToNext = () => {
//         setCurrentIndex(currentIndex === movies.length - 1 ? 0 : currentIndex + 1);
//     };

//     if (!movies.length) {
//         return (
//             <div className="movie-carousel">
//                 <div className="carousel-placeholder">
//                     <p>영화를 불러오는 중...</p>
//                 </div>
//             </div>
//         );
//     }

//     const currentMovie = movies[currentIndex];
//     const backdropUrl = getTmdbImageUrl(currentMovie.backdrop_path, 'w1280');
//     const posterUrl = getTmdbImageUrl(currentMovie.poster_path, 'w342');

//     return (
//         <div className="movie-carousel">
//             <div className="carousel-container">
//                 <div
//                     className="carousel-slide"
//                     style={{
//                         backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none'
//                     }}
//                 >
//                     <div className="carousel-overlay">
//                         <div className="carousel-content">
//                             <div className="movie-poster">
//                                 {posterUrl ? (
//                                     <img src={posterUrl} alt={currentMovie.title} />
//                                 ) : (
//                                     <div className="poster-placeholder">
//                                         <span>📽️</span>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="movie-details">
//                                 <h1 className="movie-title">{currentMovie.title}</h1>

//                                 <div className="movie-meta">
//                                     {currentMovie.release_date && (
//                                         <span className="release-year">
//                                             {new Date(currentMovie.release_date).getFullYear()}
//                                         </span>
//                                     )}

//                                     {currentMovie.vote_average > 0 && (
//                                         <span className="rating">
//                                             ⭐ {Math.round(currentMovie.vote_average * 10) / 10}
//                                         </span>
//                                     )}
//                                 </div>

//                                 {currentMovie.overview && (
//                                     <p className="movie-overview">
//                                         {currentMovie.overview.length > 200
//                                             ? `${currentMovie.overview.substring(0, 200)}...`
//                                             : currentMovie.overview
//                                         }
//                                     </p>
//                                 )}

//                                 <div className="carousel-actions">
//                                     <Link
//                                         to={`/movie/${currentMovie.id}`}
//                                         className="btn btn-primary"
//                                     >
//                                         자세히 보기
//                                     </Link>

//                                     <button
//                                         className="btn btn-secondary"
//                                         onClick={() => setIsPlaying(!isPlaying)}
//                                     >
//                                         {isPlaying ? '일시정지' : '재생'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 네비게이션 화살표 */}
//                 <button className="carousel-nav prev" onClick={goToPrev}>
//                     &#8249;
//                 </button>
//                 <button className="carousel-nav next" onClick={goToNext}>
//                     &#8250;
//                 </button>

//                 {/* 인디케이터 */}
//                 <div className="carousel-indicators">
//                     {movies.map((_, index) => (
//                         <button
//                             key={index}
//                             className={`indicator ${index === currentIndex ? 'active' : ''}`}
//                             onClick={() => goToSlide(index)}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MovieCarousel;