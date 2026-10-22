---
title: "Hey Ahi Security - Manual for old grumpy IT pros — Part I - Take the machine apart"
description: "LLMs, runtimes, tokenizers, embeddings, RAG, harnesses and agents: take the machine apart before trying to secure it."
pubDate: 2026-10-21
language: "en"
draft: false
---

Ah, this article was not written with AI. Because otherwise you wouldn't feel like reading it. And it takes about 12 to 15 minutes. Take your time.

____

Ok, I spent way too long waiting around before deciding to put things in order.

Same thing happens with my garage: there's everything in there and eventually I can't make sense of any of it, so I stop and start over — thinking about where things belong, making sense of their place, what I need and what I don't.

I am *obviously* talking about AI.

Then, being in cybersecurity, the topic is precisely AI security — that thing everyone talks about while nobody really knows what the hell they're saying. Everyone nods and pretends to understand, because it's not cool to say "I didn't get a damn thing."

Then came the word storm. Lots of words.
You feel inadequate. So alright, let's start over — but for an old *nix hand like me, it's much easier to take things apart, reframe them, put them back in order.
So I'm writing these lines basically to clear my own head, and maybe with the hope of clearing someone else's too.

I'm not talking about artificial intelligence, because I know NOTHING about it. I'm not a mathematician. I'm just a curious user, without enough authority to sit here and tell you how an LLM works or anything else. There are excellent professionals out there who know their stuff (or who bluff very well). Not me — I prefer to say I don't know.

But let's go in order (sort of).

It all starts when someone in the room begins with *"Agentic AI, which with a RAG [...] quantizing the model [...] the harness, the skills and of course the tools [...], prompt injection"*. "I got nothing." Damn, what a monstrous architecture — you need diagrams and then, I don't know, so much complicated stuff. I thought things would get simpler in 2026… I used to be the one with the complicated stuff.

In the sentence above I put a bunch of annoying dots on purpose because I'm basically a boomer. There.

For the sake of understanding, I'll simplify the concepts — hell, having taken them apart myself I'll probably get some of it wrong — but I won't get lost in technical details, and I'll put a lot of asterisks whenever you might want to dig deeper or whenever I'm sure it's not exactly like that… but to get the idea you can also ignore the asterisks.

## LLM or Model.

It's a big file that contains data. Period.

Let's take a nice GGUF file and open it with Notepad.

>Ahhhhh, nothing like binary files in Notepad.

![Ahhhhh, nothing like binary files in Notepad.](https://media1.tenor.com/m/CNkEIuvqxSMAAAAd/sid-seixeiro-sid.gif)

Obviously we'll mostly see incomprehensible binary garbage. But conceptually, inside we'll find mainly two things: metadata describing the model, and NUMBERS. Lots and lots and lots of NUMBERS.
Those are the parameters, or weights, that the model learned during training.

The machine, simplifying a lot (*), needs to hold in memory the weights required to make it work: the bigger the model, the more memory you'll need. RAM, or VRAM, which is much FFFFFasster.

(*) Yes, we can do offloading, memory mapping, distribute the model across multiple devices and a bunch of other nonsense. For now we don't care.

Jokes aside, the model is still a file. By itself it does absolutely **nothing**.

You need software that can load it, interpret its structure, and run the calculations required to use it: the ***runtime***.

To understand how this file turns into magic, we need to break our mental model a bit.

If the model is a practically dead file, as we've seen, the runtime is the component that lets you use the model. Of course the runtime itself can be seen as a series of smaller pieces.

In what sense?

in the sense that when we send an input, that input goes through tokenization.

## Token

*Token* literally means “token / chip.” For us old-timers it's enough to think of it as one of the elementary units into which text is represented so the model can process it. A token can be a word, a *piece* of a word, punctuation, and so on.

Before reaching the model, then, our input is "prepared" by a so-called "tokenizer." This "component" is distinct from the model and the engine, even though in practice it's often integrated into the same software we use for the runtime, and its job is to create the sequence of tokens — more precisely their numeric identifiers — that that model knows how to process.

Its job is to turn text into a sequence of numeric identifiers, the token IDs, belonging to that model's specific vocabulary.

The output we logically expect are the *logits*.
We can think of logits as scores associated with possible next tokens.

But to get to those scores, there is no predefined "word" → "score" table — there are calculations that happen "on the fly," using all the model's weight matrices and the current context.

This is where we have to leave the idea of "word" behind and open up to "weight," "vector," and "embedding."

## Starting over

In fact, one of the very first operations in the model is a lookup in the embedding matrix.
Let's try to make this clear. Suppose the input is "the sky is."

We've said this input is passed to the tokenizer, which will take pieces of the sentence and turn them into token IDs (n.b. for simplicity I'm using 3 token IDs, but there could be more or fewer).

The tokenizer will produce something like
>[101,452,77]

These are the token IDs.

