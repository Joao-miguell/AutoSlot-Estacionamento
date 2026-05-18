import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = usuario?.perfil === 'ADMIN';

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>
          <div>
            <strong>Parking ERP</strong>
            <span>Controle interno</span>
          </div>
          <small>{usuario?.perfil === 'ADMIN' ? 'ADMIN' : 'FUNC'}</small>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard Principal
          </NavLink>
          <NavLink to="/relatorios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Histórico e Relatórios
          </NavLink>
          {isAdmin && (
            <NavLink to="/configuracoes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Configurações
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Administrador</p>
            <h1>Olá, {usuario?.nome ?? 'usuário'}</h1>
          </div>
          <div className="topbar-actions">
            <input className="search-input" placeholder="Buscar por placa ou nome do cliente" />
            <button className="ghost-button" onClick={handleSair}>Sair</button>
          </div>
        </header>
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
};
