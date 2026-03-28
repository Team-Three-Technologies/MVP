# /renderer
Parte grafica di Angular
# /shared
# /main
Parte "backend"
## /src
### /infrastructure
database.priveder.ts crea il database
### /ipc
Riceve le richieste dal renderer e le inoltra per elaborarle. 
Formatta come scritto in /shared e manda indietro le risposte.
### /models
Classi di dominio
### /repositories
Classi che fanno le operazioni sul database 
### /services
Servizi tecnici (parser ecc.)
### /use-casesi
i file .use-case.ts sono le interfacce che vengono implementate dai .service.ts
### /value-objects
simili a /models ma vengono usati dalle classi di dominio come campi. Da vedere se 
mettere all'interno di /models

## /test


renderer > ipc > use-case > services > repositories > infrastructure
