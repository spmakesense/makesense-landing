# Generates the Hebrew voiceover (Microsoft Edge "Avri" voice) and mixes it to vo/voice.m4a.
# Order: python3 tts.py → node build.js → node render.js → ffmpeg mux (see README section in קריינות.md)
import json, subprocess, os
n = json.load(open('narration.json', encoding='utf8'))
durs = []
for i, t in enumerate(n):
    t = t.replace('MAKE SENSE', 'מֵייק סֶנְס')
    f = f'vo/{i:02d}.mp3'
    subprocess.run(['edge-tts', '--proxy', os.environ.get('HTTPS_PROXY', ''), '--voice', 'he-IL-AvriNeural',
                    '--rate', '+4%', '--text', t, '--write-media', f], check=True)
    durs.append(round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f])), 2))
json.dump(durs, open('vo/durations.json', 'w'))
