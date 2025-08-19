import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* 로고 및 소개 */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <h3>MyFlix</h3>
                            <p>영화와 도서를 사랑하는 사람들을 위한 추천 플랫폼</p>
                        </div>
                        <div className="footer-description">
                            <p>
                                최신 영화부터 베스트셀러 도서까지,
                                여러분의 취향에 맞는 컨텐츠를 추천해드립니다.
                            </p>
                        </div>
                    </div>

                    {/* 빠른 링크 */}
                    <div className="footer-section">
                        <h4>빠른 링크</h4>
                        <ul className="footer-links">
                            <li><Link to="/">홈</Link></li>
                            <li><Link to="/search">검색</Link></li>
                            <li><Link to="/search?type=movie">영화 탐색</Link></li>
                            <li><Link to="/search?type=book">도서 탐색</Link></li>
                        </ul>
                    </div>

                    {/* 서비스 */}
                    <div className="footer-section">
                        <h4>서비스</h4>
                        <ul className="footer-links">
                            <li><Link to="/playlist">플레이리스트</Link></li>
                            <li><Link to="/profile?tab=wishlist">위시리스트</Link></li>
                            <li><Link to="/profile?tab=watched">시청/독서 기록</Link></li>
                            <li><Link to="/profile?tab=recommendations">추천 받은 컨텐츠</Link></li>
                        </ul>
                    </div>

                    {/* 계정 */}
                    <div className="footer-section">
                        <h4>계정</h4>
                        <ul className="footer-links">
                            <li><Link to="/login">로그인</Link></li>
                            <li><Link to="/register">회원가입</Link></li>
                            <li><Link to="/profile">마이페이지</Link></li>
                        </ul>
                    </div>
                </div>

                {/* 하단 구분선 및 저작권 */}
                <div className="footer-bottom">
                    <div className="footer-divider"></div>
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; 2024 MyFlix. 국비지원 React 포트폴리오 프로젝트</p>
                            <p className="data-source">
                                Movie data from <strong>TMDB</strong> | Book data from <strong>Naver Open API</strong>
                            </p>
                        </div>
                        <div className="footer-social">
                            <p className="made-by">Made with ❤️ for learning React</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;