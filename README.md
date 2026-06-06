# SGPPF Mauá

Sistema de Gestão de Projetos, Publicações e Financiamentos (SGPPF) desenvolvido
para centralizar informações de pesquisa do Centro Universitário do Instituto
Mauá de Tecnologia (CEUN-IMT).

O projeto reúne dados de pesquisadores, projetos, publicações, orientações e
financiamentos em uma aplicação web, oferecendo uma visão institucional para
apoio à gestão acadêmica e à tomada de decisões.

## Estado atual

A primeira versão funcional do sistema já possui:

- autenticação local com cadastro, login e token JWT;
- integração de login social com Google e Microsoft;
- dashboard com indicadores institucionais;
- cadastro, listagem, edição e exclusão de pesquisadores e projetos;
- cadastro, listagem e exclusão de publicações, orientações e financiamentos;
- interface responsiva com tema claro e escuro;
- API REST documentada automaticamente pelo FastAPI;
- banco SQLite com script de inicialização e dados de demonstração;
- documentação detalhada de requisitos em LaTeX e PDF;
- configurações iniciais de implantação na Vercel.

Algumas áreas ainda estão em desenvolvimento:

- gráficos do dashboard ainda utilizam parte dos dados locais de demonstração;
- relatórios e administração possuem principalmente a estrutura visual;
- importação de publicações por DOI ainda não foi implementada no backend;
- autenticação social exige credenciais válidas dos provedores;
- permissões por perfil e proteção dos endpoints da API precisam ser concluídas;
- o lint do frontend ainda aponta erros relacionados a hooks e contextos;
- testes automatizados, CI/CD e preparação para produção ainda precisam ser
  adicionados.

## Tecnologias

### Frontend

- React 19
- Vite 8
- React Router
- Axios
- Font Awesome
- Google OAuth e Microsoft Authentication Library (MSAL)

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT e Passlib
- SQLite no ambiente local, com suporte preparado para PostgreSQL

## Estrutura do projeto

```text
.
├── back/                  # API FastAPI, modelos, schemas e banco local
│   ├── app/
│   │   ├── api/v1/       # Rotas da API
│   │   ├── core/         # Configuração, banco de dados e segurança
│   │   ├── models/       # Modelos SQLAlchemy
│   │   └── schemas/      # Schemas Pydantic
│   ├── init_db.py        # Inicializa as tabelas
│   └── seed_db.py        # Recria e popula o banco de demonstração
├── docs/                  # Documento de requisitos em LaTeX e PDF
├── front/                 # Aplicação React
│   └── src/
│       ├── components/    # Componentes visuais e formulários
│       ├── pages/         # Páginas da aplicação
│       └── services/      # Integração com a API
├── LICENSE
└── README.md
```

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Python 3.12 recomendado
- Git

## Executando localmente

### 1. Backend

Abra um terminal na raiz do projeto:

```powershell
cd back
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python seed_db.py
python -m uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`.

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI: `http://localhost:8000/api/v1/openapi.json`

O comando `python seed_db.py` apaga os dados existentes e recria o banco de
demonstração. Para apenas criar as tabelas sem apagar dados, utilize
`python init_db.py`. No Windows, o banco SQLite local fica por padrão em
`%LOCALAPPDATA%\SGPPF\sgppf.db`, evitando conflitos com pastas sincronizadas
pelo OneDrive.

### 2. Frontend

Em outro terminal, a partir da raiz do projeto:

```powershell
cd front
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Usuário de demonstração

Após executar `python seed_db.py`, utilize:

```text
E-mail: vanderlei.cp@maua.br
Senha:  maua123
```

## Variáveis de ambiente

O frontend utiliza as seguintes variáveis opcionais em `front/.env`:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=
VITE_MICROSOFT_CLIENT_ID=
VITE_MICROSOFT_TENANT_ID=common
```

O backend lê configurações de `back/.env`. Exemplos:

```dotenv
SECRET_KEY=troque-esta-chave-em-ambientes-reais
# Opcional:
# SQLALCHEMY_DATABASE_URI=postgresql://usuario:senha@localhost:5432/sgppf
GOOGLE_CLIENT_ID=
MICROSOFT_CLIENT_ID=
MICROSOFT_TENANT_ID=common
```

Nunca publique chaves, segredos ou credenciais reais no repositório.

## Scripts úteis

No diretório `front/`:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

No diretório `back/`:

```powershell
python init_db.py
python seed_db.py
python -m uvicorn app.main:app --reload
```

## Documentação

A especificação completa do sistema está disponível em
[`docs/requisitos.pdf`](docs/requisitos.pdf). O arquivo-fonte pode ser editado
em [`docs/requisitos.tex`](docs/requisitos.tex).

## Próximos passos sugeridos

1. Proteger os endpoints da API e implementar autorização por perfil.
2. Concluir os módulos de relatórios e administração.
3. Substituir todos os dados mockados por consultas à API.
4. Implementar importação de publicações por DOI.
5. Adicionar testes automatizados para frontend e backend.
6. Corrigir os erros atuais do lint e configurar verificações de qualidade.
7. Criar migrações de banco com Alembic e configuração segura para produção.
8. Adicionar pipeline de integração e implantação contínuas.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo
[`LICENSE`](LICENSE) para mais informações.
