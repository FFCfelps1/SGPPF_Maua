import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { googleClientId } from './config/authConfig';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Pesquisadores from './pages/Pesquisadores';
import Projetos from './pages/Projetos';
import Publicacoes from './pages/Publicacoes';
import Orientacoes from './pages/Orientacoes';
import Financiamentos from './pages/Financiamentos';
import Relatorios from './pages/Relatorios';
import Administracao from './pages/Administracao';
import Login from './pages/Login';

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('sgppf-token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="pesquisadores" element={<Pesquisadores />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="publicacoes" element={<Publicacoes />} />
          <Route path="orientacoes" element={<Orientacoes />} />
          <Route path="financiamentos" element={<Financiamentos />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="administracao" element={<Administracao />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
