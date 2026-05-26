import { useState } from 'react';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react';
import { registrarUsuario } from '../api';
import styles from './AuthForm.module.css';

function RegisterForm({ onSwitchToLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre.trim() || !email.trim() || !edad || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (Number(edad) < 1 || Number(edad) > 120) {
      setError('Introduce una edad válida.');
      return;
    }

    if (password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const data = await registrarUsuario({
        nombre: nombre.trim(),
        email: email.trim(),
        edad: Number(edad),
        password,
      });
      setSuccess(data.mensaje || '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      // Clear form
      setNombre('');
      setEmail('');
      setEdad('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
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
          <h1 className={styles.brandTitle}>Crear cuenta</h1>
          <p className={styles.brandSubtitle}>Regístrate para comenzar a gestionar tus tareas</p>
        </div>

        <form onSubmit={handleSubmit} id="register-form">
          <div className={styles.fieldGroup}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-name">
                  Nombre
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="register-name"
                    className={styles.input}
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    maxLength={50}
                  />
                  <User size={16} className={styles.inputIcon} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-age">
                  Edad
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="register-age"
                    className={styles.input}
                    type="number"
                    placeholder="20"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    min={1}
                    max={120}
                  />
                  <Calendar size={16} className={styles.inputIcon} />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-email">
                Correo electrónico
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="register-email"
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
              <label className={styles.label} htmlFor="register-password">
                Contraseña
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="register-password"
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 3 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            {success && (
              <div className={styles.success} role="status">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              id="register-submit"
            >
              <UserPlus size={18} />
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>¿Ya tienes cuenta?</span>
        </div>

        <p className={styles.switchText}>
          Inicia sesión con tu cuenta existente.{' '}
          <button
            className={styles.switchLink}
            onClick={onSwitchToLogin}
            type="button"
            id="switch-to-login"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
