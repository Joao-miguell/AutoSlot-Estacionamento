import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { AdminLayout } from './components/Layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute><AdminLayout><Relatorios /></AdminLayout></PrivateRoute>} />
          <Route path="/configuracoes" element={<PrivateRoute perfisPermitidos={['ADMIN']}><AdminLayout><Configuracoes /></AdminLayout></PrivateRoute>} />
          <Route path="/acesso-negado" element={<AccessDenied />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
