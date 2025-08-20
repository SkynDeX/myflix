// 친구 요청 목록 컴포넌트

import React, { useState, useEffect } from 'react';
import { useFriend } from '../../contexts/FriendContext';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../utils/localStorage';
import UserCard from './UserCard';
import './FriendRequestList.css';

const FriendRequestList = () => {
    const { user } = useAuth();
    const { friendRequests, loading, receivedRequestCount, sentRequestCount } = useFriend();
    const [activeTab, setActiveTab] = useState('received');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // 모든 사용자 정보를 가져와서 ID로 사용자 정보를 찾을 수 있도록 함
        const allUsers = getAllUsers();
        setUsers(allUsers);
    }, []);

    if (!user) {
        return (
            <div className="friend-request-list">
                <div className="list-error">
                    로그인이 필요한 서비스입니다.
                </div>
            </div>
        );
    }

    // 사용자 ID로 사용자 정보 찾기
    const getUserById = (userId) => {
        return users.find(u => u.id === userId);
    };

    // 받은 친구 요청 목록
    const receivedRequests = friendRequests.received
        .map(userId => getUserById(userId))
        .filter(Boolean) // null/undefined 제거
        .map(user => ({
            ...user,
            requestReceived: true
        }));

    // 보낸 친구 요청 목록
    const sentRequests = friendRequests.sent
        .map(userId => getUserById(userId))
        .filter(Boolean) // null/undefined 제거
        .map(user => ({
            ...user,
            requestSent: true
        }));

    if (loading) {
        return (
            <div className="friend-request-list">
                <div className="list-loading">
                    <div className="loading-spinner"></div>
                    <span>친구 요청을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        if (activeTab === 'received') {
            if (receivedRequests.length === 0) {
                return (
                    <div className="empty-state">
                        <div className="empty-icon">📨</div>
                        <h3>받은 친구 요청이 없습니다</h3>
                        <p>새로운 친구 요청이 도착하면 여기에 표시됩니다.</p>
                    </div>
                );
            }

            return (
                <div className="requests-list">
                    {receivedRequests.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user}
                            showActions={true}
                        />
                    ))}
                </div>
            );
        } else {
            if (sentRequests.length === 0) {
                return (
                    <div className="empty-state">
                        <div className="empty-icon">📤</div>
                        <h3>보낸 친구 요청이 없습니다</h3>
                        <p>친구 찾기에서 친구 요청을 보내보세요.</p>
                    </div>
                );
            }

            return (
                <div className="requests-list">
                    {sentRequests.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user}
                            showActions={true}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="friend-request-list">
            <div className="list-header">
                <h2>친구 요청</h2>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        받은 요청
                        {receivedRequestCount > 0 && (
                            <span className="tab-badge">{receivedRequestCount}</span>
                        )}
                    </button>
                    <button 
                        className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        보낸 요청
                        {sentRequestCount > 0 && (
                            <span className="tab-badge">{sentRequestCount}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default FriendRequestList;