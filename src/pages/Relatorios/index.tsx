import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useParking } from '../../context/ParkingContext';
import { dataHora, duracao, moeda } from '../../utils';

export default function Relatorios() {
  const { usuario } = useAuth();
  const { historico, metricas } = useParking();
  const [filtroData, setFiltroData] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const isAdmin = usuario?.perfil === 'ADMIN';

  const itens = useMemo(() => {
    return historico.filter(item => {
      if (!isAdmin && item.operador !== usuario?.nome) return false;
      const dataOK = !filtroData || item.data.slice(0, 10) === filtroData;
      const clienteOK = !filtroCliente || item.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
      const placaOK = !filtroPlaca || item.placa.toLowerCase().includes(filtroPlaca.toLowerCase());
      return dataOK && clienteOK && placaOK;
    });
  }, [filtroCliente, filtroData, filtroPlaca, historico, isAdmin, usuario?.nome]);

  const faturamentoFiltrado = itens.reduce((total, item) => total + item.valor, 0);

  return (
    <section>
      <div className="page-title card">
        <div>
          <h2>Histórico e Relatórios</h2>
          <p>{isAdmin ? 'Histórico completo com relatórios avançados e visão financeira global.' : 'Histórico simples restrito ao próprio turno do funcionário.'}</p>
        </div>
      </div>

      <div className="filters">
        <input value={filtroPlaca} onChange={e => setFiltroPlaca(e.target.value)} placeholder="Filtrar por placa" />
        <input value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} placeholder="Filtrar por cliente" />
        <input value={filtroData} onChange={e => setFiltroData(e.target.value)} type="date" />
        <button className="btn btn-ghost" onClick={() => undefined}>Aplicar</button>
      </div>

      <div className="summary-grid">
        <article><span>Faturamento geral</span><strong>{moeda(faturamentoFiltrado)}</strong></article>
        <article><span>Taxa de ocupação</span><strong>{metricas.ocupacao}%</strong></article>
        <article><span>Atendimentos</span><strong>{itens.length}</strong></article>
        <article><span>Ticket médio</span><strong>{moeda(itens.length ? faturamentoFiltrado / itens.length : 0)}</strong></article>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Placa</th><th>Cliente</th><th>Tempo</th><th>Valor</th><th>Pagamento</th><th>Operador</th><th>Data</th></tr>
          </thead>
          <tbody>
            {itens.length ? itens.map(item => (
              <tr key={`${item.placa}-${item.data}`}>
                <td>{item.placa}</td>
                <td>{item.cliente}</td>
                <td>{duracao(item.tempoMinutos)}</td>
                <td>{moeda(item.valor)}</td>
                <td>{item.pagamento}</td>
                <td>{item.operador}</td>
                <td>{dataHora(item.data)}</td>
              </tr>
            )) : <tr><td colSpan={7}>Nenhum registro encontrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <div className="chart-grid">
          <ChartCard title="Faturamento diário, semanal e mensal" bars={[45, 65, 90]} labels={['Dia', 'Semana', 'Mês']} />
          <ChartCard title="Faturamento por forma de pagamento" bars={[55, 80, 70]} labels={['Dinheiro', 'PIX', 'Cartão']} />
          <ChartCard title="Desempenho por operador" bars={[60, 85, 72]} labels={['Felipe', 'Ana', 'Carlos']} />
          <ChartCard title="Horários de pico (taxa de ocupação)" bars={[35, 68, 92]} labels={['08h', '12h', '18h']} />
        </div>
      )}
    </section>
  );
}

function ChartCard({ title, bars, labels }: { title: string; bars: number[]; labels: string[] }) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <div className="bars">
        {bars.map((bar, index) => <span key={labels[index]} style={{ height: `${bar}%` }}><small>{labels[index]}</small></span>)}
      </div>
    </article>
  );
}
