<div align="center">
<img src="https://img.shields.io/badge/AUTOSLOT-SISTEMA_DE_ESTACIONAMENTO-blue?style=for-the-badge&logo=react&logoColor=white" alt="Logo Autoslot" />
<h1>🚗 Autoslot - Gestão Inteligente de Estacionamento</h1>
<p><i>Substituindo a prancheta por tecnologia de ponta.</i></p>
</div>
📖 Sobre o Projeto
O Autoslot é uma plataforma interna desenvolvida para modernizar a gestão de estacionamentos por hora. O projeto substitui controles manuais e organiza o fluxo de reservas recebidas pelo WhatsApp, oferecendo:
Mapa visual de vagas (livre / reservada / ocupada / inativa)
Ciclo completo: reserva → check-in → check-out → pagamento → liberação
Dashboard em tempo real com indicadores e alertas (no-show/atrasos)
Motor financeiro com cálculo automático por tempo + tolerância
Gestão administrativa (tarifas, vagas, usuários e permissões)
Histórico, relatórios (faturamento e ocupação) e auditoria de ações
Este repositório reúne o projeto acadêmico e a organização do desenvolvimento em 6 Sprints (Duplas).
🎯 Objetivo do Produto
Reduzir erros de cobrança (cálculo automático e rastreável)
Evitar overbooking (bloqueio de conflitos e controle de status)
Acelerar operação no caixa (fluxos em poucos cliques)
Aumentar controle gerencial (relatórios + auditoria)
👤 Perfis de Acesso
ADMIN (Dono): configura tarifas, gerencia vagas/usuários, acessa relatórios e auditoria.
FUNCIONÁRIO (Operação): realiza reserva, check-in, check-out e registra pagamentos.
🛠️ Tecnologias Utilizadas (Visão Completa)
<div align="left">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
</div>
🚀 Como Executar o Protótipo (Front-end Atual)
Siga os passos abaixo para rodar o protótipo funcional em sua máquina. Este protótipo não necessita de back-end ou banco de dados.
Pré-requisitos
Node.js (versão 18.x ou superior)
Git
Gerenciador de pacotes npm (incluído no Node.js)
Passo a Passo de Instalação
Clone o repositório:
code
Bash
git clone https://github.com/seu-usuario/autoslot.git
Acesse o diretório do projeto:
code
Bash
cd autoslot
Instale as dependências:
code
Bash
npm install
Inicie o servidor de desenvolvimento:
code
Bash
npm run dev
Acesse no navegador:
Abra a URL fornecida no terminal, geralmente http://localhost:5173.
🔑 Credenciais para Acesso (Mock)
Utilize os seguintes dados na tela de login:
Perfil Administrador:
Login: admin@estacionamento.com
Senha: admin123
Perfil Funcionário:
Login: func@estacionamento.com
Senha: func123
🧩 Principais Módulos do Projeto Completo
Autenticação & Permissões (JWT + perfis)
Mapa de Vagas (grid/posição e ações rápidas)
Reservas (criar, listar, buscar, editar e cancelar)
Entrada Direta (sem reserva)
Pagamento & Checkout (cálculo automático + vínculo do operador)
Tarifas (histórico e apenas 1 ativa)
Relatórios (faturamento e ocupação)
Auditoria (log de ações por usuário)
🚀 Estrutura de Desenvolvimento (Sprints)
Clique em cada seção para ver os detalhes técnicos de implementação:
<details>
<summary><b>🔐 Dupla 1: Autenticação e Segurança</b></summary>
<br>
Frontend: Tela de login responsiva (React), rotas públicas/privadas, bloqueio por perfil.
Backend: Autenticação JWT e hash de senhas (ex: bcrypt).
Destaque: Perfis (ADMIN vs FUNCIONÁRIO) e middleware de permissão.
</details>
<details>
<summary><b>🗺️ Dupla 2: Mapa e Estrutura de Vagas</b></summary>
<br>
Frontend: Mapa em grid (posições X/Y), legenda de cores, ações rápidas por status.
Backend: Endpoints para mapa e detalhes da vaga, validações por status.
Destaque: Gestão de vagas (Admin) com inativação e exclusão apenas quando permitido.
</details>
<details>
<summary><b>⏱️ Dupla 3: Ciclo de Reserva e Entrada</b></summary>
<br>
Frontend: Nova reserva + listagem/busca + check-in (confirmar chegada) + entrada direta.
Backend: Validação de conflito de horários (RN02), criação/edição/cancelamento de reservas.
Destaque: Alertas de no-show/atraso e regras de status da reserva/vaga.
</details>
<details>
<summary><b>💰 Dupla 4: Motor Financeiro e Checkout</b></summary>
<br>
Frontend: Tela/modal de checkout e pagamento (PIX, Cartão, Dinheiro).
Backend: Cálculo automático por tempo + tolerância, registro de pagamento e liberação de vaga.
Destaque: Bloqueio de saída sem pagamento (RN03).
</details>
<details>
<summary><b>📊 Dupla 5: Gestão e Relatórios (LGPD)</b></summary>
<br>
Frontend: Dashboard com KPIs e alertas; telas de relatórios (Admin).
Backend: Endpoints agregados para faturamento e ocupação; filtros por período.
Destaque: Exibição mínima de dados sensíveis e controle de acesso por perfil.
</details>
<details>
<summary><b>⚙️ Dupla 6: Configurações do Administrador</b></summary>
<br>
Frontend: Painel Admin para tarifas, vagas, usuários e auditoria.
Backend: Persistência de configurações e logs de auditoria.
Destaque: Histórico de tarifas e rastreabilidade por usuário.
</details>
📋 Regras de Negócio de Destaque
RN01 (Integridade): Vagas com histórico não devem ser removidas; usar inativação.
RN02 (Conflito): Bloquear reservas com sobreposição de horário na mesma vaga.
RN03 (Segurança): Nenhuma vaga é liberada sem pagamento registrado.
RN04 (UX): Erros amigáveis; sem expor detalhes técnicos ao usuário.
👥 Equipe do Projeto
Nome	Função
João Miguel	Analista de Requisitos
Felipe Moreira	Desenvolvedor Frontend
Felipe Nadab	Desenvolvedor Frontend
João Pedro	Desenvolvedor Backend
Kaio Cesar	Desenvolvedor Backend
Mateus Fonseca	Analista de QA
<div align="center">
<p>Projeto acadêmico desenvolvido para a disciplina de Laboratório de Desenvolvimento de Software - UNICIV 2026</p>
</div>