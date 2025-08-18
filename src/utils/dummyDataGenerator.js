// 더미 데이터 생성 유틸리티

// 더미 사용자 데이터
export const generateDummyUsers = () => {
  const users = [
    {
      id: 'user1',
      email: 'user1@test.com',
      password: '123123',
      name: '김영화',
      profileImage: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=김',
      joinDate: '2024-01-15'
    },
    {
      id: 'user2',
      email: 'user2@test.com',
      password: '123123',
      name: '이도서',
      profileImage: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=이',
      joinDate: '2024-02-20'
    },
    {
      id: 'user3',
      email: 'user3@test.com',
      password: '123123',
      name: '박추천',
      profileImage: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=박',
      joinDate: '2024-03-10'
    },
    {
      id: 'user4',
      email: 'user4@test.com',
      password: '123123',
      name: '최리스트',
      profileImage: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=최',
      joinDate: '2024-04-05'
    },
    {
      id: 'user5',
      email: 'user5@test.com',
      password: '123123',
      name: '정플레이',
      profileImage: 'https://via.placeholder.com/100x100/FFEAA7/FFFFFF?text=정',
      joinDate: '2024-05-12'
    },
    {
      id: 'user6',
      email: 'user6@test.com',
      password: '123123',
      name: '한마이',
      profileImage: 'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=한',
      joinDate: '2024-06-18'
    },
    {
      id: 'user7',
      email: 'user7@test.com',
      password: '123123',
      name: '윤페이지',
      profileImage: 'https://via.placeholder.com/100x100/98D8C8/FFFFFF?text=윤',
      joinDate: '2024-07-22'
    },
    {
      id: 'user8',
      email: 'user8@test.com',
      password: '123123',
      name: '임위시',
      profileImage: 'https://via.placeholder.com/100x100/F7DC6F/FFFFFF?text=임',
      joinDate: '2024-08-30'
    }
  ];

  return users;
};

// 더미 위시리스트 데이터
export const generateDummyWishlists = () => {
  const wishlists = [];
  const users = generateDummyUsers();
  
  // 각 사용자별로 3-8개의 위시리스트 아이템 생성
  users.forEach(user => {
    const itemCount = Math.floor(Math.random() * 6) + 3; // 3-8개
    
    for (let i = 0; i < itemCount; i++) {
      const isMovie = Math.random() > 0.5;
      const item = {
        id: `wish_${user.id}_${i}`,
        userId: user.id,
        userName: user.name,
        contentType: isMovie ? 'movie' : 'book',
        contentId: isMovie ? `movie_${Math.floor(Math.random() * 1000)}` : `book_${Math.floor(Math.random() * 1000)}`,
        title: isMovie ? 
          ['인터스텔라', '듄', '오펜하이머', '어벤져스', '스파이더맨', '배트맨', '원더우먼', '블랙팬서'][Math.floor(Math.random() * 8)] :
          ['아몬드', '나미야 잡화점의 기적', '미드나잇 라이브러리', '불편한 편의점', '어린 왕자', '데미안', '역행자', '원씽'][Math.floor(Math.random() * 8)],
        image: isMovie ? 
          `https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Movie${i}` :
          `https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Book${i}`,
        addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 최근 30일 내
        isReviewed: Math.random() > 0.7 // 30% 확률로 리뷰됨
      };
      wishlists.push(item);
    }
  });

  return wishlists;
};

