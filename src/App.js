import './App.css';
import { useState } from 'react';
import SearchBar from './SearchBar';
import CytoscapeGraph from './CytoscapeGraph';

function handleSubmit(query, setData, setDrawGraph) {
  // GET 127.0.0.1:5000/get_graph/<string:query></string:query>
  fetch(`http://127.0.0.1:5000/get_graph/${query}`)
    .then(res => res.json())
    .then(data => {
      setData(data);
      setDrawGraph(true);
    }
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [drawGraph, setDrawGraph] = useState(false);

  return (
    <div className="App">
      <h1 className="AppName">BioSearch</h1>
      <SearchBar query={query} setQuery={setQuery} onSubmit={() => handleSubmit(query, setData, setDrawGraph)} />
      <CytoscapeGraph data={data} drawGraph={drawGraph} setDrawGraph={setDrawGraph} />
    </div>
  );
}

export default App;
