import { useState } from 'react';
import { publicacoesService } from '../../services/api';

export default function PublicationForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    doi: '',
    ano: new Date().getFullYear(),
    tipo: 'Artigo',
    periodico: '',
    issn: '',
    url: '',
    fator_impacto: 0,
    area_conhecimento: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicacoesService.create({
        ...formData,
        ano: parseInt(formData.ano),
        fator_impacto: parseFloat(formData.fator_impacto)
      });
      onSuccess();
    } catch (error) {
      alert('Erro ao salvar publicação: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="creation-form">
      <div className="form-group">
        <label className="form-label">Título da Publicação</label>
        <input 
          className="form-input" 
          value={formData.titulo} 
          onChange={e => setFormData({...formData, titulo: e.target.value})} 
          required 
        />
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">DOI</label>
          <input 
            className="form-input" 
            value={formData.doi} 
            onChange={e => setFormData({...formData, doi: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Ano</label>
          <input 
            type="number"
            className="form-input" 
            value={formData.ano} 
            onChange={e => setFormData({...formData, ano: e.target.value})} 
          />
        </div>
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select 
            className="form-select" 
            value={formData.tipo} 
            onChange={e => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="Artigo">Artigo</option>
            <option value="Conferência">Conferência</option>
            <option value="Livro">Livro</option>
            <option value="Patente">Patente</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Área de Conhecimento</label>
          <input 
            className="form-input" 
            value={formData.area_conhecimento} 
            onChange={e => setFormData({...formData, area_conhecimento: e.target.value})} 
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Periódico / Evento</label>
        <input 
          className="form-input" 
          value={formData.periodico} 
          onChange={e => setFormData({...formData, periodico: e.target.value})} 
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Registrar Publicação'}
        </button>
      </div>
    </form>
  );
}
