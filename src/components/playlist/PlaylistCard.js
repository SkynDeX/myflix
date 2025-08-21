// PlaylistCard 컴포넌트

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../utils/localStorage';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist, showUserInfo = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/playlist/${playlist.id}`);
    };

    const getUserDisplayName = () => {
        if (!showUserInfo || !playlist.userId) return null;
        
        const allUsers = getAllUsers();
        const user = allUsers.find(u => u.id === playlist.userId);
        if (!user) return '알 수 없는 사용자';
        
        return user.name || user.email;
    };

    return (
        <div className="playlist-card" onClick={handleClick}>
            <div className="playlist-card-header">
                <h3 className="playlist-title">{playlist.title}</h3>
                {showUserInfo && (
                    <div className="playlist-user-info">
                        <span className="user-name-small">{getUserDisplayName()}</span>
                    </div>
                )}
            </div>

            <p className="playlist-description">{playlist.description}</p>

            <div className="playlist-info">
                <span className="playlist-date">
                    {new Date(playlist.createdAt).toLocaleDateString()}
                </span>
                <span className="playlist-item-count">
                    {playlist.items ? playlist.items.length : 0}개 항목
                </span>
                <div className="playlist-likes">
                    <span className="like-icon">❤️</span>
                    <span className="like-count">{playlist.likes || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistCard;
