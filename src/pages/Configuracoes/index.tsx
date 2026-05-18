import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';

export default function Configuracoes() {
  const { vagas, configuracoes, adicionarVaga, editarVaga, inativarVaga, salvarConfiguracoes } = useParking();
  const [valorHora, setValorHora] = useState(String(configuracoes.valorHora));
  const [tolerancia, setTolerancia] = useState(String(configuracoes.toleranciaMinutos));

  const salvar = () => {
    salvarConfiguracoes({ valorHora: Number(valorHora) || 0, toleranciaMinutos: Number(tolerancia) || 0 });
    alert('Tarifas salvas com sucesso.');
  };

  const editar = (id: number, codigoAtual: string) => {
    const novoCodigo = prompt('Editar identificação da vaga:', codigoAtual);
    if (novoCodigo?.trim()) editarVaga(id, novoCodigo.trim());
  };

  return (
    <section>
      <div className="page-title card">
        <div>
          <h2>Configurações</h2>
          <p>Acesso exclusivo do administrador.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="card settings-panel">
          <h3>Aba Vagas</h3>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Vaga</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                {vagas.map(vaga => (
                  <tr key={vaga.id}>
                    <td>{vaga.codigo}</td>
                    <td>{vaga.status}</td>
                    <td>
                      <button className="btn btn-ghost mini" onClick={() => editar(vaga.id, vaga.codigo)}>Editar</button>
                      <button className="btn btn-danger mini" onClick={() => inativarVaga(vaga.id)}>Inativar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary mini-action" onClick={adicionarVaga}>Adicionar vaga</button>
        </section>

        <section className="card settings-panel">
          <h3>Aba Tarifas</h3>
          <label className="field"><span>Valor da hora (R$)</span><input value={valorHora} onChange={e => setValorHora(e.target.value)} type="number" min="0" step="0.01" /></label>
          <label className="field"><span>Minutos de tolerância</span><input value={tolerancia} onChange={e => setTolerancia(e.target.value)} type="number" min="0" /></label>
          <button className="btn btn-primary" onClick={salvar}>Salvar</button>
        </section>
      </div>
    </section>
  );
}
