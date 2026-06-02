import { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { pesquisadoresService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Pesquisadores() {
  const [pesquisadores, setPesquisadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await pesquisadoresService.getAll();
      setPesquisadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar pesquisadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await pesquisadoresService.delete(row.id);
      fetchData();
    } catch (error) {
      alert('Erro ao deletar pesquisador: ' + (error.response?.data?.detail || error.message));
    }
  };

  const columns = [
    { 
      key: 'nome', 
      label: 'Nome',
      render: (val, row) => row.usuario?.nome || val
    },
    { key: 'departamento', label: 'Departamento' },
    { key: 'area_atuacao', label: 'Área de Atuação' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`badge badge-${(val || 'ativo').toLowerCase()}`}>{val || 'Ativo'}</span>
      )
    },
  ];

  const handleRowClick = (row) => {
    setSelectedResearcher(row);
    setIsModalOpen(true);
  };

  return (
    <div className="pesquisadores-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Pesquisadores</h2>
          <p>Gerenciamento da base de pesquisadores e docentes do CEUN-IMT.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Novo Pesquisador
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados...</div>
      ) : (
        <DataTable 
          title="Lista de Pesquisadores"
          columns={columns}
          data={pesquisadores}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes do Pesquisador"
        footer={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fechar</button>}
      >
        {selectedResearcher && (
          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-field-label">Nome Completo</div>
              <div className="detail-field-value">{selectedResearcher.usuario?.nome}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">E-mail Institucional</div>
              <div className="detail-field-value">{selectedResearcher.usuario?.email}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Departamento</div>
              <div className="detail-field-value">{selectedResearcher.departamento}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">ORCID</div>
              <div className="detail-field-value">{selectedResearcher.orcid || 'Não informado'}</div>
            </div>
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Currículo Lattes</div>
              <div className="detail-field-value">
                {selectedResearcher.lattes_url ? (
                  <a href={selectedResearcher.lattes_url} target="_blank" rel="noreferrer">
                    {selectedResearcher.lattes_url}
                  </a>
                ) : 'Não informado'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
