---
title: "Hey Ahi Security - Manuale per vecchi barbogi — Parte II - Adesso diamole le chiavi di casa"
description: "Quando smette di rispondere e inizia ad agire."
pubDate: 2026-10-23
language: "it"
draft: false
---

Non so quanto sia stato difficile leggere la roba di prima, ma dobbiamo andare avanti ancora un pochino.

Ok breve recap. anzi no. In soldoni eravamo arrivati qui.

Il problema — o la parte interessante, dipende da come siete fatti — comincia quando decidiamo che invece di limitarci a chiedere:

> “Cosa dovrei fare?”

vogliamo poter dire:

> “Fallo.”

Ed è qui che iniziamo davvero a dare le chiavi di casa alla macchina.

## I tool

Abbiamo già incontrato questa parola.

Un **tool** non è altro che qualcosa che il nostro *harness* mette a disposizione del modello affinché possa compiere un'azione.

Niente magia nemmeno qui.

Un tool può essere banalmente una funzione:

`read_file("/etc/config")`

oppure:

`send_email(...)`

oppure:

`query_database(...)`

oppure ancora:

`run_command("pytest")`

Tradotto per noi vecchi:

il modello non ha improvvisamente sviluppato le mani.

C'è del software *normale* che espone delle funzioni *normali* e l'harness permette al modello di richiederne l'esecuzione.

Concettualmente:

`LLM → "voglio usare questo tool con questi parametri" → harness → funzione reale`

Esempio.

L'utente dice:

> “Controlla perché il deploy è fallito.”

Il modello potrebbe concludere:

> “Mi servono i log.”

E invece di risponderci semplicemente:

> “Dovresti guardare i log.”

può produrre una richiesta strutturata del tipo:

`get_logs(environment="production")`

L'harness riceve questa richiesta, verifica che esista un tool chiamato `get_logs`, lo esegue e restituisce il risultato al modello.

Il modello quindi riceve:

`ERROR: database connection timeout...`

e continua a ragionare.

Notare il "salto"; prima avevamo:

`input → modello → risposta`

Adesso abbiamo:

`input → modello → richiesta di azione → harness → tool → risultato → modello`

E possiamo ricominciare.

## Ed ecco il loop

ed ecccolo di nuovo, l'**agentic**. 

In forma brutale:

`osserva → decide → agisce → osserva → decide → agisce`

Fino a quando ritiene di aver raggiunto il "goal".

Torniamo all'esempio del deploy:

`"Sistema il deploy"`

↓

LLM: `Devo vedere i log`

↓

tool: `get_logs()`

↓

LLM: `C'è un errore nella configurazione del database`

↓

tool: `read_file("config.yaml")`

↓

LLM: `La porta è sbagliata`

↓

tool: `write_file("config.yaml", ...)`

↓

tool: `deploy()`

↓

tool: `get_status()`

↓

LLM: `Deploy completato`

A quel punto comincia a essere evidente perché la parola **agent** ha senso.

Non perché abbiamo creato una nuova specie di intelligenza artificiale.

Abbiamo semplicemente costruito un sistema nel quale l'LLM *agisce* influenzando il passo successivo dell'esecuzione.

L'agent, quindi, non è una cosa misteriosa.

È un sistema composto grossomodo da:

`LLM + harness + tools + stato + loop decisionale`

e magari RAG, memoria, skill e tutta l'altra roba che abbiamo già visto.

## Le skill

Qui possiamo smontare un'altra buzzword.

Una **skill** è spesso banalmente un insieme di istruzioni che spiegano all'agent come affrontare un determinato tipo di attività.

Potremmo avere una skill chiamata:

`debugging`

che dice qualcosa del tipo:

1. riproduci il problema;
2. raccogli i log;
3. identifica i componenti coinvolti;
4. formula un'ipotesi;
5. applica la modifica minima necessaria;
6. esegui i test;
7. verifica il risultato.

Anche qui, niente magia nera.

Può essere 
- un file Markdown.
- un prompt.
- codice.
- un workflow più strutturato.

Il concetto che ci interessa è:

