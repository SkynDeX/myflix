// 위시리스트 페이지

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContentType } from '../contexts/ContentTypeContext';
import { getWishlist, getUserReview } from '../utils/localStorage';
import ContentCard from '../components/content/ContentCard';
import './Wishlist.css';

const Wishlist = () => {
    const { user, loading } = useAuth();
    const { isMovieMode } = useContentType();
    const [wishlist, setWishlist] = useState([]);
    const [showReviewedOnly, setShowReviewedOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user) {
            loadWishlist();
        }
    }, [user, isMovieMode, showReviewedOnly]);

    const loadWishlist = () => {
        const userWishlist = getWishlist(user.id);
        // 현재 컨텐츠 타입으로 필터링
        let filteredList = userWishlist.filter(item =>
            item.type === (isMovieMode ? 'movie' : 'book')
        );

        // 리뷰한 것만 보기 필터
        if (showReviewedOnly) {
            filteredList = filteredList.filter(item => {
                const review = getUserReview(user.id, item.id, item.type);
                return review !== undefined;
            });
        }

        setWishlist(filteredList);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로
    };

    // 로딩 중일 때는 아무것도 렌더링하지 않습니다.
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>컨텐츠를 불러오는 중...</p>
            </div>
        );
    }

    // 로딩이 끝났는데도 user가 null이면 로그인 페이지로 리디렉션합니다.
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 페이지네이션 계산
    const totalPages = Math.ceil(wishlist.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = wishlist.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>위시리스트</h1>
                <p className="wishlist-subtitle">
                    내가 찜한 {isMovieMode ? '영화' : '도서'} 목록
                </p>
            </div>

            {/* 필터 옵션 */}
            <div className="wishlist-filters">
                <label className="filter-checkbox">
                    <input
                        type="checkbox"
                        checked={showReviewedOnly}
                        onChange={(e) => setShowReviewedOnly(e.target.checked)}
                    />
                    <span>내가 리뷰한 컨텐츠만 보기</span>
                </label>
                <div className="wishlist-count">
                    총 {wishlist.length}개
                </div>
            </div>

            {/* 위시리스트 컨텐츠 */}
            {currentItems.length > 0 ? (
                <>
                    <div className="wishlist-grid">
                        {currentItems.map((item) => (
                            <ContentCard
                                key={`${item.type}_${item.id}`}
                                content={item}
                                type={item.type}
                            />
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                이전
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-wishlist">
                    <div className="empty-icon">💔</div>
                    <h2>위시리스트가 비어있습니다</h2>
                    <p>
                        {showReviewedOnly
                            ? '아직 리뷰를 작성한 컨텐츠가 없습니다.'
                            : `마음에 드는 ${isMovieMode ? '영화' : '도서'}를 추가해보세요!`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
