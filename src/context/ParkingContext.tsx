import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export type SpotStatus = 'Livre' | 'Reservada' | 'Ocupada' | 'Expirada' | 'Inativa';

export type ParkingSpot = {
  id: number;
  codigo: string;
  status: SpotStatus;
  placa?: string;
  cliente?: string;
  modelo?: string;
  entrada?: string;
  saidaPrevista?: string;
  operador?: string;
};

export type HistoryItem = {
  placa: string;
  cliente: string;
  tempoMinutos: number;
  valor: number;
  pagamento: 'Dinheiro' | 'PIX' | 'Cartão';
  operador: string;
  data: string;
};

type Settings = {
  valorHora: number;
  toleranciaMinutos: number;
};

type NewReservation = {
  cliente: string;
  placa: string;
  modelo: string;
  entrada: string;
  saidaPrevista: string;
  vagaId: number;
};

type ParkingContextData = {
  vagas: ParkingSpot[];
  historico: HistoryItem[];
  configuracoes: Settings;
  metricas: {
    livres: number;
    ocupadas: number;
    reservadas: number;
    faturamento: number;
    ticketMedio: number;
    ocupacao: number;
  };
  reservar: (dados: NewReservation) => void;
  marcarChegada: (vagaId: number) => void;
  cancelarReservaExpirada: (vagaId: number) => void;
  finalizarPagamento: (vagaId: number, pagamento: HistoryItem['pagamento']) => void;
  adicionarVaga: () => void;
  editarVaga: (vagaId: number, codigo: string) => void;
  inativarVaga: (vagaId: number) => void;
  salvarConfiguracoes: (settings: Settings) => void;
  calcularValor: (entrada?: string, saida?: string) => number;
  calcularTempo: (entrada?: string, saida?: string) => number;
};

const ParkingContext = createContext<ParkingContextData>({} as ParkingContextData);

const agoraMenos = (minutos: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutos);
  return d.toISOString();
};

const agoraMais = (minutos: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutos);
  return d.toISOString();
};

const hojeAs = (hora: number, minuto: number) => {
  const d = new Date();
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
};

const vagasIniciais: ParkingSpot[] = [
  { id: 1, codigo: 'A01', status: 'Livre' },
  { id: 2, codigo: 'A02', status: 'Reservada', cliente: 'Carlos Lima', placa: 'AXD-1234', modelo: 'HB20', entrada: agoraMenos(18), saidaPrevista: agoraMais(42), operador: 'Ana Operadora' },
  { id: 3, codigo: 'A03', status: 'Ocupada', cliente: 'Marina Souza', placa: 'CPF-9087', modelo: 'Corolla', entrada: agoraMenos(148), saidaPrevista: agoraMenos(28), operador: 'Carlos Admin' },
  { id: 4, codigo: 'A04', status: 'Expirada', cliente: 'Bruno Rocha', placa: 'BRA-2026', modelo: 'Gol', entrada: agoraMenos(112), saidaPrevista: agoraMenos(20), operador: 'Ana Operadora' },
  { id: 5, codigo: 'B01', status: 'Livre' },
  { id: 6, codigo: 'B02', status: 'Ocupada', cliente: 'Patrícia Dias', placa: 'PKL-4065', modelo: 'Onix', entrada: agoraMenos(45), saidaPrevista: agoraMais(35), operador: 'Ana Operadora' },
  { id: 7, codigo: 'B03', status: 'Reservada', cliente: 'Eduardo Ferreira', placa: 'KWE-1102', modelo: 'Sandero', entrada: agoraMenos(50), saidaPrevista: agoraMais(85), operador: 'Carlos Admin' },
  { id: 8, codigo: 'B04', status: 'Livre' }
];

