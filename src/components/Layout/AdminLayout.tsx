import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../auth/ThemeContext';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { usuario, logout } = useAuth();
  const { temaEscuro, alternarTema } = useTheme();
  const navigate = useNavigate();
  const isAdmin = usuario?.perfil === 'ADMIN';

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark">P</div>
          <div>
            <strong>Parking ERP</strong>
            <span>Controle interno</span>
          </div>
          <small className="role-tag">{isAdmin ? 'ADMIN' : 'FUNC'}</small>
        </div>

        <nav className="nav">
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

        <div className="ux-card">
          <strong>Regra UX</strong>
          <p>Registrar entrada, alterar status e registrar saída em até 4 cliques.</p>
        </div>
      </aside>

      <main className="content">
        <header className="header">
          <div className="header-left">
            <strong>{isAdmin ? 'Administrador' : 'Funcionário'}</strong>
            <span>Olá, {usuario?.nome ?? 'usuário'}</span>
          </div>
          <div className="header-right">
            <input className="search" placeholder="Buscar por placa ou nome do cliente" />
            <button className="btn btn-ghost theme-button" onClick={alternarTema} title="Alterar tema">
              {temaEscuro ? '☀️ Claro' : '🌙 Escuro'}
            </button>
            <button className="btn btn-ghost" onClick={handleSair}>Sair</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
