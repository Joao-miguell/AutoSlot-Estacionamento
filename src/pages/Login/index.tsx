import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoUrl from '../../images/Logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) { setErro('Preencha login e senha.'); return; }
    
    setLoading(true);
    setErro('');

    setTimeout(() => {
      // MOCK DE ACESSO
      if (email === 'admin@estacionamento.com' && senha === 'admin123') {
        login('tk-admin', { nome: 'Carlos Admin', perfil: 'ADMIN' });
        navigate('/dashboard');
      } else if (email === 'func@estacionamento.com' && senha === 'func123') {
        login('tk-func', { nome: 'Ana Operadora', perfil: 'FUNCIONARIO' });
        navigate('/dashboard');
      } else {
        setErro('Usuário ou senha inválidos.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    
    <div className="login-wrapper">
      <div className="login-card" style={{ textAlign: 'center' }}>
  <img
    src={logoUrl}
    alt="AutoSlot Logo"
    style={{
      width: '140px',
      height: '140px',
      margin: '0 auto 20px auto',
      display: 'block'
    }}
  />

  <h1 style={{ marginBottom: '10px' }}>AutoSlot</h1>
        <p>Acesse com seu perfil</p>
        {erro && <div className="alert alert-error" style={{margin: '10px 0'}}>{erro}</div>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label style={{ textAlign: 'left' }}>Login</label> 
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
          </div>
          <div className="field">
            <label style={{ textAlign: 'left' }}>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <div style={{marginTop: '20px', fontSize: '11px', color: '#666', textAlign: 'left'}}>
          Admin: admin@estacionamento.com / admin123 <br/>
          Func: func@estacionamento.com / func123
        </div>
      </div>
    </div>
  );
}