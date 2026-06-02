import { useState, useEffect } from 'react';
import { projetosService, pesquisadoresService } from '../../services/api';

export default function ProjectForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    codigo_projeto: '',
    agencia_financiadora: '',
    modalidade: '',
    pesquisador_responsavel_id: '',
    data_inicio: '',
    data_termino: '',
    status: 'Em Andamento',
    valor_aprovado: 0
  });
  const [pesquisadores, setPesquisadores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pesquisadoresService.getAll().then(res => setPesquisadores(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projetosService.create({
        ...formData,
        valor_aprovado: parseFloat(formData.valor_aprovado),
        data_inicio: formData.data_inicio ? new Date(formData.data_inicio).toISOString() : null,
        data_termino: formData.data_termino ? new Date(formData.data_termino).toISOString() : null,
      });
      onSuccess();
    } catch (error) {
      alert('Erro ao salvar projeto: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="creation-form">
      <div className="form-group">
        <label className="form-label">Título do Projeto</label>
        <input 
          className="form-input" 
          value={formData.titulo} 
          onChange={e => setFormData({...formData, titulo: e.target.value})} 
          required 
        />
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">Código</label>
          <input 
            className="form-input" 
            value={formData.codigo_projeto} 
            onChange={e => setFormData({...formData, codigo_projeto: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Agência</label>
          <input 
            className="form-input" 
            value={formData.agencia_financiadora} 
            onChange={e => setFormData({...formData, agencia_financiadora: e.target.value})} 
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Pesquisador Responsável</label>
        <select 
          className="form-select" 
          value={formData.pesquisador_responsavel_id} 
          onChange={e => setFormData({...formData, pesquisador_responsavel_id: e.target.value})}
          required
        >
          <option value="">Selecione...</option>
          {pesquisadores.map(p => (
            <option key={p.id} value={p.id}>{p.usuario?.nome}</option>
          ))}
        </select>
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">Valor Aprovado (R$)</label>
          <input 
            type="number"
            className="form-input" 
            value={formData.valor_aprovado} 
            onChange={e => setFormData({...formData, valor_aprovado: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select 
            className="form-select" 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Suspenso">Suspenso</option>
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Criar Projeto'}
        </button>
      </div>
    </form>
  );
}
