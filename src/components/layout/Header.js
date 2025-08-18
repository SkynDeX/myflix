import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../constants';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // 알림 정보 가져오기
    const notificationData = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (notificationData) {
      const notifications = JSON.parse(notificationData);
      setNotifications(notifications.filter(n => !n.read));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* 로고 */}
          <div className="header-logo">
            <Link to="/" className="logo">
              <span className="logo-text">MyFlix</span>
              <span className="logo-subtitle">Movies & Books</span>
            </Link>
          </div>

          {/* 검색바 */}
          <div className="header-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="영화나 도서를 검색하세요..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>

          {/* 네비게이션 */}
          <nav className="header-nav">
            <ul className="nav-list">
              <li><Link to="/" className="nav-link">홈</Link></li>
              <li><Link to="/search" className="nav-link">검색</Link></li>
              {user && (
                <>
                  <li><Link to="/playlist" className="nav-link">나의 플레이리스트</Link></li>
                  <li className="nav-notification">
                    <Link to="/profile" className="nav-link notification-link">
                      알림
                      {notifications.length > 0 && (
                        <span className="notification-badge">{notifications.length}</span>
                      )}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* 사용자 메뉴 */}
          <div className="header-user">
            {user ? (
              <div className="user-menu">
                <button className="user-toggle" onClick={toggleMenu}>
                  <span className="user-name">{user.name}</span>
                  <svg className={`chevron ${isMenuOpen ? 'open' : ''}`} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      마이페이지
                    </Link>
                    <Link to="/profile?tab=wishlist" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      위시리스트
                    </Link>
                    <Link to="/profile?tab=watched" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      시청/독서 기록
                    </Link>
                    <Link to="/playlist" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      플레이리스트
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-small">로그인</Link>
                <Link to="/register" className="btn btn-primary btn-small">회원가입</Link>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>홈</Link>
            <Link to="/search" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>검색</Link>
            {user ? (
              <>
                <Link to="/playlist" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>나의 플레이리스트</Link>
                <Link to="/profile" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>마이페이지</Link>
                <button className="mobile-menu-item logout-btn" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>로그인</Link>
                <Link to="/register" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;