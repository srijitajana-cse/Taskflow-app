import React, { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import { useToast } from './hooks/useToast';
import Dashboard from './pages/Dashboard';
import ToastContainer from './components/ToastContainer';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('taskflow-dark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('taskflow-dark', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <TaskProvider>
      <Dashboard
        addToast={addToast}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </TaskProvider>
  );
}

export default App;
