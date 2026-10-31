# Spanish

First decide the variety: Latin American (and which country) or Peninsular. Then
keep it consistent. Mixed variety is the most conclusive tell in Spanish.

## Family 1: Calques

Search for these. Each is a literal rendering of an English fixed expression, and
each is rare to absent in native writing.

| Machine Spanish | English source | What a native writes |
| --- | --- | --- |
| al final del día | at the end of the day | a fin de cuentas, en definitiva |
| un cambio de juego | a game changer | un antes y un después, algo que lo cambia todo |
| vamos a sumergirnos, adentrémonos | let's dive in | veamos, empecemos |
| en el mundo acelerado de hoy | in today's fast-paced world | (delete the whole clause) |
| desbloquear el potencial | unlock the potential | aprovechar, sacar partido a |
| llevar X al siguiente nivel | take X to the next level | mejorar X, hacer crecer X |
| navegar los desafíos | navigate the challenges | afrontar los retos, sortear las dificultades |
| en el corazón de | at the heart of | en el centro de, la base de |
| robusto (of software, a plan) | robust | sólido, fiable |
| impactar (transitive, of an effect) | to impact | afectar a, repercutir en |

**Accepted, do not flag:** "cuando se trata de" and "en última instancia" are
native Spanish. They are overused by machines but they are not errors. Flag them
only if they appear repeatedly in a short text.

**Watch:** "aprovechar" is correct Spanish and is also the right fix for
"leverage". It only becomes a tell when it appears in every paragraph.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that show up most
in Spanish copy:

| Machine Spanish | English source | Fix |
| --- | --- | --- |
| Descubre la plataforma que... | Discover the platform that... | name the thing it does |
| en la era digital de hoy | in today's digital age | delete |
| está transformando la manera en que | is transforming the way that | delete, or state the change |
| una solución integral | a comprehensive solution | say what it actually does |
| adaptado a tus necesidades | tailored to your needs | delete |
| ya seas X o Y | whether you are X or Y | pick one audience and address it |
| se trata de | it's about, it comes down to | state the thing directly |
| cada minuto cuenta | every minute counts | delete |
| te permite | allows you to | usually deletable, use the plain verb |
| tecnología de vanguardia | cutting-edge technology | name the technology |

`te permite` is correct Spanish and is not a tell on its own. It becomes one when
it appears in every sentence, which is what happens when the source is a chain of
English "allows you to" constructions.

## Family 2: Punctuation

- **The raya.** Spanish uses the long dash for dialogue and for a strong
  parenthetical, and when it is used parenthetically it takes no space on the
  inner side. English-style spaced dashes used as a comma substitute, several
  times per page, are a machine habit. Native Spanish prose reaches for commas
  and parentheses far more often.
- **Quotation marks.** Formal Spanish uses angular marks `« »`, with curly
  double quotes as the common alternative. Straight ASCII quotes are a tell.
- **Opening marks.** `¿` and `¡` are required. Their absence signals text that was
  produced or pasted through an English-first pipeline.
- **Numbers.** Decimal comma, thousands point, in most of the Spanish speaking
  world. Mexican usage differs. Match the chosen variety.
- **Headings.** Spanish capitalizes only the first word and proper nouns. Title
  Case In A Heading is imported.

## Family 3: Register

- **Placeless Spanish.** Text that belongs to no country: no voseo, no regional
  vocabulary, nothing that would tell you where the writer lives. Pick a variety.
- **Mixed variety.** "vosotros" beside "computadora", or "coche" beside "carro".
  Conclusive. No native writer does this.
- **Usted by default.** Machines default to usted. Most marketing copy in Spanish
  addresses the reader as tú (or vos in the Río de la Plata). Choose deliberately.
- **Over-formal verbs.** "realizar" and "efectuar" where "hacer" is natural.
  "utilizar" where "usar" is natural.

## Family 4: Syntax

- **Subject pronouns.** Spanish drops them. "Nosotros ofrecemos... Nosotros
  creemos... Nosotros sabemos" is translated English. Drop the pronoun unless it
  is contrastive.
- **Adjective position.** English puts the adjective first. Spanish usually puts
  it after the noun, and moving it forward changes the meaning or the tone.
  "una innovadora solución" reads as marketing translationese where "una solución
  innovadora" is neutral.
- **Paragraph openers.** "Además," "Sin embargo," "Por lo tanto," at the start of
  consecutive paragraphs is a machine rhythm. Vary or remove.
- **Rule of three.** Three adjectives in a row, repeatedly, across a text.
- **Uniform sentence length.** Break the rhythm. Let one sentence be four words.

## Before and after

> **Machine:** En el mundo acelerado de hoy, nosotros ofrecemos una innovadora
> solución que le permite desbloquear el potencial de su negocio y llevarlo al
> siguiente nivel.

Tells: calque opener, subject pronoun, fronted adjective, two more calques, usted
by default in marketing copy.

> **Native:** Te ayudamos a hacer crecer tu negocio. Sin vueltas.
