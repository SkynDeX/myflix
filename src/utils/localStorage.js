// LocalStorage 관리 유틸리티

import { STORAGE_KEYS } from '../constants/constants';

// 데이터 저장
export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('LocalStorage 저장 실패:', error);
        return false;
    }
};

// 데이터 불러오기
export const getFromStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('LocalStorage 불러오기 실패:', error);
        return null;
    }
};

// 데이터 삭제
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('LocalStorage 삭제 실패:', error);
        return false;
    }
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
    return getFromStorage(STORAGE_KEYS.USER_INFO);
};

// 로그인 처리
export const setCurrentUser = (user) => {
    return saveToStorage(STORAGE_KEYS.USER_INFO, user);
};

// 로그아웃 처리
export const clearCurrentUser = () => {
    return removeFromStorage(STORAGE_KEYS.USER_INFO);
};

// 모든 사용자 목록 가져오기
export const getAllUsers = () => {
    return getFromStorage(STORAGE_KEYS.USERS) || [];
};

// 사용자 추가
export const addUser = (user) => {
    const users = getAllUsers();
    const newUser = {
        ...user,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
};

// 사용자 수정
export const updateUser = (userId, updates) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveToStorage(STORAGE_KEYS.USERS, users);
        return users[index];
    }
    return null;
};

// 위시리스트 관리
export const getWishlist = (userId) => {
    const wishlists = getFromStorage(STORAGE_KEYS.WISHLIST) || {};
    return wishlists[userId] || [];
};

export const addToWishlist = (userId, item) => {
    const wishlists = getFromStorage(STORAGE_KEYS.WISHLIST) || {};
    if (!wishlists[userId]) {
        wishlists[userId] = [];
    }

    // 중복 체크
    const exists = wishlists[userId].some(
        i => i.id === item.id && i.type === item.type
    );

    if (!exists) {
        wishlists[userId].push({
            ...item,
            addedAt: new Date().toISOString()
        });
        saveToStorage(STORAGE_KEYS.WISHLIST, wishlists);
    }
    return wishlists[userId];
};

export const removeFromWishlist = (userId, itemId, itemType) => {
    const wishlists = getFromStorage(STORAGE_KEYS.WISHLIST) || {};
    if (wishlists[userId]) {
        wishlists[userId] = wishlists[userId].filter(
            i => !(i.id === itemId && i.type === itemType)
        );
        saveToStorage(STORAGE_KEYS.WISHLIST, wishlists);
    }
    return wishlists[userId] || [];
};

// 추천 컨텐츠 관리
export const getRecommendedContent = (userId) => {
    const recommendations = getFromStorage(STORAGE_KEYS.RECOMMENDED_CONTENT) || {};
    return recommendations[userId] || [];
};

export const addRecommendation = (fromUserId, toUserId, content) => {
    const recommendations = getFromStorage(STORAGE_KEYS.RECOMMENDED_CONTENT) || {};
    if (!recommendations[toUserId]) {
        recommendations[toUserId] = [];
    }

    // 중복 체크
    const exists = recommendations[toUserId].some(
        i => i.id === content.id && i.type === content.type
    );

    if (!exists) {
        recommendations[toUserId].push({
            ...content,
            from: fromUserId,
            recommendedAt: new Date().toISOString(),
            viewed: false
        });
        saveToStorage(STORAGE_KEYS.RECOMMENDED_CONTENT, recommendations);
    }

    return recommendations[toUserId];
};

export const removeFromRecommendation = (userId, itemId, itemType, content) => {
    const recommendations = getFromStorage(STORAGE_KEYS.RECOMMENDED_CONTENT) || {};

    if (content) {
        recommendations[userId] = content;
        saveToStorage(STORAGE_KEYS.RECOMMENDED_CONTENT, recommendations);
    }
    return recommendations[userId] || [];
};

// 컨텐츠 조회 여부 업데이트
export const markContentAsViewed = (userId, contentId) => {
    const recommendations = getFromStorage(STORAGE_KEYS.RECOMMENDED_CONTENT) || {};
    if (recommendations[userId]) {
        const content = recommendations[userId].find(c => c.id === contentId);
        if (content) {
            content.viewed = true;
            saveToStorage(STORAGE_KEYS.RECOMMENDED_CONTENT, recommendations);
        }
    }
};

// 나만의 추천 리스트 관리
export const getMyPlaylists = (userId) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    return playlists[userId] || [];
};

export const createPlaylist = (userId, playlist) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    if (!playlists[userId]) {
        playlists[userId] = [];
    }

    const newPlaylist = {
        ...playlist,
        id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        createdAt: new Date().toISOString(),
        likes: 0,
        items: []
    };

    playlists[userId].push(newPlaylist);
    saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
    return newPlaylist;
};

export const updatePlaylist = (userId, playlistId, updates) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    if (playlists[userId]) {
        const index = playlists[userId].findIndex(p => p.id === playlistId);
        if (index !== -1) {
            playlists[userId][index] = { ...playlists[userId][index], ...updates };
            saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
            return playlists[userId][index];
        }
    }
    return null;
};

