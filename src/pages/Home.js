// 홈 페이지

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentType } from '../contexts/ContentTypeContext';
import { getPopularMovies, getNowPlayingMovies } from '../services/tmdbApi';
import { getBestsellerBooks, getNewBooks } from '../services/naverApi';
import { getAllPlaylists } from '../utils/localStorage';
import ContentCard from '../components/content/ContentCard';
import Carousel from '../components/common/Carousel';
import PlaylistCard from '../components/playlist/PlaylistCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isMovieMode } = useContentType();
  const [carouselItems, setCarouselItems] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [isMovieMode]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (isMovieMode) {
        // 영화 데이터 로드
        const nowPlaying = await getNowPlayingMovies();
        setCarouselItems(nowPlaying.slice(0, 10));
      } else {
        // 도서 데이터 로드
        const newBooks = await getNewBooks();
        setCarouselItems(newBooks.slice(0, 10));
      }

      // 사용자 플레이리스트 로드 (공개된 것만, 좋아요 순으로 정렬)
      const playlists = getAllPlaylists();
      const publicPlaylists = playlists.filter(playlist => playlist.isPublic);
      const sortedPlaylists = publicPlaylists.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      setUserPlaylists(sortedPlaylists);
    } catch (error) {
      console.error('컨텐츠 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>컨텐츠를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* 메인 배너 캐러셀 */}
      <section className="home-carousel">
        <Carousel items={carouselItems} />
      </section>

      {/* 다른 유저들의 추천 리스트 */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">다른 회원들의 추천 리스트</h2>
          {userPlaylists.length > 0 && (
            <button 
              className="more-button"
              onClick={() => navigate('/playlists')}
            >
              더보기
            </button>
          )}
        </div>
        {userPlaylists.length > 0 ? (
          <div className="playlist-grid">
            {userPlaylists.slice(0, 10).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="no-playlists-message">
            <p>아직 등록된 추천 리스트가 없습니다.</p>
            <p>첫 번째로 나만의 추천 리스트를 만들어보세요!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
