import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchTareas } from './api';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function AppContent() {
  const { autenticado, cargando } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // ─── Task state ───
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cargarTareas = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchTareas();
      setTareas(data);
    } catch (err) {
      setError(true);
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      cargarTareas();
    }
  }, [autenticado, cargarTareas]);

  // ─── Loading splash while validating session ───
  if (cargando) {
    return (
      <div className="splash">
        <div className="splashSpinner" />
        <p className="splashText">Verificando sesión...</p>
      </div>
    );
  }

  // ─── Auth screens ───
  if (!autenticado) {
    if (authView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginForm onSwitchToRegister={() => setAuthView('register')} />;
  }

  // ─── Main app ───
  const tareasFiltradas = tareas.filter((t) =>
    t.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <Header tareas={tareas} />
      <SearchBar query={searchQuery} onChange={setSearchQuery} />
      <TaskForm onTareaCreada={cargarTareas} />
      <TaskList
        tareas={tareasFiltradas}
        loading={loading}
        error={error}
        onUpdate={cargarTareas}
        onRetry={cargarTareas}
        searchQuery={searchQuery}
      />
      <footer className="footer">
        Hecho por Eduard Vaca Diez (Yovio) — Gestor de Tareas © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
