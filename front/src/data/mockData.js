// Mock Data for SGPPF — Sistema de Gestão de Projetos, Publicações e Financiamentos

export const currentUser = {
  id: 'USR-001',
  name: 'Vanderlei C. P.',
  email: 'vanderlei.cp@maua.br',
  role: 'Pesquisador — NSEE',
  avatar: 'VC',
  departamento: 'Engenharia Elétrica',
  perfil: 'Pesquisador',
};

export const pesquisadores = [
  { id: 1, nome: 'Vanderlei C. Parro', email: 'vanderlei.cp@maua.br', departamento: 'Engenharia Elétrica', area: 'Automação e Controle', orcid: '0000-0002-1234-5678', lattes: 'http://lattes.cnpq.br/1234567890', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2015-03-01', hIndex: 12, citacoes: 245 },
  { id: 2, nome: 'Maria A. Santos', email: 'maria.santos@maua.br', departamento: 'Engenharia Química', area: 'Catálise e Reatores', orcid: '0000-0003-9876-5432', lattes: 'http://lattes.cnpq.br/0987654321', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2012-08-15', hIndex: 18, citacoes: 512 },
  { id: 3, nome: 'João P. Oliveira', email: 'joao.oliveira@maua.br', departamento: 'Ciência da Computação', area: 'Inteligência Artificial', orcid: '0000-0001-5555-7777', lattes: 'http://lattes.cnpq.br/5555777733', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2018-02-10', hIndex: 8, citacoes: 134 },
  { id: 4, nome: 'Ana L. Ferreira', email: 'ana.ferreira@maua.br', departamento: 'Engenharia Mecânica', area: 'Materiais Compósitos', orcid: '0000-0002-3333-9999', lattes: 'http://lattes.cnpq.br/3333999911', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2016-07-20', hIndex: 14, citacoes: 328 },
  { id: 5, nome: 'Carlos R. Lima', email: 'carlos.lima@maua.br', departamento: 'Engenharia Civil', area: 'Estruturas', orcid: '0000-0003-4444-2222', lattes: 'http://lattes.cnpq.br/4444222288', status: 'Inativo', vinculo: 'CLT', dataIngresso: '2010-01-05', hIndex: 22, citacoes: 780 },
  { id: 6, nome: 'Patrícia M. Costa', email: 'patricia.costa@maua.br', departamento: 'Design', area: 'Design Industrial', orcid: '0000-0001-6666-8888', lattes: 'http://lattes.cnpq.br/6666888844', status: 'Ativo', vinculo: 'PJ', dataIngresso: '2020-03-15', hIndex: 5, citacoes: 67 },
  { id: 7, nome: 'Ricardo F. Mendes', email: 'ricardo.mendes@maua.br', departamento: 'Engenharia de Produção', area: 'Logística', orcid: '0000-0002-7777-1111', lattes: 'http://lattes.cnpq.br/7777111155', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2017-11-01', hIndex: 10, citacoes: 198 },
  { id: 8, nome: 'Fernanda S. Almeida', email: 'fernanda.almeida@maua.br', departamento: 'Administração', area: 'Gestão de Inovação', orcid: '0000-0003-2222-6666', lattes: 'http://lattes.cnpq.br/2222666699', status: 'Ativo', vinculo: 'CLT', dataIngresso: '2019-06-10', hIndex: 7, citacoes: 89 },
];

export const projetos = [
  { id: 1, titulo: 'Sistema de Monitoramento IoT para Eficiência Energética', codigo: 'PRJ-2024-001', agencia: 'FAPESP', modalidade: 'Auxílio Regular', responsavel: 'Vanderlei C. Parro', equipe: ['Maria A. Santos', 'João P. Oliveira'], dataInicio: '2024-01-15', dataTermino: '2026-01-14', status: 'Em Andamento', valorAprovado: 185000 },
  { id: 2, titulo: 'Desenvolvimento de Catalisadores Verdes para Biomassa', codigo: 'PRJ-2023-015', agencia: 'CNPq', modalidade: 'Universal', responsavel: 'Maria A. Santos', equipe: ['Ana L. Ferreira'], dataInicio: '2023-06-01', dataTermino: '2025-05-31', status: 'Em Andamento', valorAprovado: 120000 },
  { id: 3, titulo: 'Modelos de Deep Learning para Diagnóstico Médico', codigo: 'PRJ-2024-003', agencia: 'FAPESP', modalidade: 'Temático', responsavel: 'João P. Oliveira', equipe: ['Vanderlei C. Parro', 'Fernanda S. Almeida'], dataInicio: '2024-03-01', dataTermino: '2027-02-28', status: 'Em Andamento', valorAprovado: 450000 },
  { id: 4, titulo: 'Nanocompósitos Poliméricos para Aeronáutica', codigo: 'PRJ-2022-008', agencia: 'CAPES', modalidade: 'PROEX', responsavel: 'Ana L. Ferreira', equipe: ['Carlos R. Lima'], dataInicio: '2022-08-01', dataTermino: '2024-07-31', status: 'Concluído', valorAprovado: 95000 },
  { id: 5, titulo: 'Otimização de Cadeias Logísticas com IA Generativa', codigo: 'PRJ-2024-012', agencia: 'Empresa', modalidade: 'P&D', responsavel: 'Ricardo F. Mendes', equipe: ['João P. Oliveira', 'Fernanda S. Almeida'], dataInicio: '2024-06-01', dataTermino: '2025-12-31', status: 'Em Andamento', valorAprovado: 320000 },
  { id: 6, titulo: 'Reforço Estrutural com Fibras de Carbono', codigo: 'PRJ-2021-020', agencia: 'FAPESP', modalidade: 'Jovem Pesquisador', responsavel: 'Carlos R. Lima', equipe: ['Ana L. Ferreira'], dataInicio: '2021-04-01', dataTermino: '2024-03-31', status: 'Concluído', valorAprovado: 210000 },
];

export const publicacoes = [
  { id: 1, titulo: 'IoT-based Energy Monitoring System: A Comprehensive Framework', doi: '10.1016/j.enbuild.2024.001', ano: 2024, tipo: 'Artigo', periodico: 'Energy and Buildings', qualis: 'A1', issn: '0378-7788', citacoes: 12, fatorImpacto: 7.2, area: 'Engenharia Elétrica', autores: ['Vanderlei C. Parro', 'Maria A. Santos'] },
  { id: 2, titulo: 'Green Catalysts from Sugarcane Bagasse: Synthesis and Characterization', doi: '10.1021/acscatal.2024.002', ano: 2024, tipo: 'Artigo', periodico: 'ACS Catalysis', qualis: 'A1', issn: '2155-5435', citacoes: 8, fatorImpacto: 12.9, area: 'Engenharia Química', autores: ['Maria A. Santos', 'Ana L. Ferreira'] },
  { id: 3, titulo: 'Deep Learning for Medical Image Segmentation: A Survey', doi: '10.1109/TMI.2024.003', ano: 2024, tipo: 'Artigo', periodico: 'IEEE Trans. Medical Imaging', qualis: 'A1', issn: '0278-0062', citacoes: 45, fatorImpacto: 11.0, area: 'Ciência da Computação', autores: ['João P. Oliveira', 'Vanderlei C. Parro'] },
  { id: 4, titulo: 'Polymer Nanocomposites for Aerospace Applications', doi: '10.1016/j.compscitech.2023.004', ano: 2023, tipo: 'Artigo', periodico: 'Composites Science and Tech.', qualis: 'A2', issn: '0266-3538', citacoes: 22, fatorImpacto: 9.1, area: 'Engenharia Mecânica', autores: ['Ana L. Ferreira', 'Carlos R. Lima'] },
  { id: 5, titulo: 'Supply Chain Optimization using Reinforcement Learning', doi: '10.1016/j.ejor.2024.005', ano: 2024, tipo: 'Conferência', periodico: 'IJCAI 2024', qualis: 'A1', issn: '-', citacoes: 5, fatorImpacto: null, area: 'Engenharia de Produção', autores: ['Ricardo F. Mendes', 'João P. Oliveira'] },
  { id: 6, titulo: 'Carbon Fiber Reinforcement in Concrete Structures', doi: '10.1061/(ASCE)ST.2024.006', ano: 2023, tipo: 'Artigo', periodico: 'J. Structural Engineering', qualis: 'A2', issn: '0733-9445', citacoes: 15, fatorImpacto: 5.3, area: 'Engenharia Civil', autores: ['Carlos R. Lima', 'Ana L. Ferreira'] },
  { id: 7, titulo: 'Innovation Management in Brazilian Tech Industry', doi: '10.1016/j.techfore.2024.007', ano: 2024, tipo: 'Artigo', periodico: 'Tech. Forecasting & Social Change', qualis: 'A1', issn: '0040-1625', citacoes: 3, fatorImpacto: 12.0, area: 'Administração', autores: ['Fernanda S. Almeida'] },
  { id: 8, titulo: 'Sensor Fusion Techniques for Autonomous Systems', doi: '10.1109/TITS.2024.008', ano: 2024, tipo: 'Artigo', periodico: 'IEEE Trans. ITS', qualis: 'A1', issn: '1524-9050', citacoes: 18, fatorImpacto: 8.5, area: 'Engenharia Elétrica', autores: ['Vanderlei C. Parro'] },
];

export const orientacoes = [
  { id: 1, aluno: 'Lucas M. Ribeiro', nivel: 'Mestrado', titulo: 'Aprendizado por Reforço em Sistemas de Controle Industrial', orientador: 'Vanderlei C. Parro', coorientador: 'João P. Oliveira', dataInicio: '2023-03-01', dataConclusao: null, status: 'Em Andamento', bolsa: 'CAPES', agencia: 'CAPES' },
  { id: 2, aluno: 'Camila T. Souza', nivel: 'Doutorado', titulo: 'Catalisadores Heterogêneos para Conversão de CO2', orientador: 'Maria A. Santos', coorientador: null, dataInicio: '2022-08-01', dataConclusao: null, status: 'Em Andamento', bolsa: 'FAPESP', agencia: 'FAPESP' },
  { id: 3, aluno: 'Pedro H. Andrade', nivel: 'Iniciação Científica', titulo: 'Classificação de Imagens com Redes Neurais Convolucionais', orientador: 'João P. Oliveira', coorientador: null, dataInicio: '2024-02-01', dataConclusao: null, status: 'Em Andamento', bolsa: 'CNPq', agencia: 'CNPq' },
  { id: 4, aluno: 'Mariana R. Gomes', nivel: 'TCC', titulo: 'Análise de Falha em Materiais Compósitos via Elementos Finitos', orientador: 'Ana L. Ferreira', coorientador: 'Carlos R. Lima', dataInicio: '2024-01-15', dataConclusao: '2024-12-15', status: 'Concluída', bolsa: null, agencia: null },
  { id: 5, aluno: 'Thiago F. Nascimento', nivel: 'Mestrado', titulo: 'Otimização Multiobjetivo em Redes de Distribuição', orientador: 'Ricardo F. Mendes', coorientador: null, dataInicio: '2023-08-01', dataConclusao: '2025-07-31', status: 'Em Andamento', bolsa: 'CAPES', agencia: 'CAPES' },
  { id: 6, aluno: 'Beatriz L. Castro', nivel: 'Doutorado', titulo: 'Monitoramento de Integridade Estrutural com Sensores Acústicos', orientador: 'Carlos R. Lima', coorientador: 'Vanderlei C. Parro', dataInicio: '2021-03-01', dataConclusao: '2024-12-31', status: 'Concluída', bolsa: 'FAPESP', agencia: 'FAPESP' },
  { id: 7, aluno: 'Gabriel A. Pereira', nivel: 'Iniciação Científica', titulo: 'Design Generativo Aplicado a Produtos Sustentáveis', orientador: 'Patrícia M. Costa', coorientador: null, dataInicio: '2024-03-01', dataConclusao: null, status: 'Em Andamento', bolsa: 'Mauá', agencia: 'Institucional' },
];

export const financiamentos = [
  { id: 1, projetoId: 1, titulo: 'Sistema de Monitoramento IoT', codigo: 'PRJ-2024-001', agencia: 'FAPESP', modalidade: 'Auxílio Regular', responsavel: 'Vanderlei C. Parro', valorAprovado: 185000, valorRecebido: 92500, moeda: 'BRL', dataInicio: '2024-01-15', dataTermino: '2026-01-14', status: 'Vigente' },
  { id: 2, projetoId: 2, titulo: 'Catalisadores Verdes', codigo: 'PRJ-2023-015', agencia: 'CNPq', modalidade: 'Universal', responsavel: 'Maria A. Santos', valorAprovado: 120000, valorRecebido: 80000, moeda: 'BRL', dataInicio: '2023-06-01', dataTermino: '2025-05-31', status: 'Vigente' },
  { id: 3, projetoId: 3, titulo: 'Deep Learning Diagnóstico', codigo: 'PRJ-2024-003', agencia: 'FAPESP', modalidade: 'Temático', responsavel: 'João P. Oliveira', valorAprovado: 450000, valorRecebido: 150000, moeda: 'BRL', dataInicio: '2024-03-01', dataTermino: '2027-02-28', status: 'Vigente' },
  { id: 4, projetoId: 4, titulo: 'Nanocompósitos Aeronáutica', codigo: 'PRJ-2022-008', agencia: 'CAPES', modalidade: 'PROEX', responsavel: 'Ana L. Ferreira', valorAprovado: 95000, valorRecebido: 95000, moeda: 'BRL', dataInicio: '2022-08-01', dataTermino: '2024-07-31', status: 'Encerrado' },
  { id: 5, projetoId: 5, titulo: 'Otimização Logística com IA', codigo: 'PRJ-2024-012', agencia: 'Empresa', modalidade: 'P&D', responsavel: 'Ricardo F. Mendes', valorAprovado: 320000, valorRecebido: 160000, moeda: 'BRL', dataInicio: '2024-06-01', dataTermino: '2025-12-31', status: 'Vigente' },
  { id: 6, projetoId: 6, titulo: 'Reforço Estrutural Fibras', codigo: 'PRJ-2021-020', agencia: 'FAPESP', modalidade: 'Jovem Pesquisador', responsavel: 'Carlos R. Lima', valorAprovado: 210000, valorRecebido: 210000, moeda: 'BRL', dataInicio: '2021-04-01', dataTermino: '2024-03-31', status: 'Encerrado' },
];

export const grupos = [
  { id: 1, nome: 'NSEE — Núcleo de Sistemas Eletrônicos e Embarcados', coordenador: 'Vanderlei C. Parro', membros: 12, projetos: 3, publicacoes: 18 },
  { id: 2, nome: 'LCRQ — Laboratório de Catálise e Reatores Químicos', coordenador: 'Maria A. Santos', membros: 8, projetos: 2, publicacoes: 25 },
  { id: 3, nome: 'LIA — Laboratório de Inteligência Artificial', coordenador: 'João P. Oliveira', membros: 15, projetos: 4, publicacoes: 12 },
  { id: 4, nome: 'LCMC — Lab. de Compósitos e Materiais Cerâmicos', coordenador: 'Ana L. Ferreira', membros: 6, projetos: 2, publicacoes: 14 },
  { id: 5, nome: 'GEE — Grupo de Engenharia Estrutural', coordenador: 'Carlos R. Lima', membros: 10, projetos: 3, publicacoes: 30 },
];

export const dashboardStats = {
  totalPublicacoes: 156,
  publicacoes3Anos: 87,
  totalOrientacoes: 42,
  orientacoesConcluidas: 28,
  projetosAtivos: 4,
  valorTotalCaptado: 1380000,
  hIndexMedio: 12,
  totalCitacoes: 2353,
  ultimaAtualizacao: '2024-12-15',
};

export const publicacoesPorAno = [
  { ano: 2019, quantidade: 18 },
  { ano: 2020, quantidade: 22 },
  { ano: 2021, quantidade: 25 },
  { ano: 2022, quantidade: 28 },
  { ano: 2023, quantidade: 35 },
  { ano: 2024, quantidade: 28 },
];

export const projetosPorStatus = [
  { status: 'Em Andamento', quantidade: 4, cor: '#f39c12' },
  { status: 'Concluído', quantidade: 2, cor: '#2ecc71' },
  { status: 'Cancelado', quantidade: 0, cor: '#e74c3c' },
];

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'faChartLine', path: '/' },
  { id: 'pesquisadores', label: 'Pesquisadores', icon: 'faUsers', path: '/pesquisadores', badge: 8 },
  { id: 'projetos', label: 'Projetos', icon: 'faFolderOpen', path: '/projetos', badge: 6 },
  { id: 'publicacoes', label: 'Publicações', icon: 'faFileAlt', path: '/publicacoes', badge: 8 },
  { id: 'orientacoes', label: 'Orientações', icon: 'faGraduationCap', path: '/orientacoes', badge: 7 },
  { id: 'financiamentos', label: 'Financiamentos', icon: 'faHandHoldingUsd', path: '/financiamentos' },
  { id: 'relatorios', label: 'Relatórios', icon: 'faChartBar', path: '/relatorios' },
  { id: 'administracao', label: 'Administração', icon: 'faCogs', path: '/administracao' },
];
