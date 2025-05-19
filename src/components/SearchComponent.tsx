'use client';

import { useState, useEffect } from 'react';
import SearchDialog from 'fumadocs-ui/components/dialog/search-default';

export function SearchComponent() {
  const [open, setOpen] = useState(false);

  // Add keyboard shortcut for search (Ctrl+K or Command+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-component">
      <button 
        onClick={() => setOpen(true)}
        className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-2 w-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Search</span>
      </button>
      <SearchDialog 
        open={open} 
        onOpenChange={setOpen} 
      />
    </div>
  );
} 