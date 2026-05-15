// src/App.tsx — adicione o ThemeProvider e remova o estado de tema do Login

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './auth/ThemeContext'; // ← NOVO
import { PrivateRoute } from './auth/PrivateRoute';
import { AdminLayout } from './components/Layout/AdminLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import CheckIn from './pages/CheckIn';
import MapaDeVagas from './pages/MapaDeVagas';
import Placeholder from './pages/PlaceholderPage';
import './index.css';

function App() {
  return (
    // ThemeProvider envolve TUDO — Login e páginas internas compartilham o mesmo estado
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>
            } />
            <Route path="/checkin" element={
              <PrivateRoute><AdminLayout><CheckIn /></AdminLayout></PrivateRoute>
            } />
            <Route path="/vagas" element={
              <PrivateRoute><AdminLayout><MapaDeVagas /></AdminLayout></PrivateRoute>
            } />
            <Route path="/reservas" element={
              <PrivateRoute><AdminLayout><Placeholder titulo="Reservas" /></AdminLayout></PrivateRoute>
            } />
            <Route path="/usuarios" element={
              <PrivateRoute perfisPermitidos={['ADMIN']}><AdminLayout><Placeholder titulo="Gestão de Usuários" /></AdminLayout></PrivateRoute>
            } />
            <Route path="/relatorios" element={
              <PrivateRoute perfisPermitidos={['ADMIN']}><AdminLayout><Placeholder titulo="Relatórios Financeiros" /></AdminLayout></PrivateRoute>
            } />
            <Route path="/tarifas" element={
              <PrivateRoute perfisPermitidos={['ADMIN']}><AdminLayout><Placeholder titulo="Configuração de Tarifas" /></AdminLayout></PrivateRoute>
            } />
            <Route path="/auditoria" element={
              <PrivateRoute perfisPermitidos={['ADMIN']}><AdminLayout><Placeholder titulo="Logs de Auditoria" /></AdminLayout></PrivateRoute>
            } />

            <Route path="/acesso-negado" element={<AccessDenied />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