// 더미 추천 컨텐츠 데이터
export const generateDummyRecommendedContent = () => {
  const recommendations = [];
  const users = generateDummyUsers();
  
  // 각 사용자별로 2-5개의 추천 컨텐츠 생성
  users.forEach(user => {
    const recCount = Math.floor(Math.random() * 4) + 2; // 2-5개
    
    for (let i = 0; i < recCount; i++) {
      const isMovie = Math.random() > 0.5;
      const item = {
        id: `rec_${user.id}_${i}`,
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: 'currentUser', // 현재 로그인한 사용자
        contentType: isMovie ? 'movie' : 'book',
        contentId: isMovie ? `movie_${Math.floor(Math.random() * 1000)}` : `book_${Math.floor(Math.random() * 1000)}`,
        title: isMovie ? 
          ['인터스텔라', '듄', '오펜하이머', '어벤져스', '스파이더맨', '배트맨', '원더우먼', '블랙팬서'][Math.floor(Math.random() * 8)] :
          ['아몬드', '나미야 잡화점의 기적', '미드나잇 라이브러리', '불편한 편의점', '어린 왕자', '데미안', '역행자', '원씽'][Math.floor(Math.random() * 8)],
        image: isMovie ? 
          `https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Movie${i}` :
          `https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Book${i}`,
        message: [
          '정말 재미있어요! 꼭 봐보세요.',
          '이 작품은 정말 대박입니다.',
          '개인적으로 추천하고 싶은 작품이에요.',
          '시간 가는 줄 모르고 봤어요.',
          '다시 봐도 좋을 것 같아요.'
        ][Math.floor(Math.random() * 5)],
        recommendedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 최근 7일 내
        isRead: Math.random() > 0.6 // 40% 확률로 읽음
      };
      recommendations.push(item);
    }
  });

  return recommendations;
};