At this point the model does **not** reason directly on the number 452 as if it had some special meaning.
The number 452, in our example, identifies a certain token in the vocabulary, but the model does not treat the number 452 mathematically as if its numeric value meant something.

452 is used as an *index* instead.

We've said the model contains billions of weights organized into various matrices; one of these is the embedding matrix, which maps token IDs to their initial vectors.
One of the first operations in the model is consulting exactly this matrix and retrieving the row corresponding to that token ID.

> 452 → [-0.31, 0.08, 0.77, ...]

That long vector of numbers is the token's initial embedding. The embedding represents the token in a multidimensional numeric space.
> - "cat" → [0.8, 0.2, -0.5, ...]
> - "dog"  → [0.7, 0.3, -0.4, ...]
> - "firewall"→ [-0.2, 0.9, 0.1, ...]

Cat and dog might end up relatively “close” in that space because during training the model learned that they appear in similar contexts.
But careful: there is no “animal-ness” column, no “furry-ness” column, no “domestic” column.

Meaning is distributed across the many dimensions of the vector and, above all, this representation will keep transforming as it passes through the model's various layers.

Because now the calculations begin… and this is where it gets good.
___

We just said we have vectors, but we need to look at how these vectors relate to each other in *context*.

Take "The sky is" again.

Basically some relationships "count" more than others.
The one between "sky" and "is" is *"interesting,"* while the one between "sky" and "the" (which is just an article) is muuuch less so. For this there's *"attention,"* which calculates how relevant each token is relative to the others and "weighs" the information accordingly.
So if at the start our embedding matrix returned a certain initial representation of "sky," information taken from the other tokens — together with other calculations — has created a new representation of "sky" in that specific sequence, that is, in that specific context.

After attention, each layer also applies other mathematical transformations — in particular feed-forward networks, normalizations, and residual connections — and the process is repeated across many layers. For our purposes we can treat all of this as a series of transformations that progressively refine the token representations.

    initial embedding → attention → transformations → updated embedding

At the end of the last layer we have to resurface from the world of vector representations back to the model's vocabulary. The final representation is projected onto the vocabulary and we get the logits.
What the hell are those?
In short we have a huge vector with a value for every possible token in the vocabulary.

> - token 1382 ("blue")       → 12.4
> - token 8271 ("clear")      → 8.1
> - token 314  ("very")       → 5.7
> - token 9921 ("green")      → 1.2

And at this point there's another component, the "sampler," which chooses the next token based on the scores and some parameters (temperature and so on).
If it were a *nix pipeline

    echo "the sky is" | tokenizer | inference-engine --model model.gguf | sampler | detokenizer

inside the inference-engine process

    token id | embedding lookup | attention | feed-forward/normalizations/residual across many layers | projection onto vocabulary | logits

The sampler then chooses the next token based on the scores and passes it to the detokenizer, which does nothing more than remap the token ID to a dictionary value that makes sense to us.

And here we get to another stupid but, apparently, necessary word: inference.

## Inference

To infer — not to *inflict* — comes from the Latin *inferre*: to draw something out of what we have available.

