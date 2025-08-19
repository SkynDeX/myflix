// import React from 'react';
// import BookCard from './BookCard';
// import './BookList.css';

// const BookList = ({ books, title, loading = false }) => {
//     if (loading) {
//         return (
//             <div className="book-list">
//                 {title && <h2 className="list-title">{title}</h2>}
//                 <div className="book-grid loading">
//                     {[...Array(8)].map((_, index) => (
//                         <div key={index} className="book-skeleton">
//                             <div className="skeleton-cover"></div>
//                             <div className="skeleton-info">
//                                 <div className="skeleton-title"></div>
//                                 <div className="skeleton-author"></div>
//                                 <div className="skeleton-publisher"></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (!books || books.length === 0) {
//         return (
//             <div className="book-list">
//                 {title && <h2 className="list-title">{title}</h2>}
//                 <div className="empty-state">
//                     <span className="empty-icon">📚</span>
//                     <p>표시할 도서가 없습니다.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="book-list">
//             {title && <h2 className="list-title">{title}</h2>}
//             <div className="book-grid">
//                 {books.map((book, index) => (
//                     <BookCard
//                         key={book.isbn || book.title || index}
//                         book={book}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BookList;