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
    id: Date.now().toString(),
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
  
  recommendations[toUserId].push({
    ...content,
    from: fromUserId,
    recommendedAt: new Date().toISOString(),
    viewed: false
  });
  
  saveToStorage(STORAGE_KEYS.RECOMMENDED_CONTENT, recommendations);
  return recommendations[toUserId];
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
    id: Date.now().toString(),
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
