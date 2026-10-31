# Portuguese

Decide first: Brazilian or European. They differ in vocabulary, syntax, and
pronoun placement, and mixing them is the most conclusive tell in Portuguese.

## Family 1: Calques

| Machine Portuguese | English source | What a native writes |
| --- | --- | --- |
| no final do dia | at the end of the day | no fim das contas, afinal |
| uma mudança de jogo | a game changer | um divisor de águas |
| vamos mergulhar | let's dive in | vamos ver, bora |
| no mundo acelerado de hoje | in today's fast-paced world | (delete the clause) |
| desbloquear o potencial | unlock the potential | aproveitar, explorar |
| levar ao próximo nível | take it to the next level | melhorar, fazer crescer |
| navegar pelos desafios | navigate the challenges | enfrentar os desafios, lidar com |
| no coração de | at the heart of | no centro de, na base de |
| robusto (of software) | robust | sólido, confiável |
| entregar valor | deliver value | gerar valor, dar resultado |

**Accepted, do not flag:** "alavancar" is real Brazilian business Portuguese, and
"quando se trata de" is native. Flag only on repetition.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Portuguese machine copy:

| Machine Portuguese | English source | Fix |
| --- | --- | --- |
| Descubra a plataforma que... | Discover the platform that... | name what it does |
| na era digital de hoje | in today's digital age | delete |
| está transformando a forma como | is transforming the way that | state the change |
| uma solução completa / abrangente | a comprehensive solution | say what it does |
| adaptado às suas necessidades | tailored to your needs | delete |
| seja você X ou Y | whether you are X or Y | pick one audience |
| se trata de / é tudo sobre | it's about, it's all about | state it directly |
| cada minuto conta | every minute counts | delete |
| permite que você | allows you to | use the plain verb |
| nós acreditamos que | we believe that | drop the frame, state the claim |

**Do not flag:** `tecnologia de ponta` is native Portuguese and is the correct
fix for "cutting-edge technology", not a finding. Same for `de última geração`.

## Family 2: Punctuation

- **Travessão.** Portuguese uses the long dash mainly for dialogue. Using it
  repeatedly as an English parenthetical dash is a machine habit. Prefer commas,
  parentheses, or a colon.
- **Quotation marks.** European Portuguese prefers `« »`. Brazilian uses curly
  double quotes. Straight ASCII quotes are a tell.
- **Numbers.** Decimal comma, thousands point. Dates are day/month/year.
- **Headings.** Only the first word and proper nouns are capitalized.

## Family 3: Register

- **Mixed variety.** The clearest signals:
  - Gerund: Brazilian "estou fazendo" against European "estou a fazer".
  - Address: Brazilian "você" against European "tu" plus second person verbs.
  - Vocabulary: "celular"/"telemóvel", "ônibus"/"autocarro", "time"/"equipa".
  Any mixture inside one text is conclusive.
- **Over-formality.** "utilizar" where "usar" is natural. "realizar" where
  "fazer" is natural. Machines reach for the longer verb every time.
- **Placeless Portuguese.** No slang, no regional marker, no contractions of
  speech. Real marketing copy in Brazil is much closer to spoken register than
  machine output ever is.

## Family 4: Syntax

- **Subject pronouns.** Portuguese drops them. "Nós oferecemos... Nós
  acreditamos..." is translated English.
- **Pronoun placement.** Brazilian Portuguese fronts the clitic in speech and
  informal writing ("me diz"), European Portuguese attaches it ("diz-me").
  Machine text tends to apply European rules to Brazilian text, or to avoid
  clitics entirely by rewriting around them.
- **Paragraph openers.** "Além disso," "No entanto," "Portanto," repeated at the
  head of consecutive paragraphs.
- **Fronted adjectives.** "uma inovadora solução" is translationese. Portuguese
  puts it after: "uma solução inovadora".
- **Rule of three** and uniform sentence length, as in every language.

## Before and after

> **Machine:** No mundo acelerado de hoje, nós oferecemos uma inovadora solução
> que permite desbloquear o potencial do seu negócio e levá-lo ao próximo nível.

Tells: calque opener, subject pronoun, fronted adjective, two calques, register
too formal for marketing.

> **Native:** A gente ajuda seu negócio a crescer. Simples assim.
