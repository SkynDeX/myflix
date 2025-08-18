import { STORAGE_KEYS } from '../constants';

// 로컬 스토리지 유틸리티 함수들
class StorageService {
  // 데이터 저장
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`스토리지 저장 실패 (${key}):`, error);
    }
  }

  // 데이터 가져오기
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`스토리지 읽기 실패 (${key}):`, error);
      return defaultValue;
    }
  }

  // 데이터 삭제
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`스토리지 삭제 실패 (${key}):`, error);
    }
  }

  // 모든 데이터 삭제
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('스토리지 전체 삭제 실패:', error);
    }
  }
}

const storageService = new StorageService();

// 사용자 관련 함수들
export const userService = {
  // 사용자 로그인 정보 저장
  saveUser: (user) => {
    storageService.setItem(STORAGE_KEYS.USER, {
      ...user,
      loginTime: new Date().toISOString()
    });
  },

  // 현재 사용자 가져오기
  getCurrentUser: () => {
    return storageService.getItem(STORAGE_KEYS.USER);
  },

  // 로그아웃
  logout: () => {
    storageService.removeItem(STORAGE_KEYS.USER);
  },

  // 로그인 상태 확인
  isLoggedIn: () => {
    const user = userService.getCurrentUser();
    return user !== null;
  }
};

// 위시리스트 관련 함수들
export const wishlistService = {
  // 영화 위시리스트 추가
  addMovieToWishlist: (movie) => {
    const wishlist = storageService.getItem(STORAGE_KEYS.WISH_LIST_MOVIES, []);
    const isAlreadyAdded = wishlist.find(item => item.id === movie.id);
    
    if (!isAlreadyAdded) {
      const newWishlist = [...wishlist, { ...movie, addedAt: new Date().toISOString() }];
      storageService.setItem(STORAGE_KEYS.WISH_LIST_MOVIES, newWishlist);
      return true;
    }
    return false;
  },

  // 도서 위시리스트 추가
  addBookToWishlist: (book) => {
    const wishlist = storageService.getItem(STORAGE_KEYS.WISH_LIST_BOOKS, []);
    const isAlreadyAdded = wishlist.find(item => item.isbn === book.isbn);
    
    if (!isAlreadyAdded) {
      const newWishlist = [...wishlist, { ...book, addedAt: new Date().toISOString() }];
      storageService.setItem(STORAGE_KEYS.WISH_LIST_BOOKS, newWishlist);
      return true;
    }
    return false;
  },

  // 영화 위시리스트에서 제거
  removeMovieFromWishlist: (movieId) => {
    const wishlist = storageService.getItem(STORAGE_KEYS.WISH_LIST_MOVIES, []);
    const newWishlist = wishlist.filter(item => item.id !== movieId);
    storageService.setItem(STORAGE_KEYS.WISH_LIST_MOVIES, newWishlist);
  },

  // 도서 위시리스트에서 제거
  removeBookFromWishlist: (isbn) => {
    const wishlist = storageService.getItem(STORAGE_KEYS.WISH_LIST_BOOKS, []);
    const newWishlist = wishlist.filter(item => item.isbn !== isbn);
    storageService.setItem(STORAGE_KEYS.WISH_LIST_BOOKS, newWishlist);
  },

  // 영화 위시리스트 가져오기
  getMovieWishlist: () => {
    return storageService.getItem(STORAGE_KEYS.WISH_LIST_MOVIES, []);
  },

  // 도서 위시리스트 가져오기
  getBookWishlist: () => {
    return storageService.getItem(STORAGE_KEYS.WISH_LIST_BOOKS, []);
  },

  // 영화가 위시리스트에 있는지 확인
  isMovieInWishlist: (movieId) => {
    const wishlist = wishlistService.getMovieWishlist();
    return wishlist.some(item => item.id === movieId);
  },

  // 도서가 위시리스트에 있는지 확인
  isBookInWishlist: (isbn) => {
    const wishlist = wishlistService.getBookWishlist();
    return wishlist.some(item => item.isbn === isbn);
  }
};

