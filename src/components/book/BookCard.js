import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book, size = 'medium' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // HTML 태그 제거 함수
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  // 사용 가능한 이미지 소스들 (우선순위 순)
  const getImageSources = () => {
    const title = stripHtml(book.title);
    const encodedTitle = encodeURIComponent(title);
    
    return [
      book.image, // 메인 이미지
      book.fallbackImage, // 폴백 이미지
      `https://via.placeholder.com/300x400/E8E8E8/666666?text=${encodedTitle}`, // 최종 폴백
    ].filter(Boolean); // null/undefined 제거
  };

  // 이미지 로딩 성공 핸들러
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // 이미지 로딩 실패 핸들러 (다음 이미지 시도)
  const handleImageError = () => {
    const imageSources = getImageSources();
    const nextIndex = currentImageIndex + 1;
    
    if (nextIndex < imageSources.length) {
      setCurrentImageIndex(nextIndex);
      setImageLoaded(false);
    } else {
      setImageError(true);
      setImageLoaded(false);
    }
  };

  // 재시도 핸들러
  const handleRetry = () => {
    setCurrentImageIndex(0);
    setImageError(false);
    setImageLoaded(false);
  };

  const title = stripHtml(book.title);
  const author = stripHtml(book.author);
  const description = stripHtml(book.description);

  return (
    <div className={`book-card ${size}`}>
      <Link to={`/book/${encodeURIComponent(book.isbn || book.title)}`} className="book-card-link">
        <div className="book-cover">
          {!imageError ? (
            <>
              <img 
                src={getImageSources()[currentImageIndex]} 
                alt={title}
                className={`cover-image ${imageLoaded ? 'loaded' : 'loading'}`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                key={`${book.title}-${currentImageIndex}`} // 강제 리렌더링
              />
              {!imageLoaded && (
                <div className="image-loading">
                  <div className="loading-spinner"></div>
                </div>
              )}
            </>
          ) : (
            <div className="cover-placeholder">
              <span>📚</span>
              <p>이미지를 불러올 수 없습니다</p>
              <button 
                className="retry-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRetry();
                }}
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
        
        <div className="book-info">
          <h3 className="book-title" title={title}>
            {title}
          </h3>
          
          {author && (
            <p className="book-author">
              {author}
            </p>
          )}
          
          {book.publisher && (
            <p className="book-publisher">
              {book.publisher}
            </p>
          )}
          
          {description && (
            <p className="book-description">
              {description.length > 80 
                ? `${description.substring(0, 80)}...` 
                : description
              }
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BookCard;