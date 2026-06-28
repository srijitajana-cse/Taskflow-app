import React from 'react';

export default function EmptyState({ hasFilters, onAdd }) {
  if (hasFilters) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <h3 className="empty-state__title">No tasks match your filters</h3>
        <p className="empty-state__subtitle">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📋</div>
      <h3 className="empty-state__title">No tasks yet</h3>
      <p className="empty-state__subtitle">Create your first task to get started and stay on top of your work.</p>
      <button className="btn btn-primary" onClick={onAdd}>
        + Add Your First Task
      </button>
    </div>
  );
}
