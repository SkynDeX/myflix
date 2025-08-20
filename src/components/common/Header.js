// Header 컴포넌트

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useContentType } from '../../contexts/ContentTypeContext';
import { TAB_MENU } from '../../constants/constants';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { contentType, switchToMovie, switchToBook } = useContentType();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* 로고 */}
                <Link to="/" className="logo">
                    MyFlix
                </Link>

                {/* 컨텐츠 타입 탭 */}
                <div className="content-tabs">
                    <button
                        className={`tab-button ${contentType === 'movie' ? 'active' : ''}`}
                        onClick={switchToMovie}
                    >
                        {TAB_MENU.MOVIE}
                    </button>
                    <button
                        className={`tab-button ${contentType === 'book' ? 'active' : ''}`}
                        onClick={switchToBook}
                    >
                        {TAB_MENU.BOOK}
                    </button>
                </div>

                {/* 검색바 */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="영화, 도서를 검색해보세요..."
                        className="search-input"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/search?q=${e.target.value}`);
                            }
                        }}
                    />
                    <button
                        className="search-button"
                        onClick={() => {
                            const input = document.querySelector('.search-input');
                            if (input && input.value.trim()) {
                                navigate(`/search?q=${input.value.trim()}`);
                            }
                        }}
                    >
                        검색
                    </button>
                </div>

                {/* 사용자 메뉴 */}
                <div className="user-menu">
                    {user ? (
                        <div className="user-dropdown">
                            <span className="user-name">{user.name}</span>
                            <div className="dropdown-menu">
                                <Link to="/mypage" className="dropdown-item">
                                    마이페이지
                                </Link>
                                <Link to="/friends" className="dropdown-item">
                                    친구 관리
                                </Link>
                                <Link to="/wishlist" className="dropdown-item">
                                    위시리스트
                                </Link>
                                <Link to="/recommended" className="dropdown-item">
                                    추천 받은 컨텐츠
                                </Link>
                                <Link to="/my-playlists" className="dropdown-item">
                                    내가 만든 추천 리스트
                                </Link>
                                <Link to="/liked-playlists" className="dropdown-item">
                                    내가 좋아요한 추천 리스트
                                </Link>
                                <Link to="/profile/edit" className="dropdown-item">
                                    회원수정
                                </Link>
                                <button onClick={handleLogout} className="dropdown-item logout-btn">
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/signup" className="auth-button">
                                회원가입
                            </Link>
                            <Link to="/login" className="auth-button">
                                로그인
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
