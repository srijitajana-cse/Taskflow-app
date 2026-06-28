import React from 'react';

export default function Header({ darkMode, onToggleDark, onAddTask }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="brand-logo">✅</span>
          <div>
            <h1 className="brand-name">TaskFlow</h1>
            <p className="brand-tagline">Stay organized, ship faster</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn icon-btn--theme"
            onClick={onToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-primary" onClick={onAddTask}>
            <span className="btn-icon">+</span>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
