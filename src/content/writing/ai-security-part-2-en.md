---
title: "Hey Ahi Security - A Manual for Grumpy Old IT Pros — Part II - Now We Hand It the House Keys"
description: "When it stops answering and starts acting."
pubDate: 2026-10-23
language: "en"
draft: false
---

I don’t know how painful Part I was, but let’s keep going.

Ok, short recap. Actually no. In plain terms, we had gotten here.

The problem — or the interesting part, depending on how you're wired — starts when we decide that instead of limiting ourselves to asking:

> “What should I do?”

we want to be able to say:

> “Do it.”

And this is where we really start handing the house keys to the machine.

## Tools

We've already met this word.

A **tool** is nothing more than something our *harness* makes available to the model so it can perform an action.

No magic here either.

A tool can simply be a function:

`read_file("/etc/config")`

or:

`send_email(...)`

or:

`query_database(...)`

or again:

`run_command("pytest")`

Translated for us old-timers:

the model has not suddenly grown hands.

There's *normal* software that exposes *normal* functions, and the harness lets the model request their execution.

Conceptually:

`LLM → "I want to use this tool with these parameters" → harness → real function`

Example.

The user says:

> “Check why the deploy failed.”

The model might conclude:

> “I need the logs.”

And instead of simply answering:

> “You should look at the logs.”

it can produce a structured request like:

`get_logs(environment="production")`

The harness receives this request, checks that a tool called `get_logs` exists, runs it, and returns the result to the model.

The model then receives:

`ERROR: database connection timeout...`

and keeps reasoning.

Notice the "jump"; before we had:

`input → model → answer`

Now we have:

`input → model → action request → harness → tool → result → model`

And we can start over.

## And here's the loop

and here it is again: the **agentic**.

In brutal form:

`observe → decide → act → observe → decide → act`

Until it thinks it has reached the "goal."

Back to the deploy example:

`"Fix the deploy"`

↓

LLM: `I need to see the logs`

↓

tool: `get_logs()`

↓

LLM: `There's an error in the database configuration`

↓

tool: `read_file("config.yaml")`

↓

LLM: `The port is wrong`

↓

tool: `write_file("config.yaml", ...)`

↓

tool: `deploy()`

↓

tool: `get_status()`

↓

LLM: `Deploy completed`

At that point it starts to be clear why the word **agent** makes sense.

Not because we created a new species of artificial intelligence.

We simply built a system in which the LLM *acts*, influencing the next step of execution.

So the agent is not a mysterious thing.

It's a system made, roughly, of:

`LLM + harness + tools + state + decision loop`

and maybe RAG, memory, skills, and all the other stuff we've already seen.

## Skills

Here we can take apart another buzzword.

A **skill** is often simply a set of instructions that tell the agent how to approach a certain kind of activity.

We might have a skill called:

`debugging`

that says something like:

1. reproduce the problem;
2. collect the logs;
3. identify the components involved;
4. form a hypothesis;
5. apply the minimal necessary change;
6. run the tests;
7. verify the result.

Again, no black magic.

It can be
- a Markdown file.
- a prompt.
- code.
- a more structured workflow.

The idea that matters:

**the tool says what the agent can do; the skill suggests how to approach a certain kind of work.**

The hammer is a tool.

Knowing how to do carpentry is a skill.

*Feeling a bit cooler now that you understand all these cheap buzzwords, huh?*

## Autonomy

And here come the first problems.

How far can it go "on its own"?

We can have a system where every action needs confirmation:

`LLM → proposes action → human approves → harness executes`

Or:

`LLM → decides → harness executes`

Or again:

`LLM → decides → executes → observes → decides → executes → observes...`

for twenty, fifty, a hundred, A THOUSAND steps. Gianni! A thousand steps!

*For non-Italians: Ing.Cane (Engineer Dog) is a character played by Italian comedian Fabio De Luigi. He barely knows the Pythagorean theorem, yet he designs bridges and stuff using ridiculously huge numbers.*

