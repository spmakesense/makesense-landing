# The universal method

Five families of tells. They appear in every language, but each one surfaces
differently, which is why the language files exist.

Family 1 has two halves: idioms carried across literally (1), and the fixed
inventory of English marketing phrases (1b). In commercial copy, 1b is usually
the largest single source of tells, so do not stop at the idiom table in the
language file.

Work through the families in order. The first two are the highest yield and the
easiest to fix.

---

## Family 1: Calque

An English idiom or metaphor carried across word for word. The result is
grammatical and meaningless, or grammatical and simply not a thing people say.

This is the single strongest tell in every language studied here, because these
phrases are near absent in native writing and near constant in machine writing.

The pattern to look for: a fixed English expression rendered literally.

- "at the end of the day"
- "at the heart of"
- "it's not just X, it's Y"
- "a game changer"
- "let's dive in"
- "in today's fast-paced world"
- "when it comes to"
- "unlock the potential of"
- "navigate the challenges of"

Each language file lists the specific literal renderings to search for.

**Fix:** replace with what a native writer would actually say, or delete. Most
calques are filler and the sentence is stronger without them.

**Note:** some calques have genuinely entered a language through decades of use.
The language files mark those as accepted, so do not "fix" them.

---

## Family 1b: Stock marketing units

The highest-volume tell in commercial copy, and the one the language tables miss.

English marketing has a fixed inventory of phrases. The model reproduces the
inventory and renders each item literally into the target language. The result is
grammatical, generic, and identical across every machine-written page in that
language.

Unlike Family 1, you do not need a per-language table for these. **The source is
always English.** Take the list below, find whatever the literal rendering is in
the language you are working in, and treat each hit as a tell.

**Stock hero openers.** Almost always the first sentence, almost never how a
native writer opens:

- Discover / Introducing / Meet the...
- In today's digital age / In today's fast-paced world / In an era where...
- Whether you are X or Y...
- Imagine a world where...
- Say goodbye to X

**Stock noun phrases.** The filler that survives translation as a unit:

- a comprehensive solution
- tailored to your needs
- the best tools
- seamless integration
- cutting-edge technology
- a powerful platform
- your one-stop shop
- designed with you in mind

**Stock verb frames:**

- is transforming the way that...
- allows you to / empowers you to
- it's all about / it comes down to
- takes the hassle out of
- every minute counts / every second matters

**Fix:** delete, or replace with the specific thing. "a comprehensive solution
tailored to your needs" carries no information, so removing it loses nothing. If
the sentence collapses to nothing when you delete the stock phrase, the sentence
was empty, and that is the finding worth reporting.

**Guard:** a single stock phrase is normal. Real copywriters use them. Three or
more in one page, or one in the opening sentence, is the signal.

---

## Family 2: Imported punctuation and typography

Every language has its own conventions. The model applies English ones.

Check:

- **Dashes.** English uses the em dash as a parenthetical. Most other languages
  either use it differently, use a different character, or barely use it at all.
  In several languages a dash used the English way is an instant tell.
- **Quotation marks.** German, French, Japanese, Chinese, Russian and others all
  use different marks. Straight or curly English quotes are a tell.
- **Spacing.** French requires a space before certain marks. Chinese and Japanese
  use full width punctuation with no space.
- **Lists and capitalization.** Title Case Applied To Headings is English. Most
  languages capitalize only the first word.
- **Numbers.** Decimal separators, thousands separators, and date order differ.

**Fix:** apply the target language's convention. See the language file.

---

## Family 3: Register flattening

Machine text tends to a neutral, placeless, ageless register: correct, polite,
regionless, and with no individual voice.

Symptoms:

- **No regional identity.** Spanish that belongs to no country. Portuguese that
  is neither Brazilian nor European.
- **Uniform formality.** Every sentence at the same politeness level, where a
  human would vary.
- **Wrong default politeness.** Several languages have a formality system with a
  natural default for a given context, and the model picks the safest one rather
  than the right one.
- **Mixed varieties.** A word from one region beside a verb form from another.
  This is conclusive. No native writer does it.

**Fix:** pick one variety and one register, ask the user which if it is not
obvious from context, and make it consistent.

---

## Family 4: English syntax showing through