// 시청/독서 기록 관련 함수들
export const watchedService = {
  // 영화 시청 기록 추가
  addWatchedMovie: (movie, rating = null, review = '') => {
    const watched = storageService.getItem(STORAGE_KEYS.WATCHED_MOVIES, []);
    const existingIndex = watched.findIndex(item => item.id === movie.id);
    
    const watchedMovie = {
      ...movie,
      watchedAt: new Date().toISOString(),
      rating,
      review
    };

    if (existingIndex >= 0) {
      watched[existingIndex] = watchedMovie;
    } else {
      watched.push(watchedMovie);
    }
    
    storageService.setItem(STORAGE_KEYS.WATCHED_MOVIES, watched);
  },

  // 도서 독서 기록 추가
  addReadBook: (book, rating = null, review = '') => {
    const read = storageService.getItem(STORAGE_KEYS.READ_BOOKS, []);
    const existingIndex = read.findIndex(item => item.isbn === book.isbn);
    
    const readBook = {
      ...book,
      readAt: new Date().toISOString(),
      rating,
      review
    };

    if (existingIndex >= 0) {
      read[existingIndex] = readBook;
    } else {
      read.push(readBook);
    }
    
    storageService.setItem(STORAGE_KEYS.READ_BOOKS, read);
  },

  // 시청한 영화 목록 가져오기
  getWatchedMovies: () => {
    return storageService.getItem(STORAGE_KEYS.WATCHED_MOVIES, []);
  },

  // 읽은 도서 목록 가져오기
  getReadBooks: () => {
    return storageService.getItem(STORAGE_KEYS.READ_BOOKS, []);
  },

  // 영화 시청 여부 확인
  isMovieWatched: (movieId) => {
    const watched = watchedService.getWatchedMovies();
    return watched.some(item => item.id === movieId);
  },

  // 도서 독서 여부 확인
  isBookRead: (isbn) => {
    const read = watchedService.getReadBooks();
    return read.some(item => item.isbn === isbn);
  }
};

// 플레이리스트 관련 함수들
export const playlistService = {
  // 플레이리스트 생성
  createPlaylist: (title, description = '', type = 'mixed') => {
    const playlists = storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
    const newPlaylist = {
      id: Date.now().toString(),
      title,
      description,
      type, // 'movie', 'book', 'mixed'
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false
    };
    
    playlists.push(newPlaylist);
    storageService.setItem(STORAGE_KEYS.MY_PLAYLISTS, playlists);
    return newPlaylist;
  },

  // 플레이리스트에 아이템 추가
  addItemToPlaylist: (playlistId, item, itemType) => {
    const playlists = storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex >= 0) {
      const playlist = playlists[playlistIndex];
      const newItem = {
        ...item,
        type: itemType, // 'movie' or 'book'
        addedAt: new Date().toISOString()
      };
      
      // 중복 체크
      const isDuplicate = playlist.items.some(existingItem => 
        (itemType === 'movie' && existingItem.id === item.id) ||
        (itemType === 'book' && existingItem.isbn === item.isbn)
      );
      
      if (!isDuplicate) {
        playlist.items.push(newItem);
        playlist.updatedAt = new Date().toISOString();
        playlists[playlistIndex] = playlist;
        storageService.setItem(STORAGE_KEYS.MY_PLAYLISTS, playlists);
        return true;
      }
    }
    return false;
  },

  // 플레이리스트에서 아이템 제거
  removeItemFromPlaylist: (playlistId, itemId, itemType) => {
    const playlists = storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex >= 0) {
      const playlist = playlists[playlistIndex];
      playlist.items = playlist.items.filter(item => 
        (itemType === 'movie' && item.id !== itemId) ||
        (itemType === 'book' && item.isbn !== itemId)
      );
      playlist.updatedAt = new Date().toISOString();
      playlists[playlistIndex] = playlist;
      storageService.setItem(STORAGE_KEYS.MY_PLAYLISTS, playlists);
    }
  },

  // 모든 플레이리스트 가져오기
  getAllPlaylists: () => {
    return storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
  },

  // 특정 플레이리스트 가져오기
  getPlaylistById: (playlistId) => {
    const playlists = playlistService.getAllPlaylists();
    return playlists.find(p => p.id === playlistId);
  },

  // 플레이리스트 삭제
  deletePlaylist: (playlistId) => {
    const playlists = storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
    const newPlaylists = playlists.filter(p => p.id !== playlistId);
    storageService.setItem(STORAGE_KEYS.MY_PLAYLISTS, newPlaylists);
  },

  // 플레이리스트 업데이트
  updatePlaylist: (playlistId, updates) => {
    const playlists = storageService.getItem(STORAGE_KEYS.MY_PLAYLISTS, []);
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex >= 0) {
      playlists[playlistIndex] = {
        ...playlists[playlistIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      storageService.setItem(STORAGE_KEYS.MY_PLAYLISTS, playlists);
      return playlists[playlistIndex];
    }
    return null;
  }
};

// 추천 및 알림 관련 함수들
export const notificationService = {
  // 추천 알림 생성
  createRecommendation: (fromUserId, toUserId, item, itemType, message = '') => {
    const notifications = storageService.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    
    const newNotification = {
      id: Date.now().toString(),
      type: 'recommendation',
      fromUserId,
      toUserId,
      item,
      itemType, // 'movie' or 'book'
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(newNotification);
    storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // 알림 목록 가져오기 (현재 사용자용)
  getNotifications: (userId) => {
    const notifications = storageService.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifications.filter(n => n.toUserId === userId);
  },

  // 알림 읽음 처리
  markAsRead: (notificationId) => {
    const notifications = storageService.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex >= 0) {
      notifications[notificationIndex].read = true;
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  // 읽지 않은 알림 개수
  getUnreadCount: (userId) => {
    const notifications = notificationService.getNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }
};

export default storageService;