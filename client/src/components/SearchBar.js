import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      if (onSearch) onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="search-input"
      />
      <button type="submit" className="search-button">🔍</button>
    </form>
  );
};

export default SearchBar;