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
                'background-color': 'data(background_color)',
                'label': 'data(label)',
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
          const is_gene = nodes[i].data.type == 'gene';
          const is_disease = nodes[i].data.type == 'disease';
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

        cy.on('click', 'node', function(evt){
          const clicked_node = cy.$id(this.id());
          // get all the articles associated with this node
          const pmid_array = getConnectedArticles(clicked_node);
          
        });

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

function getConnectedArticles(node) {
  const pmids = node.data('pmids');
  // split pmids into array
  const pmids_array = pmids.split(',');
  // remove duplicates
  const unique_pmids = [...new Set(pmids_array)];
  return unique_pmids;
}
