import React from 'react';
import './searchStyles.css';

const SearchBar = (props) => {

  const { onChange , value } = props;
  
  // jsx
  return (
    <div>
      <label className="search-label">
        Search Product:
        <input className="search-input" type="text" value={value} onChange={onChange} />
      </label>
    </div>
  );
};

export default SearchBar;
