# BioSearch - An UX for pubmad

Note: this UX uses the server provided by *pubmad*, make sure to start it first.

> npm start

OBIETTIVI:

- Search:
    - Clicco su un nodo e nel modal c'è la possibilità di cercare:
        - Cammini verso nodi di una certa categoria (li posso ordinare per Probabilità
           o per distanza)
        - Cammino verso un nodo specifico (mettere un select con search per categoria e nome)



- Possibilità di mostrare i vicini a un nodo

- Possibilità di mostrare tutti i nodi di un certo tipo, esempio: Mostra tutti i nodi drug e le loro relazioni
    - Cioè in pratica mostra tutti i nodi raggiungibili partendo da una drug

- Aumentare / Diminuire dimensione dei nodi

- Invece di usare bubblesets per le communities possiamo usare i sotto-grafi come nodi

- Importare da graphml

- Tasto reset filtri