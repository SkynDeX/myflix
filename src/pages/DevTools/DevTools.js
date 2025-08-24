import React, { useState } from 'react';
import { generateDummyData, clearAllDummyData } from '../../utils/dummyData';
import './DevTools.css';

const DevTools = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerateDummyData = async () => {
        setIsGenerating(true);
        setMessage('');
        
        try {
            await generateDummyData();
            setMessage('✅ 더미데이터가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('더미데이터 생성 실패:', error);
            setMessage('❌ 더미데이터 생성에 실패했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClearDummyData = () => {
        setIsClearing(true);
        setMessage('');
        
        try {
            clearAllDummyData();
            setMessage('🗑️ 모든 더미데이터가 삭제되었습니다.');
        } catch (error) {
            console.error('더미데이터 삭제 실패:', error);
            setMessage('❌ 더미데이터 삭제에 실패했습니다.');
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="dev-tools">
            <div className="dev-tools-container">
                <h1>🛠️ 개발자 도구</h1>
                <p className="dev-tools-description">
                    시연용 더미데이터를 관리할 수 있습니다.
                </p>

                <div className="dev-tools-actions">
                    <div className="action-card">
                        <h3>📝 더미데이터 생성</h3>
                        <p>
                            • 더미 유저 10명 (user0@gmail.com ~ user9@gmail.com)<br/>
                            • 영화 추천 리스트 20개<br/>
                            • 도서 추천 리스트 5개<br/>
                            • 혼합 추천 리스트 5개<br/>
                            • 각 리스트당 5-10개의 컨텐츠 포함
                        </p>
                        <button 
                            onClick={handleGenerateDummyData}
                            disabled={isGenerating}
                            className="action-btn generate-btn"
                        >
                            {isGenerating ? '생성 중...' : '더미데이터 생성'}
                        </button>
                    </div>

                    <div className="action-card">
                        <h3>🗑️ 더미데이터 삭제</h3>
                        <p>
                            생성된 모든 더미데이터를 삭제합니다.<br/>
                            이 작업은 되돌릴 수 없으니 주의하세요.
                        </p>
                        <button 
                            onClick={handleClearDummyData}
                            disabled={isClearing}
                            className="action-btn clear-btn"
                        >
                            {isClearing ? '삭제 중...' : '모든 더미데이터 삭제'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="dev-tools-warning">
                    ⚠️ 이 페이지는 개발 및 시연 목적으로만 사용됩니다.
                </div>
            </div>
        </div>
    );
};

export default DevTools;