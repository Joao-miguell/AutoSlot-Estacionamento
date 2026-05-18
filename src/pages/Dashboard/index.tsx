import React, { useMemo, useState } from 'react';
import { useParking, ParkingSpot } from '../../context/ParkingContext';
import { dataHora, duracao, moeda, toDateTimeLocal } from '../../utils';

type Modal = 'reserva' | 'detalhes' | 'pagamento' | null;
const statusClass: Record<ParkingSpot['status'], string> = {
  Livre: 'free',
  Reservada: 'reserved',
  Ocupada: 'occupied',
  Expirada: 'expired',
  Inativa: 'inactive'
};

export default function Dashboard() {
  const { vagas, metricas, reservar, marcarChegada, cancelarReservaExpirada, finalizarPagamento, calcularTempo, calcularValor } = useParking();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [vagaSelecionada, setVagaSelecionada] = useState<ParkingSpot | null>(null);
  const [pagamento, setPagamento] = useState<'Dinheiro' | 'PIX' | 'Cartão'>('Dinheiro');
  const [erroReserva, setErroReserva] = useState('');
  const [form, setForm] = useState({
    cliente: '',
    placa: '',
    modelo: '',
    entrada: toDateTimeLocal(new Date()),
    saidaPrevista: toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
    vagaId: 0
  });

  const vagasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return vagas;
    return vagas.filter(vaga =>
      vaga.codigo.toLowerCase().includes(termo) ||
      (vaga.placa ?? '').toLowerCase().includes(termo) ||
      (vaga.cliente ?? '').toLowerCase().includes(termo)
    );
  }, [busca, vagas]);

  const vagasLivres = vagas.filter(vaga => vaga.status === 'Livre');

  const abrirReserva = () => {
    const primeiraLivre = vagasLivres[0];
    setErroReserva(primeiraLivre ? '' : 'Não há vagas livres disponíveis.');
    setForm({
      cliente: '',
      placa: '',
      modelo: '',
      entrada: toDateTimeLocal(new Date()),
      saidaPrevista: toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
      vagaId: primeiraLivre?.id ?? 0
    });
    setModal('reserva');
  };

  const abrirDetalhes = (vaga: ParkingSpot) => {
    if (vaga.status === 'Livre' || vaga.status === 'Inativa') return;
    setVagaSelecionada(vaga);
    setModal('detalhes');
  };

  const confirmarReserva = () => {
    if (!form.placa.trim()) {
      setErroReserva('A placa do veículo é obrigatória.');
      return;
    }
    if (!form.vagaId) {
      setErroReserva('Selecione uma vaga livre.');
      return;
    }
    reservar(form);
    setModal(null);
  };

  const confirmarPagamento = () => {
    if (!vagaSelecionada) return;
    finalizarPagamento(vagaSelecionada.id, pagamento);
    setModal(null);
    setVagaSelecionada(null);
  };

  return (
    <>
      <div className="dashboard-toolbar">
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por placa, cliente ou vaga" />
      </div>

      <div className="cards">
        <Metric label="Faturamento acumulado do dia" value={moeda(metricas.faturamento)} foot="Receita consolidada do turno/dia" />
        <Metric label="Vagas Livres" value={metricas.livres} foot="Disponíveis para reserva" />
        <Metric label="Vagas Ocupadas" value={metricas.ocupadas} foot="Em atendimento agora" />
        <Metric label="Ticket médio" value={moeda(metricas.ticketMedio)} foot="Média por atendimento" />
      </div>

      <div className="page-title card">
        <div>
          <h2>Mapa de Vagas</h2>
          <p>Cards clicáveis com status, placa, horário e alerta de permanência.</p>
        </div>
        <span>Dashboard com reservas, check-in e check-out</span>
      </div>

      <div className="lot-grid">
        {vagasFiltradas.map(vaga => {
          const tempo = calcularTempo(vaga.entrada);
          const atrasada = vaga.status === 'Ocupada' && vaga.saidaPrevista && new Date(vaga.saidaPrevista) < new Date();
          return (
            <button key={vaga.id} className={`spot ${statusClass[vaga.status]}`} onClick={() => abrirDetalhes(vaga)}>
              <span className="badge">{vaga.status}</span>
              <h3>Vaga {vaga.codigo}</h3>
              {vaga.status === 'Livre' ? (
                <p>Disponível para nova reserva</p>
              ) : vaga.status === 'Inativa' ? (
                <p>Vaga desativada nas configurações</p>
              ) : (
                <div>
                  <p><strong>Placa:</strong> {vaga.placa}</p>
                  <p><strong>Entrada:</strong> {dataHora(vaga.entrada)}</p>
                  <p><strong>Tempo:</strong> {duracao(tempo)}</p>
                </div>
              )}
              {(atrasada || vaga.status === 'Expirada') && <em>⚠️</em>}
            </button>
          );
        })}
      </div>

      <button className="btn btn-primary fab" onClick={abrirReserva}>+ Nova Reserva</button>

      {modal === 'reserva' && (
        <Modal title="Nova Reserva" subtitle="Somente vagas livres podem ser selecionadas." onClose={() => setModal(null)}>
          <div className="row row-2">
            <Field label="Nome do cliente"><input value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Ex.: João Silva" /></Field>
            <Field label="Placa do veículo *"><input value={form.placa} onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase() })} placeholder="ABC-1234" /></Field>
            <Field label="Modelo do veículo"><input value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} placeholder="Ex.: Onix" /></Field>
            <Field label="Horário de entrada"><input type="datetime-local" value={form.entrada} onChange={e => setForm({ ...form, entrada: e.target.value })} /></Field>
            <Field label="Horário previsto de saída"><input type="datetime-local" value={form.saidaPrevista} onChange={e => setForm({ ...form, saidaPrevista: e.target.value })} /></Field>
            <Field label="Seleção de vaga">
              <select value={form.vagaId} onChange={e => setForm({ ...form, vagaId: Number(e.target.value) })}>
                {vagasLivres.map(vaga => <option key={vaga.id} value={vaga.id}>{vaga.codigo}</option>)}
              </select>
            </Field>
          </div>
          {erroReserva && <div className="error-box">{erroReserva}</div>}
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={confirmarReserva}>Confirmar Reserva</button>
          </div>
        </Modal>
      )}

      {modal === 'detalhes' && vagaSelecionada && (
        <Modal title={`Detalhes da Vaga ${vagaSelecionada.codigo}`} subtitle={`Status atual: ${vagaSelecionada.status}`} onClose={() => setModal(null)}>
          <div className="detail-list">
            <Detail label="Placa" value={vagaSelecionada.placa ?? '-'} />
            <Detail label="Modelo" value={vagaSelecionada.modelo ?? '-'} />
            <Detail label="Cliente" value={vagaSelecionada.cliente ?? '-'} />
            <Detail label="Horário de entrada" value={dataHora(vagaSelecionada.entrada)} />
            <Detail label="Horário previsto de saída" value={dataHora(vagaSelecionada.saidaPrevista)} />
            <Detail label="Tempo corrido" value={duracao(calcularTempo(vagaSelecionada.entrada))} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Fechar</button>
            {vagaSelecionada.status === 'Reservada' && <button className="btn btn-warning" onClick={() => { marcarChegada(vagaSelecionada.id); setModal(null); }}>Cliente Chegou</button>}
            {vagaSelecionada.status === 'Ocupada' && <button className="btn btn-primary" onClick={() => setModal('pagamento')}>Informar Saída</button>}
            {vagaSelecionada.status === 'Expirada' && <button className="btn btn-danger" onClick={() => { cancelarReservaExpirada(vagaSelecionada.id); setModal(null); }}>Cancelar Reserva Expirada</button>}
          </div>
        </Modal>
      )}

      {modal === 'pagamento' && vagaSelecionada && (
        <Modal title="Finalizar Atendimento / Pagamento" subtitle="A vaga só volta a livre após confirmação do pagamento." onClose={() => setModal('detalhes')}>
          <div className="detail-list">
            <Detail label="Horário de entrada" value={dataHora(vagaSelecionada.entrada)} />
            <Detail label="Horário de saída" value={dataHora(new Date().toISOString())} />
            <Detail label="Tempo total de permanência" value={duracao(calcularTempo(vagaSelecionada.entrada))} />
            <Detail label="Vaga" value={vagaSelecionada.codigo} />
          </div>
          <div className="pay-highlight"><span>Valor calculado</span><strong>{moeda(calcularValor(vagaSelecionada.entrada))}</strong></div>
          <Field label="Forma de Pagamento">
            <select value={pagamento} onChange={e => setPagamento(e.target.value as typeof pagamento)}>
              <option>Dinheiro</option><option>PIX</option><option>Cartão</option>
            </select>
          </Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal('detalhes')}>Voltar</button>
            <button className="btn btn-primary" onClick={confirmarPagamento}>Confirmar Pagamento e Liberar Vaga</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Metric({ label, value, foot }: { label: string; value: React.ReactNode; foot: string }) {
  return <article className="card metric"><span>{label}</span><strong>{value}</strong><small>{foot}</small></article>;
}

function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={e => e.currentTarget === e.target && onClose()}><section className="modal"><div className="modal-header"><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div><div className="modal-body">{children}</div></section></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>;
}
