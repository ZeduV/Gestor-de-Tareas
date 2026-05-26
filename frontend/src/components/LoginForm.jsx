import { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ClipboardList } from 'lucide-react';
import { loginUsuario } from '../api';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css';

function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUsuario({ email: email.trim(), password });
      login(data.token, data.usuario);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <ClipboardList size={28} />
          </div>
          <h1 className={styles.brandTitle}>Bienvenido de vuelta</h1>
          <p className={styles.brandSubtitle}>Inicia sesión para gestionar tus tareas</p>
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">
                Correo electrónico
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="login-email"
                  className={styles.input}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Mail size={16} className={styles.inputIcon} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">
                Contraseña
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="login-password"
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Lock size={16} className={styles.inputIcon} />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error} role="alert">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              id="login-submit"
            >
              <LogIn size={18} />
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>¿Nuevo aquí?</span>
        </div>

        <p className={styles.switchText}>
          ¿No tienes una cuenta?{' '}
          <button
            className={styles.switchLink}
            onClick={onSwitchToRegister}
            type="button"
            id="switch-to-register"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
