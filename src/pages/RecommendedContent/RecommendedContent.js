// 추천 받은 컨텐츠 페이지

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useContentType } from '../../contexts/ContentTypeContext';
import { getRecommendedContent, getAllUsers, markContentAsViewed, removeFromRecommendation } from '../../utils/localStorage';
import ContentCard from '../../components/content/ContentCard';
import './RecommendedContent.css';

const RecommendedContent = () => {
    const { user, loading } = useAuth();
    const { isMovieMode } = useContentType();
    const [recommendations, setRecommendations] = useState([]);
    const [showUnviewedOnly, setShowUnviewedOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user) {
            loadRecommendations();
        }
    }, [user, isMovieMode, showUnviewedOnly]);

    const loadRecommendations = () => {
        const userRecommendations = getRecommendedContent(user.id);

        // 현재 컨텐츠 타입으로 필터링
        let filteredList = userRecommendations.filter(item =>
            item.type === (isMovieMode ? 'movie' : 'book')
        );

        // 확인하지 않은 것만 보기 필터
        if (showUnviewedOnly) {
            filteredList = filteredList.filter(item => !item.viewed);
        }

        // 최신순으로 정렬
        filteredList.sort((a, b) =>
            new Date(b.recommendedAt) - new Date(a.recommendedAt)
        );

        setRecommendations(filteredList);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로
    };

    const getRecommenderName = (fromUserId) => {
        const users = getAllUsers();
        const recommender = users.find(u => u.id === fromUserId);
        return recommender ? recommender.name : '알 수 없는 사용자';
    };

    const handleContentClick = (contentId) => {
        // 컨텐츠 클릭 시 조회 처리
        markContentAsViewed(user.id, contentId);
        loadRecommendations(); // 리스트 새로고침
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
    const totalPages = Math.ceil(recommendations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = recommendations.slice(startIndex, endIndex);
    const unviewedCount = recommendations.filter(r => !r.viewed).length;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const removeAllRecommendations = () => {
        if (!window.confirm('이미 확인된 추천 컨텐츠를 삭제하시겠습니까?')) {
            return;
        }

        const content = recommendations.filter(item => !item.viewed);

        removeFromRecommendation(user.id, content.id, isMovieMode ? 'movie' : 'book', content);
        loadRecommendations();
    };

    return (
        <div className="recommended-page">
            <div className="recommended-header">
                <h1>추천 받은 컨텐츠</h1>
                <p className="recommended-subtitle">
                    친구들이 추천한 {isMovieMode ? '영화' : '도서'} 목록
                    {unviewedCount > 0 && (
                        <span className="unviewed-badge">{unviewedCount}개의 새로운 추천</span>
                    )}
                </p>
            </div>

            {/* 필터 옵션 */}
            <div className="recommended-filters">
                <div className="recommended-count">
                    총 {recommendations.length}개
                </div>

                <label className="filter-checkbox">
                    <input
                        type="checkbox"
                        checked={showUnviewedOnly}
                        onChange={(e) => setShowUnviewedOnly(e.target.checked)}
                    />
                    <span>확인하지 않은 컨텐츠만 보기</span>

                    <button className="remove-all-button" onClick={() => removeAllRecommendations()}>
                        이미 확인된 추천 컨텐츠 모두 삭제
                    </button>
                </label>
            </div>

            {/* 추천 컨텐츠 목록 */}
            {currentItems.length > 0 ? (
                <>
                    <div className="recommended-grid">
                        {currentItems.map((item) => (
                            <div
                                key={`${item.type}_${item.id}_${item.recommendedAt}`}
                                className="recommended-item-wrapper"
                                onClick={() => handleContentClick(item.id)}
                            >
                                <ContentCard
                                    content={item}
                                    type={item.type}
                                />
                                <div className="recommendation-info">
                                    <span className="recommender-name">
                                        {getRecommenderName(item.from)}님이 추천
                                    </span>
                                    <span className="recommendation-date">
                                        {new Date(item.recommendedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {!item.viewed && <span className="new-indicator">NEW</span>}
                            </div>
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
                <div className="empty-recommended">
                    <div className="empty-icon">📭</div>
                    <h2>추천 받은 컨텐츠가 없습니다</h2>
                    <p>
                        {showUnviewedOnly
                            ? '모든 추천 컨텐츠를 확인했습니다!'
                            : '친구들에게 컨텐츠를 추천받아보세요!'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecommendedContent;
