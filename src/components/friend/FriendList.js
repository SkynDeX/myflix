// 친구 목록 컴포넌트

import React, { useState } from 'react';
import { useFriend } from '../../contexts/FriendContext';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from './UserCard';
import './FriendList.css';

const FriendList = () => {
    const { user } = useAuth();
    const { friends, loading, friendCount } = useFriend();
    const [searchQuery, setSearchQuery] = useState('');

    if (!user) {
        return (
            <div className="friend-list">
                <div className="list-error">
                    로그인이 필요한 서비스입니다.
                </div>
            </div>
        );
    }

    // 친구 목록 필터링
    const filteredFriends = friends.filter(friend => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        return (friend.email?.toLowerCase().includes(query));
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="friend-list">
                <div className="list-loading">
                    <div className="loading-spinner"></div>
                    <span>친구 목록을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="friend-list">
            <div className="list-header">
                <div className="header-info">
                    <h2>내 친구</h2>
                    <span className="friend-count">{friendCount}명</span>
                </div>

                {friends.length > 0 && (
                    <div className="search-container">
                        <div className="search-input-container">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="친구 검색..."
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
                    </div>
                )}
            </div>

            <div className="list-content">
                {friends.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>아직 친구가 없습니다</h3>
                        <p>친구 찾기에서 새로운 친구를 추가해보세요!</p>
                    </div>
                ) : filteredFriends.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 키워드로 검색해보세요.</p>
                    </div>
                ) : (
                    <div className="friends-container">
                        {searchQuery && (
                            <div className="search-results-info">
                                검색 결과: {filteredFriends.length}명
                            </div>
                        )}
                        
                        <div className="friends-list">
                            {filteredFriends.map(friend => (
                                <UserCard 
                                    key={friend.id} 
                                    user={{
                                        ...friend,
                                        isFriend: true // 이미 친구 목록이므로 true
                                    }}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendList;