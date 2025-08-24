import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Nav from './components/common/Nav';
import { AuthProvider } from './contexts/AuthContext';
import { ContentTypeProvider } from './contexts/ContentTypeContext';
import { FriendProvider } from './contexts/FriendContext';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ContentDetail from './pages/ContentDetail/ContentDetail';
import Friends from './pages/Friends/Friends';
import Home from './pages/Home/Home';
import LikedPlaylists from './pages/Playlists/LikedPlaylists/LikedPlaylists';
import MyPage from './pages/MyPage/MyPage';
import MyPlaylists from './pages/Playlists/MyPlaylists/MyPlaylists';
import PlaylistDetail from './pages/Playlists/PlaylistDetail/PlaylistDetail';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import RandomRecommend from './pages/RandomRecommend/RandomRecommend';
import RecommendedContent from './pages/RecommendedContent/RecommendedContent';
import Search from './pages/Search/Search';
import UserPlaylists from './pages/Playlists/UserPlaylists/UserPlaylists';
import Wishlist from './pages/Wishlist/Wishlist';
import DevTools from './pages/DevTools/DevTools';

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
                            <Route path="/friends" element={
                                <ProtectedRoute>
                                    <Friends />
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

                            {/* 개발자 도구 */}
                            <Route path="/devtools" element={<DevTools />} />
                        </Routes>

                        <Footer />
                        </div>
                    </FriendProvider>
                </ContentTypeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