**il tool dice cosa l'agent può fare; la skill gli suggerisce come affrontare un certo tipo di lavoro.**

Il martello è un tool.

Saper fare il falegname è una skill.

*Vi sentite un po' più fighi adesso che capite tutte queste buzzword da quattro soldi eh ?*

## Autonomia

E arriviamo ai primi problemi.

Quanto può andare avanti "da sola" ?

Possiamo avere un sistema nel quale ogni azione richiede conferma:

`LLM → propone azione → umano approva → harness esegue`

Oppure:

`LLM → decide → harness esegue`

Oppure ancora:

`LLM → decide → esegue → osserva → decide → esegue → osserva...`

per venti, cinquanta, cento, MILLE passaggi. Gianni ! Mille passaggi !

![tanti numeri](https://www.emugifs.net/wp-content/uploads/2021/01/Ingenier-Cane-Mille-GIF-Fabio-De-Luigi-in-TV-a-Mai-Dire-Gol-con-la-Gialappa-s-Band.gif)

Questa differenza conta parecchio.

Perché le boiate del primo passaggio possono diventare il contesto del secondo.

Il secondo può produrre il terzo.

E così via.

Non abbiamo quindi solo un sistema probabilistico.

Abbiamo un sistema probabilistico capace di **concatenare autonomamente le conseguenze delle proprie decisioni**.

E questa, molto più di tutte le cose che abbiamo incontrato finora, è probabilmente la cosa da tenere davvero a mente quando parliamo di Agentic AI.

Prima il modello poteva dire una stupidaggine.

Adesso può ***fare*** una stupidaggine.
___
## Prima ancora degli attaccanti possiamo farci male da soli

Prima di parlare di attacchi veri e propri, però, c'è un'altra cosa che vale la pena dire.

Non serve necessariamente un attaccante per creare un problema.

A volte *(hint: spesso)* basta usare male la tecnologia.

### Workforce

L'introduzione di questi strumenti di AI cambia il modo in cui le persone lavorano.

E questo non significa soltanto “l'AI ci ruberà il lavoro”, che è la versione da titolo di giornale.

Diciamo che comunque per i paranoici c'è un rischio che è "se delego tutto, non son più capace di far nulla. I junior non imparano, i senior si fidano e non controllano."

Fino a visioni più catastrofiche tipo che un team di sviluppo può incorporare codice che nessuno ha davvero letto. Oppure un processo può diventare dipendente da uno strumento che nessuno saprebbe sostituire manualmente.

Il rischio quindi non è soltanto che l'AI faccia male qualcosa.

È anche che l'organizzazione smetta progressivamente di sapere **come quella cosa viene fatta**.

### Dove vanno i dati?

Poi c'è una domanda molto meno filosofica.

Quando copio dentro a un modello:

- codice sorgente;
- log;
- documenti interni;
- dati clienti;
- configurazioni;
- incident report;

dove stanno andando quei dati?

Se sto usando un servizio esterno, quei dati stanno probabilmente attraversando infrastrutture che non controllo direttamente.

Quanto vengono conservati?

Dove?

Chi può accedervi?

Vengono utilizzati per migliorare il servizio?

Per fare training?

Finiscono nei log?

Esistono garanzie contrattuali?

Data residency?

Retention?

Il punto non è fare terrorismo dicendo che “tutti i vostri dati, pure quelli segreti sono già usati per fare training”.

Non è necessariamente vero e dipende dal servizio utilizzato.

Il punto è molto più banale:

**se non lo sapete, avete già un problema.**

E se pensate che basti cambiare provider per risolvere il problema, c'è una storia interessante da leggere.

Stefano Conter (lui ha iniziato a fare i compiti ben prima del sottoscritto) ha raccontato di aver cambiato provider per il suo assistente di coding, pur essendo soddisfatto di come funzionava. Non perché il modello fosse scarso, ma perché voleva capire meglio che fine facessero i dati che gli affidava.

Spoiler: cambiare fornitore non significa aver risolto automaticamente il problema. Significa, nella migliore delle ipotesi, aver scelto consapevolmente condizioni diverse.

Ne parla qui: [I switched AI providers. I’m not convinced I solved anything..](https://conterstefano.it/blog/switched-ai-providers-data-governance/)

È lo stesso motivo per cui non spediremmo normalmente il dump del database aziendale a un servizio online solo perché ha una bella interfaccia.

Data classification, privacy, governance e procurement continuano a esistere anche quando la casella di testo ha scritto sopra “AI”.

### E poi c'è il costo

Un'altra cosa che tendiamo curiosamente a dimenticare è che tutta questa roba costa.

L'inferenza costa.

Gli embedding costano.

Lo storage costa.

Il vector database costa.

Le chiamate API costano.

Le GPU costano.

La banda costa.

Il monitoring costa.

E soprattutto i loop costano.

Un chatbot riceve una domanda e produce una risposta.

Un agent può:

`pensare → chiamare un tool → rileggere il risultato → pensare → chiamare un altro tool → interrogare un modello → riprovare → verificare → riprovare`

magari per decine di passaggi.

E ogni passaggio può avere un costo computazionale o economico.

Questo significa che l'autonomia non ha soltanto una superficie di rischio maggiore.

Ha anche una superficie di costo maggiore.

Un agent mal configurato non deve necessariamente essere compromesso per causare un incidente.

Può semplicemente fare cento volte più lavoro del necessario.

E a fine mese qualcuno se ne accorge guardando la fattura cloud.

Anche questo, tutto sommato, è un problema abbastanza tradizionale:

**resource governance.**

___

## Roba che arriva da marte ?

Quindi, no, non è roba che arriva da Marte, anzi alla fine tutto ha un'aria terribilmente familiare.
Perché sì, è roba nuova.
Un LLM non è un web server.
Un agent non è semplicemente uno script Bash.

Quindi, no, non voglio liquidare tutto con: “Bah, sono le solite cose.”

Non lo sono.

Ma questo non significa nemmeno che dobbiamo buttare via tutto quello che sappiamo di cybersecurity e ricominciare da zero.
Perché appena smettiamo di guardare ai nomi nuovi e iniziamo a guardare all'architettura, tornano fuori problemi molto vecchi.

Abbiamo 
- input che arrivano da soggetti di cui non ci fidiamo completamente.
- dati che *attraversano* componenti diversi.
- software che esegue operazioni per conto di qualcuno.
- identità.
- privilegi.
- credenziali.
- dipendenze.
- confini tra zone con livelli di trust differenti.

Insomma, abbiamo dei "trust boundary" (eh che parolone !)

E questa, per chi fa cybersecurity, dovrebbe essere una sensazione abbastanza rassicurante.

Non perché il problema sia semplice, ma perché finalmente possiamo iniziare a fare domande che conosciamo.


1. Mi fido dell'input? (utente → harness)


2. Mi fido dei dati recuperati? (documenti → retriever → LLM)


3. Chi autorizza quell'azione? (LLM → tool)


4. Con quali privilegi viene eseguita? (tool → sistema operativo / API / cloud)


5. Sto rimettendo dentro al processo decisionale dell'agent dati provenienti da una fonte esterna? (output del tool → LLM)


6. Da dove arriva questa roba e perché mi sto fidando? (skill / modello / libreria → harness)

E improvvisamente tutta questa architettura futuristica inizia ad assomigliare a qualcosa che conosciamo molto bene.

Non abbiamo eliminato i vecchi problemi, li abbiamo solo spostati e in alcuni casi li abbiamo amplificati, o aggiunti di nuovi ma alla base continuano a esserci concetti piuttosto familiari:

trust, input validation, authorization, least privilege, isolation, supply chain, identity, logging, audit.

Ed è proprio da qui che (secondo me) bisogna partire per parlare seriamente di AI Security.

Non dall'idea che l'AI abbia reso inutile la cybersecurity che conoscevamo.

Ma dall'idea opposta:

*adesso che abbiamo capito cosa c'è davvero dentro questa roba, possiamo applicare quello che sappiamo ai nuovi trust boundary che abbiamo appena creato ?*
