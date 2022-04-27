import { useEffect } from 'react';
import React from 'react';
import './CytoscapeGraph.css';
import cytoscape from 'cytoscape';

export default function CytoscapeGraph({ data, drawGraph, setDrawGraph }) {
  useEffect(() => {
      if (drawGraph) {
        console.log('Drawing:')
        console.log(data)
        var cy = cytoscape({
          container: document.getElementById('cy'),
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#f37f0d',
                'label': 'data(name)'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle'
              }
            }
          ],
          elements: []
        });
        const nodes = data.elements.nodes
        const edges = data.elements.edges
        cy.add(nodes)
        cy.add(edges)
        // use spring layout
        cy.layout({
          name: 'cose',
          fit: true, // whether to fit the viewport to the graph
        }).run();

        setDrawGraph(false);

        cy.center();

      }
  }, [data]);

  return (
    <div id="cy"></div>
  );
}