export const deletePlaylist = (userId, playlistId) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    if (playlists[userId]) {
        playlists[userId] = playlists[userId].filter(p => p.id !== playlistId);
        saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
    }
};

export const addToPlaylist = (userId, playlistId, item) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    if (playlists[userId]) {
        const playlist = playlists[userId].find(p => p.id === playlistId);
        if (playlist) {
            if (!playlist.items) {
                playlist.items = [];
            }

            // 중복 체크
            const exists = playlist.items.some(
                i => i.id === item.id && i.type === item.type
            );

            if (!exists) {
                playlist.items.push(item);
                saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
            }
        }
    }
};

// 모든 사용자의 플레이리스트 가져오기 (다른 사용자 추천 리스트 조회용)
export const getAllPlaylists = () => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    const allPlaylists = [];

    Object.keys(playlists).forEach(userId => {
        playlists[userId].forEach(playlist => {
            allPlaylists.push({ ...playlist, userId });
        });
    });

    return allPlaylists;
};

// 좋아요한 플레이리스트 관리
export const getLikedPlaylists = (userId) => {
    const likedPlaylists = getFromStorage(STORAGE_KEYS.LIKED_PLAYLISTS) || {};
    return likedPlaylists[userId] || [];
};

export const likePlaylist = (userId, playlistId) => {
    const likedPlaylists = getFromStorage(STORAGE_KEYS.LIKED_PLAYLISTS) || {};
    if (!likedPlaylists[userId]) {
        likedPlaylists[userId] = [];
    }

    if (!likedPlaylists[userId].includes(playlistId)) {
        likedPlaylists[userId].push(playlistId);
        saveToStorage(STORAGE_KEYS.LIKED_PLAYLISTS, likedPlaylists);

        // 플레이리스트의 좋아요 수 증가
        incrementPlaylistLikes(playlistId);
    }
    return likedPlaylists[userId];
};

export const unlikePlaylist = (userId, playlistId) => {
    const likedPlaylists = getFromStorage(STORAGE_KEYS.LIKED_PLAYLISTS) || {};
    if (likedPlaylists[userId]) {
        likedPlaylists[userId] = likedPlaylists[userId].filter(id => id !== playlistId);
        saveToStorage(STORAGE_KEYS.LIKED_PLAYLISTS, likedPlaylists);

        // 플레이리스트의 좋아요 수 감소
        decrementPlaylistLikes(playlistId);
    }
    return likedPlaylists[userId] || [];
};

// 플레이리스트 좋아요 수 관리
const incrementPlaylistLikes = (playlistId) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};

    Object.keys(playlists).forEach(userId => {
        const playlist = playlists[userId].find(p => p.id === playlistId);
        if (playlist) {
            playlist.likes = (playlist.likes || 0) + 1;
            saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
        }
    });
};

const decrementPlaylistLikes = (playlistId) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};

    Object.keys(playlists).forEach(userId => {
        const playlist = playlists[userId].find(p => p.id === playlistId);
        if (playlist) {
            playlist.likes = Math.max((playlist.likes || 0) - 1, 0);
            saveToStorage(STORAGE_KEYS.MY_PLAYLISTS, playlists);
        }
    });
};

// 플레이리스트 ID로 조회
export const getPlaylistById = (playlistId) => {
    const playlists = getFromStorage(STORAGE_KEYS.MY_PLAYLISTS) || {};
    
    for (const userId in playlists) {
        const playlist = playlists[userId].find(p => p.id === playlistId);
        if (playlist) {
            return { ...playlist, userId };
        }
    }
    return null;
};

// 리뷰 관리
export const getReviews = (contentId, contentType) => {
    const reviews = getFromStorage(STORAGE_KEYS.REVIEWS) || {};
    const key = `${contentType}_${contentId}`;
    return reviews[key] || [];
};