Grammar is correct, word order is legal, but the sentence is built the way an
English sentence is built.

Look for:

- **Rule of three.** Three adjectives, three clauses, three examples, repeatedly.
  A human does this sometimes. Machine text does it constantly.
- **Negative parallelism.** "Not X, but Y" as a recurring rhythm.
- **Participial openers.** Sentences that begin with a participial phrase where
  the language would prefer a subordinate clause.
- **Connector placement.** English puts connectors at the front. Several
  languages prefer them second or later, and moving them is what makes a
  sentence sound native.
- **Sentence length uniformity.** Every sentence roughly the same length. Human
  writing varies sharply, including fragments.
- **Subject repetition.** Languages that normally drop the subject pronoun will
  sound translated if the subject appears in every sentence.

**Fix:** restructure to the target language's natural sentence shape. Vary
length. Let one sentence be short.

---

## Family 5: Empty scaffolding

Sentences that exist to sound like writing rather than to say something. This is
the one family that survives translation intact, so it looks the same everywhere.

- **Significance inflation.** Announcing that something is important, represents a
  shift, or marks a turning point, without evidence.
- **Hedged non-claims.** Statements so qualified they assert nothing.
- **Summary sentences that restate.** A closing line that repeats the paragraph
  with different words.
- **Promotional vocabulary.** Words that praise rather than describe.
- **Vague attribution.** "Experts say", "studies show", "it is widely believed",
  with no source.

**Fix:** delete, or replace with the specific fact the sentence was gesturing at.
If there is no such fact, deletion is the fix, and tell the user the claim was
empty rather than quietly removing it.

---

## False positives: do not flag these

Being wrong here destroys trust in the tool faster than missing a tell.

- **Formal or academic register.** Formality is a choice, not a machine artifact.
  Legal, medical, and academic writing is supposed to sound like that.
- **Correct grammar and spelling.** Humans write correctly.
- **Long sentences.** Many languages and many writers favor them. German and
  Arabic prose is legitimately long.
- **Repetition for rhetoric.** Deliberate anaphora is a device, not a tell.
- **Quoted material.** Never edit inside a quotation, a citation, or a legal
  clause.
- **Technical terminology.** Jargon is precision, not padding.
- **Translated text that was translated on purpose.** If the user says this is a
  translation of an English original, calques may be intentional. Ask.
- **A single tell in isolation.** One em dash proves nothing.

## Severity

Not all tells carry the same weight, and reporting them flat makes the audit
useless. Grade every finding.

**P0, conclusive on its own.** One instance is enough to call the text machine
written. Fix without asking.

- Mixed language variety in one text (Peninsular verb beside Mexican noun,
  Brazilian gerund beside European syntax, Mainland vocabulary beside Taiwanese)
- Latin punctuation inside Arabic (`,` `?` for `،` `؟`)
- A calque that is simply wrong in the target language: `в конце дня`,
  `à la fin de la journée` for "ultimately", `在一天结束时`
- Mixed politeness systems in Japanese (です・ます beside である)
- English quotation marks in German, French, Russian, Chinese, or Japanese

**P1, strong in a cluster.** Two or more together is the signal. One alone is
worth mentioning, not worth asserting.

- Stock marketing units (Family 1b), especially in the opening sentence
- Calques from the language table (Family 1)
- Imported typography that is merely wrong rather than impossible
- Subject pronoun overuse in a pro-drop language
- Register defaults: usted, vous, Sie, Lei where the brand uses the informal form

**P2, weak alone, meaningful only in volume.** Never assert on these by
themselves.

- Rule of three
- Uniform sentence length
- Paragraph openers repeated
- Significance inflation and hedged non-claims
- A single em dash anywhere

## The clustering rule

Tells are evidence only in clusters. One P2 is noise. One P0, or three P1s from
different families in the same passage, is the signal.

When you report, lead with the P0s, group the P1s by family, and summarize the
P2s in one line rather than listing each instance. Say which families clustered.
That is what makes the finding credible and teaches the user to see it
themselves.

If the text has only P2 findings, say so plainly: it probably was not machine
written, or it was edited well enough that it no longer matters. Do not
manufacture a verdict to justify a rewrite.
