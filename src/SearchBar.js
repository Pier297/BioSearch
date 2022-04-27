import './SearchBar.css';

export default function SearchBar({ query, setQuery, onSubmit, spinning }) {
  return (
    <div className="SearchBar">
      <input
        type="text"
        value={query}
        className="SearchBar__input"
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a disease... (e.g. diabetes)"
      />
      <button className='SearchBar__button' onClick={() => onSubmit(query)}>Search</button>
      {spinning && <div>Loading...</div>}
    </div>
  );
}