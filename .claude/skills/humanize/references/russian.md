# Russian

## Read this first: the dash is NOT a tell in Russian

Russian uses the dash (тире) heavily and natively. It replaces the omitted
present tense copula ("Москва — столица России"), and it is standard in
parentheticals and in place of a colon.

The English humanizer flags dashes. **Do not carry that rule into Russian.**
Flagging тире here would mark correct native writing as machine output and would
destroy the user's trust in the tool. Russian text with many dashes is normal.

What IS a typography tell in Russian:

- **Quotation marks.** Russian uses `« »` as the outer pair and `„ "` for nested
  quotes. Straight or curly English quotes are an immediate tell.
- **ё** usage. Most Russian text writes е for ё, and consistent ё throughout can
  indicate a non-native or automated pipeline. Weak signal, judge by outlet.
- **Numbers.** Decimal comma, space for thousands. Dates day.month.year.
- **Headings.** Only the first word and proper nouns are capitalized. English
  Title Case is imported.

## Family 1: Calques

| Machine Russian | English source | What a native writes |
| --- | --- | --- |
| в конце дня | at the end of the day | в конечном счёте, в итоге |
| ориентироваться в вызовах | navigate the challenges | справляться с трудностями |
| раскрыть потенциал | unlock the potential | (native, but heavily overused) |
| вывести на новый уровень | take it to the next level | (native, overused) |
| в современном быстро меняющемся мире | in today's fast-paced world | (delete the clause) |
| давайте погрузимся | let's dive in | давайте разберёмся |
| гейм-чейнджер | a game changer | переломный момент, прорыв |
| в сердце | at the heart of | в основе, в центре |
| вызов (for a business problem) | challenge | задача, проблема, трудность |

**Note on `в конце дня`:** in Russian this means literally at the end of the day,
the time of day. Used to mean "ultimately" it is simply wrong, which makes it one
of the most reliable tells in the language.

**Note on `вызов`:** the business sense of "challenge" is a recent English import.
Native writing usually says задача or проблема. Flag on repetition.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Russian machine copy:

| Machine Russian | English source | Fix |
| --- | --- | --- |
| Откройте для себя платформу, которая | Discover the platform that | name what it does |
| в современную цифровую эпоху | in today's digital age | delete |
| меняет то, как | is transforming the way that | state the change |
| комплексное решение | a comprehensive solution | say what it does |
| адаптировано под ваши потребности | tailored to your needs | delete |
| независимо от того, X вы или Y | whether you are X or Y | pick one audience |
| речь идёт о | it's about, it comes down to | state it directly |
| каждая минута на счету | every minute counts | delete |
| позволяет вам | allows you to | use the plain verb |
| мы верим, что | we believe that | drop the frame, state the claim |

`Откройте для себя` is the clearest single marker in Russian marketing copy. It
is a direct rendering of "Discover", it is almost absent from native Russian
advertising, and it appears in a large share of machine-written hero sections.

**Do not flag:** `передовые технологии` is native and is the correct fix for
"cutting-edge technology".

## Family 3: Register

- **ты / вы.** Must be consistent. Machine Russian defaults to вы even for brands
  that address a young audience with ты.
- **Bureaucratic nominalization.** "осуществление реализации проекта" is real
  Russian officialese, so it is a false positive in a government document and a
  tell in marketing copy. Judge by context.
- **Placeless register.** No idiom, nothing spoken, uniform politeness.

## Family 4: Syntax

- **Rigid SVO.** Russian word order is flexible and carries emphasis: what goes
  last is the new information. Machine Russian keeps English order in every
  sentence, which flattens the emphasis and reads as translated. This is the
  strongest syntactic tell in Russian.
- **Subject pronoun overuse.** Russian drops the subject far more than English.
  "Мы предлагаем... Мы верим... Мы знаем..." is translated English.
- **Possessive overuse.** "свой" and "его" inserted where Russian omits the
  possessive entirely ("он взял свою книгу" where "он взял книгу" is natural).
- **Paragraph openers.** "Однако," "Таким образом," "Более того," "Кроме того,"
  repeated at the head of consecutive paragraphs.
- **Rule of three** and uniform sentence length.

## Before and after

> **Machine:** В современном быстро меняющемся мире мы предлагаем надёжное
> решение, которое позволяет вам раскрыть потенциал вашего бизнеса и вывести его
> на новый уровень.

Tells: calque opener, subject pronoun, possessive "вашего" where Russian omits
it, two overused imports, rigid word order.

> **Native:** Помогаем бизнесу расти. И всё.
