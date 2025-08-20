// 친구 검색 컴포넌트

import React, { useState, useEffect } from 'react';
import { useFriend } from '../../contexts/FriendContext';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from './UserCard';
import './FriendSearch.css';

const FriendSearch = () => {
    const { user } = useAuth();
    const { searchUsers } = useFriend();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim() && user) {
                setIsSearching(true);
                try {
                    const results = searchUsers(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms 디바운스

        return () => clearTimeout(delaySearch);
    }, [searchQuery, user, searchUsers]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    if (!user) {
        return (
            <div className="friend-search">
                <div className="search-error">
                    로그인이 필요한 서비스입니다.
                </div>
            </div>
        );
    }

    return (
        <div className="friend-search">
            <div className="search-header">
                <h2>친구 찾기</h2>
                <p>사용자명, 이메일, 닉네임으로 친구를 찾아보세요</p>
            </div>

            <div className="search-container">
                <div className="search-input-container">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="사용자명, 이메일, 닉네임 검색..."
                        className="search-input"
                    />
                    {searchQuery && (
                        <button 
                            onClick={clearSearch}
                            className="clear-search-btn"
                            aria-label="검색어 지우기"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {isSearching && (
                    <div className="search-loading">
                        <div className="loading-spinner"></div>
                        <span>검색 중...</span>
                    </div>
                )}

                {searchQuery && !isSearching && (
                    <div className="search-results">
                        <div className="results-header">
                            <span className="results-count">
                                검색 결과: {searchResults.length}명
                            </span>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="results-list">
                                {searchResults.map(user => (
                                    <UserCard 
                                        key={user.id} 
                                        user={user}
                                        showActions={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <p>검색 결과가 없습니다.</p>
                                <span>다른 키워드로 검색해보세요.</span>
                            </div>
                        )}
                    </div>
                )}

                {!searchQuery && (
                    <div className="search-placeholder">
                        <div className="placeholder-icon">👥</div>
                        <p>친구를 찾아보세요</p>
                        <span>사용자명, 이메일, 닉네임으로 검색할 수 있습니다.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendSearch;