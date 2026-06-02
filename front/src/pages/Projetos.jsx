import { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { projetosService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await projetosService.getAll();
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await projetosService.delete(row.id);
      fetchData();
    } catch (error) {
      alert('Erro ao deletar projeto: ' + (error.response?.data?.detail || error.message));
    }
  };

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'agencia_financiadora', label: 'Agência' },
    { 
      key: 'pesquisador_responsavel', 
      label: 'Responsável',
      render: (val, row) => row.pesquisador_responsavel?.usuario?.nome || '-'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => {
        const statusClass = (val || 'Em Andamento').toLowerCase().replace(/\s+/g, '');
        return <span className={`badge badge-${statusClass}`}>{val || 'Em Andamento'}</span>
      }
    },
    { 
      key: 'valor_aprovado', 
      label: 'Valor (R$)',
      render: (val) => (val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    },
  ];

  const handleRowClick = (row) => {
    setSelectedProject(row);
    setIsModalOpen(true);
  };

  return (
    <div className="projetos-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Projetos de Pesquisa</h2>
          <p>Acompanhamento de auxílios, temáticos e projetos de inovação.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Novo Projeto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados...</div>
      ) : (
        <DataTable 
          title="Projetos Ativos e Concluídos"
          columns={columns}
          data={projetos}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes do Projeto"
        footer={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fechar</button>}
      >
        {selectedProject && (
          <div className="detail-grid">
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Título do Projeto</div>
              <div className="detail-field-value">{selectedProject.titulo}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Código</div>
              <div className="detail-field-value">{selectedProject.codigo_projeto || 'N/A'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Agência Financiadora</div>
              <div className="detail-field-value">{selectedProject.agencia_financiadora}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Modalidade</div>
              <div className="detail-field-value">{selectedProject.modalidade}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Status Atual</div>
              <div className="detail-field-value">{selectedProject.status}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Data de Início</div>
              <div className="detail-field-value">{selectedProject.data_inicio ? new Date(selectedProject.data_inicio).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Previsão de Término</div>
              <div className="detail-field-value">{selectedProject.data_termino ? new Date(selectedProject.data_termino).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
