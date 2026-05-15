import React, { useState, useEffect, useCallback } from 'react';
import './mapa.css';

// ─── TIPOS ─────────────────────────────────────────────────────────────────

type StatusVaga = 'LIVRE' | 'RESERVADA' | 'OCUPADA' | 'INATIVA';
type TipoVaga   = 'COMUM' | 'PREFERENCIAL' | 'COBERTA';

interface Vaga {
  id: number;
  identificacao: string; // ex: A-01
  status: StatusVaga;
  tipo: TipoVaga;
  posicao_x: number;
  posicao_y: number;
  reserva?: {
    cliente: string;
    placa: string;
    horario_previsto: string; // ISO string
  };
  ocupacao?: {
    placa: string;
    entrada: string; // ISO string
  };
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const MOCK_VAGAS: Vaga[] = [
  // Linha A
  { id:1,  identificacao:'A-01', status:'LIVRE',     tipo:'COMUM',         posicao_x:0, posicao_y:0 },
  { id:2,  identificacao:'A-02', status:'RESERVADA', tipo:'COMUM',         posicao_x:1, posicao_y:0,
    reserva:{ cliente:'João Silva', placa:'ABC-1234', horario_previsto: new Date(Date.now()+15*60000).toISOString() } },
  { id:3,  identificacao:'A-03', status:'OCUPADA',   tipo:'COMUM',         posicao_x:2, posicao_y:0,
    ocupacao:{ placa:'DEF-5678', entrada: new Date(Date.now()-90*60000).toISOString() } },
  { id:4,  identificacao:'A-04', status:'LIVRE',     tipo:'COBERTA',       posicao_x:3, posicao_y:0 },
  { id:5,  identificacao:'A-05', status:'INATIVA',   tipo:'COMUM',         posicao_x:4, posicao_y:0 },
  { id:6,  identificacao:'A-06', status:'LIVRE',     tipo:'COMUM',         posicao_x:5, posicao_y:0 },
  // Linha B
  { id:7,  identificacao:'B-01', status:'OCUPADA',   tipo:'PREFERENCIAL',  posicao_x:0, posicao_y:1,
    ocupacao:{ placa:'GHI-9012', entrada: new Date(Date.now()-180*60000).toISOString() } },
  { id:8,  identificacao:'B-02', status:'LIVRE',     tipo:'PREFERENCIAL',  posicao_x:1, posicao_y:1 },
  { id:9,  identificacao:'B-03', status:'RESERVADA', tipo:'COBERTA',       posicao_x:2, posicao_y:1,
    reserva:{ cliente:'Maria Oliveira', placa:'JKL-3456', horario_previsto: new Date(Date.now()-10*60000).toISOString() } },
  { id:10, identificacao:'B-04', status:'LIVRE',     tipo:'COMUM',         posicao_x:3, posicao_y:1 },
  { id:11, identificacao:'B-05', status:'LIVRE',     tipo:'COMUM',         posicao_x:4, posicao_y:1 },
  { id:12, identificacao:'B-06', status:'OCUPADA',   tipo:'COBERTA',       posicao_x:5, posicao_y:1,
    ocupacao:{ placa:'MNO-7890', entrada: new Date(Date.now()-30*60000).toISOString() } },
  // Linha C
  { id:13, identificacao:'C-01', status:'LIVRE',     tipo:'COMUM',         posicao_x:0, posicao_y:2 },
  { id:14, identificacao:'C-02', status:'INATIVA',   tipo:'COMUM',         posicao_x:1, posicao_y:2 },
  { id:15, identificacao:'C-03', status:'LIVRE',     tipo:'COMUM',         posicao_x:2, posicao_y:2 },
  { id:16, identificacao:'C-04', status:'OCUPADA',   tipo:'PREFERENCIAL',  posicao_x:3, posicao_y:2,
    ocupacao:{ placa:'PQR-1122', entrada: new Date(Date.now()-240*60000).toISOString() } },
  { id:17, identificacao:'C-05', status:'RESERVADA', tipo:'COMUM',         posicao_x:4, posicao_y:2,
    reserva:{ cliente:'Carlos Mendes', placa:'STU-3344', horario_previsto: new Date(Date.now()+45*60000).toISOString() } },
  { id:18, identificacao:'C-06', status:'LIVRE',     tipo:'COBERTA',       posicao_x:5, posicao_y:2 },
  // Linha D
  { id:19, identificacao:'D-01', status:'RESERVADA', tipo:'COMUM',         posicao_x:0, posicao_y:3,
    reserva:{ cliente:'Ana Costa', placa:'VWX-5566', horario_previsto: new Date(Date.now()+5*60000).toISOString() } },
  { id:20, identificacao:'D-02', status:'LIVRE',     tipo:'COMUM',         posicao_x:1, posicao_y:3 },
  { id:21, identificacao:'D-03', status:'LIVRE',     tipo:'COMUM',         posicao_x:2, posicao_y:3 },
  { id:22, identificacao:'D-04', status:'INATIVA',   tipo:'COBERTA',       posicao_x:3, posicao_y:3 },
  { id:23, identificacao:'D-05', status:'LIVRE',     tipo:'COMUM',         posicao_x:4, posicao_y:3 },
  { id:24, identificacao:'D-06', status:'OCUPADA',   tipo:'PREFERENCIAL',  posicao_x:5, posicao_y:3,
    ocupacao:{ placa:'YZA-7788', entrada: new Date(Date.now()-60*60000).toISOString() } },
];

// ─── UTILITÁRIOS ────────────────────────────────────────────────────────────

function tempoDecorrido(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (diff < 60) return `${diff}min`;
  const h = Math.floor(diff / 60), m = diff % 60;
  return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

function atrasoReserva(isoStr: string): string | null {
  const diff = Math.floor((new Date(isoStr).getTime() - Date.now()) / 60000);
  if (diff > 0) return null;
  return `${Math.abs(diff)}min de atraso`;
}

function tempoParaChegada(isoStr: string): string {
  const diff = Math.floor((new Date(isoStr).getTime() - Date.now()) / 60000);
  if (diff <= 0) return 'Já deveria ter chegado';
  return `em ${diff}min`;
}

function formatarHora(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const LABEL_STATUS: Record<StatusVaga, string> = {
  LIVRE: 'Livre', RESERVADA: 'Reservada', OCUPADA: 'Ocupada', INATIVA: 'Inativa'
};
const LABEL_TIPO: Record<TipoVaga, string> = {
  COMUM: 'Comum', PREFERENCIAL: 'Preferencial', COBERTA: 'Coberta'
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────

export default function MapaDeVagas() {
  const [vagas, setVagas]               = useState<Vaga[]>([]);
  const [loading, setLoading]           = useState(true);
  const [erro, setErro]                 = useState('');
  const [selecionada, setSelecionada]   = useState<Vaga | null>(null);
  const [filtroBusca, setFiltroBusca]   = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusVaga | 'TODOS'>('TODOS');
  const [toast, setToast]               = useState<{ msg: string; tipo: 'success'|'error' } | null>(null);
  const [loadingAcao, setLoadingAcao]   = useState(false);

  // Simula carregamento da API
  const carregarVagas = useCallback(() => {
    setLoading(true);
    setErro('');
    setTimeout(() => {
      setVagas(MOCK_VAGAS);
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => { carregarVagas(); }, [carregarVagas]);

  // Auto-refresh a cada 30s
  useEffect(() => {
    const t = setInterval(() => { if (!selecionada) carregarVagas(); }, 30000);
    return () => clearInterval(t);
  }, [selecionada, carregarVagas]);

  const showToast = (msg: string, tipo: 'success'|'error') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // Ações simuladas
  const executarAcao = async (acao: string, vaga: Vaga) => {
    setLoadingAcao(true);
    await new Promise(r => setTimeout(r, 800));
    setLoadingAcao(false);

    // Simula mudança de status localmente
    let novoStatus: StatusVaga = vaga.status;
    let nova = { ...vaga };

    if (acao === 'entrada-direta') {
      novoStatus = 'OCUPADA';
      nova = { ...nova, status: 'OCUPADA', ocupacao: { placa: 'NEW-0000', entrada: new Date().toISOString() }, reserva: undefined };
      showToast(`Entrada direta registrada na vaga ${vaga.identificacao}`, 'success');
    } else if (acao === 'checkin') {
      novoStatus = 'OCUPADA';
      nova = { ...nova, status: 'OCUPADA', ocupacao: { placa: vaga.reserva!.placa, entrada: new Date().toISOString() }, reserva: undefined };
      showToast(`Check-in confirmado na vaga ${vaga.identificacao}`, 'success');
    } else if (acao === 'checkout') {
      novoStatus = 'LIVRE';
      nova = { ...nova, status: 'LIVRE', ocupacao: undefined };
      showToast(`Check-out realizado — redirecionando para pagamento...`, 'success');
    } else if (acao === 'cancelar-reserva') {
      novoStatus = 'LIVRE';
      nova = { ...nova, status: 'LIVRE', reserva: undefined };
      showToast(`Reserva da vaga ${vaga.identificacao} cancelada`, 'success');
    } else if (acao === 'nova-reserva') {
      showToast(`Abrindo formulário de nova reserva para vaga ${vaga.identificacao}`, 'success');
    } else if (acao === 'editar-reserva') {
      showToast(`Abrindo edição da reserva da vaga ${vaga.identificacao}`, 'success');
    }

    setVagas(prev => prev.map(v => v.id === vaga.id ? nova : v));
    setSelecionada(nova);
  };

  // Filtragem
  const vagasFiltradas = vagas.filter(v => {
    const busca = filtroBusca.toLowerCase();
    const matchBusca = !busca ||
      v.identificacao.toLowerCase().includes(busca) ||
      v.reserva?.placa.toLowerCase().includes(busca) ||
      v.ocupacao?.placa.toLowerCase().includes(busca);
    const matchStatus = filtroStatus === 'TODOS' || v.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  // Destaque de busca
  const vagaDestacada = filtroBusca
    ? vagasFiltradas.find(v =>
        v.identificacao.toLowerCase() === filtroBusca.toLowerCase() ||
        v.reserva?.placa.toLowerCase() === filtroBusca.toLowerCase() ||
        v.ocupacao?.placa.toLowerCase() === filtroBusca.toLowerCase()
      )?.id ?? null
    : null;

  // Grade
  const maxX = Math.max(...vagas.map(v => v.posicao_x), 0);
  const maxY = Math.max(...vagas.map(v => v.posicao_y), 0);

  const contadores = {
    livres:    vagas.filter(v => v.status === 'LIVRE').length,
    reservadas:vagas.filter(v => v.status === 'RESERVADA').length,
    ocupadas:  vagas.filter(v => v.status === 'OCUPADA').length,
    inativas:  vagas.filter(v => v.status === 'INATIVA').length,
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div className="mv-root">

      {/* TOAST */}
      {toast && (
        <div className={`mv-toast mv-toast--${toast.tipo}`}>
          {toast.tipo === 'success'
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* CABEÇALHO */}
      <div className="page-header">
        <div>
          <h1 className="section-title">Mapa de Vagas</h1>
          <p className="section-sub">Visualização em tempo real do pátio de estacionamento</p>
        </div>
        <button className="btn-sm mv-refresh-btn" onClick={carregarVagas} disabled={loading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spin' : ''}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="mv-kpis">
        {[
          { label: 'Livres',     val: contadores.livres,     cls: 'livre'    },
          { label: 'Reservadas', val: contadores.reservadas, cls: 'reservada'},
          { label: 'Ocupadas',   val: contadores.ocupadas,   cls: 'ocupada'  },
          { label: 'Inativas',   val: contadores.inativas,   cls: 'inativa'  },
        ].map(k => (
          <button
            key={k.cls}
            className={`mv-kpi ${filtroStatus === k.cls.toUpperCase() ? 'mv-kpi--active' : ''}`}
            onClick={() => setFiltroStatus(filtroStatus === k.cls.toUpperCase() as StatusVaga ? 'TODOS' : k.cls.toUpperCase() as StatusVaga)}
          >
            <span className={`mv-dot mv-dot--${k.cls}`} />
            <span className="mv-kpi-val">{loading ? '—' : k.val}</span>
            <span className="mv-kpi-label">{k.label}</span>
          </button>
        ))}
      </div>

      {/* FILTROS */}
      <div className="mv-filters">
        <div className="mv-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Buscar por placa ou vaga (ex: A-01, ABC-1234)"
            value={filtroBusca}
            onChange={e => setFiltroBusca(e.target.value)}
            className="mv-search"
          />
          {filtroBusca && (
            <button className="mv-search-clear" onClick={() => setFiltroBusca('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        <div className="mv-status-tabs">
          {(['TODOS','LIVRE','RESERVADA','OCUPADA','INATIVA'] as const).map(s => (
            <button
              key={s}
              className={`mv-tab ${filtroStatus === s ? 'mv-tab--active' : ''}`}
              onClick={() => setFiltroStatus(s)}
            >
              {s === 'TODOS' ? 'Todos' : LABEL_STATUS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="mv-layout">

        {/* MAPA */}
        <div className="mv-mapa-wrap">

          {loading && (
            <div className="mv-state-overlay">
              <div className="mv-spinner" />
              <span>Carregando mapa...</span>
            </div>
          )}

          {erro && !loading && (
            <div className="mv-state-overlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:40,height:40,color:'var(--danger)'}}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <span style={{color:'var(--text-sub)'}}>{erro}</span>
              <button className="btn-sm" onClick={carregarVagas}>Tentar novamente</button>
            </div>
          )}

          {!loading && !erro && vagas.length === 0 && (
            <div className="mv-state-overlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:40,height:40,color:'var(--text-muted)'}}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6m-3-3v6"/>
              </svg>
              <span style={{color:'var(--text-muted)'}}>Nenhuma vaga cadastrada</span>
            </div>
          )}

          {!loading && !erro && vagas.length > 0 && (
            <>
              {/* LEGENDA */}
              <div className="mv-legenda">
                {(['livre','reservada','ocupada','inativa'] as const).map(s => (
                  <span key={s} className="mv-legenda-item">
                    <span className={`mv-dot mv-dot--${s}`} />
                    {LABEL_STATUS[s.toUpperCase() as StatusVaga]}
                  </span>
                ))}
                <span className="mv-legenda-item">
                  <span className="mv-dot mv-dot--coberta" />Coberta
                </span>
                <span className="mv-legenda-item">
                  <span className="mv-dot mv-dot--preferencial" />Preferencial
                </span>
              </div>

              {/* GRADE */}
              <div
                className="mv-grid"
                style={{ gridTemplateColumns: `repeat(${maxX + 1}, 1fr)` }}
              >
                {Array.from({ length: maxY + 1 }, (_, y) =>
                  Array.from({ length: maxX + 1 }, (_, x) => {
                    const vaga = vagasFiltradas.find(v => v.posicao_x === x && v.posicao_y === y);
                    if (!vaga) {
                      // Verifica se existe vaga nessa posição mas foi filtrada
                      const existe = vagas.find(v => v.posicao_x === x && v.posicao_y === y);
                      return (
                        <div
                          key={`${x}-${y}`}
                          className={`mv-vaga-slot ${existe ? 'mv-vaga--filtered' : 'mv-vaga--empty'}`}
                        >
                          {existe && <span className="mv-vaga-id">{existe.identificacao}</span>}
                        </div>
                      );
                    }

                    const isSelected  = selecionada?.id === vaga.id;
                    const isDestacada = vagaDestacada === vaga.id;
                    const statusCls   = vaga.status.toLowerCase();

                    return (
                      <button
                        key={vaga.id}
                        className={`mv-vaga mv-vaga--${statusCls} ${isSelected ? 'mv-vaga--selected' : ''} ${isDestacada ? 'mv-vaga--highlight' : ''}`}
                        onClick={() => setSelecionada(isSelected ? null : vaga)}
                        title={`${vaga.identificacao} — ${LABEL_STATUS[vaga.status]}`}
                      >
                        <span className="mv-vaga-id">{vaga.identificacao}</span>
                        <span className="mv-vaga-status-dot" />
                        {vaga.tipo !== 'COMUM' && (
                          <span className="mv-vaga-badge">
                            {vaga.tipo === 'COBERTA' ? '🏠' : '♿'}
                          </span>
                        )}
                        {vaga.status === 'RESERVADA' && vaga.reserva && atrasoReserva(vaga.reserva.horario_previsto) && (
                          <span className="mv-vaga-alert">!</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* PAINEL DE DETALHES */}
        {selecionada && (
          <div className="mv-painel">
            <div className="mv-painel-header">
              <div>
                <span className="mv-painel-id">{selecionada.identificacao}</span>
                <span className={`mv-badge mv-badge--${selecionada.status.toLowerCase()}`}>
                  {LABEL_STATUS[selecionada.status]}
                </span>
              </div>
              <button className="icon-btn" onClick={() => setSelecionada(null)} title="Fechar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mv-painel-body">
              {/* Info básica */}
              <div className="mv-info-row">
                <span className="mv-info-label">Tipo</span>
                <span className="mv-info-value">{LABEL_TIPO[selecionada.tipo]}</span>
              </div>
              <div className="mv-info-row">
                <span className="mv-info-label">Posição</span>
                <span className="mv-info-value">Coluna {selecionada.posicao_x + 1} · Linha {selecionada.posicao_y + 1}</span>
              </div>

              {/* Detalhes RESERVADA */}
              {selecionada.status === 'RESERVADA' && selecionada.reserva && (
                <div className="mv-detail-block">
                  <div className="mv-detail-title">Reserva</div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Cliente</span>
                    <span className="mv-info-value">{selecionada.reserva.cliente}</span>
                  </div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Placa</span>
                    <span className="mv-info-value mv-placa">{selecionada.reserva.placa}</span>
                  </div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Chegada prevista</span>
                    <span className="mv-info-value">{formatarHora(selecionada.reserva.horario_previsto)} ({tempoParaChegada(selecionada.reserva.horario_previsto)})</span>
                  </div>
                  {atrasoReserva(selecionada.reserva.horario_previsto) && (
                    <div className="mv-alert-atraso">
                      ⚠ {atrasoReserva(selecionada.reserva.horario_previsto)}
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes OCUPADA */}
              {selecionada.status === 'OCUPADA' && selecionada.ocupacao && (
                <div className="mv-detail-block">
                  <div className="mv-detail-title">Veículo</div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Placa</span>
                    <span className="mv-info-value mv-placa">{selecionada.ocupacao.placa}</span>
                  </div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Entrada</span>
                    <span className="mv-info-value">{formatarHora(selecionada.ocupacao.entrada)}</span>
                  </div>
                  <div className="mv-info-row">
                    <span className="mv-info-label">Tempo</span>
                    <span className="mv-info-value mv-tempo">{tempoDecorrido(selecionada.ocupacao.entrada)}</span>
                  </div>
                </div>
              )}

              {/* AÇÕES */}
              <div className="mv-acoes">
                <div className="mv-detail-title">Ações</div>

                {selecionada.status === 'LIVRE' && (
                  <>
                    <button className="mv-acao mv-acao--primary" onClick={() => executarAcao('nova-reserva', selecionada)} disabled={loadingAcao}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
                      Nova Reserva
                    </button>
                    <button className="mv-acao mv-acao--success" onClick={() => executarAcao('entrada-direta', selecionada)} disabled={loadingAcao}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3"/></svg>
                      Entrada Direta
                    </button>
                  </>
                )}

                {selecionada.status === 'RESERVADA' && (
                  <>
                    <button className="mv-acao mv-acao--success" onClick={() => executarAcao('checkin', selecionada)} disabled={loadingAcao}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                      Confirmar Chegada
                    </button>
                    <button className="mv-acao mv-acao--secondary" onClick={() => executarAcao('editar-reserva', selecionada)} disabled={loadingAcao}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                      Editar Reserva
                    </button>
                    <button className="mv-acao mv-acao--danger" onClick={() => executarAcao('cancelar-reserva', selecionada)} disabled={loadingAcao}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0-1.5 14H6.5L5 6m4 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Cancelar Reserva
                    </button>
                  </>
                )}

                {selecionada.status === 'OCUPADA' && (
                  <button className="mv-acao mv-acao--warning" onClick={() => executarAcao('checkout', selecionada)} disabled={loadingAcao}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/></svg>
                    Finalizar (Check-out)
                  </button>
                )}

                {selecionada.status === 'INATIVA' && (
                  <div className="mv-inativa-msg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93 19.07 19.07"/></svg>
                    Vaga fora de operação
                  </div>
                )}

                {/* Ver detalhes (sempre) */}
                <button className="mv-acao mv-acao--ghost">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  Ver Detalhes Completos
                </button>

                {loadingAcao && (
                  <div className="mv-loading-acao">
                    <div className="mv-spinner mv-spinner--sm" /> Processando...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
