import React, { useState } from 'react';

export default function CheckIn() {
  const [lista, setLista] = useState([
    { id: 1, placa: 'HJK-9900', modelo: 'Gol G5', hora: '08:00' }
  ]);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if(!placa || !modelo) return;
    const novo = { id: Date.now(), placa: placa.toUpperCase(), modelo, hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setLista([novo, ...lista]);
    setPlaca(''); setModelo('');
  };

  const remove = (id: number) => {
    if(window.confirm('Confirmar saída do veículo?')) {
      setLista(lista.filter(i => i.id !== id));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Check-in / Check-out</h1>
        <p className="page-sub">Controle de entrada e saída de veículos do pátio</p>
      </div>

      {/* FORMULÁRIO DE ENTRADA ALINHADO */}
      <div className="table-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '16px' }}>Registrar Nova Entrada</h3>
        
        <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Placa do Veículo</label>
            <input 
              type="text" 
              placeholder="Ex: ABC-1234" 
              value={placa} 
              onChange={e => setPlaca(e.target.value)} 
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Modelo / Cor</label>
            <input 
              type="text" 
              placeholder="Ex: HB20 Branco" 
              value={modelo} 
              onChange={e => setModelo(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ height: '42px', marginTop: 0, padding: '0 24px', width: 'auto' }}>
            Confirmar Check-in
          </button>

        </form>
      </div>

      {/* TABELA DE VEÍCULOS */}
      <div className="table-card">
        <div className="card-head">
          <span className="card-title">Veículos no Pátio ({lista.length})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Entrada</th>
              <th style={{ textAlign: 'right' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign: 'center', padding: '30px'}}>Nenhum veículo no pátio.</td></tr>
            ) : (
              lista.map(v => (
                <tr key={v.id}>
                  <td className="td-bold">{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td>{v.hora}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => remove(v.id)} 
                      className="btn-danger" 
                      style={{ height: '28px', fontSize: '12px', width: 'auto', padding: '0 12px', display: 'inline-flex' }}
                    >
                      Finalizar Saída
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}