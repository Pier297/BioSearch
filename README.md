# BioSearch - An UX for pubmad

Note: this UX uses the server provided by *pubmad*, make sure to start it first.

> npm start

OBIETTIVI:

- Possibilità di mostrare i vicini a un nodo

- Possibilità di mostrare tutti i nodi di un certo tipo, esempio: Mostra tutti i nodi drug e le loro relazioni
    - Cioè in pratica mostra tutti i nodi raggiungibili partendo da una drug

- Cerca cammino tra un nodo selezionato e tutti i nodi di una certa categoria

- Aumentare / Diminuire dimensione dei nodi

- Aumentare distanza tra nodi

- Invece di usare bubblesets per le communities possiamo usare i sotto-grafi come nodi

- Importare da graphml

- Predict in batch lato server per ogni articolo