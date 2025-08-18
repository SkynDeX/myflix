// Footer 컴포넌트

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <h3 className="footer-title">MyFlix</h3>
          <p className="footer-subtitle">
            영화와 도서를 사랑하는 사람들을 위한 추천 플랫폼
          </p>
          <p className="footer-description">
            최신 영화부터 베스트셀러 도서까지, 여러분의 취향에 맞는 컨텐츠를 추천해드립니다.
          </p>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 MyFlix. 하이미디어 React 포트폴리오 프로젝트
          </p>
          <p className="footer-credits">
            Movie data from <strong>TMDB</strong> | Book data from <strong>Naver Open API</strong>
          </p>
          <p className="footer-made-with">
            Made with ❤️ for learning React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
