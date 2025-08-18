import React from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();

  return (
    <div className="container">
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1>도서 상세 페이지</h1>
        <p>도서 ID: {id}</p>
        <p>도서 정보가 여기에 표시됩니다.</p>
      </div>
    </div>
  );
};

export default BookDetail;