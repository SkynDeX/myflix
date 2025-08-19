// 랜덤 추천 페이지

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentType } from '../contexts/ContentTypeContext';
import { getTop200Movies } from '../services/tmdbApi';
import { getGoogleBestsellers } from '../services/googleBooksApi';
import './RandomRecommend.css';

const RandomRecommend = () => {
    const navigate = useNavigate();
    const { isMovieMode } = useContentType();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRandomContent();
    }, [isMovieMode]);

    const loadRandomContent = async () => {
        setLoading(true);
        try {
            let contentList = [];

            if (isMovieMode) {
                // TOP 200 영화 중 랜덤 선택
                contentList = await getTop200Movies();
            } else {
                // TOP 200 도서 중 랜덤 선택
                contentList = await getGoogleBestsellers(200);
            }

            if (contentList.length > 0) {
                // 랜덤으로 하나 선택
                const randomIndex = Math.floor(Math.random() * Math.min(contentList.length, 200));
                const randomContent = contentList[randomIndex];

                // 컨텐츠 상세 페이지로 이동
                const contentId = isMovieMode ? randomContent.id : randomContent.isbn;
                navigate(`/content/${isMovieMode ? 'movie' : 'book'}/${contentId}`);
            } else {
                throw new Error('컨텐츠를 찾을 수 없습니다');
            }
        } catch (error) {
            console.error('랜덤 컨텐츠 로드 실패:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="random-recommend-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>당신을 위한 특별한 {isMovieMode ? '영화' : '도서'}를 찾고 있습니다...</h2>
                    <p>MyFlix가 엄선한 컨텐츠 중에서 선택중입니다</p>
                </div>
            </div>
        );
    }

    return (
        <div className="random-recommend-page">
            <div className="error-container">
                <h2>추천 컨텐츠를 불러올 수 없습니다</h2>
                <p>잠시 후 다시 시도해주세요</p>
                <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
            </div>
        </div>
    );
};

export default RandomRecommend;
