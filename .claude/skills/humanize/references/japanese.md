# Japanese

## Family 3 first: politeness level is the fastest tell

Japanese forces a register choice that English does not have, and machine output
handles it mechanically.

- **Mixed styles.** です・ます体 (polite) and である体 / だ体 (plain) inside one
  document, with no structural reason. Conclusive. A native writer picks one and
  holds it, or switches only at a section boundary.
- **Wrong default.** Machine Japanese defaults to polite です・ます even for blog
  posts, technical documentation, and editorial writing where plain style is the
  norm.
- **Over-honorification.** Stacking keigo where plain polite is correct, or using
  humble and honorific forms for the wrong party. Reads as a form letter.

## Family 4: Syntax

- **Explicit subjects.** This is the strongest structural tell. Japanese drops
  the subject when it is recoverable. Machine Japanese writes 私は, 私たちは,
  それは, これは in sentence after sentence because English requires a subject.
  A paragraph where every sentence states its subject is machine Japanese.
- **することができます instead of できます.** The long form is grammatical and
  is heavily overused by machines rendering English "can" and "is able to".
  Prefer できます, or restructure.
- **〜的 and 〜性 overuse.** Rendering English abstract nouns and adjectives
  directly ("効率性の向上", "戦略的なアプローチ"). Native writing often uses a
  plain verb instead.
- **〜において / 〜に関して overuse.** Direct renderings of "in" and "regarding".
  Usually a particle is enough.
- **Long pre-nominal clauses.** English relative clauses rendered as long
  modifiers stacked before the noun. Legal in Japanese, exhausting in quantity,
  and a reliable marker of translation.
- **Paragraph openers.** また、 さらに、 しかし、 そのため、 at the head of
  consecutive paragraphs.
- **Uniform sentence length.** Native Japanese varies sharply and uses short
  sentences for rhythm.

## Family 2: Typography

- **Full width punctuation.** 、 and 。 not `,` and `.`. Half width punctuation in
  Japanese text is an immediate tell.
- **Brackets.** 「 」 for quotation, 『 』 for nested or for titles. English
  quotes are a tell.
- **Spacing.** Japanese does not put spaces between words. Spaces inserted around
  Latin words are a style choice, but spaces used as English word separators are
  machine output.
- **Numbers and units.** Half width digits are normal in horizontal text. Be
  consistent.
- **The em dash.** Japanese has 〜 and ー and the double dash ――. The English em
  dash is imported.

## Family 1: Calques

| Machine Japanese | English source | What a native writes |
| --- | --- | --- |
| 一日の終わりには | at the end of the day | 結局のところ、最終的には |
| 課題をナビゲートする | navigate the challenges | 課題に取り組む、乗り越える |
| 可能性を解き放つ | unlock the potential | 活かす、引き出す |
| 次のレベルへ引き上げる | take it to the next level | 成長させる、高める |
| 今日の急速に変化する世界において | in today's fast-paced world | (delete the clause) |
| 深く掘り下げてみましょう | let's dive in | 見ていきましょう |
| ゲームチェンジャー | a game changer | 転機、画期的な |
| 〜の中心に | at the heart of | 〜の核心、〜の基盤 |

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Japanese machine copy:

| Machine Japanese | English source | Fix |
| --- | --- | --- |
| 〜をご紹介します | Introducing / Discover | name what it does |
| 今日のデジタル時代において | in today's digital age | delete |
| 〜の方法を変革します | is transforming the way that | state the change |
| 包括的なソリューション | a comprehensive solution | say what it does |
| お客様のニーズに合わせて | tailored to your needs | delete |
| 〜であっても〜であっても | whether you are X or Y | pick one audience |
| 〜が重要です | it's about, what matters is | state it directly |
| 一分一秒が大切です | every minute counts | delete |
| **〜を可能にします** | allows you to, enables you to | use the plain verb |
| 私たちは〜と信じています | we believe that | drop the frame, state the claim |

`〜を可能にします` is the Japanese twin of `することができます` from Family 4.
Both are the model rendering English modal frames rather than saying the thing.
A feature list where every item ends in 可能にします or できるようになります was
translated from an English feature list.

**Do not flag:** 最先端 is native and is the correct fix for "cutting-edge".

## Family 5: Scaffolding

Japanese machine text is heavy on 重要です and 〜と言えるでしょう: sentences that
announce importance or hedge an assertion into nothing. Delete them or state the
fact.

## Before and after

> **Machine:** 今日の急速に変化する世界において、私たちのソリューションは、
> お客様のビジネスの可能性を解き放つことができます。

Tells: calque opener, explicit subject 私たちの, ことができます, calque, uniform
polite register applied by default.

> **Native:** ビジネスの成長を支援します。それだけです。
