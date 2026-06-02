import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import TabPanel from '../components/ui/TabPanel';
import { grupos } from '../data/mockData';
import DataTable from '../components/ui/DataTable';

export default function Administracao() {
  const groupColumns = [
    { key: 'nome', label: 'Nome do Grupo / Laboratório' },
    { key: 'coordenador', label: 'Coordenador' },
    { key: 'membros', label: 'Integrantes' },
    { key: 'projetos', label: 'Projetos' },
  ];

  const tabs = [
    {
      label: 'Grupos de Pesquisa',
      content: (
        <DataTable 
          title="Laboratórios e Núcleos de Pesquisa"
          columns={groupColumns}
          data={grupos}
        />
      )
    },
    {
      label: 'Configurações de API',
      content: (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faCog} />
          </div>
          <h3 className="empty-state-title">Integrações de Sistema</h3>
          <p className="empty-state-text">Gerencie chaves de API para ORCID, CrossRef e Google Scholar.</p>
        </div>
      )
    },
    {
      label: 'Usuários e Perfis',
      content: (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <h3 className="empty-state-title">Controle de Acesso</h3>
          <p className="empty-state-text">Gerencie permissões de Administrador, Coordenador e Pesquisador.</p>
        </div>
      )
    }
  ];

  return (
    <div className="administracao-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Painel de Administração</h2>
          <p>Configurações globais, governança de dados e integração.</p>
        </div>
      </div>
      <TabPanel tabs={tabs} />
    </div>
  );
}
