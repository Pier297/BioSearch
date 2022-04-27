import './App.css';
import { useState } from 'react';
import SearchBar from './SearchBar';
import CytoscapeGraph from './CytoscapeGraph';

function handleSubmit(query, setData, setDrawGraph, setSpinning, maxPublications) {
  setSpinning(true);
  // GET 127.0.0.1:5000/get_graph/<string:query></string:query>
  fetch(`http://127.0.0.1:5000/get_graph/${query}/${maxPublications}`)
    .then(res => res.json())
    .then(data => {
      setData(data);
      setSpinning(false);
      setDrawGraph(true);
    }
  );
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
        <SearchBar onSubmit={(query, maxPublications) => handleSubmit(query, setData, setDrawGraph, setSpinning, maxPublications)} spinning={spinning} />
      </div>
      <div className='Content__container'>
        <CytoscapeGraph data={data} drawGraph={drawGraph} setDrawGraph={setDrawGraph} />
      </div>
    </div>
  );
}

export default App;