import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

function SearchBar({ query, onChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          id="search-tasks"
          type="text"
          className={styles.searchInput}
          placeholder="Buscar tareas por título..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => onChange('')}
            aria-label="Limpiar búsqueda"
            id="clear-search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
