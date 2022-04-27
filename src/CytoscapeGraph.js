import { useEffect, useState } from 'react';
import React from 'react';
import './CytoscapeGraph.css';
import cytoscape from 'cytoscape';

export default function CytoscapeGraph({ data, drawGraph, setDrawGraph }) {
  const [hideIsolatedNodes, setHideIsolatedNodes] = useState(true);
  const [showingGraph, setShowingGraph] = useState(false);

  useEffect(() => {
      if (drawGraph) {
        var cy = cytoscape({
          container: document.getElementById('cy'),
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#f37f0d',
                'label': 'data(label)'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
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
          cy.add({
            group: 'nodes',
            data: {
              id: nodes[i].data.id,
              label: nodes[i].data.mention,
            },
          });
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
          });
        }
        // use spring layout
        cy.layout({
          name: 'cose',
          fit: true, // whether to fit the viewport to the graph
        }).run();

        // Hide the isolated nodes
        if (hideIsolatedNodes) {
          cy.nodes().forEach(function (node) {
            if (node.degree() === 0) {
              node.hide();
            }
          });
        }
        setShowingGraph(true);
        setDrawGraph(false);
      }
  }, [data, drawGraph, setDrawGraph, hideIsolatedNodes]);
  // https://reactnative.dev/docs/flexbox
  return (
    <div className="CytoscapeGraph__container">
      <div className='sidebar'>
        <h3 className='sidebar_title'>Options:</h3>
        <label>Hide isolated nodes</label>
        <input type='checkbox' className='checkbox' defaultChecked={hideIsolatedNodes} onChange={() => {
          setHideIsolatedNodes(!hideIsolatedNodes);
          if (showingGraph) {
            // Update the graph
            setDrawGraph(true);
          }
        }} />
      </div>
      <div id="cy" className='canvas'></div>
    </div>
  );
}