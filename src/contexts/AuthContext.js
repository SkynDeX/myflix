// 인증 컨텍스트 - 사용자 인증 상태 관리

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 컴포넌트 마운트 시 로컬스토리지에서 사용자 정보 불러오기
    useEffect(() => {
        const savedUser = getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    // 로그인
    const login = (userData) => {
        setCurrentUser(userData);
        setUser(userData);
    };

    // 로그아웃
    const logout = () => {
        clearCurrentUser();
        setUser(null);
    };

    // 사용자 정보 업데이트
    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setCurrentUser(updatedUser);
        setUser(updatedUser);
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