But careful not to translate it mentally simply as “deduce”: we're not saying the model necessarily does logical deduction (quite the opposite).
![](https://scontent-mxp2-1.xx.fbcdn.net/v/t39.30808-6/498242714_9709716825772770_6919300669561488707_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=104&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=xpvgQg7XdNEQ7kNvwEmtywA&_nc_oc=AdrooZ-1nftnYJ73J-oW-A23v_Ns1LKYodwge1CnHcR_ywfU_wd_dQ_fLsKkPxuT0bE&_nc_zt=23&_nc_ht=scontent-mxp2-1.xx&_nc_gid=U4yKtzCLZRPP6zk6bJL73A&_nc_ss=7b289&oh=00_AQMQ5rUtXL_wTl9V1BlfhwTIvDgiKJugdWfMWMwWl7q_QA&oe=6ADF1A07)

So what we've been doing is describing inference a little *(god, even reading that word is ugly)* — that is, the process by which the runtime uses an already trained model to process an input and produce an output.

The model produces scores for possible next tokens; the generation process selects one according to the parameters set, adds it to the sequence, and starts over.

Token after token.

Until what for the machine is a sequence of numbers becomes, for us, a sensible sentence.

____

But let's take a step back. We just said an LLM is a language model. It **does not act** — that is, by itself it does not perform actions on the outside world. It answers questions with a certain context. And probabilistically, by the way.

Fine.

Or rather, not fine.

Because if we want to add more precise context to our model and make it say fewer probabilistic nonsense statements — or verified information — a good and proper thing — we need a system to retrieve that context and put it in front of the model.

Enter the next acronym: RAG, Retrieval-Augmented Generation.

## RAG

RAG is a process, not a database and not another LLM.

In plain terms: before passing our request to the model, we retrieve information we consider relevant and add it to the request's context.

We might think of it as a specific bibliography of context that we go fetch and "stick" onto the input.

So:

    question → retrieve relevant information → add context → tokenization → model → answer

The model, for its part, doesn't necessarily need to know any of this.

It simply receives more stuff to read.

And who retrieves the context?

![](https://artero.com/media/wysiwyg/Golden_Retriever2_1_.png)

The **retriever**.

Yet another term that sounds like ohmygodwhoknowswhatthatis. In reality the retriever, besides being an interesting dog breed, mainly refers to a role: something that, given a request, goes and fetches relevant information from a source.

Physically it could be a function, a script, or a program that our harness knows and knows how to use.

And where does it fetch this information from?

Wherever we want.

It could run a SQL query, search files, query a search engine, call an API, do a full-text search, or query one of those infamous vector databases we'll talk about in a moment.

Once the information is retrieved, our program has to prepare the actual input to give the model.

And again, no magic here.

If we asked:

*“What is the company procedure for changing a password?”*

the retriever might have pulled from our repository the piece of document that contains the procedure.

In all of this there's scaffolding that governs the various pieces — what is often called the ***harness***, literally the scaffolding around the model.

Don't think of anything mystical: it can simply be our “parent” program, maybe written in Python, that contains functions, configuration, and application logic and talks to the runtime. But not only that.

Our harness, via RAG, can then build an input that conceptually looks something like:

>INSTRUCTIONS
>Answer the question using the following context.
>
>CONTEXT
>[piece of document retrieved by the retriever]
>
>QUESTION
>What is the company procedure for changing a password?

At this point all of this text is tokenized and passed to the model.

Done.

The model has ***not*** become smarter.

It has ***not*** permanently learned our procedure.

We have ***not*** modified its weights.

We simply put more stuff in front of it before asking it to answer.

___
And now we laugh… but if I have 600,000 documents, how does the retriever figure out which piece is the most sensible one to grab?

Obviously we introduce *another* model.

Somehow I have to index these documents. And how?

With yet another vector database, right? :D

And here we are back at embeddings again. This time, though, we're not talking about the LLM's internal embedding.

We use an **embedding model**, that is, a model whose job is to turn text into vectors useful for comparing semantic similarity.

So we take our documents, split them into smaller pieces — the famous chunks — and pass each chunk to the embedding model, which turns them into vectors.

Then we store these vectors in a vector database, naturally keeping the link to the original chunk they came from.

At this point our input arrives.

The input is also passed to the embedding model:

    input → embedding model → input vector

And finally the retriever can say to the vector database:

*“Listen up: I've got this vector. Find me the closest ones.”*

The closest vectors will correspond, hopefully, to the chunks that are semantically most relevant to the input.

The retriever then fetches the original text associated with those vectors and passes it to our harness, which will add it to the context destined for the LLM.

Always remember the idea: "I put something BEFORE asking it to answer."

In short

    user input | retrieval | fetch chunks | build final input | LLM tokenizer | inference engine + LLM | sampler | detokenizer

But if the retriever uses a vector DB, there's another little AI pipeline inside the retriever too.

    input | embedding model tokenizer | embedding model | input vector | vector db | search | relevant chunks

And the nice part is that the retriever's tokenizers can be different from the LLM's tokenizer.

And who orchestrates all of this? The harness — remember?

___

## Agentic

ok now the agentic part, which at this point is almost nonsense.

If before the harness limited itself to preparing the input and asking for an answer, now the harness lets the model choose the next step.

The pipeline is no longer linear — it becomes a loop: observe, decide, act, observe the result, decide again, etc., until a final goal is reached. And this is where we talk about Agentic AI. That is, AI capable of **ACTING**.

The agent, at this point, is nothing more than a system made of an LLM, a harness, tools — that is, instruments it can use to do things — and a decision loop that maintains state and context.

Often there are also instructions or workflows that tell the agent how to approach certain tasks: those are called **skills**.

Seen this way, the whole thing becomes much more digestible.

The hard part is making sure a probabilistic system, with access to real tools and able to decide the next step on its own, doesn't do something stupid.

And this is finally where we can get back to talking about Cybersecurity — but above all, this is the point where we can do the most natural thing in the world: panic.

- “It's over.”
- “Agents will do everything by themselves.”
- “We'll lose our jobs.”
- “Cybersecurity is dead.”
- “Developers won't be needed anymore.”
- “Attackers will use AI and we're all screwed.”

Perfect.

Now that we've topped up on catastrophism, we can get back to thinking.

Because reality is much less cinematic and, in some ways, much more interesting: we're not looking at magic that suddenly replaces everything we knew.

We're looking at software that makes probabilistic decisions, uses tools, accesses data, calls APIs, handles credentials, reads files, writes files, talks to other systems, and every so often gets it wrong.

That is, finally, something an old cybersecurity hand already knows how to look at with suspicion.

See you in part 2? That would be nice.
