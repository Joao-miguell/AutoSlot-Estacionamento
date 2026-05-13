// src/components/Layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, ShieldAlert, DollarSign, Car, Calendar, CheckSquare, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
  const { usuario } = useAuth();
  const isAdmin = usuario?.perfil === 'ADMIN';
  const isFuncionario = usuario?.perfil === 'FUNCIONARIO';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AutoSlot</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        {/* Telas que AMBOS (Admin e Funcionario) têm acesso (ex: Vagas) */}
        <NavLink to="/vagas" className={({ isActive }) => isActive ? 'active' : ''}>
          <Car size={20} /> Mapa de Vagas
        </NavLink>

        {/* Telas exclusivas de ADMIN */}
        {isAdmin && (
          <>
            <NavLink to="/tarifas" className={({ isActive }) => isActive ? 'active' : ''}>
              <DollarSign size={20} /> Tarifas
            </NavLink>
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? 'active' : ''}>
              <Users size={20} /> Usuários
            </NavLink>
            <NavLink to="/relatorios" className={({ isActive }) => isActive ? 'active' : ''}>
              <FileText size={20} /> Relatórios
            </NavLink>
            <NavLink to="/auditoria" className={({ isActive }) => isActive ? 'active' : ''}>
              <ShieldAlert size={20} /> Auditoria
            </NavLink>
          </>
        )}

        {/* Telas exclusivas de FUNCIONARIO */}
        {isFuncionario && (
          <>
            <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active' : ''}>
              <Calendar size={20} /> Reservas
            </NavLink>
            <NavLink to="/checkin" className={({ isActive }) => isActive ? 'active' : ''}>
              <CheckSquare size={20} /> Check-in / Out
            </NavLink>
            <NavLink to="/pagamento" className={({ isActive }) => isActive ? 'active' : ''}>
              <CreditCard size={20} /> Pagamentos
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}