// 회원가입 페이지

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, addUser } from '../../utils/localStorage';
import './Auth.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birthYear: '',
        favoriteGenres: []
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // 이메일 검증
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        } else {
            // 중복 이메일 체크
            const users = getAllUsers();
            if (users.some(user => user.email === formData.email)) {
                newErrors.email = '이미 사용중인 이메일입니다';
            }
        }

        // 비밀번호 검증
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다';
        }

        // 비밀번호 확인
        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
        }

        // 이름 검증
        if (!formData.name) {
            newErrors.name = '이름을 입력해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // 사용자 등록
        const newUser = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            birthYear: formData.birthYear,
            favoriteGenres: formData.favoriteGenres
        };

        const user = addUser(newUser);

        alert('회원가입이 완료되었습니다!');
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">회원가입</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* 이메일 */}
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="example@email.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="6자 이상 입력해주세요"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <label htmlFor="passwordConfirm">비밀번호 확인</label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className={errors.passwordConfirm ? 'error' : ''}
                            placeholder="비밀번호를 다시 입력해주세요"
                        />
                        {errors.passwordConfirm && <span className="error-message">{errors.passwordConfirm}</span>}
                    </div>

                    {/* 이름 */}
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="이름을 입력해주세요"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <button type="submit" className="auth-submit-button">
                        회원가입
                    </button>
                </form>

                <div className="auth-footer">
                    <p>이미 계정이 있으신가요?</p>
                    <button onClick={() => navigate('/login')} className="auth-link-button">
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
