// 컨텐츠 타입 컨텍스트 - 영화/도서 탭 상태 관리

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CONTENT_TYPE, STORAGE_KEYS } from '../constants/constants';
import { saveToStorage, getFromStorage } from '../utils/localStorage';

const ContentTypeContext = createContext();

export const useContentType = () => {
  const context = useContext(ContentTypeContext);
  if (!context) {
    throw new Error('useContentType은 ContentTypeProvider 내에서 사용되어야 합니다');
  }
  return context;
};

export const ContentTypeProvider = ({ children }) => {
  const [contentType, setContentType] = useState(CONTENT_TYPE.MOVIE);

  // 컴포넌트 마운트 시 저장된 컨텐츠 타입 불러오기
  useEffect(() => {
    const savedType = getFromStorage(STORAGE_KEYS.CURRENT_CONTENT_TYPE);
    if (savedType && (savedType === CONTENT_TYPE.MOVIE || savedType === CONTENT_TYPE.BOOK)) {
      setContentType(savedType);
    }
  }, []);

  // 컨텐츠 타입 변경
  const changeContentType = (type) => {
    if (type === CONTENT_TYPE.MOVIE || type === CONTENT_TYPE.BOOK) {
      setContentType(type);
      saveToStorage(STORAGE_KEYS.CURRENT_CONTENT_TYPE, type);
    }
  };

  // 영화 탭으로 전환
  const switchToMovie = () => {
    changeContentType(CONTENT_TYPE.MOVIE);
  };

  // 도서 탭으로 전환
  const switchToBook = () => {
    changeContentType(CONTENT_TYPE.BOOK);
  };

  const value = {
    contentType,
    changeContentType,
    switchToMovie,
    switchToBook,
    isMovieMode: contentType === CONTENT_TYPE.MOVIE,
    isBookMode: contentType === CONTENT_TYPE.BOOK
  };

  return (
    <ContentTypeContext.Provider value={value}>
      {children}
    </ContentTypeContext.Provider>
  );
};
