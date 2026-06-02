import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

export default function Relatorios() {
  return (
    <div className="relatorios-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Relatórios e Indicadores</h2>
          <p>Geração de documentos para agências de fomento e análise estratégica.</p>
        </div>
      </div>
      <div className="empty-state glass-card">
        <div className="empty-state-icon">
          <FontAwesomeIcon icon={faChartBar} />
        </div>
        <h3 className="empty-state-title">Módulo em Desenvolvimento</h3>
        <p className="empty-state-text">
          Este módulo permitirá a exportação personalizada de dados em PDF, Excel e dashboards interativos Power BI.
        </p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }}>Solicitar Relatório Customizado</button>
      </div>
    </div>
  );
}
