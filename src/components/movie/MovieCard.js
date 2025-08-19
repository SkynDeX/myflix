// import React from 'react';
// import { Link } from 'react-router-dom';
// import { getTmdbImageUrl } from '../../services/api';
// import './MovieCard.css';

// const MovieCard = ({ movie, size = 'medium' }) => {
//     const posterUrl = getTmdbImageUrl(movie.poster_path, 'w342');
//     const rating = Math.round(movie.vote_average * 10) / 10;

//     return (
//         <div className={`movie-card ${size}`}>
//             <Link to={`/movie/${movie.id}`} className="movie-card-link">
//                 <div className="movie-poster">
//                     {posterUrl ? (
//                         <img
//                             src={posterUrl}
//                             alt={movie.title}
//                             className="poster-image"
//                             loading="lazy"
//                         />
//                     ) : (
//                         <div className="poster-placeholder">
//                             <span>📽️</span>
//                             <p>포스터 없음</p>
//                         </div>
//                     )}

//                     {/* 평점 배지 */}
//                     {movie.vote_average > 0 && (
//                         <div className="rating-badge">
//                             ⭐ {rating}
//                         </div>
//                     )}
//                 </div>

//                 <div className="movie-info">
//                     <h3 className="movie-title" title={movie.title}>
//                         {movie.title}
//                     </h3>

//                     {movie.release_date && (
//                         <p className="movie-year">
//                             {new Date(movie.release_date).getFullYear()}
//                         </p>
//                     )}

//                     {movie.overview && (
//                         <p className="movie-overview">
//                             {movie.overview.length > 80
//                                 ? `${movie.overview.substring(0, 80)}...`
//                                 : movie.overview
//                             }
//                         </p>
//                     )}
//                 </div>
//             </Link>
//         </div>
//     );
// };

// export default MovieCard;