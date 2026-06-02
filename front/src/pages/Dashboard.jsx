import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faGraduationCap, faFolderOpen, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import StatCard from '../components/ui/StatCard';
import { dashboardService } from '../services/api';
import { publicacoesPorAno, projetosPorStatus } from '../data/mockData';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Fallback para dados locais se a API falhar ou não estiver pronta
      setStats({
        totalPublicacoes: 0,
        totalOrientacoes: 0,
        projetosAtivos: 0,
        valorTotalCaptado: 0,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="empty-state">Carregando dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Dashboard Institucional</h2>
          <p>Visão geral dos indicadores de pesquisa e financiamento do CEUN-IMT.</p>
        </div>
        <div className="page-header-right">
          <span className="last-update">Última atualização: {stats.ultimaAtualizacao}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={<FontAwesomeIcon icon={faFileAlt} />} 
          value={stats.totalPublicacoes} 
          label="Total de Publicações" 
          color="#1976d2"
          delay={1}
        />
        <StatCard 
          icon={<FontAwesomeIcon icon={faGraduationCap} />} 
          value={stats.totalOrientacoes} 
          label="Total de Orientações" 
          color="#00bcd4"
          delay={2}
        />
        <StatCard 
          icon={<FontAwesomeIcon icon={faFolderOpen} />} 
          value={stats.projetosAtivos} 
          label="Projetos Ativos" 
          color="#f39c12"
          delay={3}
        />
        <StatCard 
          icon={<FontAwesomeIcon icon={faHandHoldingUsd} />} 
          value={`R$ ${(stats.valorTotalCaptado / 1000000).toFixed(1)}M`} 
          label="Total Captado" 
          color="#2ecc71"
          delay={4}
        />
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h3 className="chart-title">Publicações por Ano</h3>
          </div>
          <div className="chart-body" style={{ height: '200px' }}>
            {publicacoesPorAno.map((item, index) => (
              <div 
                key={item.ano} 
                className="chart-bar" 
                style={{ 
                  height: `${(item.quantidade / 40) * 100}%`,
                  animationDelay: `${0.1 * index}s`
                }}
              >
                <span className="chart-bar-label">{item.ano}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h3 className="chart-title">Status dos Projetos</h3>
          </div>
          <div className="chart-body" style={{ height: '200px', alignItems: 'center', justifyContent: 'space-around' }}>
            {projetosPorStatus.map((item, index) => (
              <div key={item.status} className="status-indicator" style={{ textAlign: 'center' }}>
                <div 
                  className="status-circle" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    border: `4px solid ${item.cor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: item.cor
                  }}
                >
                  {item.quantidade}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
