// 회원정보 수정 페이지

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    updateUser,
    getAllUsers
} from '../../utils/localStorage';
import { STORAGE_KEYS } from '../../constants/constants';
import './ProfileEdit.css';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { user, updateUser: updateAuthUser, logout } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        // 현재 사용자 정보로 폼 초기화
        setFormData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || ''
        }));
    }, [user, navigate]);

    const validateForm = () => {
        const newErrors = {};

        // 이름 검증
        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요.';
        }

        // 이메일 검증
        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        } else {
            // 이메일 중복 체크 (현재 사용자 제외)
            const allUsers = getAllUsers();
            const emailExists = allUsers.some(u => u.id !== user.id && u.email === formData.email);
            if (emailExists) {
                newErrors.email = '이미 사용 중인 이메일입니다.';
            }
        }

        // 비밀번호 변경 시 검증
        if (showPasswordFields) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
            } else if (formData.currentPassword !== user.password) {
                newErrors.currentPassword = '현재 비밀번호가 올바르지 않습니다.';
            }

            if (!formData.newPassword) {
                newErrors.newPassword = '새 비밀번호를 입력해주세요.';
            } else if (formData.newPassword.length < 6) {
                newErrors.newPassword = '비밀번호는 6자 이상이어야 합니다.';
            }

            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // 해당 필드의 에러 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // 업데이트할 데이터 준비
            const updateData = {
                name: formData.name,
                email: formData.email
            };

            // 비밀번호 변경 시
            if (showPasswordFields && formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            // 사용자 정보 업데이트
            const updatedUser = updateUser(user.id, updateData);
            
            if (updatedUser) {
                // AuthContext 업데이트 (localStorage도 자동으로 업데이트됨)
                updateAuthUser(updateData);
                
                alert('회원정보가 성공적으로 수정되었습니다.');
                navigate('/mypage');
            } else {
                alert('회원정보 수정 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            alert('회원정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('정말로 회원탈퇴를 하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            try {
                // 사용자 관련 모든 데이터 삭제
                const allUsers = getAllUsers();
                const updatedUsers = allUsers.filter(u => u.id !== user.id);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

                // 위시리스트 삭제
                const wishlists = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '{}');
                delete wishlists[user.id];
                localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlists));

                // 플레이리스트 삭제
                const playlists = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_PLAYLISTS) || '{}');
                delete playlists[user.id];
                localStorage.setItem(STORAGE_KEYS.MY_PLAYLISTS, JSON.stringify(playlists));

                // 좋아요한 플레이리스트 삭제
                const likedPlaylists = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_PLAYLISTS) || '{}');
                delete likedPlaylists[user.id];
                localStorage.setItem(STORAGE_KEYS.LIKED_PLAYLISTS, JSON.stringify(likedPlaylists));

                // 친구 관련 데이터 삭제
                const friends = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS) || '{}');
                delete friends[user.id];
                // 다른 사용자의 친구 목록에서도 제거
                Object.keys(friends).forEach(userId => {
                    friends[userId] = friends[userId].filter(friendId => friendId !== user.id);
                });
                localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));

                // 로그아웃 처리
                logout();
                
                alert('회원탈퇴가 완료되었습니다.');
                navigate('/');
            } catch (error) {
                console.error('회원탈퇴 실패:', error);
                alert('회원탈퇴 중 오류가 발생했습니다.');
            }
        }
        setShowDeleteConfirm(false);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-edit-page">
            <div className="profile-edit-header">
                <h1>회원정보 수정</h1>
                <p className="profile-edit-subtitle">개인정보를 안전하게 관리하세요</p>
            </div>

            <div className="profile-edit-content">
                <form onSubmit={handleSubmit} className="profile-form">
                    {/* 기본 정보 */}
                    <div className="form-section">
                        <h2 className="section-title">기본 정보</h2>
                        
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'error' : ''}
                                placeholder="이름을 입력하세요"
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="이메일을 입력하세요"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                    </div>

                    {/* 비밀번호 변경 */}
                    <div className="form-section">
                        <div className="section-header">
                            <h2 className="section-title">비밀번호 변경</h2>
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPasswordFields(!showPasswordFields)}
                            >
                                {showPasswordFields ? '취소' : '비밀번호 변경'}
                            </button>
                        </div>

                        {showPasswordFields && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">현재 비밀번호</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className={errors.currentPassword ? 'error' : ''}
                                        placeholder="현재 비밀번호를 입력하세요"
                                    />
                                    {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">새 비밀번호</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className={errors.newPassword ? 'error' : ''}
                                        placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                                    />
                                    {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={errors.confirmPassword ? 'error' : ''}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 버튼들 */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/mypage')}
                            className="cancel-button"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="save-button"
                        >
                            {loading ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </form>

                {/* 회원탈퇴 */}
                <div className="danger-zone">
                    <h2 className="section-title danger">위험 구역</h2>
                    <p className="danger-description">
                        회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="delete-account-button"
                    >
                        회원탈퇴
                    </button>
                </div>

                {/* 회원탈퇴 확인 모달 */}
                {showDeleteConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>회원탈퇴 확인</h3>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>정말로 탈퇴하시겠습니까?</p>
                                <p className="warning-text">
                                    탈퇴 시 모든 데이터(플레이리스트, 위시리스트, 친구 등)가 삭제되며 
                                    복구할 수 없습니다.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    취소
                                </button>
                                <button
                                    className="confirm-delete-button"
                                    onClick={handleDeleteAccount}
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileEdit;