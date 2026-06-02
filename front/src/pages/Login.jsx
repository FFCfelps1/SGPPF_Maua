import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { PublicClientApplication } from '@azure/msal-browser';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api';
import { msalConfig, loginRequest } from '../config/authConfig';
import mauaLogo from '../assets/maua_azul.png';

const msalInstance = new PublicClientApplication(msalConfig);
let msalInitialized = false;

const GoogleIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 23 23">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#7FBA00" d="M12 0h11v11H12z" />
    <path fill="#00A4EF" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      if (!nome.trim()) {
        setError('Por favor, informe seu nome.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      
      setLoading(true);
      try {
        const response = await authService.register(nome, email, password);
        localStorage.setItem('sgppf-token', response.data.access_token);
        localStorage.setItem('sgppf-user', JSON.stringify(response.data.user));
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.detail || 'Erro ao realizar o cadastro. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const response = await authService.login(email, password);
        localStorage.setItem('sgppf-token', response.data.access_token);
        localStorage.setItem('sgppf-user', JSON.stringify(response.data.user));
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.detail || 'Falha na autenticação. Verifique seus dados.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMicrosoftLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (!msalInitialized) {
        await msalInstance.initialize();
        msalInitialized = true;
      }
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      const token = loginResponse.accessToken;
      
      const response = await authService.socialLogin('microsoft', { token });
      localStorage.setItem('sgppf-token', response.data.access_token);
      localStorage.setItem('sgppf-user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Falha no login via Microsoft.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const token = tokenResponse.access_token;
        const response = await authService.socialLogin('google', { token });
        localStorage.setItem('sgppf-token', response.data.access_token);
        localStorage.setItem('sgppf-user', JSON.stringify(response.data.user));
        navigate('/');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Falha no login via Google.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error(error);
      setError('Falha na autenticação com o Google.');
    }
  });

  return (
    <div className="login-container" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)'
    }}>
      <div className="login-card glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--space-2xl)',
        textAlign: 'center'
      }}>
        <img src={mauaLogo} alt="Logo Mauá" style={{ height: '50px', marginBottom: 'var(--space-xl)' }} />
        
        <h2 style={{ marginBottom: 'var(--space-xs)' }}>{isSignUp ? 'Cadastrar no SGPPF' : 'Bem-vindo ao SGPPF'}</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', fontSize: 'var(--font-size-sm)' }}>
          {isSignUp ? 'Crie uma conta para começar a gerenciar seus projetos.' : 'Acesse com sua conta institucional ou credenciais.'}
        </p>

        {error && (
          <div style={{ 
            background: 'rgba(231, 76, 60, 0.1)', 
            color: 'var(--color-danger)', 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
            fontSize: 'var(--font-size-xs)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          {isSignUp && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">E-mail</label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="seu.email@maua.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Confirmar Senha</label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'var(--space-md)', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Cadastrando...' : 'Autenticando...') : (
              <>
                <FontAwesomeIcon icon={isSignUp ? faUserPlus : faSignInAlt} style={{ marginRight: '8px' }} /> 
                {isSignUp ? 'Cadastrar' : 'Entrar'}
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
          {isSignUp ? (
            <span style={{ color: 'var(--color-text-muted)' }}>
              Já tem uma conta?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(false); setError(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600', padding: 0 }}
              >
                Entrar
              </button>
            </span>
          ) : (
            <span style={{ color: 'var(--color-text-muted)' }}>
              Ainda não tem conta?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(true); setError(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600', padding: 0 }}
              >
                Cadastre-se
              </button>
            </span>
          )}
        </div>

        <div style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-xl)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-md)' }}>
            Ou entre com
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ 
                flex: 1, 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '10px' 
              }} 
              onClick={handleMicrosoftLogin}
              disabled={loading}
            >
               <MicrosoftIcon /> Microsoft
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ 
                flex: 1, 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '10px' 
              }} 
              onClick={() => handleGoogleLogin()}
              disabled={loading}
            >
               <GoogleIcon /> Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
