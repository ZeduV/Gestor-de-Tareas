import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { verificarSesion } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [cargando, setCargando] = useState(true);
  const initialCheckDone = useRef(false);

  // On mount ONLY, try to validate a previously-stored token.
  // We intentionally do NOT re-run this when `token` changes from login(),
  // because login() already sets the user directly.
  useEffect(() => {
    // Skip if we already ran the initial check (prevents re-running after login)
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    if (!token) {
      setCargando(false);
      return;
    }

    setCargando(true);

    // Try to validate with /api/me. If it doesn't exist yet (404),
    // we still trust the stored token and reconstruct user from it.
    verificarSesion()
      .then((data) => {
        setUsuario(data);
      })
      .catch(() => {
        // /api/me may not exist yet in backend.
        // Try to reconstruct minimal user from the token format: "token-valido-usuario-{id}"
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          try {
            setUsuario(JSON.parse(storedUser));
          } catch {
            // Corrupted data — clean up
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUsuario(null);
          }
        } else {
          // No way to validate — clean up
          localStorage.removeItem('auth_token');
          setToken(null);
          setUsuario(null);
        }
      })
      .finally(() => setCargando(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback((nuevoToken, datosUsuario) => {
    localStorage.setItem('auth_token', nuevoToken);
    localStorage.setItem('auth_user', JSON.stringify(datosUsuario));
    setToken(nuevoToken);
    setUsuario(datosUsuario);
    setCargando(false); // Ensure we're not stuck in loading state
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUsuario(null);
    initialCheckDone.current = false; // Allow re-validation on next login
  }, []);

  const value = {
    usuario,
    token,
    cargando,
    autenticado: !!usuario,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
