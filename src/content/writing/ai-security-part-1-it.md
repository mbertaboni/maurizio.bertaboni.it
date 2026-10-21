---
title: "Hey Ahi Security - Manuale per vecchi barbogi — Parte I - Smontiamo la macchina"
description: "LLM, runtime, tokenizer, embedding, RAG, harness e agent: smontiamo la macchina prima di provare a metterla in sicurezza."
pubDate: 2026-10-07
language: "it"
draft: false
---

Ah, quest'articolo non è scritto con l'AI. Perchè altrimenti non ti viene voglia di leggerlo. E ci impieghi dai 12 ai 15 minuti. Prenditi del tempo.

Ok, ho impiegato decisamente troppo tempo e aspettato troppo tempo prima di sedermi e iniziare a mettere a posto.

Succede anche con il mio garage, c'è dentro di tutto e alla fine non ci capisco più niente e allora mi fermo e re-inizio a pensare a dove mettere le cose, dare un senso alla posizione degli oggetti a cosa mi serve e cosa no.

Sto ovviamente parlando di AI. 

Poi, essendo nel ramo cybersecurity, il tema è AI security, insomma quella cosa di cui tutti parlano ma nessuno sa bene cosa cavolo sta dicendo. Tutti annuiscono e fingono di capire che non è bello dire "c'ho capito un tubo". 
Poi è arrivata la tempesta di parole. Un sacco di parole. 
Ti senti inadeguato. E allora ok, ripartiamo, ma per un "vecchio" dello *nix come me, è molto più facile destrutturare, riconcepire, riordinare.
Quindi mi scrivo queste righe sostanzialmente per chiarirmi le idee e magari con l'auspicio di chiarirle anche a qualcun altro. 

Non parlo di intelligenza artificiale, perchè non ne so NULLA. Non sono un matematico e quindi ne sono un fruitore, la curiosità c'è, ma non ho autorevolezza sufficiente a stare qui a raccontarvi come funziona un LLM o altro. Ci sono bravissimi professionisti là fuori che sanno le cose (o che millantano bene). io no, preferisco dire che non lo so.

Ma andiamo con ordine (si fa per dire).

Il tutto inizia quando qualcuno nella stanza inizia con "Agentic AI, che con un RAG [...] quantizzando il modello [...] l'harness, le skills e naturalmente i tools [...], prompt injection". "C'ho capito nulla". Cavolo ma che architettura bestiale, ci vogliono degli schemi e poi boh quanta roba complessa. Pensavo che nel 2026 le cose si semplificassero..ero io quello della roba complicata.

Nella frase sopra ho messo un sacco di odiosi puntini apposta perchè sono praticamente un boomer. tò.

Per questioni di comprensione, semplificherò i concetti, anzi, avendoli smontati io stesso probabilmente sbaglierò pure, però ecco non mi perdo nei dettagli tecnici e metterò un sacco di asterischi tutte le volte che volete approfondire o che sono sicuro che non è proprio così.. ma per capirsi potete anche sbattervene degli asterischi.

LLM o Modello.

È un file grosso che contiene dei dati. Punto.

Prendiamo un bel file GGUF e apriamolo con Blocco Note.

>Ahhhhh, che benessere i binary files in notepad.

Ovviamente vedremo principalmente immondizia binaria incomprensibile. Però, concettualmente, lì dentro troviamo soprattutto due cose: metadati che descrivono il modello e NUMERI. Tanti, tanti, tanti NUMERI.
Sono i parametri, o pesi, che il modello ha appreso durante il training.


La macchina, semplificando parecchio (*), deve avere in memoria i pesi necessari a farlo funzionare: più il modello è grosso, più memoria servirà. RAM, oppure VRAM, che va molto più VVVVeloce.

(*) Sì, possiamo fare offloading, memory mapping, distribuire il modello su più device e un sacco di altre porcherie. Per adesso non ce ne frega niente.

Scherzi a parte, il modello, però, è un file. Da solo non fa assolutamente **niente**.

Serve del software capace di caricarlo, interpretarne la struttura ed eseguire i calcoli necessari per utilizzarlo: il ***runtime***. 

Per capire come questo file diventa magia, dobbiamo rompere un po' il processo mentale.

Se il modello è un file praticamente morto, come abbiamo visto, il runtime è quel componente che consente di utilizzare il modello. Ovviamente il runtime stesso può essere visto come una serie di altri pezzettini. 

In che senso ?

nel senso che quando noi mandiamo un input,il nostro input viene sottoposto a tokenizzazione.  
*Token* significa letteralmente “gettone”. Per noi vecchi è sufficiente pensarlo come una delle unità elementari nelle quali il testo viene rappresentato per poter essere elaborato dal modello. Un token può essere una parola, un pezzo di parola, della punteggiatura e così via.


