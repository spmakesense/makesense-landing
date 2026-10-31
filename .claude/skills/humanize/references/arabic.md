# Arabic

Decide the register first: Modern Standard Arabic, or a dialect (Egyptian,
Levantine, Gulf, Maghrebi). Machine Arabic defaults to MSA even for copy that
should be closer to speech, and that mismatch is itself the finding.

## Family 2: Typography

The fastest checks in Arabic, and machine output fails them constantly.

- **Arabic comma `،`** not the Latin `,`.
- **Arabic semicolon `؛`** not `;`.
- **Arabic question mark `؟`** not `?`.
- **Arabic decimal and thousands separators**, where the publication uses Arabic
  numerals rather than Western ones. Be consistent with whichever the outlet uses.
- **The em dash is not Arabic punctuation.** Used as an English parenthetical it
  is imported, and in right to left text it commonly lands on the wrong side.
- **Direction damage.** Latin brand names, numbers, and trailing punctuation drift
  to the wrong side of the line when text passes through an English-first
  pipeline. Check the end of every mixed-script line.

Latin punctuation inside otherwise correct Arabic is one of the most reliable
tells there is, because a native writer's keyboard produces the Arabic marks
automatically.

## Family 4: Syntax (unusually strong in Arabic)

- **Rigid SVO.** Arabic uses verb-initial sentences (VSO) widely, especially in
  narrative and formal prose. Machine Arabic renders English SVO order in every
  sentence. A page where no sentence begins with its verb is machine Arabic.
- **`من خلال` overuse.** A direct calque of English "through" and "via". Native
  Arabic often uses a preposition, an adverbial, or restructures the sentence.
- **`يعتبر` overuse.** "is considered" as a way to avoid asserting. Usually the
  sentence is stronger with the plain verb.
- **`إن` at the head of every sentence.** Correct in isolation, machine rhythm in
  repetition.
- **Idafa avoidance.** Like Hebrew smichut, Arabic binds nouns with idafa.
  Machine Arabic sometimes routes around it with prepositions to mirror English
  "of". Prefer the idafa where it is available.
- **Conjunction chains.** Arabic legitimately uses `و` far more than English uses
  "and", so long connected sentences are not a tell. Uniform sentence length is.

## Family 1: Calques

| Machine Arabic | English source | What a native writes |
| --- | --- | --- |
| في نهاية اليوم | at the end of the day | في نهاية المطاف، في المحصلة |
| التنقل في التحديات | navigate the challenges | مواجهة التحديات، التغلب على |
| إطلاق العنان للإمكانات | unlock the potential | الاستفادة من، توظيف |
| الانتقال إلى المستوى التالي | take it to the next level | التطوير، النهوض بـ |
| في عالم اليوم سريع الخطى | in today's fast-paced world | (delete the clause) |
| دعونا نتعمق | let's dive in | لنبدأ، لننظر في |
| تغيير قواعد اللعبة | a game changer | نقلة نوعية |
| في قلب | at the heart of | في صميم، في أساس |

**Note:** `في صميم` is native and is the correct fix, not a finding.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Arabic machine copy:

| Machine Arabic | English source | Fix |
| --- | --- | --- |
| اكتشف المنصة التي | Discover the platform that | name what it does |
| في العصر الرقمي اليوم | in today's digital age | delete |
| يغير الطريقة التي | is transforming the way that | state the change |
| حل شامل | a comprehensive solution | say what it does |
| مصمم خصيصًا لتلبية احتياجاتك | tailored to your needs | delete |
| سواء كنت X أو Y | whether you are X or Y | pick one audience |
| يتعلق الأمر بـ | it's about, it comes down to | state it directly |
| كل دقيقة مهمة | every minute counts | delete |
| يتيح لك / يمكّنك من | allows you to | use the plain verb |
| نحن نؤمن بأن | we believe that | drop the frame, state the claim |

`يمكّنك من` and `يتيح لك` are correct Arabic, and they are also the default
renderings of "allows you to" and "empowers you to". A page where most feature
sentences hang off one of them was built from an English feature list.

**Do not flag:** `تقنية متطورة` is native and is the correct fix for
"cutting-edge technology".

## Family 3: Register

- **MSA where dialect belongs.** Consumer marketing in Egypt or the Gulf is often
  written close to spoken Arabic. Formal MSA in that context reads as a press
  release, which is exactly what machine output produces by default.
- **Mixed dialects.** Egyptian vocabulary beside Levantine forms. Conclusive.
- **Over-formality.** Long formulaic openings and closings that no one reads.

## Family 5: Scaffolding

Arabic machine text is especially prone to significance inflation: announcing
that something represents a qualitative leap, a fundamental transformation, or a
new era, with nothing behind it. Delete these sentences or replace them with the
specific fact.

## Before and after

> **Machine:** في عالم اليوم سريع الخطى، يعتبر حلنا أداة قوية تمكنك من إطلاق
> العنان لإمكانات عملك والانتقال به إلى المستوى التالي.

Tells: calque opener, `يعتبر` hedge, two calques, rigid SVO, Latin comma
elsewhere in the source.

> **Native:** نساعدك على تنمية عملك. هذا كل شيء.
