# Italian

## Family 1: Calques

| Machine Italian | English source | What a native writes |
| --- | --- | --- |
| alla fine della giornata | at the end of the day | in fin dei conti, alla fine |
| navigare le sfide | navigate the challenges | affrontare le sfide |
| sbloccare il potenziale | unlock the potential | valorizzare, sfruttare |
| portare al livello successivo | take it to the next level | far crescere, migliorare |
| nel mondo frenetico di oggi | in today's fast-paced world | (delete the clause) |
| immergiamoci | let's dive in | vediamo, cominciamo |
| un game changer | a game changer | una svolta, un punto di svolta |
| nel cuore di | at the heart of | al centro di, alla base di |
| robusto (of software) | robust | solido, affidabile |
| supportare (a feature) | to support | gestire, essere compatibile con |

**Accepted, do not flag:** "quando si tratta di" is native. "un punto di svolta"
is the correct fix for "game changer", not a finding.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Italian machine copy:

| Machine Italian | English source | Fix |
| --- | --- | --- |
| Scopri la piattaforma che... | Discover the platform that... | name what it does |
| nell'era digitale di oggi | in today's digital age | delete |
| sta trasformando il modo in cui | is transforming the way that | state the change |
| una soluzione completa | a comprehensive solution | say what it does |
| su misura per le tue esigenze | tailored to your needs | delete |
| che tu sia X o Y | whether you are X or Y | pick one audience |
| si tratta di | it's about, it comes down to | state it directly |
| ogni minuto conta | every minute counts | delete |
| ti permette di / ti consente di | allows you to | use the plain verb |
| noi crediamo che | we believe that | drop the frame, state the claim |

**Do not flag:** `tecnologia all'avanguardia` is native Italian and is the correct
fix for "cutting-edge technology", not a finding.

## Family 2: Typography

- **Quotation marks.** Italian uses `« »` in print and curly double quotes in
  most digital writing. Straight ASCII quotes are a tell.
- **Dashes.** The em dash is rare in Italian. Repeated English-style parenthetical
  dashes are machine rhythm. Italian prefers commas, parentheses, and the colon.
- **Numbers.** Decimal comma, thousands point. Dates day/month/year.
- **Headings.** Only the first word and proper nouns are capitalized.
- **Accents.** Check `è` against `e'`, and the correct grave and acute accents
  (`perché` not `perchè`). Machine output usually gets this right, so an error
  here suggests a human, not a machine.

## Family 3: Register

- **tu / Lei.** Must be consistent and must fit the brand. Machine Italian
  defaults to Lei even in copy that should use tu.
- **Over-formality.** "effettuare" and "realizzare" where "fare" is natural.
  "usufruire di" where "usare" is natural. Machines take the longer verb.
- **Placeless Italian.** No regional flavour, nothing spoken, no rhythm. Italian
  marketing copy is far more conversational than machine output.

## Family 4: Syntax

- **Subject pronouns.** Italian drops them. "Noi offriamo... Noi crediamo..." is
  translated English.
- **Fronted adjectives.** "un'innovativa soluzione" is translationese. Italian
  puts it after: "una soluzione innovativa". Fronting exists but changes tone.
- **Paragraph openers.** "Inoltre," "Tuttavia," "Pertanto," repeated at the head
  of consecutive paragraphs.
- **"È importante notare che"** is scaffolding. Delete and say the thing.
- **Rule of three** and uniform sentence length, as everywhere.

## Before and after

> **Machine:** Nel mondo frenetico di oggi, è importante notare che la nostra
> innovativa soluzione le permette di sbloccare il potenziale della sua azienda.

Tells: calque opener, scaffolding, fronted adjective, calque, Lei by default.

> **Native:** Ti aiutiamo a far crescere la tua azienda. Tutto qui.
