import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import BrowseFreelancers from './pages/BrowseFreelancers';
import FreelancerDetail from './pages/FreelancerDetail';
import BookingDetail from './pages/BookingDetail';
import Notifications from './pages/Notifications';
import MyProfile from './pages/MyProfile';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ fontSize: '20px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="freelancer">
          <Layout>
            <FreelancerDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/browse" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <BrowseFreelancers />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/freelancer/:id" element={
        <ProtectedRoute>
          <Layout>
            <FreelancerDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/bookings/:id" element={
        <ProtectedRoute>
          <Layout>
            <BookingDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout>
            <Notifications />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-profile" element={
        <ProtectedRoute requiredRole="freelancer">
          <Layout>
            <MyProfile />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
