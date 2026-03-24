import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import POS from './pages/POS';
import ManagerDashboard from './pages/ManagerDashboard';
import Login from './pages/Login';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { currentUser, fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        
        <Route
          path="/"
          element={
            currentUser ? (
              currentUser.role === 'manager' ? (
                <Navigate to="/dashboard" />
              ) : (
                <POS />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            currentUser?.role === 'manager' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
