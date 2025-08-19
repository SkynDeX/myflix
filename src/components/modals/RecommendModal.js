// RecommendModal 컴포넌트 - 친구에게 추천하기 모달

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers, addRecommendation } from '../../utils/localStorage';
import './Modal.css';

const RecommendModal = ({ content, type, onClose }) => {
    const { user } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState([]);

    // 현재 사용자를 제외한 모든 사용자 목록
    const users = getAllUsers().filter(u => u.id !== user.id);

    const handleUserToggle = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleRecommend = () => {
        if (selectedUsers.length === 0) {
            alert('추천할 사용자를 선택해주세요.');
            return;
        }

        const contentData = {
            id: type === 'movie' ? content.id : content.isbn,
            type: type,
            title: content.title,
            image: type === 'movie' ? content.poster_path : content.image,
            description: content.overview || content.description
        };

        selectedUsers.forEach(userId => {
            addRecommendation(user.id, userId, contentData);
        });

        alert(`${selectedUsers.length}명에게 추천했습니다!`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>친구에게 추천하기</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">"{content.title}"을(를) 추천할 친구를 선택하세요</p>

                    {users.length === 0 ? (
                        <p className="no-users-message">추천할 수 있는 사용자가 없습니다.</p>
                    ) : (
                        <div className="user-list">
                            {users.map(u => (
                                <label key={u.id} className="user-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(u.id)}
                                        onChange={() => handleUserToggle(u.id)}
                                    />
                                    <span>{u.name} ({u.email})</span>
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
                        onClick={handleRecommend}
                        disabled={selectedUsers.length === 0}
                    >
                        추천하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecommendModal;
