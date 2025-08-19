// 다른 회원들의 추천 리스트 페이지

import React, { useState, useEffect } from 'react';
import { useContentType } from '../contexts/ContentTypeContext';
import { getAllPlaylists } from '../utils/localStorage';
import PlaylistCard from '../components/playlist/PlaylistCard';
import './UserPlaylists.css';

const UserPlaylists = () => {
    const { isMovieMode } = useContentType();
    const [playlists, setPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('likes'); // likes, recent, popular
    const [contentTypeFilter, setContentTypeFilter] = useState('all'); // all, movie, book

    useEffect(() => {
        loadPlaylists();
    }, [isMovieMode]);

    useEffect(() => {
        filterAndSortPlaylists();
    }, [playlists, sortBy, contentTypeFilter]);

    const loadPlaylists = async () => {
        setLoading(true);
        try {
            const allPlaylists = getAllPlaylists();
            // 공개된 플레이리스트만 필터링
            const publicPlaylists = allPlaylists.filter(playlist => playlist.isPublic);
            setPlaylists(publicPlaylists);
        } catch (error) {
            console.error('플레이리스트 로드 실패:', error);
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPlaylists = () => {
        let filtered = [...playlists];

        // 컨텐츠 타입 필터링
        if (contentTypeFilter !== 'all') {
            filtered = filtered.filter(playlist => playlist.contentType === contentTypeFilter);
        }

        // 정렬
        switch (sortBy) {
            case 'likes':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'recent':
                filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.contentCount || 0) - (a.contentCount || 0));
                break;
            default:
                break;
        }

        setFilteredPlaylists(filtered);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleContentTypeFilterChange = (e) => {
        setContentTypeFilter(e.target.value);
    };

    const handleRefresh = () => {
        loadPlaylists();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>플레이리스트를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="user-playlists">
            <div className="page-header">
                <h1 className="page-title">다른 회원들의 추천 리스트</h1>
                <p className="page-description">
                    다양한 회원들이 만든 추천 리스트를 둘러보고 영감을 얻어보세요!
                </p>
            </div>

            <div className="controls-section">
                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="contentTypeFilter">컨텐츠 타입:</label>
                        <select
                            id="contentTypeFilter"
                            value={contentTypeFilter}
                            onChange={handleContentTypeFilterChange}
                            className="filter-select"
                        >
                            <option value="all">전체</option>
                            <option value="movie">영화</option>
                            <option value="book">도서</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sortBy">정렬 기준:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="filter-select"
                        >
                            <option value="likes">좋아요 순</option>
                            <option value="recent">최신 순</option>
                            <option value="popular">인기 순</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleRefresh} className="refresh-button">
                    새로고침
                </button>
            </div>

            <div className="playlists-section">
                {filteredPlaylists.length > 0 ? (
                    <>
                        <div className="playlists-info">
                            <span className="playlists-count">
                                총 {filteredPlaylists.length}개의 추천 리스트
                            </span>
                        </div>

                        <div className="playlists-grid">
                            {filteredPlaylists.map((playlist) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={playlist}
                                    showUserInfo={true}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-playlists-message">
                        <div className="no-playlists-icon">📚</div>
                        <h3>아직 등록된 추천 리스트가 없습니다</h3>
                        <p>
                            {contentTypeFilter !== 'all'
                                ? `${contentTypeFilter === 'movie' ? '영화' : '도서'} 추천 리스트가 아직 없습니다.`
                                : '다른 회원들이 만든 추천 리스트가 아직 없습니다.'
                            }
                        </p>
                        <p>첫 번째로 나만의 추천 리스트를 만들어보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPlaylists;
