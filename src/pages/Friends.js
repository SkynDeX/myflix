// 친구 관리 페이지

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFriend } from '../contexts/FriendContext';
import FriendList from '../components/friend/FriendList';
import FriendSearch from '../components/friend/FriendSearch';
import FriendRequestList from '../components/friend/FriendRequestList';
import './Friends.css';

const Friends = () => {
    const { user } = useAuth();
    const { friendCount, receivedRequestCount } = useFriend();
    const [activeTab, setActiveTab] = useState('friends');

    if (!user) {
        return (
            <div className="friends-page">
                <div className="auth-required">
                    <div className="auth-icon">🔒</div>
                    <h2>로그인이 필요합니다</h2>
                    <p>친구 관리 기능을 사용하려면 먼저 로그인해주세요.</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="login-btn"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'friends':
                return <FriendList />;
            case 'search':
                return <FriendSearch />;
            case 'requests':
                return <FriendRequestList />;
            default:
                return <FriendList />;
        }
    };

    return (
        <div className="friends-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>친구 관리</h1>
                    <p>친구들과 함께 영화와 책을 공유하고 추천해보세요</p>
                </div>
            </div>

            <div className="page-tabs">
                <div className="tabs-nav">
                    <button 
                        className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        <span className="tab-icon">👥</span>
                        <span className="tab-text">내 친구 ({friendCount})</span>
                    </button>
                    
                    <button 
                        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <span className="tab-icon">🔍</span>
                        <span className="tab-text">친구 찾기</span>
                    </button>
                    
                    <button 
                        className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <span className="tab-icon">📨</span>
                        <span className="tab-text">
                            친구 요청
                            {receivedRequestCount > 0 && (
                                <span className="notification-badge">{receivedRequestCount}</span>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            <div className="page-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Friends;