// 더미 플레이리스트 데이터
export const generateDummyPlaylists = () => {
  const playlists = [];
  const users = generateDummyUsers();
  
  // 각 사용자별로 2-4개의 플레이리스트 생성
  users.forEach(user => {
    const playlistCount = Math.floor(Math.random() * 3) + 2; // 2-4개
    
    for (let i = 0; i < playlistCount; i++) {
      const isMovie = Math.random() > 0.5;
      const contentCount = Math.floor(Math.random() * 8) + 3; // 3-10개
      
      const playlist = {
        id: `playlist_${user.id}_${i}`,
        userId: user.id,
        userName: user.name,
        userProfileImage: user.profileImage,
        title: [
          `${isMovie ? '영화' : '도서'} 추천 모음`,
          `내가 좋아하는 ${isMovie ? '영화' : '도서'}들`,
          `${isMovie ? '영화' : '도서'} 컬렉션`,
          `인생 ${isMovie ? '영화' : '도서'} 리스트`,
          `추천하고 싶은 ${isMovie ? '영화' : '도서'}`
        ][Math.floor(Math.random() * 5)],
        description: [
          '정말 재미있게 본 작품들을 모았어요.',
          '개인적으로 추천하고 싶은 작품들입니다.',
          '시간 가는 줄 모르고 즐긴 컨텐츠들입니다.',
          '다시 봐도 좋을 것 같은 작품들입니다.',
          '친구들에게도 추천하고 싶은 작품들입니다.'
        ][Math.floor(Math.random() * 5)],
        contentType: isMovie ? 'movie' : 'book',
        contentCount: contentCount,
        likes: Math.floor(Math.random() * 20), // 0-19개 좋아요
        isPublic: Math.random() > 0.3, // 70% 확률로 공개
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 최근 60일 내
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 최근 30일 내
      };
      
      // 플레이리스트 내용물 생성
      playlist.contents = [];
      for (let j = 0; j < contentCount; j++) {
        const content = {
          id: `${playlist.id}_content_${j}`,
          contentType: isMovie ? 'movie' : 'book',
          contentId: isMovie ? `movie_${Math.floor(Math.random() * 1000)}` : `book_${Math.floor(Math.random() * 1000)}`,
          title: isMovie ? 
            ['인터스텔라', '듄', '오펜하이머', '어벤져스', '스파이더맨', '배트맨', '원더우먼', '블랙팬서'][Math.floor(Math.random() * 8)] :
            ['아몬드', '나미야 잡화점의 기적', '미드나잇 라이브러리', '불편한 편의점', '어린 왕자', '데미안', '역행자', '원씽'][Math.floor(Math.random() * 8)],
          image: isMovie ? 
            `https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Movie${j}` :
            `https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Book${j}`,
          addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        playlist.contents.push(content);
      }
      
      playlists.push(playlist);
    }
  });

  return playlists;
};

// 더미 좋아요한 플레이리스트 데이터
export const generateDummyLikedPlaylists = () => {
  const likedPlaylists = [];
  const playlists = generateDummyPlaylists();
  const currentUserId = 'currentUser';
  
  // 현재 사용자가 좋아요한 플레이리스트들 (자신의 것 제외)
  const publicPlaylists = playlists.filter(p => p.isPublic && p.userId !== currentUserId);
  
  // 랜덤하게 5-15개 선택
  const likeCount = Math.floor(Math.random() * 11) + 5;
  const selectedPlaylists = publicPlaylists.sort(() => 0.5 - Math.random()).slice(0, likeCount);
  
  selectedPlaylists.forEach(playlist => {
    const likedItem = {
      id: `liked_${playlist.id}`,
      playlistId: playlist.id,
      userId: currentUserId,
      likedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      playlist: playlist
    };
    likedPlaylists.push(likedItem);
  });

  return likedPlaylists;
};

// 모든 더미 데이터를 한번에 생성
export const generateAllDummyData = () => {
  return {
    users: generateDummyUsers(),
    wishlists: generateDummyWishlists(),
    recommendedContent: generateDummyRecommendedContent(),
    playlists: generateDummyPlaylists(),
    likedPlaylists: generateDummyLikedPlaylists()
  };
};

// LocalStorage에 더미 데이터 삽입
export const insertDummyDataToLocalStorage = () => {
  try {
    const data = generateAllDummyData();
    
    // 사용자 데이터 (현재 사용자 제외)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newUsers = data.users.filter(user => 
      !existingUsers.find(existing => existing.id === user.id)
    );
    if (newUsers.length > 0) {
      localStorage.setItem('users', JSON.stringify([...existingUsers, ...newUsers]));
    }
    
    // 위시리스트 데이터
    const existingWishlists = JSON.parse(localStorage.getItem('wishlists') || '[]');
    const newWishlists = data.wishlists.filter(wish => 
      !existingWishlists.find(existing => existing.id === wish.id)
    );
    if (newWishlists.length > 0) {
      localStorage.setItem('wishlists', JSON.stringify([...existingWishlists, ...newWishlists]));
    }
    
    // 추천 컨텐츠 데이터
    const existingRecommended = JSON.parse(localStorage.getItem('recommendedContent') || '[]');
    const newRecommended = data.recommendedContent.filter(rec => 
      !existingRecommended.find(existing => existing.id === rec.id)
    );
    if (newRecommended.length > 0) {
      localStorage.setItem('recommendedContent', JSON.stringify([...existingRecommended, ...newRecommended]));
    }
    
    // 플레이리스트 데이터
    const existingPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
    const newPlaylists = data.playlists.filter(playlist => 
      !existingPlaylists.find(existing => existing.id === playlist.id)
    );
    if (newPlaylists.length > 0) {
      localStorage.setItem('playlists', JSON.stringify([...existingPlaylists, ...newPlaylists]));
    }
    
    // 좋아요한 플레이리스트 데이터
    const existingLiked = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');
    const newLiked = data.likedPlaylists.filter(liked => 
      !existingLiked.find(existing => existing.id === liked.id)
    );
    if (newLiked.length > 0) {
      localStorage.setItem('likedPlaylists', JSON.stringify([...existingLiked, ...newLiked]));
    }
    
    console.log('더미 데이터가 성공적으로 삽입되었습니다!');
    return true;
  } catch (error) {
    console.error('더미 데이터 삽입 실패:', error);
    return false;
  }
};

// LocalStorage에서 더미 데이터 제거 (테스트용)
export const removeDummyDataFromLocalStorage = () => {
  try {
    localStorage.removeItem('users');
    localStorage.removeItem('wishlists');
    localStorage.removeItem('recommendedContent');
    localStorage.removeItem('playlists');
    localStorage.removeItem('likedPlaylists');
    console.log('더미 데이터가 제거되었습니다.');
    return true;
  } catch (error) {
    console.error('더미 데이터 제거 실패:', error);
    return false;
  }
};
