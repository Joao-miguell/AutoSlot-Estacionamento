import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoUrl from '../../images/Logo.png';
import solUrl from '../../images/sol.png';
import luaUrl from '../../images/lua.png';


export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(true); // ← novo

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', temaEscuro);
  }, [temaEscuro]);

  const alternarTema = () => {
    setTemaEscuro(prev => !prev); // ← usa função para garantir valor atual
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) { setErro('Preencha login e senha.'); return; }

    setLoading(true);
    setErro('');

    setTimeout(() => {
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
    <>
      <div className="Botão-tema">
  <button className="btn-tema" onClick={alternarTema}>
  <img
    src={temaEscuro ? luaUrl : solUrl}
    alt={temaEscuro ? 'Mudar para claro' : 'Mudar para escuro'}
    style={{ width: '24px', height: '24px' }}
  />
</button>
</div>

      <div className="login-wrapper">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <img
            src={logoUrl}
            alt="AutoSlot Logo"
            style={{ width: '140px', height: '140px', margin: '0 auto 20px auto', display: 'block' }}
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
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" />
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
    </>
  );
}