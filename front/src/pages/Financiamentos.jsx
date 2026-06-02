import { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { financiamentosService } from '../services/api';

export default function Financiamentos() {
  const [financiamentos, setFinanciamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFin, setSelectedFin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await financiamentosService.getAll();
      setFinanciamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar financiamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'projeto', 
      label: 'Projeto',
      render: (val, row) => row.projeto?.titulo || '-'
    },
    { key: 'agencia', label: 'Agência' },
    { 
      key: 'valor_aprovado', 
      label: 'Aprovado',
      render: (val, row) => `${row.moeda} ${(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    { 
      key: 'valor_recebido', 
      label: 'Recebido',
      render: (val, row) => `${row.moeda} ${(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => {
        const statusClass = (val || '').toLowerCase() === 'vigente' ? 'active' : 'inactive';
        return <span className={`badge badge-${statusClass}`}>{val || 'Pendente'}</span>
      }
    },
  ];

  const handleRowClick = (row) => {
    setSelectedFin(row);
    setIsModalOpen(true);
  };

  return (
    <div className="financiamentos-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestão Financeira</h2>
          <p>Acompanhamento de verbas, bolsas e recursos captados.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">Exportar Relatório</button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados...</div>
      ) : (
        <DataTable 
          title="Financiamentos e Aportes"
          columns={columns}
          data={financiamentos}
          onRowClick={handleRowClick}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes Financeiros"
        footer={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fechar</button>}
      >
        {selectedFin && (
          <div className="detail-grid">
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <div className="detail-field-label">Projeto Associado</div>
              <div className="detail-field-value">{selectedFin.projeto?.titulo}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Agência</div>
              <div className="detail-field-value">{selectedFin.agencia}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Valor Aprovado</div>
              <div className="detail-field-value">{selectedFin.moeda} {(selectedFin.valor_aprovado || 0).toLocaleString('pt-BR')}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Valor Recebido</div>
              <div className="detail-field-value">{selectedFin.moeda} {(selectedFin.valor_recebido || 0).toLocaleString('pt-BR')}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Saldo a Receber</div>
              <div className="detail-field-value">{selectedFin.moeda} {((selectedFin.valor_aprovado || 0) - (selectedFin.valor_recebido || 0)).toLocaleString('pt-BR')}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">Status do Financiamento</div>
              <div className="detail-field-value">{selectedFin.status}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
