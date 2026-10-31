"""Prepare brochure assets from the landing-page logo/photo (run from repo root)."""
import base64, io, urllib.parse
from PIL import Image
import numpy as np, qrcode

OUT = "brochure/assets/"
logo = Image.open(io.BytesIO(base64.b64decode(open("logo_b64.txt").read()))).convert("RGBA")
photo = Image.open(io.BytesIO(base64.b64decode(open("photo_b64.txt").read()))).convert("RGB")

# --- logo: split into rows of content (seagulls, wordmark, sublines)
a = np.array(logo)[:, :, 3]
rows = np.where(a.max(axis=1) > 40)[0]
groups, start = [], rows[0]
for p, q in zip(rows, rows[1:]):
    if q - p > 12:
        groups.append((start, p)); start = q
groups.append((start, rows[-1]))
print("logo row groups:", groups)
# mark = two seagulls + MAKE SENSE wordmark (first three groups)
top, bottom = groups[0][0], groups[2][1]
mark = logo.crop((0, top - 10, logo.width, bottom + 10))
mark = mark.crop(mark.getbbox())
mark.save(OUT + "logo-mark-blue.png")
for name, rgb in {"white": (255, 255, 255), "gold": (217, 191, 126)}.items():
    m = np.array(mark).copy(); m[:, :, :3] = rgb
    Image.fromarray(m).save(OUT + f"logo-mark-{name}.png")
print("brand blue sample:", tuple(np.array(mark)[np.array(mark)[:, :, 3] > 250][:, :3].mean(axis=0).astype(int)))

# --- photo: crop Shirel (right part of the composite, white background)
w, h = photo.size
crop = photo.crop((int(w * 0.6), int(h * 0.12), w, h))
crop.save(OUT + "shirel.jpg", quality=95)
print("photo crop px:", crop.size)

# --- QR to WhatsApp with prefilled message
msg = "היי שיראל, קיבלתי את העלון שלך ב-BNI ואשמח לקבוע פגישת היכרות"
url = "https://wa.me/972524415395?text=" + urllib.parse.quote(msg)
q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=0, box_size=20)
q.add_data(url); q.make(fit=True)
q.make_image(fill_color="#0A0A0A", back_color="white").save(OUT + "qr-whatsapp.png")
print("qr url:", url)
