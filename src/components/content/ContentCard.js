// ContentCard 컴포넌트 - 영화/도서 카드

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../services/tmdbApi';
import {
    addToWishlist,
    getMyPlaylists,
    getWishlist,
    removeFromWishlist
} from '../../utils/localStorage';
import PlaylistModal from '../modals/PlaylistModal';
import RecommendModal from '../modals/RecommendModal';
import './ContentCard.css';

const ContentCard = ({ content, type }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showRecommendModal, setShowRecommendModal] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    // content prop 검증 - early return을 useEffect 이후로 이동
    useEffect(() => {
        if (user && content) {
            const wishlist = getWishlist(user.id);
            const contentId = type === 'movie' ? content.id : (content.isbn ? content.isbn : content.id);
            setIsInWishlist(wishlist.some(item => item.id === contentId && item.type === type));
        }
    }, [user, content, type]);

    // content prop 검증 - early return을 useEffect 이후로 이동
    if (!content) {
        console.error('ContentCard: content prop이 없습니다');
        return null;
    }

    // 위시리스트 토글
    const handleWishlistToggle = (e) => {
        e.stopPropagation();

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
                image: type === 'movie' ? getImageUrl(content.poster_path) : content.image,
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

    // 컨텐츠 상세 보기
    const handleCardClick = () => {
        const contentId = type === 'movie' ? content.id : (content.isbn ? content.isbn : content.id);
        navigate(`/content/${type}/${contentId}`);
    };

    // 이미지 URL 가져오기
    const getContentImage = () => {
        if (type === 'movie') {
            if (content.poster_path) {
                return getImageUrl(content.poster_path, 'w342');
            } else if (content.image) {
                return getImageUrl(content.image, 'w342');
            } else {
                // 포스터가 없는 경우 기본 이미지 사용
                return 'https://picsum.photos/300/400';
            }
        }
        return content.image || 'https://picsum.photos/300/400';
    };

    // 제목 가져오기
    const getTitle = () => {
        if (!content) return '제목 없음';
        return content.title || content.name || content.original_title || '제목 없음';
    };

    // 설명 가져오기
    const getDescription = () => {
        if (!content) return '';
        const desc = content.overview || content.description || content.synopsis || '';
        return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    };

    return (
        <>
            <div className="content-card" onClick={handleCardClick}>
                <div className="content-card-image">
                    <img src={getContentImage()} alt={getTitle()} />
                    <div className="content-card-overlay">
                        <p className="content-card-description">{getDescription()}</p>
                    </div>
                </div>

                <div className="content-card-info">
                    <h3 className="content-card-title">{getTitle()}</h3>

                    <div className="content-card-actions">
                        <button
                            className={`action-button wishlist-button ${isInWishlist ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                            title={isInWishlist ? '위시리스트에서 제거' : '위시리스트에 추가'}
                        >
                            {isInWishlist ? '❤️' : '🤍'}
                        </button>

                        <button
                            className="action-button recommend-button"
                            onClick={handleRecommend}
                            title="친구에게 추천하기"
                        >
                            👥
                        </button>

                        <button
                            className="action-button playlist-button"
                            onClick={handleAddToPlaylist}
                            title="내가 만든 추천 리스트에 추가"
                        >
                            📋
                        </button>
                    </div>
                </div>
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
        </>
    );
};

export default ContentCard;
