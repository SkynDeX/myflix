// 개발자 도구 페이지 (더미 데이터 관리)

import React, { useState, useEffect } from 'react';
import { insertDummyDataToLocalStorage, removeDummyDataFromLocalStorage } from '../utils/dummyDataGenerator';
import './DevTools.css';

const DevTools = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dataStatus, setDataStatus] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    checkDataStatus();
  }, []);

  const checkDataStatus = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]');
      const recommendedContent = JSON.parse(localStorage.getItem('recommendedContent') || '[]');
      const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
      const likedPlaylists = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');

      setDataStatus({
        users: users.length,
        wishlists: wishlists.length,
        recommendedContent: recommendedContent.length,
        playlists: playlists.length,
        likedPlaylists: likedPlaylists.length
      });
    } catch (error) {
      console.error('데이터 상태 확인 실패:', error);
    }
  };

  const handleInsertDummyData = async () => {
    try {
      const success = await insertDummyDataToLocalStorage();
      if (success) {
        setMessage('더미 데이터가 성공적으로 삽입되었습니다!');
        setMessageType('success');
        checkDataStatus();
      } else {
        setMessage('더미 데이터 삽입에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('더미 데이터 삽입 중 오류가 발생했습니다: ' + error.message);
      setMessageType('error');
    }

    // 3초 후 메시지 제거
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleRemoveDummyData = async () => {
    try {
      const success = await removeDummyDataFromLocalStorage();
      if (success) {
        setMessage('더미 데이터가 성공적으로 제거되었습니다!');
        setMessageType('success');
        checkDataStatus();
      } else {
        setMessage('더미 데이터 제거에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('더미 데이터 제거 중 오류가 발생했습니다: ' + error.message);
      setMessageType('error');
    }

    // 3초 후 메시지 제거
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleClearAllData = () => {
    if (window.confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        localStorage.clear();
        setMessage('모든 데이터가 삭제되었습니다!');
        setMessageType('success');
        checkDataStatus();
      } catch (error) {
        setMessage('데이터 삭제 중 오류가 발생했습니다: ' + error.message);
        setMessageType('error');
      }

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <div className="dev-tools-toggle">
        <button onClick={toggleVisibility} className="toggle-button">
          개발자 도구
        </button>
      </div>
    );
  }

  return (
    <div className="dev-tools">
      <div className="dev-tools-header">
        <h2>개발자 도구</h2>
        <button onClick={toggleVisibility} className="close-button">
          ✕
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="dev-tools-content">
        <div className="section">
          <h3>현재 데이터 상태</h3>
          <div className="data-status">
            <div className="status-item">
              <span className="status-label">사용자:</span>
              <span className="status-value">{dataStatus.users || 0}명</span>
            </div>
            <div className="status-item">
              <span className="status-label">위시리스트:</span>
              <span className="status-value">{dataStatus.wishlists || 0}개</span>
            </div>
            <div className="status-item">
              <span className="status-label">추천 컨텐츠:</span>
              <span className="status-value">{dataStatus.recommendedContent || 0}개</span>
            </div>
            <div className="status-item">
              <span className="status-label">플레이리스트:</span>
              <span className="status-value">{dataStatus.playlists || 0}개</span>
            </div>
            <div className="status-item">
              <span className="status-label">좋아요한 리스트:</span>
              <span className="status-value">{dataStatus.likedPlaylists || 0}개</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>더미 데이터 관리</h3>
          <div className="action-buttons">
            <button onClick={handleInsertDummyData} className="action-button insert">
              더미 데이터 삽입
            </button>
            <button onClick={handleRemoveDummyData} className="action-button remove">
              더미 데이터 제거
            </button>
            <button onClick={handleClearAllData} className="action-button clear">
              모든 데이터 삭제
            </button>
          </div>
          <p className="note">
            더미 데이터를 삽입하면 테스트용 사용자, 위시리스트, 플레이리스트 등이 생성됩니다.
            <br />
            테스트 계정: user1@test.com ~ user8@test.com (비밀번호: 123123)
          </p>
        </div>

        <div className="section">
          <h3>사용법</h3>
          <div className="usage">
            <ol>
              <li><strong>더미 데이터 삽입:</strong> 테스트용 데이터를 생성합니다.</li>
              <li><strong>더미 데이터 제거:</strong> 생성된 더미 데이터만 제거합니다.</li>
              <li><strong>모든 데이터 삭제:</strong> LocalStorage의 모든 데이터를 삭제합니다.</li>
              <li><strong>테스트 계정:</strong> user1@test.com ~ user8@test.com로 로그인하여 테스트할 수 있습니다.</li>
            </ol>
          </div>
        </div>

        <div className="section">
          <h3>새로고침</h3>
          <button onClick={checkDataStatus} className="refresh-button">
            데이터 상태 새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
