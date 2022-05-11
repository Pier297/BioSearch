import { useEffect, useState } from 'react';
import React from 'react';
import './CytoscapeGraph.css';
import cytoscape from 'cytoscape';
import Modal from 'react-modal';


import cola from 'cytoscape-cola';
import cise from 'cytoscape-cise';
import coseBilkent from 'cytoscape-cose-bilkent';
import BubbleSets from 'cytoscape-bubblesets';
cytoscape.use(BubbleSets);

cytoscape.use(coseBilkent);

cytoscape.use(cise);

cytoscape.use(cola);

Modal.setAppElement('#root');

var graphml = require('cytoscape-graphml');
var jquery = require('jquery');
graphml(cytoscape, jquery); // register extension


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function CytoscapeGraph({ data, communities, setData, refreshGraph, setRefreshGraph }) {
  const [hideIsolatedNodes, setHideIsolatedNodes] = useState(true);
  const [showCommunities, setShowCommunities] = useState(false);
  const [showingGraph, setShowingGraph] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeModalIsOpen, setEdgeModalIsOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [layout, setLayout] = useState('cose');
  const [downloadGraph, setDownloadGraph] = useState(false);
  const [cyObj, setCyObj] = useState(null);
  const [centralityPercThreshold, setCentralityPercThreshold] = useState(100);
  const [maxNumNodes, setMaxNumNodes] = useState(-1);
  const [nodeRepulsion, setNodeRepulsion] = useState(4);
  const [categoriesShown, setCategoriesShown] = useState('all');
  const [filterByName, setFilterByName] = useState('');

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openEdgeModal() {
    setEdgeModalIsOpen(true);
  }

  function closeEdgeModal() {
    setEdgeModalIsOpen(false);
  }

  // Download graph as a .graphml file
  useEffect(() => {
    if (cyObj !== null && downloadGraph) {
      function saveAs(blob, filename) {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style = 'display: none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      cyObj.graphml({
        node: {
          css: false,
          data: true,
          position: true,
        },
        edge: {
          css: false,
          data: true,
        },
        layoutBy: "cose" // string of layout name or layout function
      });
      let download_graph = cyObj.graphml();
      // Save the xlm to a file
      var blob = new Blob([download_graph], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "graph.graphml");

      setDownloadGraph(false);
    }
  }, [downloadGraph, cyObj]);

  useEffect(() => {
    if (refreshGraph === false) {
      return;
    }
    let cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(background_color)',
            'label': 'data(label)',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#2DCBC8',
            'target-arrow-color': '#2DCBC8',
            'target-arrow-shape': 'triangle',
            //'label': 'data(label)', // maps to data.label
          }
        }
      ],
      elements: []
    });
    const nodes = data.elements.nodes
    const edges = data.elements.edges
    for (let i = 0; i < nodes.length; i++) {
      const is_gene = nodes[i].data.type === 'gene';
      const is_disease = nodes[i].data.type === 'disease';
      var background_color = '#000000';
      if (is_gene) {
        background_color = '#f37f0d';
      } else if (is_disease) {
        background_color = '#FFF500';
      }
      cy.add({
        group: 'nodes',
        data: {
          id: nodes[i].data.id,
          label: nodes[i].data.mention,
          pmids: nodes[i].data.pmid,
          background_color: background_color,
          type: nodes[i].data.type,
        },
      });
    }

    //find max and min weight
    let max_weight = 0;
    let min_weight = 0;
    if (edges.length > 0) {
      max_weight = edges[0].data.weight;
      min_weight = edges[0].data.weight;
      for (let i = 1; i < edges.length; i++) {
        if (edges[i].data.weight > max_weight) {
          max_weight = edges[i].data.weight;
        }
        if (edges[i].data.weight < min_weight) {
          min_weight = edges[i].data.weight;
        }
      }
    }

    for (let i = 0; i < edges.length; i++) {
      cy.add({
        group: 'edges',
        data: {
          id: edges[i].data.id,
          source: edges[i].data.source,
          target: edges[i].data.target,
          //label: 1
        },
        style: { // style property overrides 
          'line-color': '#74B4E3',
          'width': Math.pow(12, edges[i].data.weight) * (max_weight - min_weight) + min_weight,
          'opacity': edges[i].data.weight,
        }
      });
    }

    // use spring layout
    cy.layout({
      name: layout,
      fit: true,
      nodeOverlap: nodeRepulsion,
      idealEdgeLength: 16,
      animate: false,
    }).run();

    cy.on('click', 'node', function (evt) {
      const clicked_node = cy.$id(this.id());
      setSelectedNode(clicked_node);
      openModal()
    });

    cy.on('click', 'edge', function (evt) {
      const clicked_edge = cy.$id(this.id());
      setSelectedEdge(clicked_edge);
      openEdgeModal()
    });

    if (showCommunities === true) {
      cy.ready(() => {
        const bb = cy.bubbleSets();
        communities.forEach(community => {
          // get the collect of nodes in the community
          let nodes = cy.nodes().filter(node => {
            return community.includes(node.id());
          });
          bb.addPath(nodes);
        });
        //bb.addPath(cy.nodes(), cy.edges(), null);
      });
    }

    // Hide the isolated nodes
    if (hideIsolatedNodes) {
      cy.nodes().forEach(function (node) {
        if (node.degree() === 0) {
          node.hide();
        }
      });
    }

    // Filter by name
    if (filterByName !== '') {
      cy.nodes().forEach(function (node) {
        console.log(node.data('label'))
        if (!node.data('label').toLowerCase().includes(filterByName.toLowerCase())) {
          node.hide();
        }
      });
    }

    // Only show nodes of type = categoriesShown
    if (categoriesShown !== 'all') {
      cy.nodes().forEach(function (node) {
        console.log(node.data('type'));
        if (node.data('type') !== categoriesShown) {
          node.hide();
        }
      });
    }

    // Show only the % of most central nodes
    let nodeMeshToDegree = {};
    if (centralityPercThreshold !== 100) {
      cy.nodes().forEach(node => {
        let centrality = cy.$().degreeCentrality({ 'root': node }).degree;
        nodeMeshToDegree[node.id()] = centrality;
      });
      let sortedNodes = Object.keys(nodeMeshToDegree).sort((a, b) => {
        return nodeMeshToDegree[a] - nodeMeshToDegree[b];
      }
      );
      let numNodesToHide = Math.floor(sortedNodes.length * (100 - centralityPercThreshold) / 100);
      if (maxNumNodes >= 0) {
        // if maxNumNodes is set, hide the nodes that are not the most central
        numNodesToHide = Math.max(numNodesToHide, sortedNodes.length - maxNumNodes);
      }
      for (let i = 0; i < numNodesToHide; i++) {
        cy.$id(sortedNodes[i]).hide();
      }
    }

    setCyObj(cy);
    if (data.elements.nodes.length > 0) {
      setShowingGraph(true);
      setRefreshGraph(false);
    }
  }, [data, hideIsolatedNodes, filterByName, categoriesShown, downloadGraph, setCyObj, communities, showCommunities, layout, refreshGraph, setRefreshGraph, centralityPercThreshold, maxNumNodes, nodeRepulsion]);

  return (
    <div className="CytoscapeGraph__container">
      <div className='sidebar'>
        <h3 className='sidebar_title'>Options:</h3>
        <label className='label'><b>Filter Graph:</b></label>
        <div className='sidebar_box'>
          <input type='text' className='input' placeholder='Search by name...' onChange={(e) => {
            setFilterByName(e.target.value);
            setRefreshGraph(true);
          }} value={filterByName} />
        </div>
        <div className='sidebar_box'>
          <label className='label'>Show categories</label>
          <select className='select' onChange={(e) => {
            console.log(e.target.value);
            setCategoriesShown(e.target.value);
            setRefreshGraph(true);
          }} value={categoriesShown}>
            <option value='all'>All</option>
            <option value='gene'>Gene</option>
            <option value='disease'>Disease</option>
            <option value='drug'>Drug</option>
          </select>
        </div>
        <div className='sidebar_box'>
          <label className='label'>Show % most central:</label>
          <input type='number' className='percentage_input' value={centralityPercThreshold} onChange={(e) => {
            setCentralityPercThreshold(e.target.value);
          }} />
        </div>
        <div className='sidebar_box'>
          <label className='label'>Max num of nodes</label>
          <input type='number' className='percentage_input' value={maxNumNodes} onChange={(e) => {
            setMaxNumNodes(e.target.value);
          }} />
        </div>
        <div className='sidebar_box'>
          <label className='label'>Node dist: {nodeRepulsion}</label>
          <input type="range" value={nodeRepulsion} min="1" max="30" step="1" onChange={(e) => {
            setNodeRepulsion(e.target.value);
          }} />
        </div>
        <button className='button' onClick={() => {
            setRefreshGraph(true);
          }}>Refresh</button>
        <div className='sidebar_box'>
          <label className='label'>Show communities</label>
          <input type='checkbox' checked={showCommunities} onChange={() => {
            setShowCommunities(!showCommunities);
            setRefreshGraph(true);
          }} />
        </div>
        <div className='sidebar_box'>
          <label className='label'>Hide isolated nodes</label>
          <input type='checkbox' className='checkbox' defaultChecked={hideIsolatedNodes} onChange={() => {
            setHideIsolatedNodes(!hideIsolatedNodes);
            setRefreshGraph(true);
          }} />
        </div>
        <div className='sidebar_box'>
          <label className='label'>Layout:</label>
          <select className='select' defaultValue={layout} onChange={(e) => {
            setLayout(e.target.value);
            setRefreshGraph(true);
          }}>
            <option value='cose'>Cose</option>
            <option value='circle'>Circle</option>
            <option value='grid'>Grid</option>
            <option value='concentric'>Concentric</option>
            <option value='random'>Random</option>
          </select>
        </div>
        <button disabled={(showingGraph === false)} className='button' onClick={() => {
          setDownloadGraph(true);
        }}>Export GraphML</button>
        <button disabled={(showingGraph === false)} className='button red' onClick={() => {
          // Reset the graph
          setData({ elements: { nodes: [], edges: [] } });
          setCategoriesShown('all');
          setFilterByName('');
          setCyObj(null);
          setRefreshGraph(true);
          setShowingGraph(false);
        }}>Reset</button>
      </div>
      <div id="cy" className='canvas'></div>
      <NodeModal node={selectedNode} closeModal={closeModal} modalIsOpen={modalIsOpen} />
      <EdgeModal edge={selectedEdge} closeModal={closeEdgeModal} modalIsOpen={edgeModalIsOpen} />
    </div>
  );
}
//get all the articles associated with this node
// const pmid_array = getConnectedArticles(clicked_node);
function getConnectedArticles(node) {
  const pmids = node.data('pmids');
  // split pmids into array
  const pmids_array = pmids.split(',');
  // remove duplicates
  const unique_pmids = [...new Set(pmids_array)];
  return unique_pmids;
}

