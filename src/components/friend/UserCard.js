// 사용자 카드 컴포넌트 - 검색 결과용

import React, { useState } from 'react';
import { useFriend } from '../../contexts/FriendContext';
import { useAuth } from '../../contexts/AuthContext';
import './UserCard.css';

const UserCard = ({ user, showActions = true }) => {
    const { user: currentUser } = useAuth();
    const {
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend
    } = useFriend();
    
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !currentUser) {
        return null;
    }

    // 액션 핸들러들
    const handleSendFriendRequest = async () => {
        setIsLoading(true);
        try {
            const success = await sendFriendRequest(user.id);
            if (success) {
                user.requestSent = true; // UI 즉시 업데이트
            }
        } catch (error) {
            console.error('친구 요청 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelFriendRequest = async () => {
        setIsLoading(true);
        try {
            const success = await cancelFriendRequest(user.id);
            if (success) {
                user.requestSent = false; // UI 즉시 업데이트
            }
        } catch (error) {
            console.error('친구 요청 취소 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        setIsLoading(true);
        try {
            const success = await acceptFriendRequest(user.id);
            if (success) {
                user.isFriend = true;
                user.requestReceived = false;
            }
        } catch (error) {
            console.error('친구 요청 수락 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectFriendRequest = async () => {
        setIsLoading(true);
        try {
            const success = await rejectFriendRequest(user.id);
            if (success) {
                user.requestReceived = false;
            }
        } catch (error) {
            console.error('친구 요청 거절 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFriend = async () => {
        if (!window.confirm(`${user.name}님을 친구에서 제거하시겠습니까?`)) {
            return;
        }

        setIsLoading(true);
        try {
            const success = await removeFriend(user.id);
            if (success) {
                user.isFriend = false;
            }
        } catch (error) {
            console.error('친구 삭제 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 액션 버튼 렌더링
    const renderActionButton = () => {
        if (!showActions) return null;

        if (isLoading) {
            return (
                <button className="user-action-btn loading" disabled>
                    처리중...
                </button>
            );
        }

        if (user.isFriend) {
            return (
                <button 
                    className="user-action-btn friends"
                    onClick={handleRemoveFriend}
                >
                    친구 삭제
                </button>
            );
        }

        if (user.requestSent) {
            return (
                <button 
                    className="user-action-btn request-sent"
                    onClick={handleCancelFriendRequest}
                >
                    요청 취소
                </button>
            );
        }

        if (user.requestReceived) {
            return (
                <div className="request-actions">
                    <button 
                        className="user-action-btn accept"
                        onClick={handleAcceptFriendRequest}
                    >
                        수락
                    </button>
                    <button 
                        className="user-action-btn reject"
                        onClick={handleRejectFriendRequest}
                    >
                        거절
                    </button>
                </div>
            );
        }

        return (
            <button 
                className="user-action-btn add-friend"
                onClick={handleSendFriendRequest}
            >
                친구 추가
            </button>
        );
    };

    // 사용자 아바타/이니셜 생성
    const getUserInitial = () => {
        const name = user.email;
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    // 상태 배지 렌더링
    const renderStatusBadge = () => {
        if (user.isFriend) {
            return <span className="status-badge friends">친구</span>;
        }
        if (user.requestSent) {
            return <span className="status-badge request-sent">요청됨</span>;
        }
        if (user.requestReceived) {
            return <span className="status-badge request-received">요청받음</span>;
        }
        return null;
    };

    return (
        <div className="user-card">

            <div className="user-info">
                <div className="user-name">
                    <h3>{user.name}</h3>
                    {renderStatusBadge()}
                </div>
                <div className="user-details">
                    <span className="email">{user.email}</span>
                </div>
                {user.createdAt && (
                    <div className="join-date">
                        가입일: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                )}
            </div>

            <div className="user-actions">
                {renderActionButton()}
            </div>
        </div>
    );
};

export default UserCard;