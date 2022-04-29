# BioSearch - An UX for pubmad

Note: this UX uses the server provided by *pubmad*, make sure to start it first.

> npm start

OBIETTIVI:
- BUG: se si fa una query usando biobert, poi si toglie biobert e si rifa la query tutto ok, ma se poi
       rimetti biobert le relazioni rimangono le co-occurrences

- Cliccare nodo grafo e vedere:
    Dialogo material ui
    - Quali sono gli articoli collegati
    - mesh_id
    - Cliccare per espandere il grafo relativo a quel nodo

- toggle Mostra/Nasconde peso dell'arco come colore Confidence del modello



- Salvare il grafo in file / Cancellare grafo corrente



- Algoritmi di centralità e communities (=> usare https://github.com/upsetjs/cytoscape.js-bubblesets)
- Cambiare layout del grafo (spring layout, ...)

- Aggiungere QA model con una specie di chatbot