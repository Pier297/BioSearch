import './SearchBar.css';
import { useState } from 'react';

export default function SearchBar({ onSubmit, spinning }) {
  const [query, setQuery] = useState('diabetes');
  const [maxPublications, setMaxPublications] = useState(10);

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
        <button className='SearchBar__button' onClick={() => onSubmit(query, maxPublications)}>Search</button>
        {spinning && <div>Loading...</div>}
      </div>
      {/*
      max_publications (int): The maximum number of publications to be used.
      start_year (int): The start year to be used.
      end_year (int): The end year to be used.
      use_biobert (bool): Whether to use BioBERT or not.
      source (str): The source to be used. Can be 'abstract' or 'full_text'. Defaults to 'abstract'.
       */}
      <div className='SearchBar__options'>
        <label>Max publications:</label>
        <input type='number' className='options__input' defaultValue={maxPublications} onChange={e => setMaxPublications(e.target.value)} />
        
      </div>
    </div>
  );
}