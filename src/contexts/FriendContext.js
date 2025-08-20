// 친구 관리 컨텍스트 - 친구 상태 관리

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    acceptFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    getFriendStatus,
    getFriendsWithInfo,
    rejectFriendRequest,
    removeFriend,
    searchUsers,
    sendFriendRequest
} from '../utils/localStorage';
import { useAuth } from './AuthContext';

const FriendContext = createContext();

export const useFriend = () => {
    const context = useContext(FriendContext);
    if (!context) {
        throw new Error('useFriend는 FriendProvider 내에서 사용되어야 합니다');
    }
    return context;
};

export const FriendProvider = ({ children }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState({ sent: [], received: [] });
    const [loading, setLoading] = useState(false);

    // 친구 관련 데이터 새로고침
    const refreshFriendData = () => {
        if (!user) {
            setFriends([]);
            setFriendRequests({ sent: [], received: [] });
            return;
        }

        try {
            setLoading(true);
            const friendsData = getFriendsWithInfo(user.id);
            const requestsData = getFriendRequests(user.id);
            
            setFriends(friendsData);
            setFriendRequests(requestsData);
        } catch (error) {
            console.error('친구 데이터 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 사용자가 변경되거나 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        refreshFriendData();
    }, [user]);

    // 친구 요청 보내기
    const handleSendFriendRequest = async (toUserId) => {
        if (!user) return false;
        
        try {
            setLoading(true);
            const success = sendFriendRequest(user.id, toUserId);
            if (success) {
                refreshFriendData();
            }
            return success;
        } catch (error) {
            console.error('친구 요청 보내기 실패:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 친구 요청 수락
    const handleAcceptFriendRequest = async (fromUserId) => {
        if (!user) return false;
        
        try {
            setLoading(true);
            const success = acceptFriendRequest(user.id, fromUserId);
            if (success) {
                refreshFriendData();
            }
            return success;
        } catch (error) {
            console.error('친구 요청 수락 실패:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 친구 요청 거절
    const handleRejectFriendRequest = async (fromUserId) => {
        if (!user) return false;
        
        try {
            setLoading(true);
            const success = rejectFriendRequest(user.id, fromUserId);
            if (success) {
                refreshFriendData();
            }
            return success;
        } catch (error) {
            console.error('친구 요청 거절 실패:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 친구 요청 취소
    const handleCancelFriendRequest = async (toUserId) => {
        if (!user) return false;
        
        try {
            setLoading(true);
            const success = cancelFriendRequest(user.id, toUserId);
            if (success) {
                refreshFriendData();
            }
            return success;
        } catch (error) {
            console.error('친구 요청 취소 실패:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 친구 삭제
    const handleRemoveFriend = async (friendId) => {
        if (!user) return false;
        
        try {
            setLoading(true);
            const success = removeFriend(user.id, friendId);
            if (success) {
                refreshFriendData();
            }
            return success;
        } catch (error) {
            console.error('친구 삭제 실패:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 사용자 검색
    const searchFriends = (query) => {
        if (!user) return [];
        
        try {
            return searchUsers(query, user.id);
        } catch (error) {
            console.error('사용자 검색 실패:', error);
            return [];
        }
    };

    // 친구 상태 확인
    const checkFriendStatus = (targetUserId) => {
        if (!user) return 'none';
        
        try {
            return getFriendStatus(user.id, targetUserId);
        } catch (error) {
            console.error('친구 상태 확인 실패:', error);
            return 'none';
        }
    };

    const value = {
        // 상태
        friends,
        friendRequests,
        loading,
        
        // 메서드
        sendFriendRequest: handleSendFriendRequest,
        acceptFriendRequest: handleAcceptFriendRequest,
        rejectFriendRequest: handleRejectFriendRequest,
        cancelFriendRequest: handleCancelFriendRequest,
        removeFriend: handleRemoveFriend,
        searchUsers: searchFriends,
        getFriendStatus: checkFriendStatus,
        refreshFriendData,
        
        // 계산된 값들
        friendCount: friends.length,
        receivedRequestCount: friendRequests.received.length,
        sentRequestCount: friendRequests.sent.length
    };

    return (
        <FriendContext.Provider value={value}>
            {children}
        </FriendContext.Provider>
    );
};