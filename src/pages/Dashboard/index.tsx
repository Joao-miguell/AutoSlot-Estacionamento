import React, { useMemo, useState } from 'react';

type Status = 'Livre' | 'Reservada' | 'Ocupada' | 'Expirada';

type Vaga = {
  codigo: string;
  status: Status;
  placa?: string;
  cliente?: string;
  entrada?: string;
  saida?: string;
  tempo?: string;
  modelo?: string;
};

const vagasIniciais: Vaga[] = [
  { codigo: 'A01', status: 'Livre' },
  { codigo: 'A02', status: 'Reservada', placa: 'AXD-1234', cliente: 'Carlos Lima', entrada: '10/04/2026, 13:40', tempo: '0h 18min', modelo: 'HB20' },
  { codigo: 'A03', status: 'Ocupada', placa: 'CPF-9087', cliente: 'Marina Souza', entrada: '10/04/2026, 11:40', tempo: '2h 28min', modelo: 'Corolla' },
  { codigo: 'A04', status: 'Expirada', placa: 'BRA-2026', cliente: 'Bruno Rocha', entrada: '10/04/2026, 12:20', saida: '10/04/2026, 13:35', tempo: '1h 52min', modelo: 'Gol' },
  { codigo: 'B01', status: 'Livre' },
  { codigo: 'B02', status: 'Ocupada', placa: 'PKL-4065', cliente: 'Patrícia Dias', entrada: '10/04/2026, 11:44', tempo: '0h 45min', modelo: 'Onix' },
  { codigo: 'B03', status: 'Reservada', placa: 'KWE-1102', cliente: 'Eduardo Ferreira', entrada: '10/04/2026, 12:15', tempo: '0h 50min', modelo: 'Sandero' },
  { codigo: 'B04', status: 'Livre' }
];

const statusClass: Record<Status, string> = {
  Livre: 'free',
  Reservada: 'reserved',
  Ocupada: 'busy',
  Expirada: 'expired'
};

