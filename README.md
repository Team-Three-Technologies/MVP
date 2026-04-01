# DIPReader
[![codecov](https://codecov.io/github/Team-Three-Technologies/MVP/graph/badge.svg?token=KR22V4BT30)](https://codecov.io/github/Team-Three-Technologies/MVP)

Questo repository contiene il _Minimun Viable Product_ (**MVP**) del progetto **C3 - DIPReader** proposto da _Sanmarco Informatica s.r.l_ realizzato dal gruppo 3, **Team Three Technologies**.

## Struttura

La struttura del progetto rispecchia quella imposta da Electron, nella cartella `main/` si trova ... mentre in `renderer` si trova l'interfaccia, sviluppata in Angular, che richiama il processo principale tramite _Inter-Process Communication_ (IPC).

## Stack tecnologico

- electron v40.8.2
- better-sqlite3 v12.6.2
- fast-xml-parser v5.5.9
- tsyringe v4.10.0
- ...
- angular v21.2.0
- ...

## Utilizzo

### Modalità dev

``` bash
# Installazione delle dipendenze Electron + main process
npm install

# Installazione delle dipendenze Angular
cd renderer/
npm install

# Avvio
cd ..
npm run dev
```

## Membri
- Francesco Balestro
- Filippo Compagno
- Sara Gioia Fichera
- Andrea Masiero
- Mattia Oliva Medin
- Nenad Radulovic
- Bianca Zaghetto

Corso di Ingegneria del Software, CdL in Informatica @ Università degli Studi di Padova a. a. 2025/26
