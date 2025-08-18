// PlaylistCard 컴포넌트

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="playlist-card" onClick={handleClick}>
      <div className="playlist-card-header">
        <h3 className="playlist-title">{playlist.title}</h3>
        <div className="playlist-likes">
          <span className="like-icon">❤️</span>
          <span className="like-count">{playlist.likes || 0}</span>
        </div>
      </div>
      
      <p className="playlist-description">{playlist.description}</p>
      
      <div className="playlist-info">
        <span className="playlist-item-count">
          {playlist.items ? playlist.items.length : 0}개 항목
        </span>
        <span className="playlist-date">
          {new Date(playlist.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default PlaylistCard;
