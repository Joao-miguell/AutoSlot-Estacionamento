import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-user-info">
        <User size={20} />
        <span>Olá, <strong>{usuario?.nome}</strong> ({usuario?.perfil})</span>
      </div>
      <button onClick={logout} className="btn-logout" title="Sair do sistema">
        <LogOut size={18} /> Sair
      </button>
    </header>
  );
}