import { useState, useEffect } from 'react';
import { financiamentosService, projetosService } from '../../services/api';

export default function FundingForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    projeto_id: '',
    agencia: '',
    valor_aprovado: 0,
    valor_recebido: 0,
    moeda: 'BRL',
    status: 'Vigente',
    data_inicio: '',
    data_termino: ''
  });
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    projetosService.getAll().then(res => setProjetos(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financiamentosService.create({
        ...formData,
        projeto_id: parseInt(formData.projeto_id),
        valor_aprovado: parseFloat(formData.valor_aprovado),
        valor_recebido: parseFloat(formData.valor_recebido),
        data_inicio: formData.data_inicio ? new Date(formData.data_inicio).toISOString() : null,
        data_termino: formData.data_termino ? new Date(formData.data_termino).toISOString() : null,
      });
      onSuccess();
    } catch (error) {
      alert('Erro ao salvar financiamento: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="creation-form">
      <div className="form-group">
        <label className="form-label">Projeto Associado</label>
        <select 
          className="form-select" 
          value={formData.projeto_id} 
          onChange={e => setFormData({...formData, projeto_id: e.target.value})}
          required
        >
          <option value="">Selecione o projeto...</option>
          {projetos.map(p => (
            <option key={p.id} value={p.id}>{p.titulo}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Agência Financiadora</label>
        <input 
          className="form-input" 
          value={formData.agencia} 
          onChange={e => setFormData({...formData, agencia: e.target.value})} 
          required 
        />
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">Valor Aprovado</label>
          <input 
            type="number"
            className="form-input" 
            value={formData.valor_aprovado} 
            onChange={e => setFormData({...formData, valor_aprovado: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Moeda</label>
          <select 
            className="form-select" 
            value={formData.moeda} 
            onChange={e => setFormData({...formData, moeda: e.target.value})}
          >
            <option value="BRL">BRL (R$)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Registrar Financiamento'}
        </button>
      </div>
    </form>
  );
}
