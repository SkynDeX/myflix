// Carousel 컴포넌트

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentType } from '../../contexts/ContentTypeContext';
import { getImageUrl } from '../../services/tmdbApi';
import './Carousel.css';

const Carousel = ({ items }) => {
  const navigate = useNavigate();
  const { isMovieMode } = useContentType();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [items.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleItemClick = (item) => {
    const type = isMovieMode ? 'movie' : 'book';
    const id = isMovieMode ? item.id : item.isbn;
    navigate(`/content/${type}/${id}`);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  // 배경 이미지 URL 가져오기
  const getBackgroundImage = () => {
    if (isMovieMode) {
      return getImageUrl(currentItem.backdrop_path || currentItem.poster_path, 'original');
    }
    return currentItem.image;
  };

  return (
    <div className="carousel">
      <div 
        className="carousel-background"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      >
        <div className="carousel-overlay"></div>
      </div>

      <div className="carousel-content">
        <div className="carousel-info">
          <h1 className="carousel-title">
            {currentItem.title || currentItem.name}
          </h1>
          <p className="carousel-description">
            {currentItem.overview || currentItem.description}
          </p>
          <button 
            className="carousel-detail-button"
            onClick={() => handleItemClick(currentItem)}
          >
            자세히 보기
          </button>
        </div>

        {/* 네비게이션 화살표 */}
        <button className="carousel-nav carousel-nav-prev" onClick={handlePrevious}>
          ‹
        </button>
        <button className="carousel-nav carousel-nav-next" onClick={handleNext}>
          ›
        </button>

        {/* 인디케이터 */}
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
