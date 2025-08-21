import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentTypeProvider } from './contexts/ContentTypeContext';
import { FriendProvider } from './contexts/FriendContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Nav from './components/common/Nav';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MyPage from './pages/MyPage';
import Wishlist from './pages/Wishlist';
import RecommendedContent from './pages/RecommendedContent';
import MyPlaylists from './pages/MyPlaylists';
import ContentDetail from './pages/ContentDetail';
import RandomRecommend from './pages/RandomRecommend';
import UserPlaylists from './pages/UserPlaylists';
import Search from './pages/Search';
import Friends from './pages/Friends';
import PlaylistDetail from './pages/PlaylistDetail';
import LikedPlaylists from './pages/LikedPlaylists';
import ProfileEdit from './pages/ProfileEdit';
import DevTools from './pages/DevTools';
import './App.css';

// 인증이 필요한 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('userInfo');
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ContentTypeProvider>
                    <FriendProvider>
                        <div className="App">
                        <Header />

                        <Routes>
                            {/* 홈 */}
                            <Route path="/" element={
                                <>
                                    <Nav />
                                    <Home />
                                </>
                            } />

                            {/* 인증 */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />

                            {/* 마이페이지 관련 (인증 필요) */}
                            <Route path="/mypage" element={
                                <ProtectedRoute>
                                    <MyPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/wishlist" element={
                                <ProtectedRoute>
                                    <Wishlist />
                                </ProtectedRoute>
                            } />
                            <Route path="/recommended" element={
                                <ProtectedRoute>
                                    <RecommendedContent />
                                </ProtectedRoute>
                            } />
                            <Route path="/my-playlists" element={
                                <ProtectedRoute>
                                    <MyPlaylists />
                                </ProtectedRoute>
                            } />
                            <Route path="/liked-playlists" element={
                                <ProtectedRoute>
                                    <LikedPlaylists />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile/edit" element={
                                <ProtectedRoute>
                                    <ProfileEdit />
                                </ProtectedRoute>
                            } />
                            <Route path="/friends/:id" element={
                                <ProtectedRoute>
                                    <Friends />
                                </ProtectedRoute>
                            } />

                            {/* 컨텐츠 관련 */}
                            <Route path="/search" element={<Search />} />
                            <Route path="/content/:type/:id" element={<ContentDetail />} />
                            <Route path="/recommend/random" element={<RandomRecommend />} />
                            <Route path="/playlists" element={<UserPlaylists />} />
                            <Route path="/playlist/:id" element={<PlaylistDetail />} />
                        </Routes>

                        <Footer />
                        {/* <DevTools /> */}
                        </div>
                    </FriendProvider>
                </ContentTypeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
