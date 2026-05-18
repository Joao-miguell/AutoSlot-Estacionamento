import React from 'react';

const linhas = [
  ['ZZZ-0001', 'Lucas Nunes', '1h 35min', 'R$ 24,00', 'PIX', 'Administrador', '10/04/2026, 08:12'],
  ['AAA-9090', 'Ricardo Melo', '1h 0min', 'R$ 12,00', 'Cartão', 'Funcionário', '10/04/2026, 09:40'],
  ['BBB-7788', 'Paula Dias', '2h 30min', 'R$ 36,00', 'Dinheiro', 'Funcionário', '10/04/2026, 11:15']
];

export default function Relatorios() {
  return (
    <div>
      <div className="page-heading">
        <h2>Histórico e Relatórios</h2>
        <p>Histórico completo com relatórios avançados e visão financeira global.</p>
      </div>

      <div className="filters-row">
        <input placeholder="Filtrar por placa" />
        <input placeholder="Filtrar por cliente" />
        <input type="date" />
        <button className="ghost-button">Aplicar</button>
      </div>

      <div className="report-kpis">
        <div><span>Faturamento geral</span><strong>R$ 72,00</strong></div>
        <div><span>Taxa de ocupação</span><strong>25%</strong></div>
        <div><span>Atendimentos</span><strong>3</strong></div>
        <div><span>Ticket médio</span><strong>R$ 24,00</strong></div>
      </div>

      <div className="table-card">
        <table>
          <thead><tr><th>Placa</th><th>Cliente</th><th>Tempo</th><th>Valor</th><th>Pagamento</th><th>Operador</th><th>Data</th></tr></thead>
          <tbody>{linhas.map(linha => <tr key={linha[0]}>{linha.map(celula => <td key={celula}>{celula}</td>)}</tr>)}</tbody>
        </table>
      </div>

      <div className="charts-grid">
        <ChartCard title="Faturamento diário, semanal e mensal" bars={[45, 62, 82]} labels={['Dia', 'Semana', 'Mês']} />
        <ChartCard title="Faturamento por forma de pagamento" bars={[55, 78, 68]} labels={['PIX', 'Cartão', 'Dinheiro']} />
        <ChartCard title="Desempenho por operador" bars={[42, 72, 60]} labels={['Felipe', 'Ana', 'Carlos']} />
        <ChartCard title="Horários de pico (taxa de ocupação)" bars={[34, 58, 76]} labels={['08h', '13h', '18h']} />
      </div>
    </div>
  );
}

function ChartCard({ title, bars, labels }: { title: string; bars: number[]; labels: string[] }) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <div className="fake-chart">
        {bars.map((bar, index) => <span key={labels[index]} style={{ height: `${bar}%` }}><small>{labels[index]}</small></span>)}
      </div>
    </article>
  );
}