export default function Dashboard() {
  const [vagas, setVagas] = useState<Vaga[]>(vagasIniciais);
  const [reservaAberta, setReservaAberta] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [pagamentoAberto, setPagamentoAberto] = useState(false);

  const totais = useMemo(() => ({
    livres: vagas.filter(v => v.status === 'Livre').length,
    ocupadas: vagas.filter(v => v.status === 'Ocupada').length,
    reservadas: vagas.filter(v => v.status === 'Reservada').length,
    faturamento: 72
  }), [vagas]);

  const informarChegada = (vaga: Vaga) => {
    setVagas(atual => atual.map(item => item.codigo === vaga.codigo ? { ...item, status: 'Ocupada', entrada: '10/04/2026, 14:40', tempo: '0h 01min' } : item));
    setVagaSelecionada(null);
  };

  const finalizarSaida = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setPagamentoAberto(true);
  };

  const liberarVaga = () => {
    if (!vagaSelecionada) return;
    setVagas(atual => atual.map(item => item.codigo === vagaSelecionada.codigo ? { codigo: item.codigo, status: 'Livre' } : item));
    setPagamentoAberto(false);
    setVagaSelecionada(null);
  };

  return (
    <>
      <div className="metric-grid">
        <article className="metric-card">
          <span>Faturamento acumulado do dia</span>
          <strong>R$ {totais.faturamento},00</strong>
          <small>Receita consolidada de domingo</small>
        </article>
        <article className="metric-card">
          <span>Vagas Livres</span>
          <strong>{totais.livres}</strong>
          <small>Disponíveis para reserva</small>
        </article>
        <article className="metric-card">
          <span>Vagas Ocupadas</span>
          <strong>{totais.ocupadas}</strong>
          <small>Em atendimento agora</small>
        </article>
        <article className="metric-card">
          <span>Ticket médio</span>
          <strong>R$ 24,00</strong>
          <small>Valor por atendimento</small>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <h2>Mapa de Vagas</h2>
          <p>Cards clicáveis com status, placa, horário e alerta de permanência.</p>
        </div>
        <span>Desktop e tablet em modo paisagem</span>
      </div>

      <div className="parking-grid">
        {vagas.map(vaga => (
          <button
            key={vaga.codigo}
            className={`parking-card ${statusClass[vaga.status]}`}
            onClick={() => setVagaSelecionada(vaga)}
          >
            <div className="parking-head">
              <strong>Vaga {vaga.codigo}</strong>
              <span>{vaga.status}</span>
            </div>
            {vaga.placa ? (
              <div className="parking-info">
                <p>Placa: {vaga.placa}</p>
                <p>Entrada: {vaga.entrada}</p>
                <p>Tempo: {vaga.tempo}</p>
              </div>
            ) : (
              <p className="parking-info">Disponível para nova reserva</p>
            )}
            {vaga.status === 'Expirada' && <em>⚠</em>}
          </button>
        ))}
      </div>

      <button className="floating-action" onClick={() => setReservaAberta(true)}>+ Nova Reserva</button>

      {reservaAberta && (
        <div className="modal-backdrop">
          <div className="modal-card reservation-modal">
            <h3>Nova Reserva</h3>
            <p>Somente vagas livres podem ser selecionadas.</p>
            <div className="form-grid">
              <label>Nome do cliente<input placeholder="Ex: João Silva" /></label>
              <label>Placa do veículo<input placeholder="Ex: ABC-1234" /></label>
              <label>Modelo do veículo<input placeholder="Ex: Onix" /></label>
              <label>Horário de entrada<input type="datetime-local" /></label>
              <label>Horário previsto de saída<input type="datetime-local" /></label>
              <label>Seleção de vaga<select defaultValue="A01"><option>A01</option><option>B01</option><option>B04</option></select></label>
            </div>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setReservaAberta(false)}>Cancelar</button>
              <button className="success-button" onClick={() => setReservaAberta(false)}>Confirmar Reserva</button>
            </div>
          </div>
        </div>
      )}

      {vagaSelecionada && !pagamentoAberto && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Detalhes da Vaga {vagaSelecionada.codigo}</h3>
            <p>Status atual: {vagaSelecionada.status}</p>
            <div className="detail-grid">
              <span>Placa<strong>{vagaSelecionada.placa ?? '-'}</strong></span>
              <span>Modelo<strong>{vagaSelecionada.modelo ?? '-'}</strong></span>
              <span>Cliente<strong>{vagaSelecionada.cliente ?? '-'}</strong></span>
              <span>Horário de entrada<strong>{vagaSelecionada.entrada ?? '-'}</strong></span>
              <span>Horário previsto de saída<strong>{vagaSelecionada.saida ?? '-'}</strong></span>
              <span>Tempo corrido<strong>{vagaSelecionada.tempo ?? '-'}</strong></span>
            </div>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setVagaSelecionada(null)}>Fechar</button>
              {vagaSelecionada.status === 'Reservada' && <button className="warning-button" onClick={() => informarChegada(vagaSelecionada)}>Cliente Chegou</button>}
              {vagaSelecionada.status === 'Ocupada' && <button className="success-button" onClick={() => finalizarSaida(vagaSelecionada)}>Informar Saída</button>}
              {vagaSelecionada.status === 'Expirada' && <button className="danger-button" onClick={() => finalizarSaida(vagaSelecionada)}>Cancelar Reserva Expirada</button>}
            </div>
          </div>
        </div>
      )}

      {pagamentoAberto && vagaSelecionada && (
        <div className="modal-backdrop">
          <div className="modal-card payment-modal">
            <h3>Finalizar Atendimento / Pagamento</h3>
            <p>A vaga só volta a livre após confirmação do pagamento.</p>
            <div className="detail-grid compact">
              <span>Horário de entrada<strong>{vagaSelecionada.entrada}</strong></span>
              <span>Horário de saída<strong>10/04/2026, 14:21</strong></span>
              <span>Tempo total<strong>2h 41min</strong></span>
              <span>Vaga<strong>{vagaSelecionada.codigo}</strong></span>
            </div>
            <div className="total-box"><small>Valor calculado</small><strong>R$ 36,00</strong></div>
            <label className="payment-select">Forma de Pagamento<select defaultValue="Dinheiro"><option>Dinheiro</option><option>PIX</option><option>Cartão</option></select></label>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setPagamentoAberto(false)}>Voltar</button>
              <button className="success-button" onClick={liberarVaga}>Confirmar Pagamento e Liberar Vaga</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
