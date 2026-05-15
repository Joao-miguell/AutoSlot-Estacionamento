// src/components/Layout/AdminLayout.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../auth/ThemeContext'; // ← NOVO
import solUrl from '../../images/sol.png';           // ← NOVO
import luaUrl from '../../images/lua.png';           // ← NOVO

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { usuario, logout } = useAuth();
  const { temaEscuro, alternarTema } = useTheme(); // ← NOVO
  const navigate = useNavigate();

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-root">

      {/* 1. SIDEBAR (ESQUERDA) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#fff' }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="brand-name">AutoSlot</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Geral</div>
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/checkin" className="nav-link">Check-in / Out</NavLink>
          <NavLink to="/vagas" className="nav-link">Mapa de Vagas</NavLink>

          {usuario?.perfil === 'ADMIN' && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: '20px' }}>Administração</div>
              <NavLink to="/usuarios" className="nav-link">Usuários</NavLink>
              <NavLink to="/relatorios" className="nav-link">Relatórios</NavLink>
              <NavLink to="/tarifas" className="nav-link">Tarifas</NavLink>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-avatar">
              {usuario?.nome ? usuario.nome.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="user-info">
              <div className="user-name">{usuario?.nome}</div>
              <div className="user-role">{usuario?.perfil}</div>
            </div>
          </div>

          <button onClick={handleSair} className="btn-danger"
            style={{ width: '100%', marginTop: '12px', height: '38px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL (DIREITA) */}
      <main className="admin-main">
        <header className="topbar">
          <span className="topbar-title">Painel de Controle</span>

          <div className="topbar-actions">
            <div className="tag tag-green">● Sistema Online</div>

            {/* ── BOTÃO DE TEMA ── */}
            <button
              className="icon-btn"
              onClick={alternarTema}
              title={temaEscuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              <img
                src={temaEscuro ? solUrl : luaUrl}
                alt={temaEscuro ? 'Tema claro' : 'Tema escuro'}
                style={{ width: '16px', height: '16px' }}
              />
            </button>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>

    </div>
  );
};
