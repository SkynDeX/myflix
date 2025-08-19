// 컨텐츠 상세 페이지

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getGoogleBookByISBN } from '../services/googleBooksApi';
import { getImageUrl, getMovieDetails, getSimilarMovies } from '../services/tmdbApi';

import ContentCard from '../components/content/ContentCard';
import PlaylistModal from '../components/modals/PlaylistModal';
import RecommendModal from '../components/modals/RecommendModal';
import {
    addReview,
    addToWishlist,
    getMyPlaylists,
    getUserReview,
    getWishlist,
    removeFromWishlist
} from '../utils/localStorage';
import './ContentDetail.css';

const ContentDetail = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [content, setContent] = useState(null);
    const [similarContent, setSimilarContent] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showRecommendModal, setShowRecommendModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        text: ''
    });

    useEffect(() => {
        loadContent();
    }, [type, id]);

    useEffect(() => {
        if (user && content) {
            checkWishlistStatus();
            loadUserReview();
        }
    }, [user, content]);

    const loadContent = async () => {
        setLoading(true);
        try {
            if (type === 'movie') {
                const movieData = await getMovieDetails(id);
                setContent(movieData);
                // 비슷한 영화 로드
                const similar = await getSimilarMovies(id);
                setSimilarContent(similar.slice(0, 5));
            } else if (type === 'book') {
                const bookData = await getGoogleBookByISBN(id);
                setContent(bookData);
                setSimilarContent([]); // 도서는 비슷한 컨텐츠 미제공
            }
        } catch (error) {
            console.error('컨텐츠 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = () => {
        const wishlist = getWishlist(user.id);
        setIsInWishlist(wishlist.some(item =>
            item.id === (type === 'movie' ? content.id : content.isbn) &&
            item.type === type
        ));
    };

    const loadUserReview = () => {
        const review = getUserReview(
            user.id,
            type === 'movie' ? content.id : content.isbn,
            type
        );
        if (review) {
            setUserReview(review);
            setReviewData({
                rating: review.rating,
                text: review.text
            });
        }
    };

    const handleWishlistToggle = () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        const contentId = type === 'movie' ? content.id : content.isbn;

        if (isInWishlist) {
            removeFromWishlist(user.id, contentId, type);
            setIsInWishlist(false);
        } else {
            const wishlistItem = {
                id: contentId,
                type: type,
                title: content.title,
                image: type === 'movie' ? content.poster_path : content.image,
                description: content.overview || content.description
            };
            addToWishlist(user.id, wishlistItem);
            setIsInWishlist(true);
        }
    };

    // 친구에게 추천
    const handleRecommend = (e) => {
        e.stopPropagation();

        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        setShowRecommendModal(true);
    };

    // 플레이리스트에 추가
    const handleAddToPlaylist = (e) => {
        e.stopPropagation();

        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        const myPlaylists = getMyPlaylists(user.id);
        if (myPlaylists.length === 0) {
            alert('먼저 나만의 추천 리스트를 만들어주세요.');
            navigate('/my-playlists');
            return;
        }

        setShowPlaylistModal(true);
    };

    const handleReviewSubmit = () => {
        if (!reviewData.rating) {
            alert('별점을 선택해주세요.');
            return;
        }

        const review = addReview(
            user.id,
            type === 'movie' ? content.id : content.isbn,
            type,
            {
                rating: reviewData.rating,
                text: reviewData.text
            }
        );

        setUserReview(review);
        setShowReviewModal(false);
        alert('리뷰가 등록되었습니다!');
    };

    const handleRefresh = () => {
        navigate('/recommend/random');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>컨텐츠를 불러오는 중...</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="error-container">
                <h2>컨텐츠를 찾을 수 없습니다</h2>
                <button onClick={() => navigate(-1)}>돌아가기</button>
            </div>
        );
    }

    // 예고편/티저 영상 찾기 (영화인 경우)
    const getTrailer = () => {
        if (type === 'movie' && content.videos && content.videos.results) {
            return content.videos.results.find(
                video => video.type === 'Trailer' || video.type === 'Teaser'
            );
        }
        return null;
    };

    const trailer = getTrailer();

    return (
        <div className="content-detail">
            {/* 배경 이미지 (영화인 경우) */}
            {type === 'movie' && content.backdrop_path && (
                <div
                    className="content-backdrop"
                    style={{ backgroundImage: `url(${getImageUrl(content.backdrop_path, 'original')})` }}
                >
                    <div className="backdrop-overlay"></div>
                </div>
            )}

            <div className="content-detail-container">
                {/* 새로고침 버튼 */}
                <button className="refresh-button" onClick={handleRefresh}>
                    🎲 다른 {type === 'movie' ? '영화' : '도서'} 추천
                </button>

                <div className="content-main">
                    {/* 포스터/이미지 */}
                    <div className="content-poster">
                        <img
                            src={type === 'movie' ? getImageUrl(content.poster_path) : content.image}
                            alt={content.title}
                        />
                        {user && (
                            <>
                                <button
                                    className={`mypage-toggle-button ${isInWishlist ? 'active' : ''}`}
                                    onClick={handleWishlistToggle}
                                >
                                    {isInWishlist ? '❤️ 위시리스트에서 제거' : '🤍 위시리스트에 추가'}
                                </button>
                                <button
                                    className={'mypage-toggle-button'}
                                    onClick={handleRecommend}
                                >
                                    👥 친구에게 추천
                                </button>
                                <button
                                    className={'mypage-toggle-button'}
                                    onClick={handleAddToPlaylist}
                                >
                                    📋 내가 만든 추천 리스트에 추가
                                </button>
                            </>
                        )}
                    </div>

                    {/* 정보 */}
                    <div className="content-info">
                        <h1 className="content-title">{content.title}</h1>

                        {/* 메타 정보 */}
                        <div className="content-meta">
                            {type === 'movie' ? (
                                <>
                                    <span className="meta-item">⭐ {content.vote_average?.toFixed(1)}/10</span>
                                    <span className="meta-item">📅 {content.release_date?.substring(0, 4)}</span>
                                    <span className="meta-item">⏱️ {content.runtime}분</span>
                                </>
                            ) : (
                                <>
                                    <span className="meta-item">✍️ {content.author}</span>
                                    <span className="meta-item">📚 {content.publisher}</span>
                                    {/* <span className="meta-item">💰 {content.price?.toLocaleString()}원</span> */}
                                </>
                            )}
                        </div>

                        {/* 장르 (영화인 경우) */}
                        {type === 'movie' && content.genres && (
                            <div className="content-genres">
                                {content.genres.map(genre => (
                                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                                ))}
                            </div>
                        )}

                        {/* 설명 */}
                        <div className="content-description">
                            <h2>줄거리</h2>
                            <p>{content.overview || content.description}</p>
                        </div>

                        {/* 추가 정보 */}
                        {type === 'movie' && content.credits && (
                            <div className="content-cast">
                                <h3>주요 출연진</h3>
                                <div className="cast-list">
                                    {content.credits.cast?.slice(0, 5).map(actor => (
                                        <div key={actor.id} className="cast-item">
                                            <span className="cast-name">{actor.name}</span>
                                            <span className="cast-character">{actor.character}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {type === 'book' && content.toc && (
                            <div className="book-toc">
                                <h3>목차</h3>
                                <pre>{content.toc}</pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* 예고편 (영화인 경우) */}
                {trailer && (
                    <div className="content-trailer">
                        <h2>예고편</h2>
                        <div className="video-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title={trailer.name}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* 나의 리뷰 */}
                {user && (
                    <div className="user-review-section">
                        <h2>나의 리뷰</h2>
                        {userReview ? (
                            <div className="user-review">
                                <div className="review-rating">
                                    {'⭐'.repeat(userReview.rating)} {userReview.rating}/5
                                </div>
                                <p className="review-text">{userReview.text || '(리뷰 내용 없음)'}</p>
                                <button
                                    className="edit-review-button"
                                    onClick={() => setShowReviewModal(true)}
                                >
                                    리뷰 수정
                                </button>
                            </div>
                        ) : (
                            <div className="no-review">
                                <p>아직 리뷰를 작성하지 않았습니다.</p>
                                <button
                                    className="write-review-button"
                                    onClick={() => setShowReviewModal(true)}
                                >
                                    리뷰 작성하기
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 비슷한 컨텐츠 (영화인 경우) */}
                {type === 'movie' && similarContent.length > 0 && (
                    <div className="similar-content">
                        <h2>비슷한 영화</h2>
                        <div className="similar-grid">
                            {similarContent.map(item => (
                                <ContentCard
                                    key={item.id}
                                    content={item}
                                    type="movie"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 추천 모달 */}
            {showRecommendModal && (
                <RecommendModal
                    content={content}
                    type={type}
                    onClose={() => setShowRecommendModal(false)}
                />
            )}

            {/* 플레이리스트 모달 */}
            {showPlaylistModal && (
                <PlaylistModal
                    content={content}
                    type={type}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}

            {/* 리뷰 모달 */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{userReview ? '리뷰 수정' : '리뷰 작성'}</h2>
                            <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="rating-select">
                                <label>별점</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            className={`star ${reviewData.rating >= star ? 'active' : ''}`}
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="review-input">
                                <label>리뷰 내용</label>
                                <textarea
                                    value={reviewData.text}
                                    onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                                    placeholder="이 작품에 대한 생각을 자유롭게 작성해주세요"
                                    rows="5"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-button cancel"
                                onClick={() => setShowReviewModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="modal-button confirm"
                                onClick={handleReviewSubmit}
                            >
                                {userReview ? '수정하기' : '등록하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentDetail;