![tanti numeri](https://www.emugifs.net/wp-content/uploads/2021/01/Ingenier-Cane-Mille-GIF-Fabio-De-Luigi-in-TV-a-Mai-Dire-Gol-con-la-Gialappa-s-Band.gif)

That difference matters a lot.

Because the nonsense from the first step can become the context of the second.

The second can produce the third.

And so on.

So we don't just have a probabilistic system.

We have a probabilistic system capable of **autonomously chaining the consequences of its own decisions**.

And that — much more than everything we've met so far — is probably the thing to really keep in mind when we talk about Agentic AI.

Before, the model could *say* something stupid.

Now it can ***do*** something stupid.
___
## Before attackers even show up, we can hurt ourselves

Before talking about real attacks, though, there's something else worth saying.

You don't necessarily need an attacker to create a problem.

Sometimes *(hint: often)* it's enough to use the technology badly.

### Workforce

Introducing these AI tools changes how people work.

And that doesn't just mean “AI will steal our jobs,” which is the newspaper-headline version.

Let's say that for the paranoids there's a risk that goes: "if I delegate everything, I can't do anything anymore. Juniors don't learn, seniors trust and don't check."

Up to more catastrophic visions where a development team can ship code nobody has really read. Or a process can become dependent on a tool nobody could replace by hand.

So the risk isn't only that the AI does something badly.

It's also that the organization gradually stops knowing **how that thing is done**.

### Where do the data go?

Then there's a much less philosophical question.

When I paste into a model:

- source code;
- logs;
- internal documents;
- customer data;
- configurations;
- incident reports;

where is that data going?

If I'm using an external service, that data is probably crossing infrastructure I don't directly control.

How long is it kept?

Where?

Who can access it?

Is it used to improve the service?

For training?

Does it end up in logs?

Are there contractual guarantees?

Data residency?

Retention?

The point is not to scare people by saying “all your data, even the secret stuff, is already being used for training.”

That isn't necessarily true, and it depends on the service.

The point is much more banal:

**if you don't know, you already have a problem.**

And if you think switching providers is enough to solve it, there's an interesting story to read.

Stefano Conter (he started doing his homework well before I did) wrote about switching providers for his coding assistant, even though he was happy with how it worked. Not because the model was bad, but because he wanted to understand better what happened to the data he entrusted to it.

Spoiler: changing vendor does not automatically mean you've solved the problem. At best, it means you've consciously chosen different terms.

He talks about it here: [I switched AI providers. I’m not convinced I solved anything..](https://conterstefano.it/blog/switched-ai-providers-data-governance/)

It's the same reason we wouldn't normally ship the company database dump to an online service just because it has a nice UI.

Data classification, privacy, governance, and procurement still exist even when the text box has “AI” written above it.

### And then there's cost

Another thing we curiously tend to forget is that all this stuff costs money.

Inference costs.

Embeddings cost.

Storage costs.

The vector database costs.

API calls cost.

GPUs cost.

Bandwidth costs.

Monitoring costs.

And above all, loops cost.

A chatbot gets a question and produces an answer.

An agent can:

`think → call a tool → re-read the result → think → call another tool → query a model → retry → verify → retry`

maybe for dozens of steps.

And every step can have a computational or economic cost.

That means autonomy doesn't only have a larger risk surface.

It also has a larger cost surface.

A poorly configured agent doesn't necessarily need to be compromised to cause an incident.

It can simply do a hundred times more work than necessary.

And at the end of the month someone notices looking at the cloud invoice.

All things considered, this too is a fairly traditional problem:

**resource governance.**

___

## Stuff from Mars?

So no, this isn't stuff from Mars — if anything, in the end it all looks terribly familiar.
Because yes, it *is* new stuff.
An LLM is not a web server.
An agent is not simply a Bash script.

So no, I don't want to dismiss everything with: “Bah, same old things.”

They aren't.

But that also doesn't mean we should throw away everything we know about cybersecurity and start from scratch.
Because as soon as we stop staring at the new names and start looking at the architecture, very old problems show up again.

We have
- input arriving from parties we don't fully trust.
- data that *crosses* different components.
- software that executes operations on someone's behalf.
- identity.
- privileges.
- credentials.
- dependencies.
- boundaries between zones with different trust levels.

In short, we have "trust boundaries" (what a fancy phrase!)

And that, for people in cybersecurity, should feel fairly reassuring.

Not because the problem is simple, but because we can finally start asking questions we know.


1. Do I trust the input? (user → harness)


2. Do I trust the retrieved data? (documents → retriever → LLM)


3. Who authorizes that action? (LLM → tool)


4. With what privileges is it executed? (tool → operating system / API / cloud)


5. Am I putting data from an external source back into the agent's decision process? (tool output → LLM)


6. Where does this stuff come from, and why am I trusting it? (skill / model / library → harness)

And suddenly this whole futuristic architecture starts looking like something we know very well.

We haven't eliminated the old problems — we've only moved them, and in some cases amplified them, or added new ones, but underneath there are still rather familiar concepts:

trust, input validation, authorization, least privilege, isolation, supply chain, identity, logging, audit.

And this is exactly where (in my view) you have to start if you want to talk seriously about AI Security.

Not from the idea that AI made the cybersecurity we knew useless.

But from the opposite idea:

*now that we understand what's really inside this stuff, can we apply what we know to the new trust boundaries we just created?*
