// 나만의 추천 리스트 페이지

import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContentType } from '../contexts/ContentTypeContext';
import { 
  getMyPlaylists, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist 
} from '../utils/localStorage';
import PlaylistCard from '../components/playlist/PlaylistCard';
import './MyPlaylists.css';

const MyPlaylists = () => {
  const { user } = useAuth();
  const { isMovieMode } = useContentType();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = () => {
    const userPlaylists = getMyPlaylists(user.id);
    // 최신순으로 정렬
    const sortedPlaylists = userPlaylists.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPlaylists(sortedPlaylists);
  };

  const handleCreatePlaylist = () => {
    if (!formData.title.trim()) {
      alert('리스트 제목을 입력해주세요.');
      return;
    }

    const newPlaylist = createPlaylist(user.id, {
      title: formData.title,
      description: formData.description,
      type: isMovieMode ? 'movie' : 'book'
    });

    setFormData({ title: '', description: '' });
    setShowCreateModal(false);
    loadPlaylists();
    alert('새로운 추천 리스트가 생성되었습니다!');
  };

  const handleUpdatePlaylist = () => {
    if (!formData.title.trim()) {
      alert('리스트 제목을 입력해주세요.');
      return;
    }

    updatePlaylist(user.id, editingPlaylist.id, {
      title: formData.title,
      description: formData.description
    });

    setFormData({ title: '', description: '' });
    setEditingPlaylist(null);
    loadPlaylists();
    alert('추천 리스트가 수정되었습니다!');
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('정말로 이 추천 리스트를 삭제하시겠습니까?')) {
      deletePlaylist(user.id, playlistId);
      loadPlaylists();
      alert('추천 리스트가 삭제되었습니다.');
    }
  };

  const handleEditClick = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      title: playlist.title,
      description: playlist.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPlaylist(null);
    setFormData({ title: '', description: '' });
    setShowCreateModal(false);
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="my-playlists-page">
      <div className="my-playlists-header">
        <h1>나만의 추천 리스트</h1>
        <p className="my-playlists-subtitle">
          나만의 특별한 {isMovieMode ? '영화' : '도서'} 컬렉션을 만들어 공유해보세요
        </p>
      </div>

      {/* 리스트 생성 버튼 */}
      <div className="playlist-actions">
        <button 
          className="create-playlist-button"
          onClick={() => setShowCreateModal(true)}
        >
          + 새 리스트 만들기
        </button>
        <div className="playlist-stats">
          총 {playlists.length}개의 리스트
        </div>
      </div>

      {/* 플레이리스트 목록 */}
      {playlists.length > 0 ? (
        <div className="my-playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item">
              <div onClick={() => handlePlaylistClick(playlist.id)}>
                <PlaylistCard playlist={playlist} />
              </div>
              <div className="playlist-controls">
                <button 
                  className="control-button edit"
                  onClick={() => handleEditClick(playlist)}
                  title="수정"
                >
                  ✏️
                </button>
                <button 
                  className="control-button delete"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-playlists">
          <div className="empty-icon">📚</div>
          <h2>아직 만든 추천 리스트가 없습니다</h2>
          <p>나만의 특별한 컬렉션을 만들어 다른 사람들과 공유해보세요!</p>
          <button 
            className="create-first-playlist-button"
            onClick={() => setShowCreateModal(true)}
          >
            첫 리스트 만들기
          </button>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {(showCreateModal || editingPlaylist) && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlaylist ? '리스트 수정' : '새 리스트 만들기'}</h2>
              <button className="modal-close" onClick={handleCancelEdit}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">리스트 제목 *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 혼자 보기 아까운 영화 10선"
                  maxLength="50"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">설명</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="이 리스트에 대한 설명을 입력해주세요"
                  rows="4"
                  maxLength="200"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-button cancel" onClick={handleCancelEdit}>
                취소
              </button>
              <button 
                className="modal-button confirm" 
                onClick={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
              >
                {editingPlaylist ? '수정하기' : '만들기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