export const addReview = (userId, contentId, contentType, review) => {
    const reviews = getFromStorage(STORAGE_KEYS.REVIEWS) || {};
    const key = `${contentType}_${contentId}`;

    if (!reviews[key]) {
        reviews[key] = [];
    }

    const newReview = {
        ...review,
        id: Date.now().toString(),
        userId,
        createdAt: new Date().toISOString()
    };

    reviews[key].push(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
};

export const getUserReview = (userId, contentId, contentType) => {
    const reviews = getReviews(contentId, contentType);
    return reviews.find(r => r.userId === userId);
};

// ===============================
// 친구 관리 시스템
// ===============================

// 친구 목록 가져오기
export const getFriends = (userId) => {
    const friends = getFromStorage(STORAGE_KEYS.FRIENDS) || {};
    return friends[userId] || [];
};

// 친구 추가
export const addFriend = (userId, friendId) => {
    if (userId === friendId) return false; // 자기 자신은 추가할 수 없음

    const friends = getFromStorage(STORAGE_KEYS.FRIENDS) || {};
    
    // 양방향으로 친구 관계 설정
    if (!friends[userId]) friends[userId] = [];
    if (!friends[friendId]) friends[friendId] = [];
    
    // 이미 친구인지 확인
    if (!friends[userId].includes(friendId)) {
        friends[userId].push(friendId);
        friends[friendId].push(userId);
        saveToStorage(STORAGE_KEYS.FRIENDS, friends);
        
        // 친구 요청 삭제 (있다면)
        removeFriendRequest(userId, friendId);
        removeFriendRequest(friendId, userId);
        
        return true;
    }
    return false;
};

// 친구 삭제
export const removeFriend = (userId, friendId) => {
    const friends = getFromStorage(STORAGE_KEYS.FRIENDS) || {};
    
    if (friends[userId]) {
        friends[userId] = friends[userId].filter(id => id !== friendId);
    }
    if (friends[friendId]) {
        friends[friendId] = friends[friendId].filter(id => id !== userId);
    }
    
    saveToStorage(STORAGE_KEYS.FRIENDS, friends);
    return true;
};

// 친구 요청 데이터 구조 가져오기
export const getFriendRequests = (userId) => {
    const requests = getFromStorage(STORAGE_KEYS.FRIEND_REQUESTS) || {};
    return requests[userId] || { sent: [], received: [] };
};

// 친구 요청 보내기
export const sendFriendRequest = (fromUserId, toUserId) => {
    if (fromUserId === toUserId) return false; // 자기 자신에게는 요청할 수 없음
    
    const requests = getFromStorage(STORAGE_KEYS.FRIEND_REQUESTS) || {};
    
    // 요청 보내는 사람의 sent 목록에 추가
    if (!requests[fromUserId]) {
        requests[fromUserId] = { sent: [], received: [] };
    }
    if (!requests[fromUserId].sent.includes(toUserId)) {
        requests[fromUserId].sent.push(toUserId);
    }
    
    // 요청 받는 사람의 received 목록에 추가
    if (!requests[toUserId]) {
        requests[toUserId] = { sent: [], received: [] };
    }
    if (!requests[toUserId].received.includes(fromUserId)) {
        requests[toUserId].received.push(fromUserId);
    }
    
    saveToStorage(STORAGE_KEYS.FRIEND_REQUESTS, requests);
    return true;
};

// 친구 요청 수락
export const acceptFriendRequest = (userId, fromUserId) => {
    // 친구로 추가
    const success = addFriend(userId, fromUserId);
    
    if (success) {
        // 친구 요청 데이터에서 제거
        removeFriendRequest(userId, fromUserId);
        removeFriendRequest(fromUserId, userId);
    }
    
    return success;
};

// 친구 요청 거절
export const rejectFriendRequest = (userId, fromUserId) => {
    removeFriendRequest(userId, fromUserId);
    removeFriendRequest(fromUserId, userId);
    return true;
};

// 친구 요청 삭제 (내부 함수)
const removeFriendRequest = (userId, targetUserId) => {
    const requests = getFromStorage(STORAGE_KEYS.FRIEND_REQUESTS) || {};
    
    if (requests[userId]) {
        requests[userId].sent = requests[userId].sent.filter(id => id !== targetUserId);
        requests[userId].received = requests[userId].received.filter(id => id !== targetUserId);
        saveToStorage(STORAGE_KEYS.FRIEND_REQUESTS, requests);
    }
};

// 친구 요청 취소
export const cancelFriendRequest = (fromUserId, toUserId) => {
    removeFriendRequest(fromUserId, toUserId);
    removeFriendRequest(toUserId, fromUserId);
    return true;
};

// 사용자 검색 (친구 찾기용)
export const searchUsers = (query, currentUserId) => {
    const users = getAllUsers();
    const friends = getFriends(currentUserId);
    const { sent, received } = getFriendRequests(currentUserId);
    
    if (!query.trim()) return [];
    
    return users
        .filter(user => 
            user.id !== currentUserId && // 자기 자신 제외
            (user.name?.toLowerCase().includes(query.toLowerCase()) ||
             user.email?.toLowerCase().includes(query.toLowerCase()))
        )
        .map(user => ({
            ...user,
            isFriend: friends.includes(user.id),
            requestSent: sent.includes(user.id),
            requestReceived: received.includes(user.id)
        }));
};

// 친구 상태 확인
export const getFriendStatus = (userId, targetUserId) => {
    const friends = getFriends(userId);
    const { sent, received } = getFriendRequests(userId);
    
    if (friends.includes(targetUserId)) {
        return 'friends';
    } else if (sent.includes(targetUserId)) {
        return 'request_sent';
    } else if (received.includes(targetUserId)) {
        return 'request_received';
    } else {
        return 'none';
    }
};

// 친구 정보 가져오기 (사용자 정보와 함께)
export const getFriendsWithInfo = (userId) => {
    const friendIds = getFriends(userId);
    const users = getAllUsers();
    
    return friendIds
        .map(friendId => users.find(user => user.id === friendId))
        .filter(Boolean); // null/undefined 제거
};
