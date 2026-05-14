import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// AUTH E LAYOUT
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { AdminLayout } from './components/Layout/AdminLayout';

// PÁGINAS
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';

// NOVOS COMPONENTES (O QUE ESTAVA FALTANDO)
import CheckIn from './pages/CheckIn';
import Placeholder from './pages/PlaceholderPage'; // Importando PlaceholderPage como "Placeholder"
import './index.css';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ROTA PÚBLICA */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS COMPARTILHADAS (ADMIN E FUNCIONÁRIO) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </PrivateRoute>
          } />
          
          <Route path="/checkin" element={
            <PrivateRoute>
              <AdminLayout><CheckIn /></AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/vagas" element={
            <PrivateRoute>
              <AdminLayout><Placeholder titulo="Mapa de Vagas" /></AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/reservas" element={
            <PrivateRoute>
              <AdminLayout><Placeholder titulo="Reservas" /></AdminLayout>
            </PrivateRoute>
          } />

          {/* ROTAS EXCLUSIVAS DE ADMIN */}
          <Route path="/usuarios" element={
            <PrivateRoute perfisPermitidos={['ADMIN']}>
              <AdminLayout><Placeholder titulo="Gestão de Usuários" /></AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/relatorios" element={
            <PrivateRoute perfisPermitidos={['ADMIN']}>
              <AdminLayout><Placeholder titulo="Relatórios Financeiros" /></AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/tarifas" element={
            <PrivateRoute perfisPermitidos={['ADMIN']}>
              <AdminLayout><Placeholder titulo="Configuração de Tarifas" /></AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/auditoria" element={
            <PrivateRoute perfisPermitidos={['ADMIN']}>
              <AdminLayout><Placeholder titulo="Logs de Auditoria" /></AdminLayout>
            </PrivateRoute>
          } />

          {/* UTILITÁRIOS */}
          <Route path="/acesso-negado" element={<AccessDenied />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;