import './SearchBar.css';
import { useState } from 'react';
import React from 'react';

export default function SearchBar({ onSubmit, spinning }) {
  const [query, setQuery] = useState('diabetes');
  const [maxPublications, setMaxPublications] = useState(100);
  const [startYear, setStartYear] = useState(1800);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [useBioBERT, setUseBioBERT] = useState(true);

  return (
    <div className='SearchBar__container'>
      <div className="SearchBar">
        <input
          type="text"
          value={query}
          className="SearchBar__input"
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a disease... (e.g. diabetes)"
        />
        <button className='SearchBar__button' onClick={() => onSubmit(query, maxPublications, startYear, endYear, useBioBERT)}>Search</button>
        {spinning && <div>Loading...</div>}
      </div>
      <div className='SearchBar__options'>
        <label>Max publications:</label>
        <input type='number' className='options__input' defaultValue={maxPublications} onChange={e => setMaxPublications(e.target.value)} />
        <label>Start year:</label>
        <input type='number' className='options__input' defaultValue={startYear} onChange={e => setStartYear(e.target.value)} />
        <label>End year:</label>
        <input type='number' className='options__input' defaultValue={endYear} onChange={e => setEndYear(e.target.value)} />
        <label>Use BioBERT:</label>
        <input type='checkbox' className='checkbox' defaultChecked={useBioBERT} onChange={() => setUseBioBERT(!useBioBERT)} />
      </div>
    </div>
  );
}