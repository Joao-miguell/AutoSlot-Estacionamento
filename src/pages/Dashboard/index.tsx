import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { usuario } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Bem-vindo ao sistema, {usuario?.nome}.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Perfil Logado</span>
          <div className="kpi-value">{usuario?.perfil}</div>
        </div>
        
        <div className="kpi-card">
          <span className="kpi-label">Status</span>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>Online</div>
        </div>
      </div>
    </div>
  );
}