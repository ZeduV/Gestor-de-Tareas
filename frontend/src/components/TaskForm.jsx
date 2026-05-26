import { useState } from 'react';
import { Plus, PenLine } from 'lucide-react';
import { crearTarea } from '../api';
import styles from './TaskForm.module.css';

function TaskForm({ onTareaCreada }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      await crearTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad: Number(prioridad),
      });
      setTitulo('');
      setDescripcion('');
      setPrioridad(2);
      onTareaCreada();
    } catch (err) {
      setError('No se pudo crear la tarea. Verifica que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit} id="task-form">
        <h2 className={styles.formTitle}>
          <PenLine size={20} className={styles.formTitleIcon} />
          Nueva Tarea
        </h2>

        <div className={styles.fieldGroup}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="task-title">Título</label>
              <input
                id="task-title"
                className={styles.input}
                type="text"
                placeholder="¿Qué necesitas hacer?"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="task-priority">Prioridad</label>
              <select
                id="task-priority"
                className={styles.select}
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value={1}>🔴 Alta</option>
                <option value={2}>🟡 Media</option>
                <option value={3}>🟢 Baja</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-description">Descripción</label>
            <textarea
              id="task-description"
              className={styles.textarea}
              placeholder="Agrega detalles sobre la tarea..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
            />
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            id="submit-task"
          >
            <Plus size={18} />
            {loading ? 'Creando...' : 'Agregar Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
