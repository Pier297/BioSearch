import './App.css';
import { useState } from 'react';
import SearchBar from './SearchBar';
import CytoscapeGraph from './CytoscapeGraph';

function handleSubmit(query, setData, setDrawGraph, setSpinning, maxPublications, startYear, endYear, useBioBERT) {
  setSpinning(true);
  const useBioBERT_int = useBioBERT ? 1 : 0;
  // POST 127.0.0.1:5000/get_graph
  fetch('http://127.0.0.1:5000/get_graph', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      max_publications: maxPublications,
      start_year: startYear,
      end_year: endYear,
      use_biobert: useBioBERT_int,
    }),
  })
    .then(response => response.json())
    .then(data => {
      setData(data);
      setDrawGraph(true);
      setSpinning(false);
    });
}

function App() {
  const [data, setData] = useState([]);
  const [drawGraph, setDrawGraph] = useState(false);
  // whether we're waiting for the server to respond
  const [spinning, setSpinning] = useState(false);

  return (
    <div className="App">
      <div className='Logo__container'>
        <h1 className="AppName">BioSearch</h1>
      </div>
      <div className='Search__container'>
        <SearchBar onSubmit={(query, maxPublications, startYear, endYear, useBioBERT) => handleSubmit(query, setData, setDrawGraph, setSpinning, maxPublications, startYear, endYear, useBioBERT)} spinning={spinning} />
      </div>
      <div className='Content__container'>
        <CytoscapeGraph data={data} drawGraph={drawGraph} setDrawGraph={setDrawGraph} />
      </div>
    </div>
  );
}

export default App;