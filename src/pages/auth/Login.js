// 로그인 페이지

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../utils/localStorage';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 제거
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    // 사용자 인증
    const users = getAllUsers();
    const user = users.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // 로그인 성공
      login(user);
      navigate('/');
    } else {
      // 로그인 실패
      setError('이메일 또는 비밀번호가 일치하지 않습니다');
    }
  };

  // 테스트 계정으로 로그인
  const handleTestLogin = () => {
    const testUser = {
      id: 'test-user',
      email: 'test@myflix.com',
      name: '테스트 사용자',
      password: 'test123'
    };
    login(testUser);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">로그인</h2>
        
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
              className={error ? 'error' : ''}
              placeholder="이메일을 입력하세요"
            />
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
              className={error ? 'error' : ''}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <button type="submit" className="auth-submit-button">
            로그인
          </button>
        </form>

        {/* 테스트 로그인 버튼 */}
        <div className="test-login-section">
          <div className="divider">
            <span>또는</span>
          </div>
          <button onClick={handleTestLogin} className="test-login-button">
            테스트 계정으로 로그인
          </button>
          <p className="test-info">개발 테스트용 계정입니다</p>
        </div>

        <div className="auth-footer">
          <p>아직 계정이 없으신가요?</p>
          <button onClick={() => navigate('/signup')} className="auth-link-button">
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
