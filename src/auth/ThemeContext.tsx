// src/auth/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  temaEscuro: boolean;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  temaEscuro: true,
  alternarTema: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lê preferência salva (ou inicia escuro)
  const [temaEscuro, setTemaEscuro] = useState<boolean>(() => {
    const salvo = localStorage.getItem('autoslot-tema');
    return salvo !== null ? salvo === 'escuro' : true;
  });

  // Sincroniza classe no body e salva no localStorage
  useEffect(() => {
    document.body.classList.toggle('dark', temaEscuro);
    localStorage.setItem('autoslot-tema', temaEscuro ? 'escuro' : 'claro');
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(prev => !prev);

  return (
    <ThemeContext.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
