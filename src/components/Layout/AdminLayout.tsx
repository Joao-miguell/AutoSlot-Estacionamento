import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../auth/ThemeContext';
import { LayoutDashboard, FileText, Settings, LogOut, Sun, Moon, ParkingCircle } from 'lucide-react';
import logoUrl from '../../images/Logo.png';

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

  const initials = usuario?.nome
    ? usuario.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="shell">
      <aside className="sidebar">
        {/* Brand */}
        <div className="brand">
          <img src={logoUrl} alt="AutoSlot" />
          <div>
            <strong>AutoSlot</strong>
            <span>Parking ERP</span>
          </div>
          <small className="role-tag">{isAdmin ? 'ADMIN' : 'FUNC'}</small>
        </div>

        {/* Nav */}
        <nav className="nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/relatorios"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <FileText size={16} />
            Relatórios
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/configuracoes"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Settings size={16} />
              Configurações
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div className="ux-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent-sub)', border: '1.5px solid rgba(249,115,22,0.3)',
              display: 'grid', placeItems: 'center',
              fontSize: 12, fontWeight: 800, color: 'var(--accent)', flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario?.nome ?? 'Usuário'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {isAdmin ? 'Administrador' : 'Funcionário'}
              </div>
            </div>
          </div>
          <p style={{ marginTop: 10 }}>Sistema de controle de vagas em tempo real.</p>
        </div>
      </aside>

      <main className="content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <strong>{isAdmin ? 'Administrador' : 'Funcionário'}</strong>
            <span>Olá, {usuario?.nome ?? 'usuário'} — bem-vindo ao painel</span>
          </div>
          <div className="header-right">
            <input
              className="search"
              placeholder="Buscar por placa ou cliente…"
            />
            <button
              className="btn btn-ghost"
              onClick={alternarTema}
              title="Alternar tema"
              style={{ padding: '0 12px', minHeight: 38 }}
            >
              {temaEscuro
                ? <><Sun size={15} /> Claro</>
                : <><Moon size={15} /> Escuro</>
              }
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleSair}
              style={{ padding: '0 12px', minHeight: 38, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};
