// src/pages/PlaceholderPage/index.tsx
import React from 'react';

interface PlaceholderProps {
  titulo: string;
  descricao?: string;
}

export default function PlaceholderPage({ titulo, descricao = 'Esta tela receberá a integração com o back-end em breve.' }: PlaceholderProps) {
  return (
    <div>
      <h1 className="page-title">{titulo}</h1>
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>🚧 Módulo em Construção</h3>
        <p>{descricao}</p>
        <p style={{ marginTop: '10px', fontSize: '0.875rem', color: '#6b7280' }}>
          Endpoints pendentes: GET, POST, PUT, DELETE para /{titulo.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}