const historicoInicial: HistoryItem[] = [
  { placa: 'ZZZ-0001', cliente: 'Lucas Nunes', tempoMinutos: 95, valor: 24, pagamento: 'PIX', operador: 'Carlos Admin', data: hojeAs(8, 12) },
  { placa: 'AAA-9090', cliente: 'Ricardo Melo', tempoMinutos: 60, valor: 12, pagamento: 'Cartão', operador: 'Ana Operadora', data: hojeAs(9, 40) },
  { placa: 'BBB-7788', cliente: 'Paula Dias', tempoMinutos: 150, valor: 36, pagamento: 'Dinheiro', operador: 'Ana Operadora', data: hojeAs(11, 15) }
];

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [vagas, setVagas] = useState<ParkingSpot[]>(vagasIniciais);
  const [historico, setHistorico] = useState<HistoryItem[]>(historicoInicial);
  const [configuracoes, setConfiguracoes] = useState<Settings>({ valorHora: 12, toleranciaMinutos: 10 });

  const calcularTempo = (entrada?: string, saida = new Date().toISOString()) => {
    if (!entrada) return 0;
    return Math.max(0, Math.round((new Date(saida).getTime() - new Date(entrada).getTime()) / 60000));
  };

  const calcularValor = (entrada?: string, saida = new Date().toISOString()) => {
    const minutos = calcularTempo(entrada, saida);
    const cobravel = Math.max(0, minutos - configuracoes.toleranciaMinutos);
    return Math.ceil(cobravel / 60) * configuracoes.valorHora;
  };

  const metricas = useMemo(() => {
    const faturamento = historico.reduce((total, item) => total + item.valor, 0);
    const ocupadas = vagas.filter(v => v.status === 'Ocupada').length;
    const livres = vagas.filter(v => v.status === 'Livre').length;
    const reservadas = vagas.filter(v => v.status === 'Reservada').length;
    return {
      livres,
      ocupadas,
      reservadas,
      faturamento,
      ticketMedio: historico.length ? faturamento / historico.length : 0,
      ocupacao: vagas.length ? Math.round((ocupadas / vagas.length) * 100) : 0
    };
  }, [historico, vagas]);

  const reservar = (dados: NewReservation) => {
    setVagas(atual => atual.map(vaga => vaga.id === dados.vagaId ? {
      ...vaga,
      status: 'Reservada',
      cliente: dados.cliente || 'Cliente não informado',
      placa: dados.placa.toUpperCase(),
      modelo: dados.modelo || '-',
      entrada: new Date(dados.entrada).toISOString(),
      saidaPrevista: new Date(dados.saidaPrevista).toISOString(),
      operador: usuario?.nome ?? 'Operador'
    } : vaga));
  };

  const marcarChegada = (vagaId: number) => {
    setVagas(atual => atual.map(vaga => vaga.id === vagaId ? { ...vaga, status: 'Ocupada', entrada: new Date().toISOString() } : vaga));
  };

  const limparVaga = (vaga: ParkingSpot): ParkingSpot => ({ id: vaga.id, codigo: vaga.codigo, status: 'Livre' });

  const cancelarReservaExpirada = (vagaId: number) => {
    setVagas(atual => atual.map(vaga => vaga.id === vagaId ? limparVaga(vaga) : vaga));
  };

  const finalizarPagamento = (vagaId: number, pagamento: HistoryItem['pagamento']) => {
    const saida = new Date().toISOString();
    const vaga = vagas.find(item => item.id === vagaId);
    if (!vaga) return;

    setHistorico(atual => [{
      placa: vaga.placa ?? '-',
      cliente: vaga.cliente ?? '-',
      tempoMinutos: calcularTempo(vaga.entrada, saida),
      valor: calcularValor(vaga.entrada, saida),
      pagamento,
      operador: usuario?.nome ?? 'Operador',
      data: saida
    }, ...atual]);

    setVagas(atual => atual.map(item => item.id === vagaId ? limparVaga(item) : item));
  };

  const adicionarVaga = () => {
    setVagas(atual => {
      const proximoId = Math.max(...atual.map(v => v.id)) + 1;
      const codigo = `C${String(proximoId - 8).padStart(2, '0')}`;
      return [...atual, { id: proximoId, codigo, status: 'Livre' }];
    });
  };

  const editarVaga = (vagaId: number, codigo: string) => {
    setVagas(atual => atual.map(vaga => vaga.id === vagaId ? { ...vaga, codigo: codigo.toUpperCase() } : vaga));
  };

  const inativarVaga = (vagaId: number) => {
    setVagas(atual => atual.map(vaga => vaga.id === vagaId ? { ...vaga, status: 'Inativa' } : vaga));
  };

  const salvarConfiguracoes = (settings: Settings) => setConfiguracoes(settings);

  return (
    <ParkingContext.Provider value={{
      vagas,
      historico,
      configuracoes,
      metricas,
      reservar,
      marcarChegada,
      cancelarReservaExpirada,
      finalizarPagamento,
      adicionarVaga,
      editarVaga,
      inativarVaga,
      salvarConfiguracoes,
      calcularValor,
      calcularTempo
    }}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  return useContext(ParkingContext);
}
