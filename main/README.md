# Main

Questo processo Node.js, **main** secondo la denominazione IPC di Electron, si occupa di gestire le operazioni dell'applicazione DiPReader.

## Architettura logica

### Presentation Layer

Si trova principalmente nella cartella `./presentation/` e comprende le classi `Handler`, che si occupano di gestire le richieste IPC a loro assegnate dalla funzione `registerAllHandlers()` in `./presentation/router.ts`

Queste classi deserializzano i DTO in ingresso definiti in `../shared` e richiamano l'Application Layer, poi restituiscono la risposta costruendo i possibili DTO in uscita

### Application Layer

Si trova nella cartella `./application/` e comprende le interfaccie `UseCase` e le loro implementazioni `Service`

Fungono da "orchestratori", coordinando il dominio e l'infrastruttura

### Domain Layer

Si trova nella cartella `./domain/` e comprende le classi di dominio e i value-objects in `./domain/value-objects/`

Sono le classi che rappresentano la logica dell'applicazione

### Persistance Layer

### Infrastructure Layer