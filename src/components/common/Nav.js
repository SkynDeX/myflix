// Nav 컴포넌트

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentType } from '../../contexts/ContentTypeContext';
import './Nav.css';

const Nav = () => {
    const navigate = useNavigate();
    const { isMovieMode } = useContentType();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleDetailSearch = () => {
        navigate('/search');
    };

    const handleRandomRecommend = () => {
        navigate('/recommend/random');
    };

    const handleUserPlaylists = () => {
        navigate('/playlists');
    };


    return (
        <nav className="nav">
            <div className="nav-container">
                {/* 설명 문구 */}
                <div className="nav-description">
                    <h2 className="nav-title">당신만의 특별한 컨텐츠를 찾아보세요</h2>
                    <p className="nav-subtitle">
                        최신 {isMovieMode ? '영화' : '도서'}부터 베스트셀러까지, MyFlix에서 모든 것을 발견하세요
                    </p>
                </div>

                {/* 검색바 */}
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder={`${isMovieMode ? '영화' : '도서'} 제목, 장르, 연도 등을 검색하세요`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-button" title="검색">
                            검색
                            {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15.5 15.5M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> */}
                        </button>
                        <button
                            type="button"
                            className="detail-search-button"
                            onClick={handleDetailSearch}
                            title="상세 검색"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12H21M3 6H21M3 18H15"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* 추천 버튼들 */}
                <div className="nav-buttons">
                    <button className="nav-action-button" onClick={handleRandomRecommend}>
                        <span className="button-icon">🎲</span>
                        MyFlix 선정 오늘의 추천 {isMovieMode ? '영화' : '도서'}
                    </button>
                    <button className="nav-action-button" onClick={handleUserPlaylists}>
                        <span className="button-icon">📚</span>
                        다른 회원의 추천 리스트 보러가기
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
