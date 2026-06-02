import { useState } from 'react';
import { pesquisadoresService } from '../../services/api';

export default function ResearcherForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    departamento: '',
    area_atuacao: '',
    orcid: '',
    lattes_url: '',
    instituicao_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Nota: Em um sistema real, primeiro criamos o usuário e depois o pesquisador.
      // Aqui simplificaremos para fins do protótipo funcional.
      await pesquisadoresService.create({
        ...formData,
        usuario_id: 1 // Temporário: vincular ao usuário admin padrão
      });
      onSuccess();
    } catch (error) {
      alert('Erro ao salvar pesquisador: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="creation-form">
      <div className="form-group">
        <label className="form-label">Nome Completo</label>
        <input 
          className="form-input" 
          value={formData.nome} 
          onChange={e => setFormData({...formData, nome: e.target.value})} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label">E-mail Institucional</label>
        <input 
          className="form-input" 
          type="email"
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
        />
      </div>
      <div className="detail-grid">
        <div className="form-group">
          <label className="form-label">Departamento</label>
          <input 
            className="form-input" 
            value={formData.departamento} 
            onChange={e => setFormData({...formData, departamento: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Área de Atuação</label>
          <input 
            className="form-input" 
            value={formData.area_atuacao} 
            onChange={e => setFormData({...formData, area_atuacao: e.target.value})} 
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">ORCID</label>
        <input 
          className="form-input" 
          placeholder="0000-0000-0000-0000"
          value={formData.orcid} 
          onChange={e => setFormData({...formData, orcid: e.target.value})} 
        />
      </div>
      <div className="form-group">
        <label className="form-label">URL Lattes</label>
        <input 
          className="form-input" 
          placeholder="http://lattes.cnpq.br/..."
          value={formData.lattes_url} 
          onChange={e => setFormData({...formData, lattes_url: e.target.value})} 
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Cadastrar Pesquisador'}
        </button>
      </div>
    </form>
  );
}
