import { ListTodo, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

function TaskList({ tareas, loading, error, onUpdate, onRetry, searchQuery }) {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Cargando tareas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <AlertTriangle size={48} className={styles.errorIcon} />
        <h3 className={styles.errorTitle}>Error de conexión</h3>
        <p className={styles.errorDesc}>
          No se pudieron cargar las tareas. Verifica que el backend esté activo en localhost:8000.
        </p>
        <button className={styles.retryBtn} onClick={onRetry} id="retry-btn">
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  if (tareas.length === 0 && !searchQuery) {
    return (
      <div className={styles.emptyState}>
        <Inbox size={56} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>No hay tareas aún</h3>
        <p className={styles.emptyDesc}>¡Crea tu primera tarea usando el formulario de arriba!</p>
      </div>
    );
  }

  if (tareas.length === 0 && searchQuery) {
    return (
      <div className={styles.emptyState}>
        <Inbox size={56} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>Sin resultados</h3>
        <p className={styles.emptyDesc}>
          No se encontraron tareas que coincidan con "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <section className={styles.listSection}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>
          <ListTodo size={20} className={styles.listTitleIcon} />
          Mis Tareas
        </h2>
        <span className={styles.taskCount}>
          {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}
        </span>
      </div>
      <div className={styles.taskList} id="task-list">
        {tareas.map((tarea, index) => (
          <TaskItem
            key={tarea.id}
            tarea={tarea}
            onUpdate={onUpdate}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskList;
