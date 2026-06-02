import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Modal from '../ui/Modal';
import { useUI } from '../../context/UIContext';
import ResearcherForm from '../forms/ResearcherForm';
import ProjectForm from '../forms/ProjectForm';
import PublicationForm from '../forms/PublicationForm';
import FundingForm from '../forms/FundingForm';

export default function MainLayout() {
  const { modals, closeModal } = useUI();

  const handleSuccess = (type) => {
    closeModal(type);
    window.location.reload(); // Simplificado: recarregar para ver os novos dados
  };

  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />

      {/* Modais Globais de Criação */}
      <Modal 
        isOpen={modals.pesquisador} 
        onClose={() => closeModal('pesquisador')} 
        title="Cadastrar Novo Pesquisador"
      >
        <ResearcherForm 
          onSuccess={() => handleSuccess('pesquisador')} 
          onCancel={() => closeModal('pesquisador')} 
        />
      </Modal>

      <Modal 
        isOpen={modals.projeto} 
        onClose={() => closeModal('projeto')} 
        title="Criar Novo Projeto de Pesquisa"
      >
        <ProjectForm 
          onSuccess={() => handleSuccess('projeto')} 
          onCancel={() => closeModal('projeto')} 
        />
      </Modal>

      <Modal 
        isOpen={modals.publicacao} 
        onClose={() => closeModal('publicacao')} 
        title="Registrar Produção Científica"
      >
        <PublicationForm 
          onSuccess={() => handleSuccess('publicacao')} 
          onCancel={() => closeModal('publicacao')} 
        />
      </Modal>

      <Modal 
        isOpen={modals.financiamento} 
        onClose={() => closeModal('financiamento')} 
        title="Registrar Novo Financiamento"
      >
        <FundingForm 
          onSuccess={() => handleSuccess('financiamento')} 
          onCancel={() => closeModal('financiamento')} 
        />
      </Modal>
    </div>
  );
}
