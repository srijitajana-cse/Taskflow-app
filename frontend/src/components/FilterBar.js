import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // eslint-disable-line

  const handleSort = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onFilterChange({ sortBy, sortOrder });
  };

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button className="search-clear" onClick={() => { setSearchInput(''); onFilterChange({ search: '' }); }}>×</button>
        )}
      </div>

      <div className="filter-controls">
        <select
          className="filter-select"
          value={filters.priority}
          onChange={e => onFilterChange({ priority: e.target.value })}
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select
          className="filter-select"
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={handleSort}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date ↑</option>
          <option value="dueDate:desc">Due Date ↓</option>
          <option value="title:asc">Title A–Z</option>
          <option value="priority:desc">Priority High–Low</option>
        </select>
      </div>
    </div>
  );
}
