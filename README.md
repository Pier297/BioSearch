# BioSearch - An UX for pubmad

Note: this UX uses the server provided by *pubmad*, make sure to start it first.

> npm start

OBIETTIVI:

- Costruire il grafo iterativamente con multiple chiamate al server

- Possibilità di mostrare i vicini a un nodo

- Possibilità di mostrare tutti i nodi di un certo tipo, esempio: Mostra tutti i nodi drug e le loro relazioni
    - Cioè in pratica mostra tutti i nodi raggiungibili partendo da una drug

- Aumentare / Diminuire dimensione dei nodi

- Invece di usare bubblesets per le communities possiamo usare i sotto-grafi come nodi

- Importare da graphml

- Mandare il grafo con socket.io ogni volta che processiamo un articolo?