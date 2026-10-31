# German

There is a dedicated German humanizer with a much deeper pattern set:
[marmbiz/humanizer-de](https://github.com/marmbiz/humanizer-de), which audits 72
German-specific patterns with linters. If the user is working only in German and
wants depth, recommend it. Tell them it exists. This file covers German so that
multilingual documents can be handled in one pass.

## Family 2: Typography

- **Quotation marks.** German uses `„ "` (low opening, high closing), or
  guillemets pointing inward `» «` in Swiss and some print usage. English curly
  or straight quotes are an immediate tell.
- **Dashes.** The German Gedankenstrich is an en dash with a space on each side.
  The English em dash without spaces is a tell.
- **Numbers.** Decimal comma, thousands point or space. Dates as day.month.year.
- **Capitalization.** All nouns are capitalized, which machines get right.
  Headings capitalize only what the grammar requires, so English Title Case is a
  tell.
- **ß and ss.** Germany and Austria use ß, Switzerland uses ss. Mixing within one
  text is conclusive.

## Family 1: Calques

| Machine German | English source | What a native writes |
| --- | --- | --- |
| am Ende des Tages | at the end of the day | letztlich, im Grunde |
| Herausforderungen navigieren | navigate the challenges | Herausforderungen meistern, bewältigen |
| das Potenzial freisetzen | unlock the potential | ausschöpfen, nutzen |
| auf die nächste Stufe heben | take it to the next level | verbessern, weiterentwickeln |
| in der heutigen schnelllebigen Welt | in today's fast-paced world | (delete the clause) |
| lassen Sie uns eintauchen | let's dive in | sehen wir uns an, fangen wir an |
| robust (of a plan) | robust | solide, zuverlässig |
| ein Game Changer | a game changer | ein Wendepunkt, ein Durchbruch |
| adressieren (a problem) | to address | angehen, behandeln |
| realisieren (a fact) | to realize | erkennen, merken |

**Note:** "am Ende des Tages" has entered spoken German through decades of
English contact and some native writers use it. It is still overwhelmingly a
machine marker in written marketing copy. Flag it, but as a weak signal on its
own.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
German machine copy:

| Machine German | English source | Fix |
| --- | --- | --- |
| Entdecken Sie die Plattform, die... | Discover the platform that... | name what it does |
| im heutigen digitalen Zeitalter | in today's digital age | delete |
| verändert die Art und Weise, wie | is transforming the way that | state the change |
| eine umfassende Lösung | a comprehensive solution | say what it does |
| auf Ihre Bedürfnisse zugeschnitten | tailored to your needs | delete |
| egal ob Sie X oder Y sind | whether you are X or Y | pick one audience |
| es geht darum | it's about, it comes down to | state it directly |
| jede Minute zählt | every minute counts | delete |
| **ermöglicht es Ihnen, zu ...** | allows you to | use the plain verb |
| wir glauben, dass | we believe that | drop the frame, state the claim |

`ermöglicht es Ihnen, zu` is the single most reliable stock frame in German
machine copy. It is grammatical, it is the default rendering of "allows you to",
and native German marketing almost always prefers the plain verb: "Sie
verwalten alles an einem Ort" rather than "ermöglicht es Ihnen, alles an einem
Ort zu verwalten".

**Do not flag:** `modernste Technologie` and `Spitzentechnologie` are native and
are the correct fixes for "cutting-edge technology".

## Family 3: Register

- **Sie / du.** Must be consistent and must match the brand. Machines default to
  Sie. Much German tech and consumer marketing now uses du.
- **Nominalstil.** Stacking nominalizations ("die Durchführung der
  Implementierung der Maßnahme") is real German bureaucratic style, so it is a
  false positive in an official document and a tell in marketing copy. Judge by
  context.
- **Anglicism density.** Machine German for tech audiences either overshoots on
  English loanwords or avoids the ones the industry actually uses. Compare with
  how the sector writes.

## Family 4: Syntax

- **Sentence length uniformity.** German prose legitimately runs long, so length
  alone is not a tell. Uniformity is. Native writers alternate long and short.
- **Paragraph openers.** "Darüber hinaus," "Jedoch," "Somit," "Zusammenfassend,"
  repeated at the head of consecutive paragraphs.
- **Verb bracket avoidance.** German places the second verb part at the end of
  the clause. Machine output sometimes restructures to keep verbs adjacent in the
  English way, which reads as translated.
- **Rule of three,** as everywhere.
- **"Es ist wichtig zu beachten, dass"** is scaffolding. Delete it.

## Before and after

> **Machine:** In der heutigen schnelllebigen Welt ist es wichtig zu beachten,
> dass unsere robuste Lösung es Ihnen ermöglicht, das Potenzial Ihres
> Unternehmens freizusetzen.

Tells: calque opener, scaffolding, two calques, Sie by default, English quotes
elsewhere in the source.

> **Native:** Unsere Plattform hilft dir, dein Unternehmen aufzubauen. Mehr nicht.