Prima di arrivare al modello, quindi, il nostro input viene "preparato" da un cosiddetto "tokenizer". Questo "componente" è distinto dal modello e dell'engine, anche se nella pratica è spesso integrato nello stesso software che usiamo per il runtime e si occupa di creare la sequenza di token — più precisamente nei relativi identificatori numerici — che quel modello sa elaborare.


Il suo lavoro è trasformare il testo in una sequenza di identificatori numerici, i token ID, appartenenti al vocabolario specifico di quel modello.


L'output che ci aspettiamo logicamente sono i *logits*.
I logits possiamo immaginarli come dei punteggi associati ai possibili token successivi.

Però per arrivare al punteggio, non c'è un tabella predefinita "parola" -> "punteggio" ma dei calcoli che avvengono "al volo", usando tutte le matrici di pesi del modello e il contesto corrente.

è qui che dobbiamo staccarci dal concetto di parola e aprirci al concetto di "peso" ,"vettore" e "embedding".

Di fatto, una delle primissime operazioni del modello è il lookup nella embedding matrix. 
Proviamo a farci capire. Ipotizziamo l'input "il cielo è".

Abbiamo detto che questo input viene passato al tokenizer. che prenderà pezzi della frase e li trasformerà in token ID (n.b. per semplicità metto 3 tokenid ma potrebbero essere di più o di meno).

il tokenizer produrrà qualcosa tipo 
>[101,452,77] 

Questi sono gli ID token.

A sto punto il modello non ragiona direttamente sul numero 452 come se avesse un significato particolare.
Il numero 452, nel nostro esempio, identifica un certo token nel vocabolario, ma il modello non tratta matematicamente il numero 452 come se il suo valore numerico significasse qualcosa.

452 viene usato invece come indice.

Il modello abbiamo detto che contiene miliardi di pesi organizzati in varie matrici; una di queste è la embedding matrix, che associa i token ID ai loro vettori iniziali.
Una delle prime operazioni del modello consiste nel consultare proprio questa matrice e recuperare la riga corrispondente a quel token ID.

> 452 → [-0.31, 0.08, 0.77, ...]

quel lungo vettore di numeri è l'embedding iniziale del token. L'embedding rappresenta il token in uno spazio numerico multidimensionale.
> - "gatto" → [0.8, 0.2, -0.5, ...]
> - "cane"  → [0.7, 0.3, -0.4, ...]
> - "firewall"→ [-0.2, 0.9, 0.1, ...]

gatto e cane potrebbero risultare relativamente “vicini” in quello spazio perché durante il training il modello ha imparato che compaiono in contesti simili.
Ma attenzione: non c’è una colonna “animalità”, una colonna “pelosità”, una colonna “domestico”.

Il significato è distribuito sulle molte dimensioni del vettore e, soprattutto, questa rappresentazione continuerà a trasformarsi mentre attraversa i vari strati del modello.

Già perchè adesso iniziano i calcoli..ed è qui il bello.
___

Abbiamo appena detto che noi abbiamo dei vettori, ma dobbiamo guardare al modo in cui questi vettori si relazionano tra loro nel *contesto*.

Prendiamo ancora "Il cielo è"

Banalmente alcune relazioni "contano" più di altre. 
Quella tra "cielo" e "è" è *"interessante"* mentre quella tra "cielo" e "il" (che è solo un articolo) moolto meno. Per questa cosa c'è la *"attention"* che calcola quanto ogni token è rilevante rispetto agli altri e "soppesa" le informazioni di conseguenza.
Quindi se all'inizio la nostra embedding matrix restituiva una certa rappresentazione iniziale di "cielo", ecco che le informazioni prese dagli altri token unitamente ad altri calcoli, hanno creato una nuova rappresentazione di "cielo" in quella specifica sequenza, cioè in quello specifico contesto.

Dopo l’attention, ogni layer applica anche altre trasformazioni matematiche — in particolare reti feed-forward, normalizzazioni e connessioni residue — e il processo viene ripetuto per molti layer. Per i nostri scopi possiamo però trattare tutto questo come una serie di trasformazioni che raffinano progressivamente la rappresentazione dei token.

    embedding iniziale → attention → trasformazioni → embedding aggiornato

Alla fine dell’ultimo layer dobbiamo riemergere dal mondo delle rappresentazioni vettoriali verso il vocabolario del modello. La rappresentazione finale viene proiettata sul vocabolario e otteniamo i logits.
Che roba sono ?
In sostanza abbiamo un enorme vettore con un valore per ogni token possibile del vocabolario.

