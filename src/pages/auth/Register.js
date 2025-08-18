import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/storage';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 기존 사용자 목록 확인
      const registeredUsers = JSON.parse(localStorage.getItem('myflix_registered_users') || '[]');
      
      // 이메일 중복 확인
      const existingUser = registeredUsers.find(u => u.email === formData.email);
      if (existingUser) {
        setErrors({
          email: '이미 등록된 이메일입니다.'
        });
        setIsLoading(false);
        return;
      }

      // 새 사용자 생성
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // 실제 앱에서는 해시화 필요
        registeredAt: new Date().toISOString()
      };

      // 사용자 목록에 추가
      registeredUsers.push(newUser);
      localStorage.setItem('myflix_registered_users', JSON.stringify(registeredUsers));

      // 자동 로그인
      const userInfo = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      userService.saveUser(userInfo);
      navigate('/');
      
      // 페이지 새로고침으로 헤더 업데이트
      window.location.reload();

    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrors({
        general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>회원가입</h1>
            <p>MyFlix와 함께 새로운 컨텐츠를 발견하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="이름을 입력하세요"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="이메일을 입력하세요"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-large auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '가입 처리중...' : '회원가입'}
            </button>
          </form>

          <div className="auth-footer">
            <p>이미 계정이 있으신가요? <Link to="/login" className="auth-link">로그인</Link></p>
          </div>

          {/* 포트폴리오 안내 */}
          <div className="portfolio-notice">
            <h4>📋 포트폴리오 프로젝트 안내</h4>
            <p>이 애플리케이션은 React 학습용 포트폴리오 프로젝트입니다.</p>
            <ul>
              <li>실제 서버 없이 localStorage 사용</li>
              <li>TMDB와 네이버 도서 API 활용</li>
              <li>영화/도서 추천 및 개인화 기능</li>
              <li>반응형 디자인 적용</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;