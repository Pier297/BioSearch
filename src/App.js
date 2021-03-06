import './App.css';
import { useState } from 'react';
import React from 'react';
import SearchBar from './SearchBar';
import CytoscapeGraph from './CytoscapeGraph';

function handleSubmit(query, setData, setSpinning, maxPublications, startYear, endYear, useBioBERT, setCommunities, setRefreshGraph, data) {
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
      data: data,
    }),
  })
    .then(response => response.json())
    .then(data => {
      let cy_data = data['cy_data'];
      // parse json
      cy_data = JSON.parse(cy_data);
      const communities = data['communities'];
      setData(cy_data);
      setRefreshGraph(true);
      setCommunities(communities);
      setSpinning(false);
    });
}

function App() {
  const [data, setData] = useState({ elements: { nodes: [], edges: [] } });
  const [refreshGraph, setRefreshGraph] = useState(false);
  const [communities, setCommunities] = useState([]);
  // whether we're waiting for the server to respond
  const [spinning, setSpinning] = useState(false);

  return (
    <div className="App">
      <div className='Logo__container'>
        <h1 className="AppName">BioSearch</h1>
      </div>
      <div className='Search__container'>
        <SearchBar onSubmit={(query, maxPublications, startYear, endYear, useBioBERT) => handleSubmit(query, setData, setSpinning, maxPublications, startYear, endYear, useBioBERT, setCommunities, setRefreshGraph, data)} spinning={spinning} />
      </div>
      <div className='Content__container'>
        <CytoscapeGraph data={data} setData={setData} communities={communities} refreshGraph={refreshGraph} setRefreshGraph={setRefreshGraph} />
      </div>
    </div>
  );
}

export default App;