> - token 1382 ("blu")       → 12.4
> - token 8271 ("sereno")    → 8.1
> - token 314  ("molto")     → 5.7
> - token 9921 ("verde")     → 1.2

E,a questo punto, c'è un altro componente, il "sampler" che sceglie in base ai punteggi e ad alcuni parametri (temperature e altro) il token successivo.
Se fosse una pipeline *xnix

    echo "il cielo è" | tokenizer | inference-engine --model modello.gguf | sampler | detokenizer 

dentro il processo inference-engine

    token id | embedding lookup | attention | feed-forward/normalizzazioni/residual per molti layer | proiezione sul vocabolario | logits 

Il sampler quindi sceglie in base ai punteggi il token successivo e lo passa al detokenizer che non fa altro che rimappare il token id con un valore a dizionario che ha senso per noi.

E arriviamo a un'altra parola idiota ma, a quanto pare, necessaria: inference, in italiano inferenza.

Inferire — non *infierire* — deriva dal latino *inferre*: ricavare qualcosa a partire da ciò che abbiamo a disposizione.

Attenzione però a non tradurlo mentalmente semplicemente con “dedurre”: non stiamo dicendo che il modello faccia necessariamente una deduzione logica (anzi)

Quindi quello di cui ci siamo occupati è di descrivere un pochino l'inferenza *(madonna che brutto anche da leggere)* cioè il processo con cui il runtime usa un modello già addestrato per elaborare un input e produrre un output. 

Il modello produce i punteggi per i possibili token successivi; il processo di generazione ne seleziona uno secondo i parametri impostati, lo aggiunge alla sequenza e ricomincia.

Token dopo token.

Finché quella che per la macchina è una sequenza di numeri torna a essere, per noi, una frase sensata.

____

Facciamo però un passo indietro, abbiamo appena detto che un LLM è un modello linguistico. **Non agisce** e cioè da solo non compie azioni sul mondo esterno. Risponde a delle domande con un certo contesto. Peraltro in modo probabilistico.

Bene.

O meglio, non bene.

Perché se vogliamo aggiungere contesto più preciso al nostro modello e fargli dire meno stupidate probabilistiche o informazioni verificate  — cosa buona e giusta — dobbiamo avere un sistema per recuperarlo e metterglielo a disposizione.

Qui entra in gioco l'ennesimo acronimo: RAG, Retrieval-Augmented Generation.

RAG è un processo, non un database e nemmeno un altro LLM.

In soldoni: prima di passare la nostra richiesta al modello, recuperiamo delle informazioni che riteniamo pertinenti e le aggiungiamo al contesto della richiesta.

Potremmo immaginarle come una bibliografia specifica di contesto, che andiamo a recuperare e "appiccichiamo" all'input.

Quindi:

    domanda → recupero informazioni pertinenti → aggiungo il contesto → tokenizzazione → modello → risposta

Il modello, dal canto suo, non deve necessariamente sapere nulla di tutto questo.

Riceve semplicemente più roba da leggere.

E chi recupera il contesto?

Il **retriever**.

Ennesimo termine che sembra indicare oddiochissàcherobaè. In realtà il retriever, oltre ad essere una interessante razza canina, si riferisce principalmente ad un ruolo: qualcosa che, ricevuta una richiesta, va a recuperare informazioni pertinenti da una sorgente.

Fisicamente potrebbe essere una funzione, uno script o un programma che il nostro harness conosce e sa utilizzare.

E da dove recupera queste informazioni?

Da dove vogliamo.

Potrebbe fare una query SQL, cercare dei file, interrogare un motore di ricerca, chiamare un'API, fare una ricerca full-text oppure interrogare uno di quei famigerati vector database di cui parleremo tra poco.

Una volta recuperate le informazioni, il nostro programma deve preparare l'input effettivo da dare al modello.

E anche qui niente magia.

Se abbiamo chiesto:

*“Qual è la procedura aziendale per cambiare una password?”*

il retriever potrebbe aver recuperato dal nostro repository il pezzo di documento che contiene la procedura.

in tutto questo c'è un impalcato che governa le varie cose, quello che spesso viene chiamato ***harness***, letteralmente l'impalcatura attorno al modello.

Non pensiamo a qualcosa di mistico: può essere banalmente il nostro programma “papà”, magari scritto in Python, che contiene funzioni, configurazioni e logica applicativa e che dialoga con il runtime. Ma non solo.

Il nostro harness, tramite RAG, può quindi costruire un input che, concettualmente, assomiglia a:

>ISTRUZIONI
>Rispondi alla domanda utilizzando il contesto seguente.
>
>CONTESTO
>[pezzo del documento recuperato dal retriever]
>
>DOMANDA
>Qual è la procedura aziendale per cambiare una password?

