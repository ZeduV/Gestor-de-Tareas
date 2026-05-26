import { Trash2, Check, Clock, CheckCircle2 } from 'lucide-react';
import { eliminarTarea, actualizarEstado } from '../api';
import styles from './TaskItem.module.css';

const PRIORIDAD_MAP = {
  1: { label: 'Alta', className: styles.high },
  2: { label: 'Media', className: styles.medium },
  3: { label: 'Baja', className: styles.low },
};

function TaskItem({ tarea, onUpdate }) {
  const isCompleted = tarea.estado === 'Completada';
  const prioridad = PRIORIDAD_MAP[tarea.prioridad] || PRIORIDAD_MAP[2];

  const handleToggle = async () => {
    const nuevoEstado = isCompleted ? 'Pendiente' : 'Completada';
    try {
      await actualizarEstado(tarea.id, nuevoEstado);
      onUpdate();
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await eliminarTarea(tarea.id);
      onUpdate();
    } catch (err) {
      console.error('Error eliminando tarea:', err);
    }
  };

  return (
    <div
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      id={`task-${tarea.id}`}
    >
      <div className={styles.checkArea}>
        <button
          className={`${styles.checkBtn} ${isCompleted ? styles.checked : ''}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
          id={`toggle-task-${tarea.id}`}
        >
          <Check size={16} strokeWidth={3} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.taskTitle}>{tarea.titulo}</span>
          <span className={`${styles.priorityBadge} ${prioridad.className}`}>
            {prioridad.label}
          </span>
        </div>
        {tarea.descripcion && (
          <p className={styles.taskDesc}>{tarea.descripcion}</p>
        )}
        <span className={`${styles.statusBadge} ${isCompleted ? styles.completada : styles.pendiente}`}>
          {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {tarea.estado}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Eliminar tarea"
          id={`delete-task-${tarea.id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
