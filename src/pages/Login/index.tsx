import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../auth/ThemeContext';
import { Sun, Moon, Car, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import logoUrl from '../../images/Logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { temaEscuro, alternarTema } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

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
    }, 900);
  };

  const fillDemo = (type: 'admin' | 'func') => {
    if (type === 'admin') {
      setEmail('admin@estacionamento.com');
      setSenha('admin123');
    } else {
      setEmail('func@estacionamento.com');
      setSenha('func123');
    }
    setErro('');
  };

  return (
    <>
      {/* Botão de tema */}
      <div className="Botão-tema">
        <button className="btn-tema" onClick={alternarTema} title={temaEscuro ? 'Modo claro' : 'Modo escuro'}>
          {temaEscuro ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <main className="login-page">
  <section className="login-card">
          {/* Logo + Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <img
              src={logoUrl}
              alt="AutoSlot"
              style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 3 }}>AutoSlot</h1>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Sistema de controle de estacionamento</p>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              <span>{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} noValidate>
            <div className="field">
              <label>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-2)', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={{ paddingLeft: 36 }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-2)', pointerEvents: 'none' }}
                />
                <input
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: 36 }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
              style={{ marginTop: 6, minHeight: 44, fontSize: 14, fontWeight: 700 }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 0.75s linear infinite' }} /> Entrando…</>
                : <><ArrowRight size={16} /> Entrar no sistema</>
              }
            </button>
          </form>

          {/* Credenciais demo */}
          <div className="demo-users">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-2)', fontFamily: 'inherit' }}>
                Contas de demonstração
              </span>
            </div>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              style={{
                all: 'unset', display: 'block', cursor: 'pointer', padding: '6px 0',
                borderBottom: '1px solid var(--line)', color: 'var(--muted)', transition: 'color 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Admin · admin@estacionamento.com / admin123
            </button>
            <button
              type="button"
              onClick={() => fillDemo('func')}
              style={{
                all: 'unset', display: 'block', cursor: 'pointer', padding: '6px 0',
                color: 'var(--muted)', transition: 'color 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Func · func@estacionamento.com / func123
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
