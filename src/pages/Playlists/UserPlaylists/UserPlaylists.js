// 다른 회원들의 추천 리스트 페이지

import React, { useState, useEffect } from 'react';
import { useContentType } from '../../../contexts/ContentTypeContext';
import { getAllPlaylists } from '../../../utils/localStorage';
import PlaylistCard from '../../../components/playlist/PlaylistCard';
import './UserPlaylists.css';

const UserPlaylists = () => {
    const { isMovieMode } = useContentType();
    const [playlists, setPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('random'); // random, likes, recent, oldest
    const [searchQuery, setSearchQuery] = useState('');
    const [contentTypeFilter, setContentTypeFilter] = useState('all'); // all, movie, book

    useEffect(() => {
        loadPlaylists();
    }, [isMovieMode]);

    useEffect(() => {
        filterAndSortPlaylists();
    }, [playlists, sortBy, contentTypeFilter, searchQuery]);

    const loadPlaylists = async () => {
        setLoading(true);
        try {
            const allPlaylists = getAllPlaylists();
            // 모든 플레이리스트를 가져옴 (isPublic 속성이 없는 경우를 대비)
            setPlaylists(allPlaylists);
        } catch (error) {
            console.error('추천 리스트 로드 실패:', error);
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    // 랜덤 셔플 함수
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const filterAndSortPlaylists = () => {
        let filtered = [...playlists];

        // 검색 필터링
        if (searchQuery.trim()) {
            filtered = filtered.filter(playlist =>
                playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 컨텐츠 타입 필터링 (플레이리스트가 가진 아이템들로 판단)
        if (contentTypeFilter !== 'all') {
            filtered = filtered.filter(playlist => {
                if (!playlist.items || playlist.items.length === 0) return false;
                // 플레이리스트 아이템 중 해당 타입이 있는지 확인
                return playlist.items.some(item => item.type === contentTypeFilter);
            });
        }

        // 정렬
        switch (sortBy) {
            case 'random':
                filtered = shuffleArray(filtered);
                break;
            case 'likes':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'recent':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
                <p>추천 리스트를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="user-playlists">
            <div className="page-header">
                <h1 className="page-title">회원들의 추천 리스트</h1>
                <p className="page-description">
                    다양한 회원들이 만든 추천 리스트를 둘러보고 영감을 얻어보세요!
                </p>
            </div>

            <div className="controls-section">
                {/* 검색 입력 */}
                <div className="search-section">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="추천 리스트 제목이나 설명으로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                {/* 필터 및 정렬 */}
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
                            <option value="random">추천순</option>
                            <option value="likes">좋아요 순</option>
                            <option value="recent">최신 순</option>
                            <option value="oldest">오래된 순</option>
                        </select>
                    </div>

                    <button onClick={handleRefresh} className="refresh-button">
                        새로고침
                    </button>
                </div>
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
                                : '회원들이 만든 추천 리스트가 아직 없습니다.'
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
