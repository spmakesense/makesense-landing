# French

## Family 2 first: typography is the fastest tell in French

French typography has rules English does not, and machine output breaks them
constantly. Check these before anything else.

- **Space before double punctuation.** French requires a narrow non-breaking
  space before `;` `:` `!` `?` and `%`. English does not. Text with no space
  before these marks was produced by an English-first process.
- **Guillemets.** French quotes are `« »`, with a narrow non-breaking space
  inside both. Curly or straight English quotes are a tell.
- **Dashes.** French uses the em dash sparingly, mainly for dialogue and for
  strong parentheticals. English-style dashes used as commas, repeatedly, are
  machine rhythm. French prefers commas, parentheses, and the colon.
- **Capitalization.** Only the first word and proper nouns in a heading. Also
  note that French does not capitalize days, months, languages, or nationality
  adjectives.
- **Numbers.** Decimal comma, non-breaking space for thousands, and the currency
  symbol after the number.

## Family 1: Calques

| Machine French | English source | What a native writes |
| --- | --- | --- |
| à la fin de la journée | at the end of the day | en fin de compte, au fond |
| naviguer les défis | navigate the challenges | relever les défis, faire face à |
| libérer le potentiel | unlock the potential | exploiter, tirer parti de |
| passer au niveau supérieur | take it to the next level | progresser, aller plus loin |
| dans le monde d'aujourd'hui en constante évolution | in today's fast-paced world | (delete the clause) |
| plongeons dans | let's dive in | voyons, commençons |
| robuste (of a plan) | robust | solide, fiable |
| adresser un problème | to address a problem | traiter, aborder un problème |
| supporter (to support a feature) | to support | prendre en charge |
| réaliser (to realize a fact) | to realize | se rendre compte |

**Accepted, do not flag:** "au cœur de" is native French and is not a calque.
"changer la donne" is the correct native equivalent of "game changer" and should
be the fix, not a finding.

**Note on "à la fin de la journée":** in French this literally means at the end
of the working day. Used to mean "ultimately" it is simply wrong, which makes it
one of the most reliable tells in the language.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
French machine copy:

| Machine French | English source | Fix |
| --- | --- | --- |
| Découvrez la plateforme qui... | Discover the platform that... | name what it does |
| à l'ère numérique d'aujourd'hui | in today's digital age | delete |
| transforme la façon dont | is transforming the way that | state the change |
| une solution complète | a comprehensive solution | say what it does |
| adapté à vos besoins | tailored to your needs | delete |
| que vous soyez X ou Y | whether you are X or Y | pick one audience |
| il s'agit de / tout est une question de | it's about, it comes down to | state it directly |
| chaque minute compte | every minute counts | delete |
| vous permet de | allows you to | use the plain verb |
| nous croyons que | we believe that | drop the frame, state the claim |

**Do not flag:** `technologie de pointe` is native French and is the correct fix
for "cutting-edge technology", not a finding.

`vous permet de` deserves a note. It is correct French, and it is also the
default rendering of the English "allows you to" frame. A page where most
sentences hang off `vous permet de` was built from an English list of features.

## Family 3: Register

- **tu / vous.** Must be consistent, and must match the context. Machine output
  defaults to vous even in copy where a brand addresses a young audience with tu.
- **Over-nominalization.** "la mise en œuvre de la réalisation du projet". French
  administrative style does this, marketing French does not.
- **Anglicisms.** A machine writing French for a tech audience tends to leave
  English terms untranslated where French has a standard term, or to translate
  terms that are normally left in English. Both directions are tells. Check
  against how the sector actually writes.

## Family 4: Syntax

- **Paragraph openers.** "En effet," "Par ailleurs," "Ainsi," "De plus," at the
  head of consecutive paragraphs is machine rhythm.
- **"Il est important de noter que"** and its relatives are pure scaffolding.
  Delete and state the thing directly.
- **Rule of three.** Three adjectives, three clauses, repeated across the text.
- **Uniform sentence length.** French journalistic and marketing prose varies
  much more than machine output does.
- **Overuse of the present participle.** English participial openers rendered
  directly ("Offrant une solution complète, notre plateforme...") read as
  translation. French prefers a relative or subordinate clause.

## Before and after

> **Machine:** Dans le monde d'aujourd'hui en constante évolution, il est
> important de noter que notre solution robuste vous permet de libérer le
> potentiel de votre entreprise et de passer au niveau supérieur.

Tells: calque opener, scaffolding, three calques, no spacing before punctuation
elsewhere in the source.

> **Native:** Notre plateforme aide votre entreprise à se développer. C'est tout.
