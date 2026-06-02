import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faFolderOpen, 
  faFileAlt, 
  faGraduationCap, 
  faHandHoldingUsd, 
  faChartBar, 
  faCogs,
  faPlus,
  faPlusCircle,
  faUserPlus,
  faFileUpload,
  faCoins
} from '@fortawesome/free-solid-svg-icons';
import { useUI } from '../../context/UIContext';
import { currentUser, menuItems } from '../../data/mockData';

const iconMap = {
  faChartLine,
  faUsers,
  faFolderOpen,
  faFileAlt,
  faGraduationCap,
  faHandHoldingUsd,
  faChartBar,
  faCogs
};

export default function Sidebar() {
  const location = useLocation();
  const { openModal } = useUI();

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">{currentUser.avatar}</div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{currentUser.name}</div>
          <div className="sidebar-profile-role">{currentUser.role}</div>
          <div className="sidebar-profile-id">ID: {currentUser.id}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Principal</div>
        {menuItems.slice(0, 1).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive && location.pathname === '/' ? 'active' : ''}`
            }
            end
          >
            <span className="sidebar-item-icon">
              <FontAwesomeIcon icon={iconMap[item.icon]} />
            </span>
            <span>{item.label}</span>
            {item.badge && <span className="sidebar-item-badge">{item.badge}</span>}
          </NavLink>
        ))}

        <div className="sidebar-section-title">Gestão Acadêmica</div>
        {menuItems.slice(1, 6).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon">
              <FontAwesomeIcon icon={iconMap[item.icon]} />
            </span>
            <span>{item.label}</span>
            {item.badge && <span className="sidebar-item-badge">{item.badge}</span>}
          </NavLink>
        ))}

        <div className="sidebar-section-title">Sistema</div>
        {menuItems.slice(6).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon">
              <FontAwesomeIcon icon={iconMap[item.icon]} />
            </span>
            <span>{item.label}</span>
            {item.badge && <span className="sidebar-item-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-add-btn primary" onClick={() => openModal('projeto')}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Novo Projeto</span>
        </button>
        <button className="sidebar-add-btn" onClick={() => openModal('pesquisador')}>
          <FontAwesomeIcon icon={faUserPlus} />
          <span>Pesquisador</span>
        </button>
        <button className="sidebar-add-btn" onClick={() => openModal('publicacao')}>
          <FontAwesomeIcon icon={faPlusCircle} />
          <span>Publicação</span>
        </button>
        <button className="sidebar-add-btn" onClick={() => openModal('financiamento')}>
          <FontAwesomeIcon icon={faCoins} />
          <span>Financiamento</span>
        </button>
      </div>
    </aside>
  );
}
