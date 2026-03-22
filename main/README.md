# Main

Questo processo Node.js, main secondo la denominazione IPC di Electron, si occupa di gestire le operazioni dell'applicazione DIPReader.

## Architettura logica

Architettura layered

IPC / Presentation Layer: include `ipc/` e `../shared/`
Business / Domain Layer: include `models/` e `use-cases/`
Service Layer: include `services/`
Persistance Layer: include `repository/`
Infrastructure Layer: include `infrastructure/`