A questo punto tutto questo testo viene tokenizzato e passato al modello.

Fine.

Il modello ***non*** è diventato più intelligente.

***Non*** ha imparato permanentemente la nostra procedura.

***Non*** abbiamo modificato i suoi pesi.

Gli abbiamo semplicemente messo davanti della roba in più prima di chiedergli di rispondere.

___
E ora ridiamo... ma se ho 600.000 documenti, come fa il retriever a capire quale è il pezzo più sensato da andare a prendere? 

Ovviamente introduciamo un altro modello.

In qualche modo dovrò indicizzare questi documenti. E come?

Ma con l'ennesimo database di vettori, no? :D

Ed ecco che torniamo nuovamente agli embedding. Questa volta, però, non stiamo parlando dell'embedding interno dell'LLM.

Utilizziamo un **embedding model**, cioè un modello il cui lavoro è trasformare testo in vettori utili per confrontarne la similarità semantica.

Prendiamo quindi i nostri documenti, li dividiamo in pezzi più piccoli — i famosi chunk — e passiamo ogni chunk all'embedding model che li trasforma in vettori.

Memorizziamo poi questi vettori in un vector database, mantenendo naturalmente il collegamento con il chunk originale da cui provengono.

A questo punto arriva il nostro input.

Anche l'input viene passato all'embedding model:

    input → embedding model → vettore dell'input

E finalmente il retriever può dire al vector database:

*“Sentite un po': io ho questo vettore. Trovatemi quelli più vicini.”*

I vettori più vicini corrisponderanno, si spera, ai chunk semanticamente più pertinenti rispetto all'input.

Il retriever recupera quindi il testo originale associato a quei vettori e lo passa al nostro harness, che lo aggiungerà al contesto destinato all'LLM.

ricordiamo sempre il concetto che è "metto qualcosa PRIMA di chiedergli di rispondere".

in sostanza

    input utente | retrieval | recupero chunk | costruisco l'input finale | tokenizer dell'LLM | inference engine + LLM | sampler | detokenizer

Ma se il retriever usa un vector DB c'è dentro anche al retriever un'altra piccola pipeline AI.

    input | tokenizer dell'embedding model | embedding model | vettore dell'input | vector db | ricerca | chunk pertinenti.

E la cosa bella è che i tokenizer del retriever possono essere diversi dal tokenizer dell'LLM. 

e chi orchestra il tutto? L'harness, ricordi ?

___

ok adesso la parte agentic, che a sto punto è quasi una boiata.

Se prima l'harness si limitava a preparare l'input e chiedere una risposta, ora l'harness permette al modello di scegliere il prossimo passo.

La pipeline non è più lineare ma diventa un loop, osserva, decide, agisce, osserva il risultato, decide di nuovo etc.. fino al raggiungimento di un goal finale. Ed è qui che si parla di Agentic AI. Cioè di AI in grado di **AGIRE**.

L'agent, a questo punto, non è altro che un sistema composto da un LLM, un harness, dei tool — cioè strumenti con cui può fare cose — e un loop decisionale che mantiene stato e contesto.

Spesso ci sono anche istruzioni o workflow che spiegano all'agent come affrontare determinati task: quelle vengono chiamate **skill**.

Vista così, la cosa diventa decisamente più bevibile.

La parte difficile è far sì che un sistema probabilistico, dotato di accesso a strumenti reali e capace di decidere autonomamente il passo successivo, non faccia stupidate.

Ed è qui che finalmente possiamo tornare a parlare di Cybersecurity, ma soprattutto è a questo punto che possiamo fare la cosa più naturale del mondo: andare nel panico.

- “È finita.”
- “Gli agent faranno tutto da soli.”
- “Perderemo il lavoro.”
- “La cybersecurity è morta.”
- “Gli sviluppatori non serviranno più.”
- “Gli attaccanti useranno l'AI e saremo tutti fregati.”

Perfetto.

Adesso che abbiamo fatto il pieno di catastrofismo, possiamo tornare a ragionare.

Perché la realtà è molto meno cinematografica e, per certi versi, molto più interessante: non siamo davanti a una magia che sostituisce improvvisamente tutto ciò che conoscevamo.

Siamo davanti a software che prende decisioni probabilistiche, usa strumenti, accede a dati, chiama API, gestisce credenziali, legge file, scrive file, parla con altri sistemi e, ogni tanto, sbaglia.

Cioè, finalmente, qualcosa che un vecchio della cybersecurity sa già come guardare con sospetto.

Ci vediamo nella parte 2 ? Sarebbe bello.


