import React from 'react';

const vagas = ['A01', 'A02', 'A03', 'A04', 'B01', 'B02', 'B03', 'B04'];
const status = ['Livre', 'Reservada', 'Ocupada', 'Expirada', 'Livre', 'Ocupada', 'Reservada', 'Livre'];

export default function Configuracoes() {
  return (
    <div>
      <div className="page-heading">
        <h2>Configurações</h2>
        <p>Acesso exclusivo do administrador.</p>
      </div>

      <div className="settings-grid">
        <section className="table-card settings-panel">
          <h3>Aba Vagas</h3>
          <table>
            <thead><tr><th>Vaga</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>{vagas.map((vaga, index) => <tr key={vaga}><td>{vaga}</td><td>{status[index]}</td><td><button className="ghost-button mini">Editar</button><button className="danger-button mini">Inativar</button></td></tr>)}</tbody>
          </table>
          <button className="success-button mini">Adicionar vaga</button>
        </section>

        <section className="settings-panel">
          <h3>Aba Tarifas</h3>
          <label>Valor da hora (R$)<input defaultValue="12" /></label>
          <label>Minutos de tolerância<input defaultValue="10" /></label>
          <button className="success-button mini">Salvar</button>
        </section>
      </div>
    </div>
  );
}
