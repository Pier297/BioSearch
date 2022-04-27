import './App.css';
import { useState } from 'react';
import SearchBar from './SearchBar';

function handleSubmit(query) {
  // GET 127.0.0.1:5000/get_graph/<string:query></string:query>
  fetch(`http://127.0.0.1:5000/get_graph/${query}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    }
  );
}

function App() {
  const [query, setQuery] = useState('');

  return (
    <div className="App">
      <h1 className="AppName">BioSearch</h1>
      <SearchBar query={query} setQuery={setQuery} onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
