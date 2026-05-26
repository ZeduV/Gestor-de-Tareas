import { ClipboardList, CheckCircle2, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

function Header({ tareas }) {
  const { usuario, logout } = useAuth();
  const total = tareas.length;
  const pendientes = tareas.filter((t) => t.estado === 'Pendiente').length;
  const completadas = total - pendientes;

  return (
    <header className={styles.header}>
      {/* User bar */}
      <div className={styles.userBar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <span className={styles.userName}>
            Hola, <strong>{usuario?.nombre || 'Usuario'}</strong>
          </span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={logout}
          id="logout-btn"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>

      <h1 className={styles.title}>Gestor de Tareas</h1>
      <p className={styles.subtitle}>Organiza tu día, conquista tus objetivos</p>

      <div className={styles.statsRow}>
        <div className={styles.statCard} id="stat-pending">
          <div className={`${styles.statIcon} ${styles.pending}`}>
            <Clock size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{pendientes}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>

        <div className={styles.statCard} id="stat-completed">
          <div className={`${styles.statIcon} ${styles.completed}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{completadas}</span>
            <span className={styles.statLabel}>Completadas</span>
          </div>
        </div>

        <div className={styles.statCard} id="stat-total">
          <div className={`${styles.statIcon} ${styles.total}`}>
            <ClipboardList size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
