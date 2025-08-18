// 마이페이지

import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContentType } from '../contexts/ContentTypeContext';
import { 
  getWishlist, 
  getRecommendedContent, 
  getMyPlaylists,
  getLikedPlaylists,
  getAllPlaylists
} from '../utils/localStorage';
import ContentCard from '../components/content/ContentCard';
import PlaylistCard from '../components/playlist/PlaylistCard';
import './MyPage.css';

const MyPage = () => {
  const { user } = useAuth();
  const { isMovieMode } = useContentType();
  const [wishlist, setWishlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, isMovieMode]);

  const loadUserData = () => {
    // 위시리스트 로드
    const userWishlist = getWishlist(user.id);
    const filteredWishlist = userWishlist.filter(item => 
      item.type === (isMovieMode ? 'movie' : 'book')
    );
    setWishlist(filteredWishlist.slice(0, 6));

    // 추천 받은 컨텐츠 로드
    const userRecommendations = getRecommendedContent(user.id);
    const filteredRecommendations = userRecommendations.filter(item => 
      item.type === (isMovieMode ? 'movie' : 'book')
    );
    // 최신순으로 정렬
    const sortedRecommendations = filteredRecommendations.sort((a, b) => 
      new Date(b.recommendedAt) - new Date(a.recommendedAt)
    );
    setRecommendations(sortedRecommendations.slice(0, 6));

    // 나만의 추천 리스트 로드
    const userPlaylists = getMyPlaylists(user.id);
    setMyPlaylists(userPlaylists.slice(0, 4));

    // 좋아요한 추천 리스트 로드
    const likedPlaylistIds = getLikedPlaylists(user.id);
    const allPlaylists = getAllPlaylists();
    const userLikedPlaylists = allPlaylists.filter(playlist => 
      likedPlaylistIds.includes(playlist.id)
    );
    setLikedPlaylists(userLikedPlaylists.slice(0, 4));
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const unviewedCount = recommendations.filter(r => !r.viewed).length;

  return (
    <div className="mypage">
      <div className="mypage-header">
        <h1>마이페이지</h1>
        <p className="welcome-message">{user.name}님, 환영합니다!</p>
      </div>

      {/* 위시리스트 섹션 */}
      <section className="mypage-section">
        <div className="section-header">
          <h2>위시리스트</h2>
          <Link to="/wishlist" className="more-link">더보기 →</Link>
        </div>
        {wishlist.length > 0 ? (
          <div className="content-grid-small">
            {wishlist.map((item) => (
              <ContentCard
                key={`${item.type}_${item.id}`}
                content={item}
                type={item.type}
              />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>위시리스트가 비어있습니다.</p>
            <p>마음에 드는 {isMovieMode ? '영화' : '도서'}를 추가해보세요!</p>
          </div>
        )}
      </section>

      {/* 추천 받은 컨텐츠 섹션 */}
      <section className="mypage-section">
        <div className="section-header">
          <h2>
            추천 받은 컨텐츠
            {unviewedCount > 0 && (
              <span className="badge">{unviewedCount}</span>
            )}
          </h2>
          <Link to="/recommended" className="more-link">더보기 →</Link>
        </div>
        {recommendations.length > 0 ? (
          <div className="content-grid-small">
            {recommendations.map((item) => (
              <div key={`${item.type}_${item.id}_${item.recommendedAt}`} className="recommended-item">
                <ContentCard
                  content={item}
                  type={item.type}
                />
                {!item.viewed && <span className="new-badge">NEW</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>아직 추천 받은 컨텐츠가 없습니다.</p>
          </div>
        )}
      </section>

      {/* 나만의 추천 리스트 섹션 */}
      <section className="mypage-section">
        <div className="section-header">
          <h2>나만의 추천 리스트</h2>
          <Link to="/my-playlists" className="more-link">더보기 →</Link>
        </div>
        {myPlaylists.length > 0 ? (
          <div className="playlist-grid-small">
            {myPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>아직 만든 추천 리스트가 없습니다.</p>
            <p>나만의 특별한 리스트를 만들어보세요!</p>
          </div>
        )}
      </section>

      {/* 내가 좋아요한 추천 리스트 섹션 */}
      <section className="mypage-section">
        <div className="section-header">
          <h2>내가 좋아요한 추천 리스트</h2>
          <Link to="/liked-playlists" className="more-link">더보기 →</Link>
        </div>
        {likedPlaylists.length > 0 ? (
          <div className="playlist-grid-small">
            {likedPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>아직 좋아요한 추천 리스트가 없습니다.</p>
            <p>다른 회원들의 추천 리스트를 둘러보세요!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPage;
