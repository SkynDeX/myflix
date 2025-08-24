// 랜덤 추천 페이지

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentType } from '../../contexts/ContentTypeContext';
import { getTop200Movies, hasMovieTrailer } from '../../services/tmdbApi';
import { getGoogleBestsellers } from '../../services/googleBooksApi';
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
                // TOP 200 영화 중 예고편 있는 것만 랜덤 선택
                contentList = await getTop200Movies();
                
                // 예고편이 있는 영화 찾기 (최대 10번 시도)
                let attempts = 0;
                let randomContent = null;
                
                while (attempts < 10 && !randomContent) {
                    const randomIndex = Math.floor(Math.random() * Math.min(contentList.length, 200));
                    const candidate = contentList[randomIndex];
                    
                    if (await hasMovieTrailer(candidate.id)) {
                        randomContent = candidate;
                        break;
                    }
                    attempts++;
                }
                
                if (randomContent) {
                    navigate(`/content/movie/${randomContent.id}`);
                } else {
                    // 예고편 없어도 일단 진행
                    const randomIndex = Math.floor(Math.random() * Math.min(contentList.length, 200));
                    const fallbackContent = contentList[randomIndex];
                    navigate(`/content/movie/${fallbackContent.id}`);
                }
            } else {
                // TOP 200 도서 중 랜덤 선택
                contentList = await getGoogleBestsellers(200);
                
                if (contentList.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(contentList.length, 200));
                    const randomContent = contentList[randomIndex];
                    navigate(`/content/book/${randomContent.isbn}`);
                } else {
                    throw new Error('도서를 찾을 수 없습니다');
                }
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
