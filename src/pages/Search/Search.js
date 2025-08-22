// 검색 상세 페이지

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentCard from '../../components/content/ContentCard';
import { useContentType } from '../../contexts/ContentTypeContext';
import { searchGoogleBooks } from '../../services/googleBooksApi';
import { getGenres, searchMovies } from '../../services/tmdbApi';
import './Search.css';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isMovieMode } = useContentType();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [genres, setGenres] = useState([]);

    // 검색 조건들
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('relevance'); // relevance, date, rating

    useEffect(() => {
        const query = searchParams.get('q') || '';
        setSearchQuery(query);
        if (query) {
            performSearch(query);
        }

        // 장르 목록 로드 (영화 모드일 때만)
        if (isMovieMode) {
            loadGenres();
        }
    }, [searchParams, isMovieMode]);

    const loadGenres = async () => {
        try {
            const genreList = await getGenres();
            setGenres(genreList);
        } catch (error) {
            console.error('장르 목록 로드 실패:', error);
        }
    };

    const performSearch = async (query, page = 1) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            let results = [];

            if (isMovieMode) {
                results = await searchMovies(query, page);
            } else {
                results = await searchGoogleBooks(query, 20, (page - 1) * 20 + 1);
            }

            if (page === 1) {
                setSearchResults(results);
                setCurrentPage(1);
            } else {
                setSearchResults(prev => [...prev, ...results]);
            }

            // 페이지네이션 계산 (더미 데이터 기준)
            setTotalPages(Math.ceil(results.length / 10));
        } catch (error) {
            console.error('검색 실패:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery.trim() });
            setCurrentPage(1);
        }
    };

    const handleFilterChange = () => {
        if (searchQuery.trim()) {
            performSearch(searchQuery.trim(), 1);
            setCurrentPage(1);
        }
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        performSearch(searchQuery, nextPage);
        setCurrentPage(nextPage);
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1900; year--) {
            years.push(year);
        }
        return years;
    };

    const filteredResults = searchResults.filter(item => {
        let passes = true;

        // 장르 필터링 (영화만)
        if (isMovieMode && selectedGenre && item.genre_ids) {
            passes = passes && item.genre_ids.includes(parseInt(selectedGenre));
        }

        // 연도 필터링
        if (selectedYear) {
            if (isMovieMode && item.release_date) {
                const itemYear = new Date(item.release_date).getFullYear();
                passes = passes && itemYear === parseInt(selectedYear);
            } else if (!isMovieMode && item.pubdate) {
                const itemYear = parseInt(item.pubdate.substring(0, 4));
                passes = passes && itemYear === parseInt(selectedYear);
            }
        }

        return passes;
    });

    return (
        <div className="search-page">
            <div className="search-container">
                {/* 검색 헤더 */}
                <div className="search-header">
                    <h1 className="search-title">
                        {searchQuery ? `"${searchQuery}" 검색 결과` : '컨텐츠 검색'}
                    </h1>
                    <p className="search-subtitle">
                        {isMovieMode ? '영화' : '도서'}를 검색하고 원하는 조건으로 필터링해보세요
                    </p>
                </div>

                {/* 검색 폼 */}
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder={`${isMovieMode ? '영화' : '도서'} 제목, 장르, 연도 등을 검색하세요`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-button">
                            검색
                        </button>
                    </div>
                </form>

                {/* 검색 조건 필터 - 검색 폼 바로 아래로 이동 */}
                {searchQuery && (
                    <div className="search-filters">
                        <h3 className="filters-title">검색 조건</h3>
                        <div className="filters-grid">
                            {/* 장르 필터 (영화만) */}
                            {isMovieMode && (
                                <div className="filter-group">
                                    <label htmlFor="genre-filter">장르:</label>
                                    <select
                                        id="genre-filter"
                                        value={selectedGenre}
                                        onChange={(e) => {
                                            setSelectedGenre(e.target.value);
                                            handleFilterChange();
                                        }}
                                        className="filter-select"
                                    >
                                        <option value="">전체 장르</option>
                                        {genres.map(genre => (
                                            <option key={genre.id} value={genre.id}>
                                                {genre.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 연도 필터 */}
                            <div className="filter-group">
                                <label htmlFor="year-filter">연도:</label>
                                <select
                                    id="year-filter"
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="filter-select"
                                >
                                    <option value="">전체 연도</option>
                                    {generateYearOptions().map(year => (
                                        <option key={year} value={year}>
                                            {year}년
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 검색 결과 */}
                {searchQuery && (
                    <div className="search-results">
                        <div className="results-header">
                            <h3 className="results-title">
                                검색 결과 ({filteredResults.length}개)
                            </h3>
                            {filteredResults.length > 0 && (
                                <div className="results-info">
                                    {currentPage}페이지 / {totalPages}페이지
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>검색 중...</p>
                            </div>
                        ) : filteredResults.length > 0 ? (
                            <>
                                <div className="results-grid">
                                    {filteredResults.map((item) => (
                                        <ContentCard
                                            key={item.id}
                                            content={item}
                                            type={isMovieMode ? 'movie' : 'book'}
                                        />
                                    ))}
                                </div>

                                {/* 더보기 버튼 */}
                                {currentPage < totalPages && (
                                    <div className="load-more-container">
                                        <button
                                            onClick={handleLoadMore}
                                            className="load-more-button"
                                            disabled={loading}
                                        >
                                            {loading ? '로딩 중...' : '더보기'}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>검색 결과가 없습니다</h3>
                                <p>
                                    "{searchQuery}"에 대한 검색 결과를 찾을 수 없습니다.
                                    <br />
                                    다른 키워드로 검색해보시거나 검색 조건을 조정해보세요.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 검색 안내 */}
                {!searchQuery && (
                    <div className="search-guide">
                        <div className="guide-icon">💡</div>
                        <h3>검색 팁</h3>
                        <ul className="guide-list">
                            <li>영화 제목, 감독, 배우 이름으로 검색할 수 있습니다</li>
                            <li>도서 제목, 저자, 출판사로 검색할 수 있습니다</li>
                            <li>장르나 연도로 필터링하여 더 정확한 결과를 찾을 수 있습니다</li>
                            <li>검색어를 입력하고 Enter를 누르거나 검색 버튼을 클릭하세요</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
