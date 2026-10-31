# Hebrew

Hebrew has one tell that outperforms every other, and most people cannot name it
even though they feel it. Start there.

## The strongest tell: "של" instead of smichut

Natural Hebrew binds nouns with the construct state (smichut). Translated Hebrew
mirrors the English "of" and uses `של` for everything.

| Machine Hebrew | Natural Hebrew |
| --- | --- |
| המנהל של הפרויקט | מנהל הפרויקט |
| המערכת של הניהול | מערכת הניהול |
| הפוטנציאל של העסק שלך | הפוטנציאל העסקי שלך |
| הצוות של התמיכה | צוות התמיכה |

A paragraph with `של` three or four times where smichut was available is machine
Hebrew, almost without exception. This single check finds more than all the
vocabulary lists combined.

Do not overcorrect. `של` is correct and necessary for real possession
("הספר שלי"), and smichut can sound stiff when overused. Fix the noun-noun pairs,
leave genuine possession alone.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Hebrew machine copy:

| Machine Hebrew | English source | Fix |
| --- | --- | --- |
| בעידן הדיגיטלי של היום | in today's digital age | delete |
| גלה את הפלטפורמה ש... | Discover the platform that... | name what it does |
| בין אם אתה X או Y | whether you are X or Y | pick one audience |
| פתרון מקיף | a comprehensive solution | say what it does |
| מותאם לצרכים שלך | tailored to your needs | delete |
| הכלים הטובים ביותר | the best tools | delete or prove it |
| טכנולוגיה מתקדמת | cutting-edge technology | name the technology |
| אנחנו מאמינים ש... | we believe that... | state the claim without the frame |
| מאפשר לך | allows you to | use the plain verb |
| הכל מתחיל ב... | it all starts with... | delete |

`אנחנו מאמינים ש` deserves its own note. It is the most common opener in Hebrew
machine marketing copy, it is a direct rendering of "we believe that", and it
almost always precedes a claim that would be stronger stated flat. "אנחנו
מאמינים שכל עסק ראוי לכלים טובים" says less than "לכל עסק מגיעים כלים טובים".

## Family 2: Typography

- **The em dash does not belong in Hebrew.** Hebrew has the maqaf for compounds.
  The long English dash used as a parenthetical is imported, and in right to left
  text it also tends to land on the wrong side of the phrase. Replace with a
  comma, a colon, or parentheses.
- **Quotation marks.** Hebrew uses gershayim, typically straight double quotes.
  Curly English quotes render backwards in RTL and are an immediate tell.
- **Direction damage.** Numbers, Latin brand names, and trailing punctuation
  frequently end up on the wrong side of a sentence when text passes through an
  English-first pipeline. Check the end of every line that mixes scripts.
- **Headings.** No Title Case. Hebrew has no capitals, so any imported
  capitalization pattern applies to the Latin words only and usually looks wrong.

## Family 1: Calques

| Machine Hebrew | English source | What a native writes |
| --- | --- | --- |
| לנווט את האתגרים | navigate the challenges | להתמודד עם האתגרים |
| לשחרר את הפוטנציאל | unlock the potential | למצות את הפוטנציאל |
| לקחת את זה לשלב הבא | take it to the next level | לקדם, להצמיח |
| בעולם המהיר של ימינו | in today's fast-paced world | (delete the clause) |
| בואו נצלול | let's dive in | בואו נתחיל, נראה |
| משנה משחק | a game changer | שינוי אמיתי, פריצת דרך |
| בליבה של | at the heart of | בבסיס, במרכז |
| חזק ועמיד (of software) | robust | אמין, יציב |

**Accepted, do not flag:** `בסופו של יום` entered spoken Hebrew long ago and
native writers use it. It is a weak signal on its own, meaningful only in a
cluster.

## Family 3: Register

- **Literary register in marketing copy.** Machines reach for `אשר`, `לפיכך`,
  `כמו כן`, `הינו`, `על מנת`. Marketing Hebrew uses `ש`, `אז`, `גם`, `כדי`.
  The word `הינו` in particular is a strong marker: it is bureaucratic Hebrew and
  almost never appears in copy a person wrote to persuade someone.
- **`אשר` instead of `ש`.** Native writing uses `ש` almost always. Repeated `אשר`
  is machine formality.
- **Placeless Hebrew.** No slang, no rhythm, nothing that sounds spoken. Real
  Hebrew marketing copy is much closer to speech than machine output.

## Family 4: Syntax

- **Copula overuse.** Hebrew drops the present tense "to be". Machine Hebrew
  writes `הוא` and `היא` everywhere: "הפתרון הוא פתרון אשר מאפשר". Native:
  "הפתרון מאפשר".
- **Rigid subject-verb-object.** Hebrew moves the verb forward for emphasis and
  in narrative. Machine Hebrew is SVO in every sentence because English is.
- **Paragraph openers.** `יתרה מכך`, `עם זאת`, `לפיכך`, `בנוסף לכך` repeated at
  the head of consecutive paragraphs.
- **Uniform sentence length,** and rule of three, as in every language.

## Before and after

> **Machine:** בעולם המהיר של ימינו, הפתרון שלנו הינו פתרון חזק ועמיד אשר מאפשר
> לך לשחרר את הפוטנציאל של העסק שלך ולקחת אותו לשלב הבא.

Tells: calque opener, `הינו`, `אשר`, copula padding, two calques, `של` where
smichut belongs.

> **Native:** אנחנו עוזרים לעסק שלך לגדול. זהו.
