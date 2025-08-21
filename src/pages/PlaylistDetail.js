// 통합 플레이리스트 상세보기 페이지

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFriend } from '../contexts/FriendContext';
import {
    getPlaylistById,
    deletePlaylist,
    likePlaylist,
    unlikePlaylist,
    getLikedPlaylists,
    getAllUsers
} from '../utils/localStorage';
import ContentCard from '../components/content/ContentCard';
import './PlaylistDetail.css';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { friends } = useFriend();
    
    const [playlist, setPlaylist] = useState(null);
    const [playlistOwner, setPlaylistOwner] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlaylistData();
    }, [id, user]);

    const loadPlaylistData = () => {
        try {
            setLoading(true);
            
            // 플레이리스트 데이터 가져오기
            const playlistData = getPlaylistById(id);
            if (!playlistData) {
                alert('플레이리스트를 찾을 수 없습니다.');
                navigate('/');
                return;
            }

            // 플레이리스트 소유자 정보 가져오기
            const allUsers = getAllUsers();
            const owner = allUsers.find(u => u.id === playlistData.userId);
            
            setPlaylist(playlistData);
            setPlaylistOwner(owner);
            setIsOwner(user && user.id === playlistData.userId);

            // 좋아요 상태 확인
            if (user) {
                const likedPlaylists = getLikedPlaylists(user.id);
                setIsLiked(likedPlaylists.includes(id));
            }

        } catch (error) {
            console.error('플레이리스트 불러오기 실패:', error);
            alert('플레이리스트를 불러오는 중 오류가 발생했습니다.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!window.confirm('이 플레이리스트를 삭제하시겠습니까?\n삭제된 플레이리스트는 복구할 수 없습니다.')) {
            return;
        }

        try {
            deletePlaylist(user.id, id);
            alert('플레이리스트가 삭제되었습니다.');
            navigate('/my-playlists');
        } catch (error) {
            console.error('플레이리스트 삭제 실패:', error);
            alert('플레이리스트 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleLikeToggle = () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        try {
            if (isLiked) {
                unlikePlaylist(user.id, id);
                setIsLiked(false);
                // 플레이리스트 좋아요 수 업데이트
                setPlaylist(prev => ({
                    ...prev,
                    likes: Math.max((prev.likes || 0) - 1, 0)
                }));
            } else {
                likePlaylist(user.id, id);
                setIsLiked(true);
                // 플레이리스트 좋아요 수 업데이트
                setPlaylist(prev => ({
                    ...prev,
                    likes: (prev.likes || 0) + 1
                }));
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const getOwnerDisplayName = () => {
        if (!playlistOwner) return '알 수 없는 사용자';
        return playlistOwner.name || playlistOwner.email;
    };

    const isOwnerFriend = () => {
        if (!playlistOwner || !friends) return false;
        return friends.some(friend => friend.id === playlistOwner.id);
    };

    const handleOwnerClick = () => {
        if (!isOwnerFriend() && !isOwner) {
            if (window.confirm('친구 요청 페이지로 이동하시겠습니까?')) {
                navigate(`/friends/${playlistOwner.email}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="playlist-detail-page">
                <div className="loading-container">
                    <div className="loading-text">플레이리스트를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-detail-page">
                <div className="error-container">
                    <h2>플레이리스트를 찾을 수 없습니다</h2>
                    <button onClick={() => navigate('/')} className="back-button">
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-detail-page">
            {/* 플레이리스트 헤더 */}
            <div className="playlist-detail-header">
                <div className="playlist-header-content">
                    <div className="playlist-title-section">
                        <h1 className="playlist-title">{playlist.title}</h1>
                        <p className="playlist-description">{playlist.description}</p>
                    </div>

                    {/* 소유자 정보 */}
                    <div className="playlist-owner-info">
                        <div className="owner-details">
                            <span className={`owner-name ${isOwnerFriend() || isOwner ? '' : 'clickable'}`} onClick={handleOwnerClick}>{getOwnerDisplayName()}</span>
                            {isOwnerFriend() && <span className="owner-badge">친구</span>}
                            <div className="playlist-meta">
                                <span className="playlist-date">
                                    {new Date(playlist.createdAt).toLocaleDateString()}
                                </span>
                                <span className="playlist-item-count">
                                    {playlist.items ? playlist.items.length : 0}개 항목
                                </span>
                                <span className="playlist-likes">
                                    ❤️ {playlist.likes || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="playlist-actions">
                    {isOwner ? (
                        <button 
                            onClick={handleDelete}
                            className="action-button delete-button"
                        >
                            🗑️ 삭제
                        </button>
                    ) : (
                        <button 
                            onClick={handleLikeToggle}
                            className={`action-button like-button ${isLiked ? 'liked' : ''}`}
                        >
                            {isLiked ? '💖' : '🤍'}좋아요
                        </button>
                    )}
                </div>
            </div>

            {/* 컨텐츠 그리드 */}
            <div className="playlist-content">
                {playlist.items && playlist.items.length > 0 ? (
                    <div className="content-grid-small">
                        {playlist.items.map((item, index) => (
                            <ContentCard
                                key={`${item.type}-${item.id}-${index}`}
                                content={item}
                                type={item.type}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-playlist">
                        <div className="empty-icon">📝</div>
                        <h2>빈 플레이리스트</h2>
                        <p>아직 추가된 컨텐츠가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;