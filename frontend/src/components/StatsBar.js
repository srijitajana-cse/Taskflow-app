import React from 'react';

export default function StatsBar({ stats, activeFilter, onFilterClick }) {
  const total = (stats.todo || 0) + (stats['in-progress'] || 0) + (stats.done || 0);

  const items = [
    { key: 'all', label: 'All Tasks', count: total, icon: '📋' },
    { key: 'todo', label: 'To Do', count: stats.todo || 0, icon: '⏳' },
    { key: 'in-progress', label: 'In Progress', count: stats['in-progress'] || 0, icon: '🔄' },
    { key: 'done', label: 'Done', count: stats.done || 0, icon: '✅' },
  ];

  return (
    <div className="stats-bar">
      {items.map(item => (
        <button
          key={item.key}
          className={`stat-card ${activeFilter === item.key ? 'stat-card--active' : ''} stat-card--${item.key}`}
          onClick={() => onFilterClick(item.key)}
        >
          <span className="stat-icon">{item.icon}</span>
          <span className="stat-count">{item.count}</span>
          <span className="stat-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
