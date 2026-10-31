# Chinese

Decide the variety first: Simplified (Mainland), Traditional (Taiwan), or
Traditional (Hong Kong). Vocabulary differs, not only characters, and mixing them
is conclusive. 软件 / 軟體 / 軟件 are three different regional choices.

## Family 2: Typography

- **Full width punctuation.** ，。！？：；and the enumeration comma 、 for lists.
  Half width Latin punctuation inside Chinese text is an immediate tell.
- **Quotation marks.** Mainland uses “ ”. Taiwan and Hong Kong use 「 」.
  Straight ASCII quotes are a tell, and the wrong regional pair is a variety
  mismatch.
- **The enumeration comma 、** is required between list items. Machine output
  often uses ，for everything.
- **Spacing.** No spaces between Chinese characters. A space between a Chinese
  character and a Latin word is a house style choice, but English-style spacing
  around all punctuation is machine output.
- **The em dash.** Chinese uses a double-width dash ——. The English em dash is
  imported.

## Family 4: Syntax

- **Long pre-nominal attributive clauses.** The strongest structural tell in
  Chinese. English relative clauses get rendered as long 的 modifiers stacked
  before the noun: 一个能够帮助企业实现数字化转型的全面的解决方案. Legal, and
  exhausting. Native writing breaks this into separate clauses.
- **的 chains.** Three or more 的 in one sentence. Native writing drops most of
  them.
- **进行 + verb.** 进行分析 where 分析 alone works. A direct rendering of English
  "carry out" and "perform" constructions.
- **我们 overuse.** Chinese drops the subject freely. 我们提供…我们相信…我们致力于
  in consecutive sentences is translated English.
- **被 overuse.** Chinese uses the passive far less than English, and 被 often
  carries a negative connotation. Machine Chinese renders English passives
  directly.
- **Paragraph openers.** 此外、然而、因此、总之 at the head of consecutive
  paragraphs.
- **Uniform sentence length.** Native Chinese alternates four-character phrases
  and short clauses for rhythm.

## Family 1: Calques

| Machine Chinese | English source | What a native writes |
| --- | --- | --- |
| 在一天结束时 | at the end of the day | 归根结底、说到底 |
| 驾驭挑战 / 导航挑战 | navigate the challenges | 应对挑战 |
| 释放潜力 | unlock the potential | 发挥潜力 |
| 提升到一个新的水平 | take it to the next level | 更上一层楼、进一步提升 |
| 在当今快节奏的世界中 | in today's fast-paced world | (delete the clause) |
| 让我们深入探讨 | let's dive in | 我们来看看 |
| 游戏规则改变者 | a game changer | 颠覆性的、突破性的 |
| 在…的核心 | at the heart of | …的核心在于、根本上 |

**Note on 在一天结束时:** in Chinese this means literally at the end of the day,
the time of day. Used to mean "ultimately" it is wrong, which makes it a reliable
tell.

## Family 1b: Stock marketing units

See `method.md` for the full English inventory. The renderings that dominate
Chinese machine copy:

| Machine Chinese | English source | Fix |
| --- | --- | --- |
| 探索这个平台 / 发现 | Discover the platform | name what it does |
| 在当今的数字时代 | in today's digital age | delete |
| 正在改变…的方式 | is transforming the way that | state the change |
| 全面的解决方案 | a comprehensive solution | say what it does |
| 量身定制，满足您的需求 | tailored to your needs | delete |
| 无论您是X还是Y | whether you are X or Y | pick one audience |
| 关键在于 | it's about, it comes down to | state it directly |
| 分秒必争 | every minute counts | delete |
| **使您能够 / 让您可以** | allows you to, enables you to | use the plain verb |
| 我们相信 | we believe that | drop the frame, state the claim |

`使您能够` pairs with the `进行` overuse from Family 4. Both are the model
rendering an English verb frame instead of using the Chinese verb directly.
"使您能够进行数据分析" is three layers of frame around 分析数据.

**Do not flag:** `尖端技术` and `前沿技术` are native and are the correct fixes
for "cutting-edge technology".

## Family 3: Register

- **Mixed variety.** Mainland vocabulary beside Taiwanese terms, or Simplified
  characters with Taiwanese word choices. Conclusive.
- **Over-formality.** Machine Chinese reaches for formal written register in
  contexts where consumer copy is close to speech.
- **Four-character idiom stuffing.** Chengyu inserted to sound literary rather
  than because they fit. Native writers use them sparingly and precisely.

## Family 5: Scaffolding

Significance inflation is heavy in machine Chinese: 具有重要意义, 标志着,
开启了新篇章, with nothing behind it. Delete or replace with the specific fact.

## Before and after

> **Machine:** 在当今快节奏的世界中，我们提供一个能够帮助您的企业释放潜力并
> 提升到一个新的水平的全面的解决方案。

Tells: calque opener, 我们 subject, long pre-nominal clause, 的 chain, two
calques.

> **Native:** 我们帮助企业成长。就这么简单。
