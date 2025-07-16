# Nexu

Nexu è una web application pensata per la condivisione di post e commenti, simile a un social network, sviluppata utilizzando Node.js, Express e SQLite. Il progetto offre funzionalità di registrazione, login, pubblicazione post con immagini, gestione dei commenti, profilo utente e meccaniche di voto sui contenuti.

## Struttura delle Cartelle

```
Nexu-ServerApp/
│
├── node_modules/               # Dipendenze npm
│
├── public/                     # File statici accessibili dal client
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Foglio di stile principale
│   │   └── img/
│   │       └── favicon.ico     # Icona del sito
│   ├── uploads/                # Immagini caricate dagli utenti
│   ├── commenti.html           # Pagina commenti post
│   ├── esplora.html            # Pagina di esplorazione post
│   ├── index.html              # Homepage
│   ├── login.html              # Pagina di login
│   ├── profilo.html            # Pagina profilo utente
│   └── signup.html             # Pagina di registrazione
│
├── src/                        # File sorgente lato server
│   ├── controllers/            # Controller logica applicativa
│   │   ├── authController.js   # Gestione autenticazione e profilo
│   │   ├── commentController.js# Gestione commenti
│   │   └── postController.js   # Gestione post e voti
│   ├── db/
│   │   └── sqlite.js           # Connessione e setup database SQLite
│   ├── middleware/
│   │   └── authMiddleware.js   # Middleware autenticazione utente
│   ├── models/
│   │   └── user.js             # Modello utente
│   ├── routes/                 # Definizione delle rotte API
│   │   ├── auth.js             # Rotte autenticazione/profilo
│   │   ├── comments.js         # Rotte commenti
│   │   └── posts.js            # Rotte post/voti
│   └── app.js                  # Entry point dell’applicazione
│
├── package.json                # Configurazione npm e dipendenze
├── package-lock.json           # Lockfile npm
└── README.md                   # Documentazione del progetto
```

## Avvio dell'applicazione

Per eseguire Nexu sul proprio server locale seguire questi passaggi:

1. **Prerequisiti**
   - Node.js installato (versione consigliata ≥ 18)
   - npm installato

2. **Installazione delle dipendenze**

   Nella directory principale del progetto eseguire:
   ```
   npm install
   ```

3. **Avvio del server**

   Avviare il server di sviluppo con:
   ```
   npm start
   ```
   Oppure, per un riavvio automatico ad ogni modifica del codice:
   ```
   npm run dev
   ```

   Il server sarà attivo su [http://localhost:3000](http://localhost:3000).

4. **Database**
   Al primo avvio, il database SQLite verrà creato automaticamente nella cartella principale come `database.db` con tutte le tabelle necessarie.

## Istruzioni d’uso

### 1. **Registrazione e Login**
- Accedi alla pagina principale e registrati tramite “Sign up”. È necessario fornire un nome, un’email valida, una password e la data di nascita (solo maggiorenni).
- Dopo la registrazione, si viene autenticati automaticamente. Da questo momento è possibile esplorare, pubblicare e commentare.

### 2. **Esplorazione e Interazione**
- Accedi alla sezione “Esplora” dove puoi vedere i post pubblicati dagli utenti.
- Puoi ordinare i post per “Nuovi” o “Popolari”.
- Tramite la barra di ricerca puoi filtrare i post per parole chiave o nome utente.

### 3. **Creazione di un Post**
- Se autenticato (e non in timeout), puoi creare un nuovo post cliccando sull’icona “+” in basso a destra su “Esplora”.
- Puoi inserire un testo e allegare un’immagine (jpg, png, gif).
- I post possono essere eliminati dall’autore o da un amministratore.

### 4. **Commenti**
- Cliccando sull’icona commento di un post puoi vedere e aggiungere commenti, se autenticato e non amministratore.
- Gli amministratori non possono commentare e gli utenti in timeout sono bloccati temporaneamente dall’interagire.

### 5. **Votazione dei Post**
- Ogni post può essere votato con “upvote” o “downvote”. Ogni utente può esprimere un solo voto per post.

### 6. **Gestione del Profilo**
- Nella pagina “Profilo” puoi modificare il nome utente e la password (previa conferma della password attuale).
- È possibile visualizzare le proprie informazioni di registrazione.

### 7. **Timeout e Moderazione**
- Gli amministratori possono temporaneamente sospendere utenti irregolari tramite la funzionalità di timeout (solo via API).

---

Per qualsiasi problema, suggerimento o richiesta di miglioramento aprire una issue o contattare gli sviluppatori.

---