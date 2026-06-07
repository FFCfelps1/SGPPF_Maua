/**
 * Brazilian-Portuguese UI copy. Components reference these keys; no hardcoded
 * pt-BR strings live in components (KTD11). Entity units extend their sections.
 */
export const labels = {
  app: {
    name: "SGPPF",
    full: "Sistema de Gestão de Projetos, Publicações e Financiamentos",
  },
  nav: {
    dashboard: "Painel",
    researchers: "Pesquisadores",
    projects: "Projetos",
    publications: "Publicações",
    advisings: "Orientações",
    admin: "Administração",
    signOut: "Sair",
  },
  actions: {
    create: "Novo",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    search: "Buscar",
    exportCsv: "Exportar CSV",
    importDoi: "Importar por DOI",
  },
  auth: {
    signIn: "Entrar",
    signUp: "Criar conta",
    email: "E-mail institucional",
    password: "Senha",
    fullName: "Nome completo",
    noAccount: "Não tem conta?",
    hasAccount: "Já tem conta?",
    signInWithMicrosoft: "Entrar com Microsoft", // shown once Azure provider is enabled
  },
  errors: {
    required: "Campo obrigatório",
    invalidEmail: "E-mail inválido",
    invalidCredentials: "E-mail ou senha inválidos",
    duplicate: "Esse valor já está em uso",
    notMauaEmail: "Use seu e-mail institucional da Mauá",
    unauthorized: "Você não tem permissão para esta ação",
    generic: "Algo deu errado. Tente novamente.",
  },
  dialogs: {
    confirmDelete: {
      title: "Confirmar exclusão",
      description: "Esta ação não pode ser desfeita.",
      confirm: "Excluir",
      cancel: "Cancelar",
    },
  },
  empty: {
    researchers: {
      title: "Nenhum pesquisador cadastrado",
      description: "Os pesquisadores aparecerão aqui assim que forem adicionados.",
    },
    projects: {
      title: "Nenhum projeto cadastrado",
      description: "Crie um projeto para começar a registrar financiamentos e publicações.",
    },
    publications: {
      title: "Nenhuma publicação registrada",
      description: "Importe por DOI ou registre manualmente.",
    },
    advisings: {
      title: "Nenhuma orientação registrada",
      description: "As orientações aparecerão aqui assim que forem adicionadas.",
    },
    funding: {
      title: "Nenhum financiamento registrado",
      description: "Adicione um contrato de financiamento a este projeto.",
    },
  },
  dashboard: {
    title: "Painel",
    publicationsTotal: "Publicações",
    publicationsLast3y: "Publicações (últimos 3 anos)",
    advisingsTotal: "Orientações",
    advisingsCompleted: "Orientações concluídas",
    activeFundedProjects: "Projetos financiados ativos",
    fundsReceived: "Recursos captados (BRL)",
    empty: "Sem dados ainda",
  },
} as const;
