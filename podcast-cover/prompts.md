# שקל דעת: פרומפטים לקאבר

## מה מעלים למחולל (Nano Banana 2 / GPT Image)
1. `export/shekel-daat-cover-3000.png` (קאבר המאסטר, כרפרנס לפריסה)
2. התמונה של שיראל בחליפה (מותניים ומעלה)
3. הלוגו של MAKE SENSE (כחול על לבן)

הפרומפט כתוב באנגלית כי המחוללים מבינים הוראות עיצוב טוב יותר באנגלית. הטקסט העברי מופיע במירכאות בדיוק כמו שהוא אמור להיות מודפס.

---

## 1. קאבר ראשי של הפודקאסט (1:1)

```
Create a 1:1 square podcast cover, 3000x3000 px, in the exact layout and style of reference image 1.

Background: clean pure white (#FFFFFF) with a very faint light-blue (#EEF3FB) architectural blueprint grid that fades out from the upper right.

Left half: a solid royal blue (#004AAD) house silhouette (pointed roof and walls) anchored to the bottom-left corner, about half the width and 70% of the height. An amber (#FFBD59) outline of the same house shape is offset slightly up and to the left. In front of the house, centered on it, stands the man from reference image 2, waist-up, arms crossed, warm confident smile, facing the viewer, wearing a navy suit jacket, open-collar white shirt, small Star of David necklace and silver watch. His head sits right at the roof peak. Keep his face, short grey hair and beard exactly as in the photo. Soft blue drop shadow behind him. He is cropped by the bottom edge.

Top-left: the "MAKE SENSE" wordmark from reference image 3, in royal blue.
Top-right: a rounded amber pill badge with a small black microphone icon and the black Hebrew text "פודקאסט".

Right side, right-aligned, huge ultra-condensed heavy Hebrew poster font (like Karantina Bold):
line 1 in royal blue #004AAD: "שקל"
line 2, same huge size, in black: "דעת"
Two thin blue seagulls (from the logo) fly above the man's head, toward the title.
Under the title, one hand-drawn amber brush swoosh.
Under it, bold black Hebrew sans text: "משכנתאות · נדל״ן · כסף", and below it in dark grey: "כי כל שקל צריך שיקול דעת."

Bottom-right: a royal blue band with a slanted left edge. Inside, right-aligned: white text "עם" followed by amber text "שיראל פרגר" in the condensed poster font, and below it small white text "יועץ משכנתאות ומימון · MAKE SENSE".

All Hebrew text is right-to-left, spelled exactly as given, with no extra text. Style: bold, clean, high-contrast, viral podcast cover, readable as a small phone thumbnail. No money piles, coins or piggy banks. Only blue, amber, black and white.
```

---

## 2. קאבר לפרק (תבנית). מחליפים רק את מה שבסוגריים המסולסלים

```
Create a 1:1 square podcast EPISODE cover, 3000x3000 px. Keep the exact layout, colors, fonts, house frame, host cut-out, logo, seagulls and bottom band of reference image 1. Use the man from reference image 2 without changing his face.

Change only the right-side text block:
- Top-right amber pill with a microphone icon and the black text: "שקל דעת"
- Under it a small black rounded tag with white text: "פרק {EPISODE_NUMBER}"
- Then a huge right-aligned stacked title in the ultra-condensed heavy Hebrew poster font:
  black lines: "{TITLE_LINE_1}" / "{TITLE_LINE_2}"
  royal blue (#004AAD) lines: "{HIGHLIGHT_LINE_1}" / "{HIGHLIGHT_LINE_2}"
- One amber brush swoosh under the title
- Small grey text under it: "משכנתאות · נדל״ן · כסף"

Bottom band stays: "עם שיראל פרגר" / "יועץ משכנתאות ומימון · MAKE SENSE".
{OPTIONAL_EXPRESSION: the man's expression is surprised / serious / pointing at the title}
Hebrew is right-to-left, spelled exactly as given, no other text.
```

**דוגמה ממולאת:** EPISODE_NUMBER = 07, TITLE_LINE_1 = "מיחזור", TITLE_LINE_2 = "משכנתא:", HIGHLIGHT_LINE_1 = "מתי זה", HIGHLIGHT_LINE_2 = "שווה?"

---

## 3. פרומפט מהסרטון או מהתמליל לקאבר (בשביל ChatGPT או Gemini)

מעלים את הסרטון, התמליל או הכותרת, ומדביקים:

```
You are the cover designer of the Hebrew podcast "שקל דעת" by Shirel Preger, a mortgage and financing advisor (MAKE SENSE).
From the attached episode (video / transcript / title):
1. Suggest 3 Hebrew cover titles. Each is max 6 words, split into 2-4 short lines of max ~12 characters, with 1-2 punchline lines to highlight in blue. Lead with tension, a question or a number that appears in the episode. Use only facts from the episode.
2. Pick the strongest one and fill the episode_template variables of the attached brand-spec.json.
3. Suggest the host's expression for this topic (confident / surprised / serious / pointing).
4. Generate the cover image with the "Episode cover" prompt below, using the attached master cover and host photo as references.
[paste prompt 2 here]
```

---

## טיפים
- **עברית במחולל:** אם יוצאת שגיאת כתיב, מייצרים שוב או מבקשים "fix only the Hebrew text, keep everything else". הדרך הבטוחה: לייצר את הקאבר בלי טקסט ("leave the right side empty") ולהוסיף את הכותרת בקנבה עם הפונט Karantina.
- **הפנים:** תמיד לצרף תמונה אמיתית של שיראל ולכתוב "keep his face exactly as in the photo".
- **בדיקת ת'אמבנייל:** להקטין את התמונה ל-150 פיקסלים. אם אי אפשר לקרוא את הכותרת, היא ארוכה מדי.
- **גדלים:** ספוטיפיי ואפל דורשים 3000x3000. ליוטיוב צריך גם גרסה ב-16:9 (1280x720), וזה השלב הבא.
