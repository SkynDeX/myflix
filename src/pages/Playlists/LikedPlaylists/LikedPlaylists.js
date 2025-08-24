// 내가 좋아요한 추천리스트 페이지

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
    getLikedPlaylists,
    getPlaylistById,
    getAllUsers,
    unlikePlaylist
} from '../../../utils/localStorage';
import PlaylistCard from '../../../components/playlist/PlaylistCard';
import './LikedPlaylists.css';
import { useNavigate } from 'react-router-dom';

const LikedPlaylists = () => {
    const { user } = useAuth();
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadLikedPlaylists();
    }, [user]);

    const loadLikedPlaylists = () => {
        if (!user) {
            setLikedPlaylists([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // 좋아요한 플레이리스트 ID 목록 가져오기
            const likedPlaylistIds = getLikedPlaylists(user.id);
            const allUsers = getAllUsers();
            
            // 각 플레이리스트의 상세 정보 가져오기
            const playlistsWithDetails = likedPlaylistIds
                .map(playlistId => {
                    const playlist = getPlaylistById(playlistId);
                    if (playlist) {
                        // 플레이리스트 소유자 정보 추가
                        const owner = allUsers.find(u => u.id === playlist.userId);
                        return {
                            ...playlist,
                            ownerName: owner ? (owner.name || owner.email) : '알 수 없는 사용자'
                        };
                    }
                    return null;
                })
                .filter(playlist => playlist !== null) // null 값 제거 (삭제된 플레이리스트)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬

            setLikedPlaylists(playlistsWithDetails);

        } catch (error) {
            console.error('좋아요한 추천 리스트 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigator = useNavigate();

    const handleUnlike = (playlistId) => {
        if (!window.confirm('이 추천 리스트를 좋아요 목록에서 제거하시겠습니까?')) {
            return;
        }

        try {
            unlikePlaylist(user.id, playlistId);
            // UI에서 즉시 제거
            setLikedPlaylists(prev => prev.filter(p => p.id !== playlistId));
        } catch (error) {
            console.error('좋아요 해제 실패:', error);
            alert('좋아요 해제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="liked-playlists-page">
                <div className="loading-container">
                    <div className="loading-text">좋아요한 추천 리스트를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="liked-playlists-page">
            {/* 헤더 */}
            <div className="liked-playlists-header">
                <h1>내가 좋아요한 추천 리스트</h1>
                <p className="liked-playlists-subtitle">
                    다른 사용자들이 만든 멋진 추천 리스트들을 모아보세요
                </p>
            </div>

            {/* 통계 */}
            <div className="liked-playlists-stats">
                <div className="stat-item">
                    <span className="stat-number">{likedPlaylists.length}</span>
                    <span className="stat-label">개의 추천 리스트</span>
                </div>
            </div>

            {/* 플레이리스트 목록 */}
            {likedPlaylists.length > 0 ? (
                <div className="liked-playlists-grid">
                    {likedPlaylists.map((playlist) => (
                        <div key={playlist.id} className="liked-playlist-item">
                            <PlaylistCard playlist={playlist} />
                            
                            {/* 플레이리스트 추가 정보 */}
                            <div className="playlist-extra-info">
                                <div className="playlist-owner">
                                    <span className="owner-label">by</span>
                                    <span className="owner-name">{playlist.ownerName}</span>
                                </div>
                                <button
                                    onClick={() => handleUnlike(playlist.id)}
                                    className="unlike-button"
                                    title="좋아요 취소"
                                >
                                    💔
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-liked-playlists">
                    <div className="empty-icon">💖</div>
                    <h2>아직 좋아요한 추천 리스트가 없어요</h2>
                    <p>다른 사용자들의 멋진 추천 리스트를 탐색해보세요!</p>
                    <button 
                        onClick={() => navigator('/playlists')}
                        className="explore-button"
                    >
                        추천 리스트 둘러보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default LikedPlaylists;