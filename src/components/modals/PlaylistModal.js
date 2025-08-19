// PlaylistModal 컴포넌트 - 플레이리스트에 추가 모달

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyPlaylists, addToPlaylist } from '../../utils/localStorage';
import './Modal.css';

const PlaylistModal = ({ content, type, onClose }) => {
    const { user } = useAuth();
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    const playlists = getMyPlaylists(user.id);

    const handleAddToPlaylist = () => {
        if (!selectedPlaylist) {
            alert('플레이리스트를 선택해주세요.');
            return;
        }

        const contentData = {
            id: type === 'movie' ? content.id : content.isbn,
            type: type,
            title: content.title,
            image: type === 'movie' ? content.poster_path : content.image,
            description: content.overview || content.description
        };

        addToPlaylist(user.id, selectedPlaylist, contentData);
        alert('플레이리스트에 추가되었습니다!');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>플레이리스트에 추가</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">"{content.title}"을(를) 추가할 플레이리스트를 선택하세요</p>

                    {playlists.length === 0 ? (
                        <p className="no-playlists-message">
                            생성된 플레이리스트가 없습니다.
                            <br />
                            먼저 나만의 추천 리스트를 만들어주세요.
                        </p>
                    ) : (
                        <div className="playlist-select-list">
                            {playlists.map(playlist => (
                                <label key={playlist.id} className="playlist-select-item">
                                    <input
                                        type="radio"
                                        name="playlist"
                                        value={playlist.id}
                                        checked={selectedPlaylist === playlist.id}
                                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                                    />
                                    <div className="playlist-select-info">
                                        <span className="playlist-select-title">{playlist.title}</span>
                                        <span className="playlist-select-count">
                                            {playlist.items ? playlist.items.length : 0}개 항목
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="modal-button cancel" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="modal-button confirm"
                        onClick={handleAddToPlaylist}
                        disabled={!selectedPlaylist}
                    >
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistModal;
