import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faQuestionCircle, faCog, faSun, faMoon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import mauaLogo from '../../assets/maua_azul.png';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'notifications' | 'help' | 'settings' | null
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', title: 'Novo Projeto Cadastrado', text: 'O projeto "Smart Grid Mauá" foi enviado para análise da coordenação.', time: '5 min atrás', unread: true },
    { id: 2, type: 'doc', title: 'Publicação Científica Importada', text: 'O artigo do prof. Newton foi adicionado via DOI com sucesso.', time: '2 horas atrás', unread: true },
    { id: 3, type: 'finance', title: 'Verba FAPESP Liberada', text: 'Primeira parcela de R$ 50.000,00 foi creditada para pesquisa.', time: '1 dia atrás', unread: true }
  ]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('sgppf-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.header-right')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleDropdownToggle = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    localStorage.removeItem('sgppf-token');
    localStorage.removeItem('sgppf-user');
    navigate('/login');
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '55px',
    right: '0',
    background: 'var(--color-bg-secondary, #2c3e50)',
    border: '1px solid var(--color-border, rgba(255, 255, 255, 0.1))',
    borderRadius: 'var(--radius-md, 8px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    padding: '16px',
    zIndex: 1000,
    textAlign: 'left',
    backdropFilter: 'blur(12px)',
    color: 'var(--color-text-primary, #ffffff)',
    animation: 'fadeIn 0.2s ease-out'
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={mauaLogo} alt="Instituto Mauá de Tecnologia" className="header-logo" />
        <div>
          <div className="header-title">Aplicativo para controle de projetos CEUN-IMT</div>
          <div className="header-subtitle">Sistema de Gestão de Projetos, Publicações e Financiamentos</div>
        </div>
      </div>
      <div className="header-right" style={{ position: 'relative', display: 'flex', gap: '8px' }}>
        <button 
          className="header-icon-btn" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
        <button 
          className={`header-icon-btn ${activeDropdown === 'notifications' ? 'active' : ''}`} 
          onClick={() => handleDropdownToggle('notifications')}
          title="Notificações"
          style={{ position: 'relative' }}
        >
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--color-danger, #e74c30)',
              color: '#fff',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
        <button 
          className={`header-icon-btn ${activeDropdown === 'help' ? 'active' : ''}`} 
          onClick={() => handleDropdownToggle('help')}
          title="Ajuda"
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
        <button 
          className={`header-icon-btn ${activeDropdown === 'settings' ? 'active' : ''}`} 
          onClick={() => handleDropdownToggle('settings')}
          title="Configurações"
        >
          <FontAwesomeIcon icon={faCog} />
        </button>

        {/* Notifications Dropdown */}
        {activeDropdown === 'notifications' && (
          <div style={{ ...dropdownStyle, width: '340px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Notificações</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--color-primary, #3498db)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '8px', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', background: n.unread ? 'rgba(52, 152, 219, 0.05)' : 'none', position: 'relative', borderRadius: '4px' }}>
                  <div style={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{n.title}</span>
                    {n.unread && <span style={{ width: '6px', height: '6px', background: 'var(--color-primary, #3498db)', borderRadius: '50%' }}></span>}
                  </div>
                  <p style={{ margin: '4px 0', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{n.text}</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', opacity: 0.8 }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Dropdown */}
        {activeDropdown === 'help' && (
          <div style={{ ...dropdownStyle, width: '280px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Ajuda & Suporte
            </div>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '2px', color: '#f1c40f' }}>💡 Dica Rápida</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>Para importar artigos acadêmicos, digite o código DOI no módulo de Publicações para importação automática.</span>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>📂 Documentos Úteis</strong>
                <a href="#manual-coord" style={{ display: 'block', color: 'var(--color-primary, #3498db)', textDecoration: 'none', marginBottom: '4px' }}>📘 Manual do Coordenador.pdf</a>
                <a href="#manual-pesq" style={{ display: 'block', color: 'var(--color-primary, #3498db)', textDecoration: 'none' }}>📗 Guia do Pesquisador.pdf</a>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                <span>Dúvidas ou problemas?</span>
                <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Suporte: <a href="mailto:suporte.sgppf@maua.br" style={{ color: 'var(--color-primary, #3498db)', textDecoration: 'none' }}>suporte.sgppf@maua.br</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Dropdown */}
        {activeDropdown === 'settings' && (
          <div style={{ ...dropdownStyle, width: '250px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Minha Conta
            </div>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Usuário Atual</div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '2px' }}>{user.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>{user.email}</div>
                  <span style={{ display: 'inline-block', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', marginTop: '6px', fontWeight: 'bold' }}>
                    {user.perfil}
                  </span>
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Não autenticado</div>
              )}
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  onClick={toggleTheme} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--color-text-primary)', padding: '8px', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                  <span>Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--color-danger, #e74c3c)', padding: '8px', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px' }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(231, 76, 60, 0.05)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
