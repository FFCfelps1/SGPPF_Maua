import { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { publicacoesService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons';

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPub, setSelectedPub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await publicacoesService.getAll();
      setPublicacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await publicacoesService.delete(row.id);
      fetchData();
    } catch (error) {
      alert('Erro ao deletar publicação: ' + (error.response?.data?.detail || error.message));
    }
  };

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'ano', label: 'Ano' },
    { key: 'tipo', label: 'Tipo' },
    { 
      key: 'autores', 
      label: 'Autores',
      render: (val, row) => row.autores?.map(a => a.usuario?.nome).join(', ') || '-'
    },
    { key: 'periodico', label: 'Periódico' },
  ];

  const handleRowClick = (row) => {
    setSelectedPub(row);
    setIsModalOpen(true);
  };

  return (
    <div className="publicacoes-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Publicações Científicas</h2>
          <p>Artigos, conferências, livros e capítulos produzidos pelos pesquisadores.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">
            <FontAwesomeIcon icon={faFileUpload} /> Importar via DOI
          </button>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Novo Registro
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados...</div>
      ) : (
        <DataTable 
          title="Produção Intelectual"
          columns={columns}
          data={publicacoes}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes da Publicação"
        footer={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fechar</button>}
      >
        {selectedPub && (
          <div className="detail-grid">
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Título</div>
              <div className="detail-field-value">{selectedPub.titulo}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">DOI</div>
              <div className="detail-field-value">{selectedPub.doi || 'N/A'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Ano de Publicação</div>
              <div className="detail-field-value">{selectedPub.ano}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Tipo</div>
              <div className="detail-field-value">{selectedPub.tipo}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Periódico / Evento</div>
              <div className="detail-field-value">{selectedPub.periodico}</div>
            </div>
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Autores</div>
              <div className="detail-field-value">{selectedPub.autores?.map(a => a.usuario?.nome).join(', ') || 'N/A'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Área de Conhecimento</div>
              <div className="detail-field-value">{selectedPub.area_conhecimento || 'N/A'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">ISSN</div>
              <div className="detail-field-value">{selectedPub.issn || 'N/A'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