function NodeModal({ node, closeModal, modalIsOpen }) {
  let nodeLabel = '';
  let articles = [];
  let db = '';
  let id_value = '';
  let url = '';

  if (node != null) {
    nodeLabel = node.data('label');
    articles = getConnectedArticles(node);
    let mesh_id = node.data('id');
    // extract mesh_id after the :
    const mesh_id_array = mesh_id.split(':');
    if (mesh_id_array[0] === 'mesh') {
      db = 'MeSH';
      id_value = mesh_id_array[1];
      url = 'https://www.ncbi.nlm.nih.gov/mesh/' + id_value;
    } else if (mesh_id_array[0] === 'mim') {
      db = 'MIM';
      id_value = mesh_id_array[1];
      url = 'https://omim.org/entry/' + id_value;
    } else if (mesh_id_array[0] === 'NCBIGene') {
      db = 'NCBIGene';
      id_value = mesh_id_array[1];
      url = 'https://www.ncbi.nlm.nih.gov/gene/' + id_value;
    }
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>{nodeLabel}</h2>
      <div className='mesh_link'>
        <h4>{db}:</h4>
        <a href={url} target="_blank">{id_value}</a>
      </div>

      <div className='articles'>
        <h3>Connected articles:</h3>
        {articles.map(article => (
          <a href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${article}`} target='_blank' rel='noopener noreferrer' key={article}>{article}</a>
        ))}
      </div>
    </Modal>
  );
}

function EdgeModal({ edge, closeModal, modalIsOpen }) {
  let intersection = [];

  if (edge != null) {
    const source = edge.source();
    const target = edge.target();
    const source_articles = getConnectedArticles(source);
    const target_articles = getConnectedArticles(target);
    intersection = source_articles.filter(article => target_articles.includes(article));
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>Edge</h2>
      <div className='articles'>
        <h3>Connected articles:</h3>
        {intersection.map(article => (
          <a href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${article}`} target='_blank' rel='noopener noreferrer' key={article}>{article}</a>
        ))}
      </div>
    </Modal>
  );
}