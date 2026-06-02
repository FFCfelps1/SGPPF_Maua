import { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { orientacoesService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Orientacoes() {
  const [orientacoes, setOrientacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrient, setSelectedOrient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await orientacoesService.getAll();
      setOrientacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar orientações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await orientacoesService.delete(row.id);
      fetchData();
    } catch (error) {
      alert('Erro ao deletar orientação: ' + (error.response?.data?.detail || error.message));
    }
  };

  const columns = [
    { key: 'aluno', label: 'Aluno' },
    { key: 'nivel', label: 'Nível' },
    { 
      key: 'orientador', 
      label: 'Orientador',
      render: (val, row) => row.orientador?.usuario?.nome || '-'
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
      key: 'data_inicio', 
      label: 'Início',
      render: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : '-'
    },
  ];

  const handleRowClick = (row) => {
    setSelectedOrient(row);
    setIsModalOpen(true);
  };

  return (
    <div className="orientacoes-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Orientações Acadêmicas</h2>
          <p>Registro de iniciações científicas, TCCs, mestrados e doutorados.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Novo Registro
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados...</div>
      ) : (
        <DataTable 
          title="Orientações em Curso e Concluídas"
          columns={columns}
          data={orientacoes}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes da Orientação"
        footer={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fechar</button>}
      >
        {selectedOrient && (
          <div className="detail-grid">
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Título do Trabalho</div>
              <div className="detail-field-value">{selectedOrient.titulo_trabalho || 'N/A'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Nome do Aluno</div>
              <div className="detail-field-value">{selectedOrient.aluno}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Nível Acadêmico</div>
              <div className="detail-field-value">{selectedOrient.nivel}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Orientador</div>
              <div className="detail-field-value">{selectedOrient.orientador?.usuario?.nome}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Coorientador</div>
              <div className="detail-field-value">{selectedOrient.coorientador?.usuario?.nome || 'Nenhum'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Data de Início</div>
              <div className="detail-field-value">{selectedOrient.data_inicio ? new Date(selectedOrient.data_inicio).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Status</div>
              <div className="detail-field-value">{selectedOrient.status}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
